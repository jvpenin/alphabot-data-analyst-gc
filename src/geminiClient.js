const axios = require('axios');
const { cleanAIResponse } = require('./responseParser');

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

async function askGemini(prompt) {
  if (!GEMINI_KEY) {
    return `Erro: A chave da API do Gemini não foi configurada. Verifique o arquivo .env`;
  }

  // Gemini 2.5 Flash - melhor custo-benefício (rápido e inteligente)
  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;

  try {
    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    };

    console.log('🚀 Chamando Gemini 2.5 Flash...');
    console.log('📝 Prompt enviado:', prompt.substring(0, 200) + '...');
    
    const res = await axios.post(url, body, { 
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 // 30 segundos de timeout
    });
    
    const data = res.data || {};
    console.log('📨 Resposta completa da API:', JSON.stringify(data, null, 2));

    // Verifica se há resposta válida
    if (data.candidates && 
        data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      
      const rawResponse = data.candidates[0].content.parts[0].text;
      console.log('✅ Resposta bruta recebida:', rawResponse.substring(0, 200) + '...');
      
      // Aplica o parser para limpar markdown e formatar
      const cleanedResponse = cleanAIResponse(rawResponse);
      
      console.log('🔄 Resposta processada pelo parser');
      return cleanedResponse;
    }

    // Se não houver candidatos, pode ter sido bloqueado por safety ou outros motivos
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].finishReason) {
      console.warn('⚠️ Resposta bloqueada - Motivo:', data.candidates[0].finishReason);
      console.warn('📊 Candidato completo:', JSON.stringify(data.candidates[0], null, 2));
      
      // Retorna uma mensagem mais específica baseada no motivo
      const reason = data.candidates[0].finishReason;
      if (reason === 'SAFETY') {
        return 'A resposta foi bloqueada por questões de segurança. Tente reformular sua pergunta de forma mais específica sobre análise de dados.';
      } else if (reason === 'RECITATION') {
        return 'A resposta foi bloqueada por questões de direitos autorais. Tente fazer uma pergunta mais específica sobre seus dados.';
      } else if (reason === 'MAX_TOKENS') {
        return 'A resposta foi muito longa. Tente fazer uma pergunta mais específica ou dividi-la em partes menores.';
      } else if (reason === 'LENGTH') {
        return 'A pergunta ou dados são muito extensos. Tente com dados menores ou uma pergunta mais focada.';
      } else {
        return `Não foi possível gerar uma resposta (${reason}). Tente reformular sua pergunta.`;
      }
    }

    console.warn('❌ Nenhum candidato válido encontrado na resposta');
    return `Não foi possível extrair a resposta da API Gemini.`;

  } catch (err) {
    console.error('Erro ao chamar Gemini 2.5:', err.response ? err.response.data : err.message);
    
    const errorDetails = err.response ? JSON.stringify(err.response.data) : err.message;
    throw new Error('Falha ao consultar a API Gemini: ' + errorDetails);
  }
}

module.exports = { askGemini };