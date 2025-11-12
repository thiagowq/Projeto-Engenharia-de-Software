/* ================================================= */
/* LÓGICA DAS ABAS E DADOS GLOBAIS */
/* ================================================= */

// Simulação de Banco de Dados de Estoque
const estoqueDB = [
    { id: 1, codigo: '400-XYZ', desc: 'Tomate Italiano 1kg', cat: 'Hortifruti', un: 'KG', estoque: 12.50, status: 'Ativo', lote: 'Não', validade: 'Sim', local: 'Depósito A / Rua 3', min: 5, pto: 10 },
    { id: 2, codigo: '999-OLD', desc: 'Refrigerante Lata 350ml (descont.)', cat: 'Bebidas', un: 'UN', estoque: 0.00, status: 'Inativo', lote: 'Não', validade: 'Sim', local: 'Depósito B', min: 0, pto: 0 },
    { id: 3, codigo: '500-ABC', desc: 'Queijo Mussarela Peça', cat: 'Frios', un: 'KG', estoque: 35.00, status: 'Ativo', lote: 'Sim', validade: 'Sim', local: 'Câmara Fria 1', min: 10, pto: 15 }
];
let itemCarregadoCache = null; // Guarda o item para edição/exclusão

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
    mascaraDecimal(document.getElementById('estoque-cad'));
    mascaraDecimal(document.getElementById('estoque_minimo'));
    mascaraDecimal(document.getElementById('ponto_reposicao'));
});


/* ================================================= */
/* LÓGICA TELA 1: CADASTRAR ITEM */
/* ================================================= */
function configurarTelaCadastro() {
    const form = document.getElementById('formCadastroItem');
    if (!form) return;

    // Preenche data atual (do seu script original)
    const data = new Date();
    const dd = String(data.getDate()).padStart(2,'0');
    const mm = String(data.getMonth()+1).padStart(2,'0');
    const yyyy = data.getFullYear();
    document.getElementById('data_cadastro-cad').value = dd + "/" + mm + "/" + yyyy;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // Valida estoque > 0 (do seu script original)
        const v = parseFloat(document.getElementById('estoque-cad').value.replace(',','.'));
        if (isNaN(v) || v <= 0) {
            alert("Estoque inicial deve ser maior que 0.");
            event.preventDefault();
            return;
        }
        
        alert("Item de estoque cadastrado com sucesso!");
        this.reset();
        
        ativarAba('tela-consultar');
        buscarEstoque(); // (Simulando a atualização)
    });
}


/* ================================================= */
/* LÓGICA TELA 2: CONSULTAR ITENS */
/* ================================================= */
function configurarTelaConsulta() {
    buscarEstoque(); // Carrega a tabela ao iniciar
}

function buscarEstoque() {
    const tbodyAtivos = document.getElementById('tbodyAtivos');
    const tbodyInativos = document.getElementById('tbodyInativos');
    if (!tbodyAtivos || !tbodyInativos) return;

    tbodyAtivos.innerHTML = ''; // Limpa
    tbodyInativos.innerHTML = ''; // Limpa
    
    // Lógica de filtro (simplificada)
    const statusFiltro = document.getElementById('f_status').value;
    const resultados = estoqueDB.filter(item => item.status.toLowerCase() === statusFiltro.toLowerCase() || statusFiltro === '');

    if (resultados.length === 0) {
        tbodyAtivos.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">Nenhum item encontrado.</td></tr>`;
        tbodyInativos.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">Nenhum item encontrado.</td></tr>`;
        return;
    }

    resultados.forEach(item => {
        const statusClass = item.status === 'Ativo' ? 'status-ativo' : 'status-inativo';
        const tr = `
            <tr>
                <td>${item.codigo}</td>
                <td>${item.desc}</td>
                <td>${item.cat}</td>
                <td>${item.un}</td>
                <td>${item.estoque.toFixed(2)}</td>
                <td><span class="${statusClass}">${item.status}</span></td>
                <td>
                    <button class="btn-acao" onclick="abrirEdicao(${item.id})">Editar</button>
                    <button class="btn-acao btn-acao-danger" onclick="abrirExclusao(${item.id})" ${item.status === 'Inativo' ? 'disabled' : ''}>Excluir</button>
                </td>
            </tr>
        `;
        
        // Separa nas duas tabelas (conforme seu HTML original)
        if (item.status === 'Ativo') {
            tbodyAtivos.innerHTML += tr;
        } else {
            tbodyInativos.innerHTML += tr;
        }
    });
}

// --- Funções chamadas pelos botões da tabela ---
function abrirEdicao(id) {
    const item = estoqueDB.find(f => f.id === id);
    if (item) {
        carregarDadosTelaEdicao(item); // Carrega os dados na tela de Alterar
        ativarAba('tela-editar'); // Muda para a aba de Alterar
    }
}

function abrirExclusao(id) {
    const item = estoqueDB.find(f => f.id === id);
    if (item) {
        carregarDadosTelaExclusao(item); // Carrega os dados na tela de Excluir
        ativarAba('tela-excluir'); // Muda para a aba de Excluir
    }
}


/* ================================================= */
/* LÓGICA TELA 3: EDITAR ITEM */
/* ================================================= */
function configurarTelaEdicao() {
    const formBusca = document.getElementById('formBuscarItem');
    const formEdicao = document.getElementById('formEditarItem');
    if (!formBusca || !formEdicao) return;

    // Lógica de Busca
    formBusca.addEventListener('submit', function(e) {
        e.preventDefault();
        const codigo = document.getElementById('busca_codigo').value;
        const item = estoqueDB.find(f => f.codigo === codigo);
        if (item) {
            carregarDadosTelaEdicao(item);
        } else {
            alert("Item não encontrado!");
        }
    });

    // Lógica de Edição (do seu script original)
    const permitir = document.getElementById('permitir_codigo');
    const codigoInput = document.getElementById('codigo_interno_edit');
    permitir.addEventListener('change', function() {
        codigoInput.readOnly = !this.checked;
    });

    formEdicao.addEventListener('submit', function(e) {
        e.preventDefault();
        alert("Item alterado com sucesso!");
        ativarAba('tela-consultar');
        buscarEstoque(); // (Simulando a atualização)
    });
}

function carregarDadosTelaEdicao(item) {
    itemCarregadoCache = item; // Salva o item
    document.getElementById('id-edit').value = item.id;
    document.getElementById('desc-edit-header').textContent = `(${item.desc})`;
    document.getElementById('codigo_interno_edit').value = item.codigo;
    document.getElementById('descricao_edit').value = item.desc;
    document.getElementById('categoria_edit').value = item.cat;
    document.getElementById('unidade_edit').value = item.un;
    document.getElementById('lote_edit').value = item.lote;
    document.getElementById('validade_edit').value = item.validade;
    document.getElementById('estoque_minimo').value = item.min.toFixed(2).replace('.', ',');
    document.getElementById('ponto_reposicao').value = item.pto.toFixed(2).replace('.', ',');
    document.getElementById('localizacao_edit').value = item.local;
    document.getElementById('status_edit').value = item.status;
    document.getElementById('permitir_codigo').checked = false;
    codigo_interno_edit.readOnly = true;
}


/* ================================================= */
/* LÓGICA TELA 4: EXCLUIR ITEM */
/* ================================================= */
function configurarTelaExclusao() {
    const formBusca = document.getElementById('formBuscarExcluir');
    const formExcluir = document.getElementById('formExcluirItem');
    if (!formBusca || !formExcluir) return;

    // Lógica de Busca
    formBusca.addEventListener('submit', function(e) {
        e.preventDefault();
        const codigo = document.getElementById('codigo_busca_excluir').value;
        const item = estoqueDB.find(f => f.codigo === codigo);
        if (item) {
            carregarDadosTelaExclusao(item);
        } else {
            alert("Item não encontrado!");
        }
    });

    // Lógica de Exclusão (do seu script original, com melhorias)
    formExcluir.addEventListener('submit', function(e){
        e.preventDefault();
        const estoqueNum = parseFloat(itemCarregadoCache.estoque) || 0;
        const alerta = document.getElementById('alerta_estoque');
        const confirma = document.getElementById('confirma_exclusao').checked;

        if (estoqueNum > 0) {
            alerta.style.display = 'block';
            alert("Exclusão bloqueada: estoque precisa ser 0.");
            return;
        } else {
            alerta.style.display = 'none';
        }

        if (!confirma) {
            alert("Você precisa marcar a confirmação antes de excluir.");
            return;
        }

        if (confirm("Tem certeza? Esta exclusão é permanente.")) {
            alert(`Item ${itemCarregadoCache.desc} excluído com sucesso!`);
            // Lógica real de exclusão
            
            // Limpa o form e volta para a consulta
            itemCarregadoCache = null;
            formBusca.reset();
            formExcluir.reset();
            document.getElementById('desc-exc').textContent = "";
            document.getElementById('cod-exc').textContent = "";
            document.getElementById('cat-exc').textContent = "";
            document.getElementById('status-exc').textContent = "";
            document.getElementById('estoque_atual_valor').textContent = "";
            
            ativarAba('tela-consultar');
            buscarEstoque(); 
        }
    });
}

function carregarDadosTelaExclusao(item) {
    itemCarregadoCache = item; // Salva o item
    document.getElementById('id-excluir').value = item.id;
    document.getElementById('desc-exc').textContent = item.desc;
    document.getElementById('cod-exc').textContent = item.codigo;
    document.getElementById('cat-exc').textContent = item.cat;
    document.getElementById('status-exc').innerHTML = `<span class="${item.status === 'Ativo' ? 'status-ativo' : 'status-inativo'}">${item.status}</span>`;
    document.getElementById('estoque_atual_valor').textContent = item.estoque.toFixed(2);
    
    // Mostra/esconde o alerta de estoque
    const alerta = document.getElementById('alerta_estoque');
    alerta.style.display = item.estoque > 0 ? 'block' : 'none';
    document.getElementById('confirma_exclusao').checked = false; // Desmarca a caixa
}


/* ================================================= */
/* FUNÇÕES ÚTEIS (MÁSCARAS) */
/* ================================================= */
function mascaraDecimal(input) {
    if (!input) return;
    input.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        v = v.replace(/(\d)(\d{2})$/, "$1,$2"); // Coloca vírgula antes dos 2 últimos dígitos
        v = v.replace(/(?=(\d{3})+(\D))\B/g, "."); // Coloca ponto a cada 3 dígitos
        e.target.value = v;
    });
}