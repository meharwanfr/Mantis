import { MossClient, type SessionIndex } from "@moss-dev/moss";
import { ENV } from "../config/env.ts";

export const moss = new MossClient(ENV.MOSS_PROJECT_ID, ENV.MOSS_PROJECT_KEY);

type SessionEntry = {
  session: SessionIndex;
  loadedIndexes: Set<string>;
};

const sessions = new Map<string, SessionEntry>();

export async function getOrCreateSession(sessionId?: string): Promise<{
  session: SessionIndex;
  sessionId: string;
  isNew: boolean;
}> {
  if (sessionId && sessions.has(sessionId)) {
    const entry = sessions.get(sessionId)!;
    return { session: entry.session, sessionId, isNew: false };
  }

  const newId = sessionId || `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const session = await moss.session(newId);
  sessions.set(newId, { session, loadedIndexes: new Set() });
  return { session, sessionId: newId, isNew: true };
}

export async function ensureIndexLoaded(sessionId: string, indexName: string): Promise<boolean> {
  const entry = sessions.get(sessionId);
  if (!entry) return false;
  if (entry.loadedIndexes.has(indexName)) return true;
  try {
    await entry.session.loadIndex(indexName);
    entry.loadedIndexes.add(indexName);
    return true;
  } catch {
    return false;
  }
}

export function getSession(sessionId: string): SessionEntry | undefined {
  return sessions.get(sessionId);
}

export function cleanupSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export async function queryProductIndexes(
  productIds: string[],
  query: string,
  topK: number = 3
): Promise<{ context: string; sources: string[] }> {
  let context = '';
  const sources: string[] = [];

  for (const pid of productIds) {
    try {
      await moss.loadIndex(pid);
      const results = await moss.query(pid, query, { topK });
      if (results?.docs?.length) {
        const texts = results.docs.map((d: any) => d.text).join('\n');
        context += `\n--- ${pid} ---\n${texts}`;
        sources.push(pid);
      }
    } catch {
      // index doesn't exist or not queryable
    }
  }

  return { context, sources };
}
