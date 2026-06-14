import { describe, expect, it, beforeAll, afterAll } from 'bun:test';
import { app } from '../src/index';

const originalFetch = global.fetch;

function mockFetch(responseMap: Record<string, any>) {
  global.fetch = async (req: Request | string, init?: RequestInit) => {
    const url = req instanceof Request ? req.url : req.toString();
    for (const [pattern, response] of Object.entries(responseMap)) {
      if (url.includes(pattern)) {
        return new Response(JSON.stringify(response.data), {
          status: response.status || 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    return new Response(JSON.stringify({ error: 'not mocked' }), { status: 404 });
  };
}

describe('Mantis API Server', () => {
  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('returns 200 OK for GET /health', async () => {
    const response = await app.handle(new Request('http://localhost/health'));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
  });

  it('returns 200 OK for GET /api/products', async () => {
    mockFetch({
      'products': {
        data: [{ id: 'xiaomi-scooter-4-pro', title: 'Xiaomi Mi Electric Scooter 4 Pro' }],
      },
    });

    const response = await app.handle(new Request('http://localhost/api/products'));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].id).toBe('xiaomi-scooter-4-pro');
  });

  it('returns 200 OK for POST /api/diagnose (fallback mock)', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'xiaomi-scooter-4-pro',
          query: 'scooter wont start',
        }),
      })
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.text).toBeDefined();
    expect(Array.isArray(data.suggestedActions)).toBe(true);
    expect(Array.isArray(data.manualLinks)).toBe(true);
  }, 15000);

  it('returns 400 Bad Request for POST /api/upload-manual with invalid file type', async () => {
    const formData = new FormData();
    formData.append('productId', 'xiaomi-scooter-4-pro');
    formData.append('title', 'Test Product');
    formData.append('description', 'A test product');
    formData.append('tags', 'test,scooter');
    formData.append('file', new Blob(['dummy text content'], { type: 'text/plain' }), 'test.txt');

    const response = await app.handle(
      new Request('http://localhost/api/upload-manual', {
        method: 'POST',
        body: formData,
      })
    );
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('returns 200 OK for POST /api/ask with general query (fallback mock)', async () => {
    mockFetch({
      'products': {
        data: [{ id: 'xiaomi-scooter-4-pro', title: 'Xiaomi Mi Electric Scooter 4 Pro' }],
      },
    });

    const response = await app.handle(
      new Request('http://localhost/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'How do I troubleshoot battery issues?',
        }),
      })
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.answer).toBeDefined();
    expect(data.sessionId).toBeDefined();
    expect(typeof data.sessionId).toBe('string');
    expect(data.sessionId.length).toBeGreaterThan(0);
    expect(Array.isArray(data.sources)).toBe(true);
    expect(Array.isArray(data.suggestedActions)).toBe(true);
  }, 15000);

  it('returns 400 for POST /api/ask with empty query', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '' }),
      })
    );
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('returns 200 for POST /api/ask with session continuation', async () => {
    mockFetch({
      'products': {
        data: [{ id: 'xiaomi-scooter-4-pro', title: 'Xiaomi Mi Electric Scooter 4 Pro' }],
      },
    });

    const first = await app.handle(
      new Request('http://localhost/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'First question' }),
      })
    );
    expect(first.status).toBe(200);
    const firstData = await first.json();
    expect(firstData.sessionId).toBeDefined();

    const second = await app.handle(
      new Request('http://localhost/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Follow-up question',
          sessionId: firstData.sessionId,
        }),
      })
    );
    expect(second.status).toBe(200);
    const secondData = await second.json();
    expect(secondData.sessionId).toBe(firstData.sessionId);
    expect(secondData.answer).toBeDefined();
  }, 15000);

  it('returns 200 for POST /api/chat/end', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: 'test-session' }),
      })
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
