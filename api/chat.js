export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { messages } = req.body;

  // Prompt di sistema per guidare l'avventura testuale
  const systemPrompt = {
    role: "system",
    content: "Sei un Dungeon Master esperto per un'avventura testuale RPG. " +
             "Descrivi l'ambiente, le conseguenze delle azioni del giocatore in modo immersivo e dinamico. " +
             "Alla fine di ogni risposta proponi SEMPRE 4 scelte numerate (1, 2, 3, 4) su cosa fare, " +
             "lasciando la possibilità di fare un'azione personalizzata."
  };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free', // Modello open-source gratuito
        messages: [systemPrompt, ...messages]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Errore nella richiesta ad OpenRouter');
    }

    // Risposta formattata per il frontend
    const reply = data.choices[0].message.content;
    return res.status(200).json({ content: [{ text: reply }] });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
