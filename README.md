# 📊 Alpha Bot - Data Analyst

Um assistente de IA para análise de dados que responde perguntas sobre suas planilhas CSV/Excel em tempo real.

**Desenvolvido para:** Aula de IA e Dados - Geração Caldeira  
**Tipo:** Projeto Individual e Pessoal

---

## 🚀 Funcionalidades

- 📤 Upload de múltiplos arquivos (CSV, XLSX, XLS)
- 🤖 Análise inteligente usando Google Gemini 2.5 Flash
- 💬 Chat em tempo real com perguntas sobre seus dados
- 📱 Interface responsiva (desktop e mobile)
- ⚡ Processamento rápido de grandes planilhas

---

## 🏗️ Arquitetura

### Stack Tecnológico
- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Backend:** Node.js + Express.js
- **IA/LLM:** Google Gemini 2.5 Flash API
- **Armazenamento:** Memória (RAM) - sem persistência em disco
- **Hospedagem:** Vercel (gratuita)

### Fluxo de Dados

```
Usuário (Browser)
    ↓
[Upload de Arquivo] → Express Server
    ↓
[Parse CSV/XLSX] → XLSX.js → Memória (RAM)
    ↓
[Pergunta] → Prompt + Dados → Google Gemini API
    ↓
[Resposta] → Response Parser → Chat
```

---

## 💾 Armazenamento de Dados

**Importante:** Os dados são armazenados **em memória (RAM)** do servidor, não em disco.

- ✅ Rápido e responsivo
- ✅ Sem limite de arquivo por tamanho (até 10MB)
- ❌ Dados perdidos ao reiniciar o servidor
- ❌ Não persistem entre sessões

**Recomendação:** Para uso em produção, integrar com banco de dados (MongoDB, PostgreSQL, etc.)

---

## 🤖 Google Gemini API

O projeto utiliza a API gratuita do **Google Gemini 2.5 Flash**:

- Modelo: `gemini-2.5-flash`
- Resposta rápida (~1-2 segundos)
- Limite: 15 requisições/minuto (plan gratuito)
- Máximo de tokens de saída: 8192

### Configuração

```javascript
// Parâmetros de geração
{
  temperature: 0.7,        // Criatividade (0-1)
  maxOutputTokens: 8192,   // Máximo de caracteres
  topP: 0.8,              // Diversidade
  topK: 40                // Variedade de respostas
}
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Chave da API do Google Gemini
GEMINI_API_KEY=sua_chave_aqui

# Porta do servidor (opcional)
PORT=3000
```

### Como obter a chave Gemini:

1. Acesse [Google AI Studio](https://aistudio.google.com/apikey)
2. Clique em "Create API Key"
3. Copie a chave gerada
4. Cole no arquivo `.env`

**⚠️ Nunca commite o .env no Git!**

---

## 🚀 Hospedagem via Vercel

### Deploy gratuito em 3 passos:

1. **Push no GitHub**
   ```bash
   git push origin master
   ```

2. **Importar no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Selecione o repositório `alphabot-data-analyst-gc`

3. **Configurar variáveis**
   - Em "Settings" → "Environment Variables"
   - Adicione: `GEMINI_API_KEY=sua_chave`

### Limitações da versão gratuita:
- ⏱️ Cold start (primeira requisição lenta)
- 💾 Memória reinicia a cada deploy
- 🔄 Máximo 60 segundos por requisição
- 📊 Dados não persistem entre execuções

---

## 📦 Instalação Local

### Pré-requisitos
- Node.js 18+ instalado
- Chave API do Gemini

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/jvpenin/alphabot-data-analyst-gc.git
cd alphabot-data-analyst

# 2. Instale as dependências
npm install

# 3. Configure as variáveis (crie um .env)
echo "GEMINI_API_KEY=sua_chave_aqui" > .env

# 4. Inicie o servidor
npm start

# 5. Acesse http://localhost:3000
```

---

## 📋 Dependências

- `express` - Framework web
- `cors` - Controle de origem cruzada
- `multer` - Upload de arquivos
- `body-parser` - Parse de JSON
- `xlsx` - Leitura de Excel/CSV
- `axios` - HTTP client
- `dotenv` - Variáveis de ambiente

---

## 🎯 Como Usar

1. **Acesse** a aplicação em http://localhost:3000
2. **Clique** no botão "📎 Enviar Arquivo"
3. **Selecione** um ou mais arquivos CSV/XLSX
4. **Digite** sua pergunta no chat
5. **Receba** uma análise inteligente dos dados

### Exemplos de perguntas:
- "Qual é a venda total por região?"
- "Mostre as tendências de crescimento"
- "Quais são os produtos mais vendidos?"
- "Faça um resumo dos dados"

---

## 🔧 Estrutura do Projeto

```
alphabot-data-analyst/
├── server.js                 # Backend Express
├── package.json             # Dependências
├── .env                      # Variáveis (não commitar)
├── .gitignore               # Arquivos ignorados
│
├── src/
│   ├── geminiClient.js       # Integração com Gemini
│   ├── googleClient.js       # Google Auth (opcional)
│   └── responseParser.js     # Processamento de respostas
│
└── public/
    ├── index.html           # Interface HTML
    ├── app.js               # JavaScript do frontend
    └── styles.css           # Estilos CSS
```

---

## 🚨 Limitações & Considerações

| Aspecto | Status | Notas |
|---------|--------|-------|
| Persistência | ❌ | Dados perdem ao reiniciar |
| Autenticação | ❌ | Acesso público |
| Limite de requisições | ⚠️ | 15/min (Gemini free) |
| Tamanho de arquivo | ⚠️ | Máximo 10MB |
| Privacidade | ⚠️ | Dados enviados para Google |

---

## 📝 Licença

Projeto educacional - Desenvolvimento livre para fins de aprendizado.

---

## 👨‍💻 Autor

Desenvolvido como projeto individual para a **Aula de IA e Dados - Geração Caldeira**

---

## 🤝 Suporte

Para dúvidas ou melhorias:
- Abra uma issue no GitHub
- Consulte a documentação do [Gemini API](https://ai.google.dev)
- Verifique o [Express.js Guide](https://expressjs.com)

---

**⚡ Última atualização:** Novembro 2025

