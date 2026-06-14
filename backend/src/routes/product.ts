import { Elysia, t } from 'elysia';
import { moss, getOrCreateSession, ensureIndexLoaded, queryProductIndexes, cleanupSession } from '../moss/client.ts';
import { ENV } from '../config/env.ts';
import { PDFParse } from 'pdf-parse';
import { supabase } from '../config/supabase.ts';

async function callGemini(systemPrompt: string): Promise<any> {
  if (!ENV.GEMINI_API_KEY) {
    return null;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': ENV.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}: ${await response.text()}`);
  }

  const resBody = await response.json();
  const textResponse = resBody.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) throw new Error('Empty response from Gemini API');

  return JSON.parse(textResponse.trim());
}

export const productRoutes = new Elysia()
  .get('/products', async () => {
    try {
      const results = await moss.query('products', '*');
      return (results as any)?.matches ?? [];
    } catch {
      return [];
    }
  })
  .get('/api/products', async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
    return data || [];
  })
  .get('/api/manuals', async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Failed to fetch manuals:', err.message || err);
      return [];
    }
  })
  .post('/api/upload-manual', async ({ body, set }) => {
    const { productId, title, description, tags, file, image } = body;

    if (!file || file.type !== 'application/pdf') {
      set.status = 400;
      return { error: 'Invalid file type. Only PDF is supported.' };
    }

    try {
      try {
        const indexes = await moss.listIndexes();
        const exists = indexes.some((idx: any) => idx.name === productId);
        if (exists) {
          console.log(`Index ${productId} already exists. Deleting it before recreating...`);
          await moss.deleteIndex(productId);
        }
      } catch (checkErr: any) {
        console.warn('Warning checking/deleting index:', checkErr.message || checkErr);
      }

      const pdfPath = `pdfs/${productId}-${Date.now()}.pdf`;
      const pdfBuffer = await file.arrayBuffer();
      const { error: pdfUploadError } = await supabase.storage.from('product-assets').upload(pdfPath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });
      if (pdfUploadError) throw new Error(`PDF Upload Failed: ${pdfUploadError.message}`);

      const { data: pdfPublicUrlData } = supabase.storage.from('product-assets').getPublicUrl(pdfPath);
      const pdfUrl = pdfPublicUrlData.publicUrl;

      let imageUrl = null;
      if (image) {
        const imagePath = `images/${productId}-${Date.now()}-${image.name}`;
        const imageBuffer = await image.arrayBuffer();
        const { error: imgUploadError } = await supabase.storage.from('product-assets').upload(imagePath, imageBuffer, {
          contentType: image.type,
          upsert: true,
        });
        if (imgUploadError) throw new Error(`Image Upload Failed: ${imgUploadError.message}`);

        const { data: imgPublicUrlData } = supabase.storage.from('product-assets').getPublicUrl(imagePath);
        imageUrl = imgPublicUrlData.publicUrl;
      }

      console.log(`Parsing PDF file locally: ${file.name}...`);
      const parser = new PDFParse({ data: new Uint8Array(pdfBuffer) });
      const textResult = await parser.getText();

      const parsedTags = tags ? tags.split(',').map((t: string) => t.trim()) : [];

      const docs = [
        {
          id: `meta-info`,
          text: `Product Title: ${title}\nDescription: ${description}\nTags: ${parsedTags.join(', ')}`,
        },
        ...textResult.pages.map((page: any) => ({
          id: `page-${page.num}`,
          text: page.text,
        })),
      ];

      console.log(`Indexing ${docs.length} extracted chunks in MOSS for product ${productId}...`);
      await moss.createIndex(productId, docs);

      const { error: dbError } = await supabase.from('products').upsert({
        id: productId,
        title,
        description,
        tags: parsedTags,
        pdf_url: pdfUrl,
        image_url: imageUrl,
        status: 'Processed',
      });
      if (dbError) throw new Error(`DB Insert Failed: ${dbError.message}`);

      console.log(`Successfully indexed and persisted ${file.name}`);
      return { success: true, message: `Successfully indexed ${title}` };
    } catch (err: any) {
      console.error(`Failed to index product ${productId}:`, err);
      set.status = 500;
      return { error: `Upload process failed: ${err.message || err}` };
    }
  }, {
    body: t.Object({
      productId: t.String(),
      title: t.String(),
      description: t.String(),
      tags: t.Optional(t.String()),
      file: t.File(),
      image: t.Optional(t.File()),
    }),
  })
  .post('/api/diagnose', async ({ body }) => {
    const { productId, query } = body as { productId: string; query: string };

    let promptContext = '';
    try {
      await moss.loadIndex(productId);
      const searchResults = await moss.query(productId, query, { topK: 3 });
      if (searchResults && Array.isArray(searchResults.docs)) {
        promptContext = searchResults.docs.map((doc: any) => doc.text).join('\n\n');
      }
    } catch (error: any) {
      console.warn('MOSS query failed (likely index not created yet):', error.message || error);
    }

    if (!ENV.GEMINI_API_KEY) {
      return {
        text: 'It looks like the Gemini API Key is not set in the environment. Based on the system\'s mock knowledge: Please check if the connection between the battery terminal and controller is tight.',
        suggestedActions: ['Inspect Fuse F3 (10A)', 'Check battery-to-controller connection', 'Reset BMS'],
        manualLinks: [{ name: 'BMS Protection Mode', page: 22 }, { name: 'Replacing the Fuse', page: 34 }],
      };
    }

    try {
      const parsed = await callGemini(`You are an expert technician and diagnostic assistant for products.
The user is troubleshooting the product: "${productId}".
User query: "${query}"

Here is the context extracted from the official product knowledge base (including manual, description, and tags):
---
${promptContext || 'No official knowledge context found for this product. Use general technical knowledge.'}
---

Provide a helpful, step-by-step diagnostic recommendation to narrow down the issue and inspect components safely.
You MUST output your response in JSON format matching this schema:
{
  "text": "Your step-by-step diagnostic text. Keep it technical, clear, and structured.",
  "suggestedActions": ["Action check item 1", "Action check item 2", ...],
  "manualLinks": [{"name": "Section Name or Manual Page Reference", "page": 12}, ...]
}

Return ONLY the raw JSON object. Do not wrap it in markdown code blocks or other text.`);

      return {
        text: parsed.text || 'Could not generate recommendation.',
        suggestedActions: parsed.suggestedActions || [],
        manualLinks: parsed.manualLinks || [],
      };
    } catch (geminiError: any) {
      console.error('Gemini API call failed:', geminiError);
      return {
        text: `Error calling AI diagnostics assistant: ${geminiError.message || geminiError}. Returning mock fallback.`,
        suggestedActions: ['Check physical connections', 'Verify power source'],
        manualLinks: [{ name: 'General Troubleshooting Guide', page: 1 }],
      };
    }
  })
  .post('/api/ask', async ({ body, set }) => {
    const { query, sessionId: incomingSessionId, productIds } = body as {
      query: string;
      sessionId?: string;
      productIds?: string[];
    };

    if (!query || !query.trim()) {
      set.status = 400;
      return { error: 'Query is required.' };
    }

    let sessionId = incomingSessionId || '';
    let mossAvailable = false;

    try {
      const result = await getOrCreateSession(incomingSessionId);
      sessionId = result.sessionId;
      mossAvailable = true;
    } catch {
      sessionId = sessionId || `chat-fallback-${Date.now()}`;
    }

    let targetProductIds = productIds;
    if (!targetProductIds || targetProductIds.length === 0) {
      try {
        const { data } = await supabase.from('products').select('id');
        targetProductIds = (data || []).map((p: any) => p.id);
      } catch {
        targetProductIds = [];
      }
    }

    let mossContext = '';
    let sources: string[] = [];

    if (mossAvailable) {
      try {
        const entry = getSession(sessionId);
        if (entry) {
          await entry.session.addDocs([
            { id: `user-${Date.now()}`, text: `User asked: ${query}`, metadata: { role: 'user' } },
          ]);
        }
      } catch { }

      const result = await queryProductIndexes(targetProductIds, query, 3);
      mossContext = result.context;
      sources = result.sources;

      let sessionContext = '';
      try {
        const entry = getSession(sessionId);
        if (entry) {
          const sessionResults = await entry.session.query(query, { topK: 5 });
          if (sessionResults?.docs?.length) {
            sessionContext = sessionResults.docs
              .filter((d: any) => d.id !== 'system-prompt')
              .map((d: any) => d.text)
              .join('\n');
          }
        }
      } catch { }
    }

    if (!ENV.GEMINI_API_KEY) {
      return {
        answer: 'The Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.',
        suggestedActions: [],
        relatedProducts: sources,
        sessionId,
        sources,
      };
    }

    try {
      const parsed = await callGemini(`You are a helpful product knowledge assistant for the Mantis diagnostics platform.
You answer questions about products, their manuals, troubleshooting steps, and specifications.

User query: "${query}"

Relevant product knowledge context:
---
${mossContext || 'No specific product knowledge found for this query.'}
---

Answer the user's question thoroughly based on the available context. If the context doesn't contain enough information, say so and provide general guidance.

You MUST output your response in JSON format matching this schema:
{
  "answer": "Your detailed answer to the user's question. Be clear, technical, and structured.",
  "suggestedActions": ["Follow-up action 1", "Follow-up action 2", ...],
  "relatedProducts": ["product-id-1", "product-id-2", ...]
}

Return ONLY the raw JSON object. Do not wrap it in markdown code blocks or other text.`);

      if (mossAvailable) {
        try {
          const entry = getSession(sessionId);
          if (entry) {
            await entry.session.addDocs([
              { id: `ai-${Date.now()}`, text: `AI responded: ${parsed.answer}`, metadata: { role: 'assistant' } },
            ]);
          }
        } catch { }
      }

      return {
        answer: parsed.answer || 'Could not generate an answer.',
        suggestedActions: parsed.suggestedActions || [],
        relatedProducts: parsed.relatedProducts || sources,
        sessionId,
        sources,
      };
    } catch (err: any) {
      console.error('Failed to process question:', err);
      set.status = 500;
      return { error: `Failed to process question: ${err.message || err}` };
    }
  }, {
    body: t.Object({
      query: t.String(),
      sessionId: t.Optional(t.String()),
      productIds: t.Optional(t.Array(t.String())),
    }),
  })
  .post('/api/chat/end', async ({ body }) => {
    const { sessionId } = body as { sessionId: string };
    if (sessionId) {
      cleanupSession(sessionId);
    }
    return { success: true };
  });
