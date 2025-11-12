/* ================================================= */
/* LÓGICA DAS ABAS (Do seu código) */
/* ================================================= */
document.addEventListener('DOMContentLoaded', () => {

    const abas = document.querySelectorAll('.aba-link');
    const telas = document.querySelectorAll('.tela');

    function ativarAba(targetId) {
        telas.forEach(tela => {
            tela.classList.remove('ativa');
        });
        abas.forEach(aba => {
            aba.classList.remove('ativa');
        });
        const telaAlvo = document.getElementById(targetId);
        if (telaAlvo) {
            telaAlvo.classList.add('ativa');
        }
        const abaAlvo = document.querySelector(`.aba-link[data-target="${targetId}"]`);
        if (abaAlvo) {
            abaAlvo.classList.add('ativa');
        }
    }

    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            const targetId = aba.getAttribute('data-target');
            ativarAba(targetId);
        });
    });

    if (abas.length > 0) {
        // Mudei para 'tela-consultar' para ser a padrão, faz mais sentido.
        ativarAba('tela-consultar'); 
    }

    /* ================================================= */
    /* MÁSCARAS DE FORMULÁRIO (Do seu código) */
    /* ================================================= */

    // --- Máscaras da Tela: INSERIR CLIENTE ---
    try {
        const cpfInput = document.getElementById("cpf");
        cpfInput.addEventListener("input", function() {
            let v = cpfInput.value.replace(/\D/g, "").slice(0,11);
            if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
            else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
            else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
            cpfInput.value = v;
        });

        const telInput = document.getElementById("telefone");
        telInput.addEventListener("input", function() {
            // Máscara para celular (11) 91234-5678
            let v = telInput.value.replace(/\D/g,"").slice(0,11); 
            if (v.length > 10) {
                v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
            } else if (v.length > 6) {
                v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
            } else if (v.length > 2) {
                v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
            } else if (v.length > 0) {
                v = v.replace(/(\d{0,2})/, "($1");
            }
            telInput.value = v;
        });

        const cepInput = document.getElementById("cep");
        cepInput.addEventListener("input", function() {
            let v = cepInput.value.replace(/\D/g,"").slice(0,8);
            if (v.length > 5) v = v.replace(/(\d{5})(\d{0,3})/,"$1-$2");
            cepInput.value = v;
        });

        const hoje = new Date();
        const dd = String(hoje.getDate()).padStart(2,'0');
        const mm = String(hoje.getMonth()+1).padStart(2,'0');
        const yyyy = hoje.getFullYear();
        document.getElementById("data_cadastro").value = dd + "/" + mm + "/" + yyyy;

        document.getElementById("formCadastroCliente").addEventListener("submit", function(e){
            const rawCPF = cpfInput.value.replace(/\D/g,"");
            if (rawCPF.length !== 11) {
                alert("CPF inválido. Deve ter 11 dígitos.");
                e.preventDefault();
            }
        });
    } catch (e) { console.warn("Scripts da tela INSERIR não carregados:", e.message); }

    // --- Máscaras da Tela: EDITAR CLIENTE ---
    try {
        const permitirCPF = document.getElementById("permitir_cpf");
        const cpfEdit = document.getElementById("cpf_edit");

        permitirCPF.addEventListener("change", function() {
            cpfEdit.readOnly = !this.checked;
        });

        cpfEdit.addEventListener("input", function() {
            let v = cpfEdit.value.replace(/\D/g, "").slice(0,11);
            if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
            else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
            else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
            cpfEdit.value = v;
        });

        function maskPhone(el) {
            let v = el.value.replace(/\D/g,"").slice(0,11);
            if (v.length > 10) {
                v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
            } else if (v.length > 6) {
                v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
            } else if (v.length > 2) {
                v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
            } else if (v.length > 0) {
                v = v.replace(/(\d{0,2})/, "($1");
            }
            el.value = v;
        }

        document.getElementById("tel1_edit").addEventListener("input", function(){ maskPhone(this); });
        
        const cepEdit = document.getElementById("cep_edit");
        if(cepEdit) { // Adicionando verificação
            cepEdit.addEventListener("input", function() {
                let v = cepEdit.value.replace(/\D/g,"").slice(0,8);
                if (v.length > 5) v = v.replace(/(\d{5})(\d{0,3})/,"$1-$2");
                cepEdit.value = v;
            });
        }

        document.getElementById("formEditarCliente").addEventListener("submit", function(e){
            if (!cpfEdit.hasAttribute("readonly")) {
                const raw = cpfEdit.value.replace(/\D/g,"");
                if (raw.length !== 11) {
                    alert("CPF inválido. Deve conter 11 dígitos.");
                    e.preventDefault();
                }
            }
        });
    } catch (e) { console.warn("Scripts da tela EDITAR não carregados:", e.message); }

    // --- Máscaras da Tela: EXCLUIR CLIENTE ---
    try {
        const cpfExcluir = document.getElementById("cpf_excluir");
        cpfExcluir.addEventListener("input", function() {
            let v = cpfExcluir.value.replace(/\D/g, "").slice(0,11);
            if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
            else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
            else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
            cpfExcluir.value = v;
        });

        document.getElementById("formExcluirCliente").addEventListener("submit", function(e){
            const radioDef = document.getElementById("opcao_definitiva");
            const confirmou = document.getElementById("confirmar_acao").checked;
            
            if (radioDef.disabled && radioDef.checked) {
                alert("Exclusão definitiva bloqueada. Cliente possui vínculos. Use 'Desativar'.");
                e.preventDefault();
                return;
            }
            if (!confirmou) {
                alert("Você precisa confirmar antes de executar a ação.");
                e.preventDefault();
                return;
            }
            if (!confirm("Tem certeza? Esta ação será registrada em auditoria.")) {
                e.preventDefault();
            }
        });
    } catch (e) { console.warn("Scripts da tela EXCLUIR não carregados:", e.message); }
    
});