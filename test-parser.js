// Teste do parser de respostas da IA
require('dotenv').config();
const { cleanAIResponse, hasMarkdown } = require('./src/responseParser');

console.log('🧪 Testando o parser de respostas da IA\n');

// Exemplos de respostas com markdown
const testCases = [
  {
    name: 'Resposta com headers e bold',
    input: `## Análise de Vendas

**Total de vendas:** 150.000

### Resumo:
- **Janeiro:** 45.000
- **Fevereiro:** 55.000  
- **Março:** 50.000

Esse é o resultado da \`análise completa\`.`,
    
    expected: 'Texto limpo sem markdown'
  },
  
  {
    name: 'Resposta com listas e código',
    input: `### Principais insights:

1. **Produto A** vendeu mais
2. **Produto B** teve queda
3. Margem de \`15%\` no trimestre

\`\`\`
Total: R$ 100.000
\`\`\`

**Conclusão:** Bom desempenho geral.`,
    
    expected: 'Texto limpo'
  },
  
  {
    name: 'Resposta simples sem markdown',
    input: `O total de vendas foi de 50.000 reais. 

A empresa teve um bom desempenho no primeiro trimestre.

Principais produtos:
• Produto A: 20.000
• Produto B: 30.000`,
    
    expected: 'Deve manter o texto original'
  }
];

testCases.forEach((testCase, index) => {
  console.log(`\n📝 Teste ${index + 1}: ${testCase.name}`);
  console.log('─'.repeat(60));
  
  console.log('🔍 Entrada (com markdown):');
  console.log(testCase.input);
  
  console.log('\n✨ Saída (processada):');
  const result = cleanAIResponse(testCase.input);
  console.log(result);
  
  console.log('\n📊 Análise:');
  console.log(`- Tinha markdown antes: ${hasMarkdown(testCase.input) ? '✅ Sim' : '❌ Não'}`);
  console.log(`- Tem markdown depois: ${hasMarkdown(result) ? '⚠️ Ainda tem' : '✅ Limpo'}`);
  console.log(`- Tamanho original: ${testCase.input.length} chars`);
  console.log(`- Tamanho final: ${result.length} chars`);
  
  console.log('\n' + '═'.repeat(80));
});

console.log('\n🎉 Teste do parser concluído!');
console.log('\n💡 Dica: Agora suas respostas da IA virão sem markdown e bem formatadas!');