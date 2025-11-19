document.addEventListener("DOMContentLoaded", function () {
    // Campos do formulário
    const inputProduto = document.getElementById("produto");
    const inputValidade = document.getElementById("validade");
    const selectSecao = document.getElementById("secao");
    const selectFornecedor = document.getElementById("fornecedor");
    const inputQuantidade = document.getElementById("quantidade");
    const btnEmitir = document.getElementById("emitirRelatorio");

    // Elementos da tabela e resumos
    const tbodyEstoque = document.getElementById("tbody-estoque");
    const spanSecaoNome = document.getElementById("secao-nome");
    const spanSubtotalQtd = document.getElementById("subtotal-qtd");
    const spanSubtotalValor = document.getElementById("subtotal-valor");
    const spanTotalGeral = document.getElementById("total-geral");

    // Dados fake de estoque (simulação)
    const dadosEstoque = [
        {
            produto: "Sabão em Pó Azul 100g",
            validade: "2025-12-05",
            secao: "limpeza",
            fornecedor: "Alfa Suprimentos",
            quantidade: 150,
            valorUnitario: 5.99
        },
        {
            produto: "Desinfetante Y",
            validade: "2026-01-15",
            secao: "limpeza",
            fornecedor: "Betha Distribuidora",
            quantidade: 80,
            valorUnitario: 8.50
        },
        {
            produto: "Refrigerante Cola 2L",
            validade: "2025-11-30",
            secao: "bebidas",
            fornecedor: "Betha Distribuidora",
            quantidade: 200,
            valorUnitario: 7.49
        },
        {
            produto: "Arroz Branco 5kg",
            validade: "2026-03-10",
            secao: "mercearia",
            fornecedor: "Alfa Suprimentos",
            quantidade: 120,
            valorUnitario: 24.90
        },
        {
            produto: "Suco de Laranja 1L",
            validade: "2025-10-20",
            secao: "bebidas",
            fornecedor: "Alfa Suprimentos",
            quantidade: 60,
            valorUnitario: 5.25
        }
    ];

    // Controle do gráfico
    let estoqueChart = null;

    // Função pra comparar ignorando acento e maiúscula
    function normalizar(texto) {
        return (texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // tira acentos
    }

    // Habilitar/desabilitar botão Emitir
    // (Produto e Fornecedor agora são OPCIONAIS)
    function validarFormulario() {
        const campos = [
            inputValidade.value,
            inputQuantidade.value.trim()
        ];


        const tudoPreenchido = campos.every(function (v) {
            return v !== "" && v !== null;
        });

        btnEmitir.disabled = !tudoPreenchido;
    }

    inputProduto.addEventListener("input", validarFormulario);
    inputValidade.addEventListener("change", validarFormulario);
    selectSecao.addEventListener("change", validarFormulario);
    selectFornecedor.addEventListener("change", validarFormulario);
    inputQuantidade.addEventListener("input", validarFormulario);

    // Clique no botão Emitir
    btnEmitir.addEventListener("click", function () {
        // Pega filtros
        const filtroProduto = normalizar(inputProduto.value.trim());
        const filtroValidade = inputValidade.value; // yyyy-mm-dd
        const filtroSecao = selectSecao.value;
        
        // aqui a gente pega o TEXTO do fornecedor, não o value "forn1/forn2"
        let filtroFornecedorTexto = "";
        if (selectFornecedor.value !== "") {
            filtroFornecedorTexto = selectFornecedor.options[selectFornecedor.selectedIndex].text;
        }
        const filtroFornecedorNorm = normalizar(filtroFornecedorTexto);

        const qtdMinima = parseInt(inputQuantidade.value, 10) || 0;

        // Filtra os dados
        const filtrados = dadosEstoque.filter(function (item) {
            const nomeNormalizado = normalizar(item.produto);
            const fornecedorNormalizado = normalizar(item.fornecedor);

            // Produto OPCIONAL
            const matchProduto =
                filtroProduto === "" ||
                nomeNormalizado.includes(filtroProduto);

            // Validade OBRIGATÓRIA
            const matchValidade =
                filtroValidade === "" ||
                item.validade >= filtroValidade;

            // Seção OBRIGATÓRIA
            const matchSecao =
                filtroSecao === "" ||
                normalizar(item.secao) === normalizar(filtroSecao);

            // Fornecedor OPCIONAL (agora comparando texto direitinho)
            const matchFornecedor =
                filtroFornecedorNorm === "" ||
                fornecedorNormalizado === filtroFornecedorNorm;

            const matchQuantidade = item.quantidade >= qtdMinima;

            return (
                matchProduto &&
                matchValidade &&
                matchSecao &&
                matchFornecedor &&
                matchQuantidade
            );
        });

        atualizarTabela(filtrados, filtroSecao);
        atualizarResumo(filtrados);
        atualizarGrafico(filtrados); // ATUALIZA SEMPRE, mesmo se estiver vazio
    });


    // --------- FUNÇÕES AUXILIARES ---------

    function atualizarTabela(lista, filtroSecao) {
        tbodyEstoque.innerHTML = "";

        // Atualiza nome da seção no cabeçalho
        if (filtroSecao === "limpeza") {
            spanSecaoNome.textContent = "Limpeza";
        } else if (filtroSecao === "bebidas") {
            spanSecaoNome.textContent = "Bebidas";
        } else if (filtroSecao === "mercearia") {
            spanSecaoNome.textContent = "Mercearia";
        } else {
            spanSecaoNome.textContent = "Todas";
        }

        if (lista.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");
            celula.colSpan = 4;
            celula.textContent = "Nenhum produto encontrado com os filtros informados.";
            linha.appendChild(celula);
            tbodyEstoque.appendChild(linha);
            return;
        }

        lista.forEach(function (item) {
            const tr = document.createElement("tr");

            const tdProduto = document.createElement("td");
            tdProduto.textContent = item.produto;

            const tdValidade = document.createElement("td");
            tdValidade.textContent = formatarDataBR(item.validade);

            const tdQuantidade = document.createElement("td");
            tdQuantidade.textContent = item.quantidade;

            const tdValor = document.createElement("td");
            tdValor.textContent = item.valorUnitario.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

            tr.appendChild(tdProduto);
            tr.appendChild(tdValidade);
            tr.appendChild(tdQuantidade);
            tr.appendChild(tdValor);

            tbodyEstoque.appendChild(tr);
        });
    }

    function atualizarResumo(lista) {
        let totalQtd = 0;
        let totalValor = 0;

        lista.forEach(function (item) {
            totalQtd += item.quantidade;
            totalValor += item.quantidade * item.valorUnitario;
        });

        spanSubtotalQtd.textContent = totalQtd;
        spanSubtotalValor.textContent = totalValor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        // Por enquanto total geral = subtotal
        spanTotalGeral.textContent = totalValor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function atualizarGrafico(lista) {
        const ctx = document.getElementById("estoqueChart").getContext("2d");

        const labels = lista.map(function (item) {
            return item.produto;
        });

        const dadosQtd = lista.map(function (item) {
            return item.quantidade;
        });

        // Destroi gráfico anterior pra não bugar
        if (estoqueChart !== null) {
            estoqueChart.destroy();
        }

        estoqueChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Quantidade em Estoque",
                        data: dadosQtd
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return "Qtd: " + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function formatarDataBR(dataYmd) {
        // de "2025-12-05" para "05/12/2025"
        const partes = dataYmd.split("-");
        if (partes.length !== 3) return dataYmd;
        return partes[2] + "/" + partes[1] + "/" + partes[0];
    }

    // Mostra algo inicial com todos os dados
    atualizarTabela(dadosEstoque, "");
    atualizarResumo(dadosEstoque);
    atualizarGrafico(dadosEstoque);
});
