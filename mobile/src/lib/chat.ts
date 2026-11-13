// Klepet z inštruktorjem: odgovor prihaja sproti (Server-Sent Events z /api/conversations/:id/messages).
import { request } from "./api";

export type ChatEvent = { event: string; data: any };

// Razčleni tok SSE na dogodke (delta, done, error, cards, mastered, proposal, allowance).
export function parseSse(buffer: string): { events: ChatEvent[]; rest: string } {
  const events: ChatEvent[] = [];
  const blocks = buffer.split("\n\n");
  const rest = blocks.pop() ?? "";
  for (const block of blocks) {
    let event = "message";
    const data: string[] = [];
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
    }
    if (!data.length) continue;
    try {
      events.push({ event, data: JSON.parse(data.join("\n")) });
    } catch {
      // nepopoln ali napačen dogodek preskočimo
    }
  }
  return { events, rest };
}

type Send = { text?: string; image?: { media_type: string; data: string }; deep?: boolean; lite?: boolean };

export async function sendMessage(conversationId: number, body: Send, onEvent: (e: ChatEvent) => void, signal?: AbortSignal) {
  const res = (await request(`/api/conversations/${conversationId}/messages`, { body, stream: true, signal })) as Response;
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const { events, rest } = parseSse(buf);
    buf = rest;
    events.forEach(onEvent);
  }
  if (buf.trim()) parseSse(buf + "\n\n").events.forEach(onEvent);
}
