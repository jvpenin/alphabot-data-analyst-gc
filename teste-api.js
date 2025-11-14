// Teste simples da API do Gemini
require('dotenv').config();
const { askGemini } = require('./src/geminiClient');

async function testeSimples() {
  console.log('🧪 Testando API do Gemini com pergunta simples...\n');
  
  try {
    const perguntaSimples = `Analise estes dados simples:
    
Dados: [["Nome", "Vendas"], ["João", 100], ["Maria", 200]]

Pergunta: Qual foi o total de vendas?

Por favor, responda apenas com o cálculo simples.`;

    console.log('📤 Enviando pergunta de teste...');
    const resposta = await askGemini(perguntaSimples);
    
    console.log('✅ RESPOSTA RECEBIDA:');
    console.log('─'.repeat(50));
    console.log(resposta);
    console.log('─'.repeat(50));
    
    if (resposta.includes('Desculpe, não consegui gerar')) {
      console.log('\n❌ PROBLEMA: A API está bloqueando as respostas');
      console.log('💡 Possíveis soluções:');
      console.log('- Verificar se a chave API está válida');
      console.log('- Tentar com perguntas mais simples');
      console.log('- Verificar se há créditos na conta Google Cloud');
    } else {
      console.log('\n🎉 SUCESSO: A API está funcionando corretamente!');
    }
    
  } catch (error) {
    console.error('❌ ERRO no teste:', error.message);
  }
}

// Executa o teste
testeSimples();