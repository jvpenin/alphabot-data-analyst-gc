require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const { askGemini } = require('./src/geminiClient');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Armazenamento em memória das planilhas enviadas
let uploadedSheets = [];

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls' || ext === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos .xlsx, .xls ou .csv são permitidos'));
    }
  }
});

// Endpoint para fazer upload de planilhas
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const fileId = Date.now().toString();
    uploadedSheets.push({
      id: fileId,
      name: req.file.originalname,
      data: data,
      uploadedAt: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Planilha carregada com sucesso',
      file: {
        id: fileId,
        name: req.file.originalname,
        rows: data.length
      }
    });
  } catch (err) {
    console.error('Erro no upload:', err);
    res.status(500).json({ error: 'Erro ao processar a planilha: ' + err.message });
  }
});

// Endpoint para listar planilhas enviadas
app.get('/api/files', async (req, res) => {
  try {
    const files = uploadedSheets.map(sheet => ({
      id: sheet.id,
      name: sheet.name,
      rows: sheet.data.length,
      uploadedAt: sheet.uploadedAt
    }));
    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

// Endpoint para remover uma planilha
app.delete('/api/files/:id', (req, res) => {
  try {
    const { id } = req.params;
    uploadedSheets = uploadedSheets.filter(sheet => sheet.id !== id);
    res.json({ success: true, message: 'Planilha removida' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

// Endpoint para limpar todas as planilhas
app.delete('/api/files', (req, res) => {
  try {
    uploadedSheets = [];
    res.json({ success: true, message: 'Todas as planilhas foram removidas' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

// Endpoint de debug
app.get('/api/debug', (req, res) => {
  res.json({
    geminiKeyDefined: !!process.env.GEMINI_API_KEY,
    uploadedSheetsCount: uploadedSheets.length,
    sheets: uploadedSheets.map(s => ({ name: s.name, rows: s.data.length }))
  });
});

// Endpoint principal de consulta
app.post('/api/query', async (req, res) => {
  const { question } = req.body || {};
  if (!question) return res.status(400).json({ error: 'Pergunta ausente' });
  
  try {
    if (uploadedSheets.length === 0) {
      return res.json({ 
        answer: 'Por favor, faça o upload de pelo menos uma planilha antes de fazer perguntas.' 
      });
    }
    
    // Prepara os dados das planilhas com LIMITAÇÃO para evitar MAX_TOKENS
    const sheetsContext = uploadedSheets.map(sheet => {
      return {
        name: sheet.name,
        headers: sheet.data[0] || [],
        totalRows: sheet.data.length,
        // Limita a 50 linhas para evitar exceder o limite de tokens
        data: sheet.data.slice(0, Math.min(51, sheet.data.length)) // Header + 50 linhas
      };
    });
    
    const prompt = `Analise os dados e responda em português simples:

DADOS: ${JSON.stringify(sheetsContext)}

PERGUNTA: ${question}

Responda de forma direta e objetiva usando apenas texto simples.`;

    const answer = await askGemini(prompt);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
