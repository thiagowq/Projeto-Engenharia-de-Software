/* ================================================= */
/* LÓGICA DAS ABAS E DADOS GLOBAIS */
/* ================================================= */

// Simulação de Banco de Dados de Seções
const secoesDB = [
    { id: 1, codigo: 'PAD01', nome: 'Padaria', responsavel: 'func1', status: 'Ativo', desc: 'Seção de pães, bolos e derivados.', produtosVinculados: 15 },
    { id: 2, codigo: 'ACG01', nome: 'Açougue', responsavel: '-', status: 'Inativo', desc: 'Seção desativada.', produtosVinculados: 0 },
    { id: 3, codigo: 'HORTI', nome: 'Hortifruti', responsavel: 'func1', status: 'Ativo', desc: 'Frutas, legumes e verduras.', produtosVinculados: 120 }
];
let itemCarregadoCache = null; // Guarda a seção para edição/exclusão

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
});


/* ================================================= */
/* LÓGICA TELA 1: CADASTRAR SEÇÃO */
/* ================================================= */
function configurarTelaCadastro() {
    const form = document.getElementById('formCadastroSecao');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert("Seção cadastrada com sucesso!");
        this.reset();
        ativarAba('tela-consultar');
        buscarSecoes(); // (Simulando a atualização)
    });
}


/* ================================================= */
/* LÓGICA TELA 2: CONSULTAR SEÇÕES */
/* ================================================= */
function configurarTelaConsulta() {
    buscarSecoes(); // Carrega a tabela ao iniciar
}

function buscarSecoes() {
    const tbody = document.getElementById('tabelaSecoes');
    if (!tbody) return;
    tbody.innerHTML = ''; // Limpa
    
    // Lógica de filtro (simplificada)
    const statusFiltro = document.getElementById('status-filtro').value;
    const resultados = secoesDB.filter(s => s.status === statusFiltro || statusFiltro === '');

    if (resultados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhuma seção encontrada.</td></tr>`;
        return;
    }

    resultados.forEach(item => {
        const statusClass = item.status === 'Ativo' ? 'status-ativo' : 'status-inativo';
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.codigo}</td>
            <td>${item.responsavel === 'func1' ? 'Funcionário Exemplo 1' : 'Nenhum'}</td>
            <td><span class="${statusClass}">${item.status}</span></td>
            <td>
                <button class="btn-acao" onclick="abrirEdicao(${item.id})">Editar</button>
                <button class="btn-acao btn-acao-danger" onclick="abrirExclusao(${item.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Funções chamadas pelos botões da tabela ---
function abrirEdicao(id) {
    const item = secoesDB.find(s => s.id === id);
    if (item) {
        carregarDadosTelaEdicao(item); // Carrega os dados na tela de Alterar
        ativarAba('tela-editar'); // Muda para a aba de Alterar
    }
}

function abrirExclusao(id) {
    const item = secoesDB.find(s => s.id === id);
    if (item) {
        carregarDadosTelaExclusao(item); // Carrega os dados na tela de Excluir
        ativarAba('tela-excluir'); // Muda para a aba de Excluir
    }
}


/* ================================================= */
/* LÓGICA TELA 3: EDITAR SEÇÃO */
/* ================================================= */
function configurarTelaEdicao() {
    const form = document.getElementById('formEditarSecao');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert("Seção alterada com sucesso!");
        // Simula a "salvamento" no DB
        const id = document.getElementById('id-edit').value;
        const item = secoesDB.find(s => s.id == id);
        if(item) {
            item.nome = document.getElementById('nome_secao-edit').value;
            item.desc = document.getElementById('descricao-edit').value;
            item.responsavel = document.getElementById('responsavel-edit').value;
            item.status = document.getElementById('status-edit').value;
        }
        
        ativarAba('tela-consultar');
        buscarSecoes(); // Atualiza a tabela
    });
}

function carregarDadosTelaEdicao(item) {
    // Preenche os campos do formulário de EDIÇÃO
    document.getElementById('id-edit').value = item.id;
    document.getElementById('nome-edit-header').textContent = `(${item.nome})`;
    document.getElementById('codigo_secao-edit').value = item.codigo;
    document.getElementById('nome_secao-edit').value = item.nome;
    document.getElementById('descricao-edit').value = item.desc;
    document.getElementById('responsavel-edit').value = item.responsavel;
    document.getElementById('status-edit').value = item.status;
}


/* ================================================= */
/* LÓGICA TELA 4: EXCLUIR SEÇÃO */
/* ================================================= */
function configurarTelaExclusao() {
    const form = document.getElementById('formExcluirSecao');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const confirmaCheck = document.getElementById('confirma_exclusao').checked;
        const btnConfirmar = document.getElementById('btn-confirmar-exclusao');

        if (btnConfirmar.disabled) {
            alert("Não é possível excluir esta seção. Verifique as regras.");
            return;
        }

        if (!confirmaCheck) {
            alert("Você precisa marcar a caixa de confirmação para excluir.");
            return;
        }
        
        if (confirm(`Tem certeza que deseja excluir a seção '${itemCarregadoCache.nome}'?`)) {
            alert("Seção excluída com sucesso!");
            // Lógica real de exclusão
            
            ativarAba('tela-consultar');
            buscarSecoes();
        }
    });
}

function carregarDadosTelaExclusao(item) {
    itemCarregadoCache = item; // Salva o item
    
    // Preenche o resumo
    document.getElementById('id-excluir').value = item.id;
    document.getElementById('nome-exc').textContent = item.nome;
    document.getElementById('codigo-exc').textContent = item.codigo;
    document.getElementById('status-exc').innerHTML = `<span class="${item.status === 'Ativo' ? 'status-ativo' : 'status-inativo'}">${item.status}</span>`;
    document.getElementById('vinculos-exc').textContent = item.produtosVinculados;
    
    const alerta = document.getElementById('alerta-exclusao');
    const btnConfirmar = document.getElementById('btn-confirmar-exclusao');
    const checkConfirmar = document.getElementById('confirma_exclusao');
    checkConfirmar.checked = false; // Sempre desmarca

    // IMPLEMENTAÇÃO DA REGRA DE NEGÓCIO
    // "só é permitida para seções inativas e sem produtos vinculados."
    let podeExcluir = true;
    let msgAlerta = "";

    if (item.status === 'Ativo') {
        podeExcluir = false;
        msgAlerta = "<strong>Exclusão Bloqueada:</strong> A seção precisa estar 'Inativa' para ser excluída. Edite-a e mude o status primeiro.";
    } else if (item.produtosVinculados > 0) {
        podeExcluir = false;
        msgAlerta = `<strong>Exclusão Bloqueada:</strong> A seção possui ${item.produtosVinculados} produtos vinculados. Não é possível excluir.`;
    } else {
        msgAlerta = "<strong>Atenção:</strong> A seção está 'Inativa' e 'Sem Vínculos'. Ela pode ser excluída permanentemente.";
    }

    // Atualiza a UI
    alerta.innerHTML = msgAlerta;
    alerta.className = `alerta ${podeExcluir ? 'alerta-aviso' : 'alerta-perigo'}`; // Muda a cor do alerta
    btnConfirmar.disabled = !podeExcluir; // Desabilita o botão se não puder excluir
}