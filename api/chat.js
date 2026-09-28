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
      model: 'openrouter/auto',
      messages,
      stream: false,
    }),
  });

  const data = await r.json();

  if (data.error) {
    return new Response(JSON.stringify({ error: data.error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const reply = data.choices?.[0]?.message?.content || '(risposta vuota)';

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
