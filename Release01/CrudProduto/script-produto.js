/* ================================================= */
/* LÓGICA DAS ABAS E DADOS GLOBAIS */
/* ================================================= */

// Simulação de Banco de Dados de Produtos
const produtosDB = [
    { id: 1, codigo: '789001', nome: 'Sabão em Pó Azul 500g', secao: 'limpeza', estoque: 150, custo: 3.50, venda: 5.99, status: 'ativo', fornecedor: 'Empresa X', descricao: 'Sabão em pó para roupas brancas e coloridas.' },
    { id: 2, codigo: '789002', nome: 'Pão Francês', secao: 'padaria', estoque: 80, custo: 0.20, venda: 0.50, status: 'ativo', fornecedor: 'Pão e Cia', descricao: 'Pão fresco do dia.' },
    { id: 3, codigo: '789003', nome: 'Tomate Italiano Kg', secao: 'hortifruti', estoque: 0, custo: 5.00, venda: 8.49, status: 'inativo', fornecedor: 'Fazenda Sol', descricao: 'Tomate maduro.' }
];

// --- Função Mestra de Ativação de Abas ---
function ativarAba(targetId) {
    const telas = document.querySelectorAll('.tela');
    const abas = document.querySelectorAll('.aba-link');
    
    telas.forEach(tela => tela.classList.remove('ativa'));
    abas.forEach(aba => aba.classList.remove('ativa'));
    
    const telaAlvo = document.getElementById(targetId);
    if (telaAlvo) telaAlvo.classList.add('ativa');
    
    const abaAlvo = document.querySelector(`.aba-link[data-target="${targetId}"]`);
    if (abaAlvo) abaAlvo.classList.add('ativa');
}


/* ================================================= */
/* EXECUTA QUANDO A PÁGINA CARREGA */
/* ================================================= */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Configura os cliques nas abas do menu
    const abas = document.querySelectorAll('.aba-link');
    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            ativarAba(aba.getAttribute('data-target'));
        });
    });

    // 2. Inicia na tela de "Consultar"
    ativarAba('tela-consultar'); 
    
    // 3. Configura os scripts de cada tela
    configurarTelaCadastro();
    configurarTelaConsulta();
    configurarTelaAlteracao(); 
    configurarTelaDescontinuar();

    // 4. Adiciona máscaras de dinheiro
    mascaraDinheiro(document.getElementById('custo-cad'));
    mascaraDinheiro(document.getElementById('venda-cad'));
    mascaraDinheiro(document.getElementById('custo-alt'));
    mascaraDinheiro(document.getElementById('venda-alt'));
});


/* ================================================= */
/* LÓGICA TELA 1: CADASTRAR PRODUTO */
/* ================================================= */
function configurarTelaCadastro() {
    const form = document.getElementById('cadastroForm');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // Lógica de cadastro...
        alert("Produto cadastrado com sucesso!");
        this.reset();
        
        // Volta para a tela de consulta e atualiza a tabela
        ativarAba('tela-consultar');
        buscarProdutos(); // (Simulando a atualização)
    });
}


/* ================================================= */
/* LÓGICA TELA 2: CONSULTAR PRODUTO */
/* ================================================= */
function configurarTelaConsulta() {
    buscarProdutos(); // Carrega a tabela ao iniciar
}

function buscarProdutos() {
    const tabelaProdutos = document.getElementById('tabelaProdutos');
    if (!tabelaProdutos) return;
    tabelaProdutos.innerHTML = ''; // Limpa
    
    const filtroStatus = document.getElementById('filtroStatus').value;
    const resultados = produtosDB.filter(p => p.status === filtroStatus || filtroStatus === '');

    if (resultados.length === 0) {
        tabelaProdutos.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">Nenhum produto encontrado.</td></tr>`;
        return;
    }

    resultados.forEach(produto => {
        const tr = document.createElement('tr');
        const statusClass = produto.status === 'ativo' ? 'status-ativo' : 'status-inativo';
        const statusTexto = produto.status === 'ativo' ? 'Ativo' : 'Descontinuado';

        tr.innerHTML = `
            <td>${produto.codigo}</td>
            <td>${produto.nome}</td>
            <td>${produto.secao}</td>
            <td>${produto.estoque}</td>
            <td>R$ ${produto.venda.toFixed(2)}</td>
            <td><span class="${statusClass}">${statusTexto}</span></td>
            <td>
                <button class="btn-acao" onclick="abrirAlteracao(${produto.id})">Alterar</button>
                <button class="btn-acao" onclick="abrirDescontinuacao(${produto.id})" ${produto.status === 'inativo' ? 'disabled' : ''}>Descontinuar</button>
            </td>
        `;
        tabelaProdutos.appendChild(tr);
    });
}

// *** A MÁGICA DE CONECTAR AS TELAS ***
function abrirAlteracao(id) {
    const produto = produtosDB.find(p => p.id === id);
    if (produto) {
        carregarDadosTelaAlteracao(produto); // Carrega os dados na tela de Alterar
        ativarAba('tela-alterar'); // Muda para a aba de Alterar
    }
}

function abrirDescontinuacao(id) {
    const produto = produtosDB.find(p => p.id === id);
    if (produto) {
        carregarDadosTelaDescontinuar(produto); // Carrega os dados na tela de Descontinuar
        ativarAba('tela-descontinuar'); // Muda para a aba de Descontinuar
    }
}


/* ================================================= */
/* LÓGICA TELA 3: ALTERAR PRODUTO */
/* ================================================= */
function configurarTelaAlteracao() {
    const form = document.getElementById('alteracaoForm');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert("Produto alterado com sucesso!");
        // Volta para a consulta e atualiza a tabela
        ativarAba('tela-consultar');
        buscarProdutos(); // (Simulando a atualização)
    });
}

function carregarDadosTelaAlteracao(produto) {
    // Preenche os campos do formulário de ALTERAÇÃO
    document.getElementById('produtoNome-alt').textContent = produto.nome;
    document.getElementById('estoqueAtual-alt').textContent = produto.estoque;
    document.getElementById('codigoBarras-alt').value = produto.codigo;
    document.getElementById('nome-alt').value = produto.nome;
    document.getElementById('secao-alt').value = produto.secao;
    document.getElementById('fornecedor-alt').value = produto.fornecedor;
    document.getElementById('custo-alt').value = "R$ " + produto.custo.toFixed(2).replace(".", ",");
    document.getElementById('venda-alt').value = "R$ " + produto.venda.toFixed(2).replace(".", ",");
    document.getElementById('descricao-alt').value = produto.descricao;
}


/* ================================================= */
/* LÓGICA TELA 4: DESCONTINUAR PRODUTO */
/* ================================================= */
function configurarTelaDescontinuar() {
    const form = document.getElementById('descontinuacaoForm');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const motivo = document.getElementById('motivo-desc').value;
        const nomeProduto = document.getElementById('produtoNome-desc').textContent;
        
        if (confirm(`Deseja realmente descontinuar o produto '${nomeProduto}'?`)) {
            // Lógica para mudar o status do produto no "BD"
            const produto = produtosDB.find(p => p.nome === nomeProduto);
            if (produto) produto.status = 'inativo';
            
            alert(`Produto ${nomeProduto} descontinuado com sucesso!`);
            
            // Volta para a consulta e atualiza a tabela
            ativarAba('tela-consultar');
            buscarProdutos(); 
        }
    });
}

function carregarDadosTelaDescontinuar(produto) {
    // Preenche os campos do formulário de DESCONTINUAÇÃO
    document.getElementById('produtoNome-desc').textContent = produto.nome;
    document.getElementById('estoqueAtual-desc').value = produto.estoque;
}


/* ================================================= */
/* FUNÇÕES ÚTEIS (MÁSCARAS) */
/* ================================================= */
function mascaraDinheiro(input) {
    if (!input) return;
    input.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        v = (v / 100).toFixed(2) + '';
        v = v.replace(".", ",");
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        e.target.value = 'R$ ' + v;
    });
}