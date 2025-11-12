/* ================================================= */
/* LÓGICA DAS ABAS */
/* ================================================= */
document.addEventListener('DOMContentLoaded', () => {

    const abas = document.querySelectorAll('.aba-link');
    const telas = document.querySelectorAll('.tela');

    function ativarAba(targetId) {
        telas.forEach(tela => tela.classList.remove('ativa'));
        abas.forEach(aba => aba.classList.remove('ativa'));
        
        const telaAlvo = document.getElementById(targetId);
        if (telaAlvo) telaAlvo.classList.add('ativa');
        
        const abaAlvo = document.querySelector(`.aba-link[data-target="${targetId}"]`);
        if (abaAlvo) abaAlvo.classList.add('ativa');
    }

    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            ativarAba(aba.getAttribute('data-target'));
        });
    });

    // Inicia na tela de consulta
    if (abas.length > 0) {
        ativarAba('tela-consultar'); 
    }

    /* ================================================= */
    /* MÁSCARAS DE FORMULÁRIO (Adicionadas) */
    /* ================================================= */

    // --- Máscara de CPF genérica ---
    function mascaraCPF(input) {
        if (!input) return;
        input.addEventListener("input", function() {
            let v = input.value.replace(/\D/g, "").slice(0,11);
            if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
            else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
            else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
            input.value = v;
        });
    }
    
    // --- Máscara de Telefone genérica ---
    function mascaraTelefone(input) {
        if (!input) return;
        input.addEventListener("input", function() {
            let v = input.value.replace(/\D/g,"").slice(0,11); 
            if (v.length > 10) {
                v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"); // Celular
            } else if (v.length > 6) {
                v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3"); // Fixo
            } else if (v.length > 2) {
                v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
            } else if (v.length > 0) {
                v = v.replace(/(\d{0,2})/, "($1");
            }
            input.value = v;
        });
    }

    // --- Máscara de Salário (simples) ---
    function mascaraSalario(input) {
        if (!input) return;
        input.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '');
            v = (v / 100).toFixed(2) + '';
            v = v.replace(".", ",");
            v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            e.target.value = 'R$ ' + v;
        });
    }

    // Aplicando as máscaras
    mascaraCPF(document.getElementById('cpf-func'));
    mascaraCPF(document.getElementById('cpf-filtro'));
    mascaraCPF(document.getElementById('busca_cpf_edit'));
    mascaraCPF(document.getElementById('busca_cpf_exc'));
    
    mascaraTelefone(document.getElementById('telefone-func'));
    mascaraTelefone(document.getElementById('telefone-edit'));

    mascaraSalario(document.getElementById('salario-func'));
    mascaraSalario(document.getElementById('salario-edit'));
});