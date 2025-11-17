# Projeto-Engenharia-de-Software

Projeto de Engenharia de Software, sistema de mercado

🛒 Visão Geral do Projeto: Sistema de Gestão para Supermercado
Este projeto consiste no desenvolvimento de um Sistema Integrado de Gestão projetado especificamente para atender às necessidades operacionais de um supermercado, abrangendo desde o cadastro de clientes e funcionários até a gestão de estoque, produtos e fornecedores. O objetivo principal é centralizar e otimizar processos críticos, garantindo eficiência, controle e rastreabilidade em todas as áreas.

🔑 Módulos Principais
O sistema é dividido em módulos funcionais que cobrem os pilares da operação de um supermercado, com foco na estabilidade e na correta aplicação de regras de negócio:

1. Módulo de Clientes (RFS01, RFS02, RFS03, RFS04)
Gerenciamento completo da base de clientes.
Cadastro: Permite inserir clientes com validação de CPF (unicidade e formato).
Consulta: Permite buscar clientes por CPF, nome, telefone, endereço e status.
Edição e Exclusão: Permite alterar dados do cliente, com regras específicas para alteração de CPF (se editável na política) e exclusão. A exclusão pode ser lógica (inativação) ou definitiva (se não houver vínculos).

2. Módulo de Funcionários (RFS05, RFS06, RFS07, RFS08)
Controle e organização do quadro de colaboradores.
Cadastro: Permite registrar novos funcionários, com validação de CPF para unicidade e integridade.
Gestão: Permite a consulta e atualização de informações como telefone, endereço, cargo e salário.
Exclusão: A exclusão física (definitiva) não é permitida; é realizada apenas a inativação lógica, preservando o histórico de ações e registros.

3. Módulo de Produtos e Estoque (RFS09 a RFS16, RFS25)
Controle de inventário e mercadorias, do cadastro à descontinuação.
Gestão de Estoque: Permite inserir itens de estoque com controle de lote e validade, e consultar/editar esses itens. A exclusão de item de estoque é permitida apenas se o estoque for igual a zero.
Gestão de Produtos: Permite o cadastro , consulta , alteração , e descontinuação (inativação lógica) de produtos.
Relatório de Estoque (RFS25): Emissão de relatório visual (gráfico de barras) e tabulado, ordenado pela data de validade mais próxima, crucial para o controle de perdas.

4. Módulo de Fornecedores (RFS17, RFS18, RFS19, RFS20)
Gestão dos parceiros comerciais para cotação e aquisição de mercadorias.
Cadastro e Edição: Permite inserir fornecedores com Razão Social e CNPJ. Permite a alteração do campo de endereço.
Consulta e Relatório: Permite a busca por Razão Social, CNPJ e Ramo de Atividade, com resultados agrupados por ramo.
Exclusão: Permite a exclusão de fornecedores se não houver mais interações (especulações de orçamento ou consultas de preço).

5. Módulo de Seções (RFS21, RFS22, RFS23, RFS24)
Organização lógica dos produtos e atribuição de responsabilidade por departamento.
Cadastro: Permite registrar seções (departamentos) com Nome, Código, Descrição, Responsável e Status. Nome e Código devem ser únicos.
Gestão: Permite consulta, edição e exclusão lógica de seções, com verificação obrigatória de vínculos com produtos antes da inativação ou exclusão.

🔒 Regras de Negócio e Auditoria
O sistema prioriza a integridade dos dados e a rastreabilidade das ações:
Ações como edição de clientes , edição de funcionários , e exclusão de funcionários e seções  exigem o registro em auditoria de usuário, data e hora da modificação/operação.
A inativação (exclusão lógica) é o padrão para preservar o histórico, sendo a remoção definitiva geralmente bloqueada em casos de vínculos (clientes com vendas, funcionários).

### Links dos Documentos

* [DRE](https://docs.google.com/document/d/1AG3WQAE0YHvN49bGdYE4iE0XvViLezwdIagybRTVeGo/edit?tab=t.0)
* [Poker Planning (Planilha)](https://docs.google.com/spreadsheets/d/1qxx6wb7zdPd04oXO9DWUSqzK6QyIl8gfT2rWcGnMj9Q/edit?gid=631401022#gid=631401022)
* [Poker Planning (Comparativo)](https://docs.google.com/document/d/16ifAUfpznmNTLzYRdH-eQ2tqcJDJVt2vAFeNw3M0uK4/edit?tab=t.0)
* [Quadro no Trello](https://trello.com/b/Gzl9QMux/engenharia-de-software-supermarket)

---

### Equipe

* Christian Ferreira Toledo
* Mateus Eduardo de Pádua Almeida
* Thiago José da Cruz
* Thiago Santos Fonseca Amaral


---
Acesse como está ficando por esse link: https://thiagowq.github.io/Projeto-Engenharia-de-Software/
