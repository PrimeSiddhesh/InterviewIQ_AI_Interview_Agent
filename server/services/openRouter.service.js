import axios from "axios"

export const askAi = async (messages) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages array is empty.");
        }

        let systemInstruction = undefined;
        let contents = [];

        for (const msg of messages) {
            if (msg.role === 'system') {
                systemInstruction = { parts: [{ text: msg.content }] };
            } else {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                });
            }
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.OPENROUTER_API_KEY}`;
        
        const payload = {
            contents,
            systemInstruction
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const content = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content || !content.trim()) {
            throw new Error("AI returned empty response.");
        }

        return content;
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || "Gemini API Error");
    }
}