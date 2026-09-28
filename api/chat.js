export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { messages } = await req.json();

  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.OPENROUTER_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openrouter/auto', // scegli tu il modello, fisso lato server
      messages,
      stream: true,
    }),
  });

  return new Response(r.body, {
    status: r.status,
    headers: { 'Content-Type': r.headers.get('Content-Type') || 'text/event-stream' },
  });
}
