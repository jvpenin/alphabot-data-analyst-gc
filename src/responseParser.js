/**
 * Parser para respostas da IA - Remove markdown e formata o texto
 */

/**
 * Remove markdown e formata a resposta da IA
 * @param {string} text - Texto com markdown da IA
 * @returns {string} - Texto limpo e formatado
 */
function parseAIResponse(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let cleanText = text;

  // Remove markdown headers (##, ###, etc)
  cleanText = cleanText.replace(/^#{1,6}\s+(.+)$/gm, '$1');
  
  // Remove markdown bold (**texto** ou __texto__)
  cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1');
  cleanText = cleanText.replace(/__(.*?)__/g, '$1');
  
  // Remove markdown italic (*texto* ou _texto_)
  cleanText = cleanText.replace(/\*(.*?)\*/g, '$1');
  cleanText = cleanText.replace(/_(.*?)_/g, '$1');
  
  // Remove markdown code blocks (```código```)
  cleanText = cleanText.replace(/```[\s\S]*?```/g, '');
  
  // Remove markdown inline code (`código`)
  cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
  
  // Remove markdown links [texto](url)
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove markdown bullet points (-, *, +) e substitui por bullet simples
  cleanText = cleanText.replace(/^[\s]*[-\*\+]\s+/gm, '• ');
  
  // Remove markdown numbered lists (1., 2., etc) e substitui por bullet
  cleanText = cleanText.replace(/^[\s]*\d+\.\s+/gm, '• ');
  
  // Remove markdown blockquotes (>)
  cleanText = cleanText.replace(/^>\s*/gm, '');
  
  // Remove markdown horizontal rules (---, ***, ___)
  cleanText = cleanText.replace(/^[\s]*[-\*_]{3,}[\s]*$/gm, '');
  
  // Remove markdown tables
  cleanText = cleanText.replace(/\|.*\|/g, '');
  cleanText = cleanText.replace(/^[\s]*\|?[\s]*:?-+:?[\s]*\|?[\s]*$/gm, '');
  
  // Limpa múltiplas linhas vazias consecutivas
  cleanText = cleanText.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Remove espaços em branco no início e fim de linhas
  cleanText = cleanText.replace(/^[ \t]+|[ \t]+$/gm, '');
  
  // Remove múltiplos espaços consecutivos
  cleanText = cleanText.replace(/ {2,}/g, ' ');
  
  // Trim geral
  cleanText = cleanText.trim();
  
  return cleanText;
}

/**
 * Formata números para melhor legibilidade
 * @param {string} text - Texto com números
 * @returns {string} - Texto com números formatados
 */
function formatNumbers(text) {
  // Formata números grandes com separadores de milhares
  return text.replace(/\b(\d{1,3})(\d{3})\b/g, '$1.$2');
}

/**
 * Estrutura melhor as respostas com tópicos e seções
 * @param {string} text - Texto da resposta
 * @returns {string} - Texto estruturado
 */
function structureResponse(text) {
  let structured = text;
  
  // Adiciona quebras de linha antes de tópicos importantes
  structured = structured.replace(/(\. )(Resumo|Total|Resultado|Conclusão|Análise)/g, '$1\n\n$2');
  
  // Melhora a formatação de listas numeradas
  structured = structured.replace(/(\d+)\.\s/g, '\n$1. ');
  
  // Adiciona espaçamento após dois pontos em títulos
  structured = structured.replace(/([A-Za-zÀ-ÿ]+):\s*([A-Za-z])/g, '$1:\n$2');
  
  return structured.trim();
}

/**
 * Parser principal - combina todas as funções de limpeza
 * @param {string} rawResponse - Resposta bruta da IA
 * @returns {string} - Resposta limpa e formatada
 */
function cleanAIResponse(rawResponse) {
  if (!rawResponse) return rawResponse;
  
  // 1. Remove markdown
  let cleaned = parseAIResponse(rawResponse);
  
  // 2. Formata números
  cleaned = formatNumbers(cleaned);
  
  // 3. Estrutura melhor a resposta
  cleaned = structureResponse(cleaned);
  
  // 4. Validação final
  if (!cleaned || cleaned.length < 10) {
    return rawResponse; // Retorna original se ficou muito pequeno
  }
  
  return cleaned;
}

/**
 * Detecta se a resposta contém markdown
 * @param {string} text - Texto a verificar
 * @returns {boolean} - True se contém markdown
 */
function hasMarkdown(text) {
  const markdownPatterns = [
    /#{1,6}\s+/, // Headers
    /\*\*(.*?)\*\*/, // Bold
    /\*(.*?)\*/, // Italic
    /```[\s\S]*?```/, // Code blocks
    /`([^`]+)`/, // Inline code
    /\[([^\]]+)\]\([^\)]+\)/, // Links
    /^[\s]*[-\*\+]\s+/m, // Bullet points
    /^[\s]*\d+\.\s+/m // Numbered lists
  ];
  
  return markdownPatterns.some(pattern => pattern.test(text));
}

module.exports = {
  cleanAIResponse,
  parseAIResponse,
  formatNumbers,
  structureResponse,
  hasMarkdown
};