// Teste da API do Gemini
require('dotenv').config();
const { askGemini } = require('./src/geminiClient');

async function testarGemini() {
  console.log('🔍 Testando configuração da API do Gemini...\n');
  
  // Verifica se a chave API está configurada
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'sua_chave_api_aqui') {
    console.log('❌ ERRO: Chave API do Gemini não configurada!');
    console.log('');
    console.log('📝 Para configurar:');
    console.log('1. Acesse: https://makersuite.google.com/app/apikey');
    console.log('2. Crie uma nova API Key');
    console.log('3. Edite o arquivo .env e substitua "sua_chave_api_aqui" pela sua chave real');
    console.log('');
    return;
  }
  
  console.log('✅ Chave API encontrada!');
  console.log('🚀 Fazendo teste de conexão...\n');
  
  try {
    const resposta = await askGemini('Olá! Você está funcionando corretamente? Responda em português.');
    console.log('🎉 SUCESSO! A API do Gemini está funcionando!');
    console.log('');
    console.log('📝 Resposta do Gemini:');
    console.log('─'.repeat(50));
    console.log(resposta);
    console.log('─'.repeat(50));
    console.log('');
    console.log('✨ Sua configuração está completa! Você pode iniciar o servidor com: npm start');
    
  } catch (error) {
    console.log('❌ ERRO ao conectar com a API do Gemini:');
    console.log(error.message);
    console.log('');
    console.log('🔧 Possíveis soluções:');
    console.log('- Verifique se sua chave API está correta');
    console.log('- Certifique-se de que tem créditos disponíveis na sua conta Google Cloud');
    console.log('- Verifique sua conexão com a internet');
  }
}

// Executa o teste
testarGemini();