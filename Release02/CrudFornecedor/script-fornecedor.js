/* ================================================= */
/* LÓGICA DAS ABAS E DADOS GLOBAIS */
/* ================================================= */

// Simulação de Banco de Dados de Fornecedores
const fornecedoresDB = [
    { id: 1, razao: 'Distribuidora Alimentos ABC', cnpj: '11.222.333/0001-44', endereco: 'Rua das Flores, 123 - Centro', ramo: 'comercio', status: 'ativo' },
    { id: 2, razao: 'Mercado Preço Bom Ltda.', cnpj: '55.666.777/0001-88', endereco: 'Avenida Principal, 987 - Bairro Novo', ramo: 'comercio', status: 'ativo' },
    { id: 3, razao: 'Indústria de Embalagens ZYX', cnpj: '99.888.777/0001-66', endereco: 'Rodovia Industrial, km 5 - Distrito Industrial', ramo: 'industria', status: 'ativo' },
    { id: 4, razao: 'LimpaTudo Serviços Gerais', cnpj: '12.345.678/0001-99', endereco: 'Av. das Nações, 1000', ramo: 'servico', status: 'ativo' }
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
    configurarTelaEdicao(); 
    configurarTelaExclusao();

    // 4. Adiciona máscaras
    aplicarMascaraCNPJ('cnpj-cad');
    aplicarMascaraCNPJ('cnpj-filtro');
    aplicarMascaraCNPJ('cnpj-edit');
});


/* ================================================= */
/* LÓGICA TELA 1: CADASTRAR FORNECEDOR */
/* ================================================= */
function configurarTelaCadastro() {
    const form = document.getElementById('formCadastroFornecedor');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert("Fornecedor cadastrado com sucesso!");
        this.reset();
        ativarAba('tela-consultar');
        buscarFornecedores(); // (Simulando a atualização)
    });
}


/* ================================================= */
/* LÓGICA TELA 2: CONSULTAR FORNECEDOR */
/* ================================================= */
function configurarTelaConsulta() {
    buscarFornecedores(); // Carrega a tabela ao iniciar
}

function buscarFornecedores() {
    const tbody = document.getElementById('tabelaFornecedores');
    if (!tbody) return;
    tbody.innerHTML = ''; // Limpa
    
    // Lógica de filtro (simplificada)
    const ramoFiltro = document.getElementById('ramoAtividade-filtro').value;
    const resultados = fornecedoresDB.filter(f => f.ramo === ramoFiltro || ramoFiltro === '');

    // Agrupar resultados por ramo
    const agrupados = resultados.reduce((acc, fornecedor) => {
        const ramo = fornecedor.ramo.charAt(0).toUpperCase() + fornecedor.ramo.slice(1); // Capitaliza
        if (!acc[ramo]) {
            acc[ramo] = [];
        }
        acc[ramo].push(fornecedor);
        return acc;
    }, {});

    // Renderizar tabela com grupos
    if (resultados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">Nenhum fornecedor encontrado.</td></tr>`;
        return;
    }

    Object.keys(agrupados).sort().forEach(ramo => {
        // Adiciona a linha de cabeçalho do grupo
        tbody.innerHTML += `<tr class="grupo-ramo"><td colspan="4">${ramo}</td></tr>`;
        
        // Adiciona as linhas de dados do grupo
        agrupados[ramo].forEach(f => {
            tbody.innerHTML += `
                <tr>
                    <td>${f.razao}</td>
                    <td>${f.cnpj}</td>
                    <td>${f.endereco}</td>
                    <td>
                        <button class="btn-acao" onclick="abrirEdicao(${f.id})">Editar</button>
                        <button class="btn-acao btn-acao-danger" onclick="abrirExclusao(${f.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    });
}

// --- Funções chamadas pelos botões da tabela ---
function abrirEdicao(id) {
    const fornecedor = fornecedoresDB.find(f => f.id === id);
    if (fornecedor) {
        carregarDadosTelaEdicao(fornecedor); 
        ativarAba('tela-editar'); 
    }
}

function abrirExclusao(id) {
    const fornecedor = fornecedoresDB.find(f => f.id === id);
    if (fornecedor) {
        carregarDadosTelaExclusao(fornecedor); 
        ativarAba('tela-excluir'); 
    }
}


/* ================================================= */
/* LÓGICA TELA 3: EDITAR FORNECEDOR */
/* ================================================= */
function configurarTelaEdicao() {
    const form = document.getElementById('formEditarFornecedor');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert("Fornecedor alterado com sucesso!");
        ativarAba('tela-consultar');
        buscarFornecedores(); // (Simulando a atualização)
    });
}

function carregarDadosTelaEdicao(fornecedor) {
    document.getElementById('id-edit').value = fornecedor.id;
    document.getElementById('razaoSocial-edit-header').textContent = fornecedor.razao;
    document.getElementById('razaoSocial-edit').value = fornecedor.razao;
    document.getElementById('cnpj-edit').value = fornecedor.cnpj;
    document.getElementById('endereco-edit').value = fornecedor.endereco;
    document.getElementById('ramoAtividade-edit').value = fornecedor.ramo;
}


/* ================================================= */
/* LÓGICA TELA 4: EXCLUIR FORNECEDOR */
/* ================================================= */
function configurarTelaExclusao() {
    const form = document.getElementById('formExcluirFornecedor');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('razaoSocial-exc').textContent;
        
        if (confirm(`Deseja realmente EXCLUIR o fornecedor '${nome}'?`)) {
            alert(`Fornecedor ${nome} excluído com sucesso!`);
            // Lógica real de exclusão (aqui simulada)
            
            ativarAba('tela-consultar');
            buscarFornecedores(); 
        }
    });
}

function carregarDadosTelaExclusao(fornecedor) {
    document.getElementById('id-excluir').value = fornecedor.id;
    document.getElementById('razaoSocial-exc').textContent = fornecedor.razao;
    document.getElementById('cnpj-exc').textContent = fornecedor.cnpj;
    document.getElementById('endereco-exc').textContent = fornecedor.endereco;
}


/* ================================================= */
/* FUNÇÕES ÚTEIS (MÁSCARAS) */
/* ================================================= */
function aplicarMascaraCNPJ(elementId) {
    const input = document.getElementById(elementId);
    if (!input) return;

    input.addEventListener("input", function() {
        // 00.000.000/0001-00
        let v = input.value.replace(/\D/g, "").slice(0, 14);
        if (v.length > 12) {
            v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        } else if (v.length > 8) {
            v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
        } else if (v.length > 5) {
            v = v.replace(/(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
        } else if (v.length > 2) {
            v = v.replace(/(\d{2})(\d{0,3})/, "$1.$2");
        }
        input.value = v;
    });
}