document.addEventListener("DOMContentLoaded", function () {
    // Campos do formulário
    const inputRazao = document.getElementById("razaoSocial");
    const inputRamo = document.getElementById("ramoAtividade");
    const inputCnpj = document.getElementById("cnpj");
    const btnEmitir = document.getElementById("emitirRelatorioFor");

    // Área onde os blocos por ramo serão montados
    const divBlocosRamo = document.getElementById("blocos-ramo");
    const spanTotalFornecedores = document.getElementById("total-fornecedores");

    // --------- DADOS FAKE DE FORNECEDORES ---------
    // Aqui é o "backend fake" desse relatório
    const dadosFornecedores = [
        {
            razaoSocial: "Indústrias Alfa Alimentos LTDA",
            ramo: "Indústria",
            cnpj: "00.111.222/0001-33",
            quantidadeProdutos: 35,
            endereco: "Av. Brasil, 123 - Centro - São Paulo/SP"
        },
        {
            razaoSocial: "Distribuidora Betha Bebidas ME",
            ramo: "Distribuidora",
            cnpj: "11.222.333/0001-44",
            quantidadeProdutos: 18,
            endereco: "Rua das Laranjeiras, 456 - Rio de Janeiro/RJ"
        },
        {
            razaoSocial: "Comercial Gamma Higiene e Limpeza",
            ramo: "Indústria",
            cnpj: "22.333.444/0001-55",
            quantidadeProdutos: 22,
            endereco: "Rod. Anhanguera, km 45 - Campinas/SP"
        },
        {
            razaoSocial: "Super Atacado Delta",
            ramo: "Atacado",
            cnpj: "33.444.555/0001-66",
            quantidadeProdutos: 50,
            endereco: "Av. das Nações, 789 - Belo Horizonte/MG"
        },
        {
            razaoSocial: "Varejão Épsilon Alimentos",
            ramo: "Varejo",
            cnpj: "44.555.666/0001-77",
            quantidadeProdutos: 12,
            endereco: "Rua 7 de Setembro, 1000 - Curitiba/PR"
        },
        {
            razaoSocial: "Indústria Zeta Produtos de Limpeza",
            ramo: "Indústria",
            cnpj: "55.666.777/0001-88",
            quantidadeProdutos: 28,
            endereco: "Rua da Limpeza, 250 - Santo André/SP"
        }
    ];

    // --------- FUNÇÕES DE APOIO ---------

    // Normaliza texto pra comparar sem acento/maiúsculas
    function normalizar(texto) {
        return (texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Deixa só dígitos no CNPJ
    function somenteDigitos(texto) {
        return (texto || "").replace(/\D/g, "");
    }

    // Habilitar/desabilitar botão (3 campos obrigatórios)
    function validarFormulario() {
        const campos = [
            inputRazao.value.trim(),
            inputRamo.value.trim(),
            inputCnpj.value.trim()
        ];

        const tudoPreenchido = campos.every(function (v) {
            return v !== "" && v !== null;
        });

        btnEmitir.disabled = !tudoPreenchido;
    }

    inputRazao.addEventListener("input", validarFormulario);
    inputRamo.addEventListener("input", validarFormulario);
    inputCnpj.addEventListener("input", validarFormulario);

    // --------- CLIQUE NO BOTÃO EMITIR ---------
    btnEmitir.addEventListener("click", function () {

        const filtroRazao = normalizar(inputRazao.value.trim());
        const filtroRamo = normalizar(inputRamo.value.trim());
        const filtroCnpj = somenteDigitos(inputCnpj.value.trim());

        const filtrados = dadosFornecedores.filter(function (forn) {
            const razaoNorm = normalizar(forn.razaoSocial);
            const ramoNorm = normalizar(forn.ramo);
            const cnpjDigits = somenteDigitos(forn.cnpj);

            const matchRazao =
                filtroRazao === "" || razaoNorm.includes(filtroRazao);

            const matchRamo =
                filtroRamo === "" || ramoNorm.includes(filtroRamo);

            // Aqui eu permito o usuário digitar o CNPJ inteiro ou só o começo
            const matchCnpj =
                filtroCnpj === "" || cnpjDigits.startsWith(filtroCnpj);

            return matchRazao && matchRamo && matchCnpj;
        });

        atualizarRelatorio(filtrados);
    });

    // --------- MONTAGEM DO RELATÓRIO ---------

    function atualizarRelatorio(lista) {
        divBlocosRamo.innerHTML = "";

        if (lista.length === 0) {
            divBlocosRamo.innerHTML =
                "<p>Nenhum fornecedor encontrado com os filtros informados.</p>";
            spanTotalFornecedores.textContent =
                "0 fornecedores - 0 produtos no total";
            return;
        }

        // Agrupa fornecedores por ramo
        const gruposPorRamo = {};
        lista.forEach(function (forn) {
            if (!gruposPorRamo[forn.ramo]) {
                gruposPorRamo[forn.ramo] = [];
            }
            gruposPorRamo[forn.ramo].push(forn);
        });

        let totalFornecedores = 0;
        let totalProdutos = 0;

        // Para cada ramo ("Indústria", "Atacado", etc.)
        Object.keys(gruposPorRamo).forEach(function (ramo) {
            const fornecedoresRamo = gruposPorRamo[ramo];

            let subtotalQuantidadeProdutos = 0;
            fornecedoresRamo.forEach(function (f) {
                subtotalQuantidadeProdutos += f.quantidadeProdutos;
            });

            const variedadeProdutos = fornecedoresRamo.length; // qts fornecedores naquele ramo

            totalFornecedores += fornecedoresRamo.length;
            totalProdutos += subtotalQuantidadeProdutos;

            // Monta tabela daquele ramo
            let html = `
                <div class="section-group">
                    <div class="section-header">
                        &lt;&lt; ${ramo} &gt;&gt;
                    </div>
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>Razão Social</th>
                                <th>CNPJ</th>
                                <th>Quantidade de produtos</th>
                                <th>Endereço</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            fornecedoresRamo.forEach(function (f) {
                html += `
                    <tr>
                        <td>${f.razaoSocial}</td>
                        <td>${f.cnpj}</td>
                        <td>${f.quantidadeProdutos}</td>
                        <td>${f.endereco}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                    <div class="section-footer">
                        <p><strong>SubTotal da ${ramo} (Quantidade de produtos):</strong> ${subtotalQuantidadeProdutos}</p>
                        <p><strong>SubTotal da ${ramo} (Variedade de fornecedores):</strong> ${variedadeProdutos}</p>
                    </div>
                </div>
                <hr class="section-divider">
            `;

            divBlocosRamo.insertAdjacentHTML("beforeend", html);
        });

        spanTotalFornecedores.textContent =
            `${totalFornecedores} fornecedor(es) - ${totalProdutos} produto(s) no total`;
    }

    // Opcional: mostrar tudo logo de cara na primeira carga
    atualizarRelatorio(dadosFornecedores);
});
