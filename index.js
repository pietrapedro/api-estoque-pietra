const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json()); // Permite que a API entenda JSON no corpo (body) das requisições

const FILE_PATH = './produtos.json';

// Função auxiliar para escrever no arquivo
const writeData = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// --- ENDPOINTS ---

// 1. Listar todos
app.get('/produtos', (req, res) => {
    const produtos = readData();
    res.json(produtos);
});

// 2. Buscar por ID
app.get('/produtos/:id', (req, res) => {
    const produtos = readData();
    const produto = produtos.find(p => p.id === parseInt(req.params.id));
    if (!produto) return res.status(404).send('Produto não encontrado');
    res.json(produto);
});

// 3. Cadastrar novo
app.post('/produtos', (req, res) => {
    const produtos = readData();
    const novoProduto = {
        id: produtos.length + 1,
        ...req.body
    };
    produtos.push(novoProduto);
    writeData(produtos);
    res.status(201).json(novoProduto);
});

// 4. Atualizar
app.put('/produtos/:id', (req, res) => {
    const produtos = readData();
    const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Produto não encontrado');

    produtos[index] = { ...produtos[index], ...req.body };
    writeData(produtos);
    res.json(produtos[index]);
});

// 5. Remover
app.delete('/produtos/:id', (req, res) => {
    const produtos = readData();
    const novaLista = produtos.filter(p => p.id !== parseInt(req.params.id));
    writeData(novaLista);
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

const readData = () => {
    // Verifica se o arquivo existe antes de tentar ler
    if (!fs.existsSync(FILE_PATH)) {
        // Se não existir, cria o arquivo com um array vazio
        fs.writeFileSync(FILE_PATH, JSON.stringify([]));
        return [];
    }
    const data = fs.readFileSync(FILE_PATH);
    return JSON.parse(data);
};