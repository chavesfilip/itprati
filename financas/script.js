// === Dashboard Financeiro ITPRATI ===
// Requer: Chart.js e PapaParse incluídos no HTML

// Função principal para carregar e processar o CSV
async function carregarDados() {
    const response = await fetch('data/dados_financeiros_itprati.csv');
    const csvText = await response.text();
    const dados = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;

    return dados.map(linha => ({
        ...linha,
        Valor: parseFloat(linha.Valor),
        Data_Vencimento: new Date(linha.Data_Vencimento)
    }));
}

// Obter lista de meses disponíveis
function obterMesesDisponiveis(dados) {
    const meses = new Set(dados.map(d => `${d.Data_Vencimento.getFullYear()}-${String(d.Data_Vencimento.getMonth() + 1).padStart(2, '0')}`));
    return Array.from(meses).sort();
}

// Filtrar dados por mês selecionado
function filtrarPorMes(dados, mesSelecionado) {
    const [ano, mes] = mesSelecionado.split('-').map(Number);
    return dados.filter(d => d.Data_Vencimento.getFullYear() === ano && d.Data_Vencimento.getMonth() + 1 === mes);
}

// Calcular KPIs
function calcularKPIs(dados) {
    const totalEntradas = dados.filter(d => d.Tipo === 'Recebível').reduce((s, d) => s + d.Valor, 0);
    const totalSaidas = dados.filter(d => d.Tipo === 'Pagável').reduce((s, d) => s + d.Valor, 0);
    const saldoLiquido = totalEntradas - totalSaidas;
    const pendentesReceber = dados.filter(d => d.Tipo === 'Recebível' && (d.Status === 'Pendente' || d.Status === 'Atrasado')).reduce((s, d) => s + d.Valor, 0);
    const pendentesPagar = dados.filter(d => d.Tipo === 'Pagável' && (d.Status === 'Pendente' || d.Status === 'Atrasado')).reduce((s, d) => s + d.Valor, 0);
    return { totalEntradas, totalSaidas, saldoLiquido, pendentesReceber, pendentesPagar };
}

// Atualizar os valores dos KPIs
function atualizarKPIs(kpis) {
    document.getElementById('kpi-entradas').innerText = kpis.totalEntradas.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
    document.getElementById('kpi-saidas').innerText = kpis.totalSaidas.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
    document.getElementById('kpi-saldo').innerText = kpis.saldoLiquido.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
    document.getElementById('kpi-pendentes-receber').innerText = kpis.pendentesReceber.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
    document.getElementById('kpi-pendentes-pagar').innerText = kpis.pendentesPagar.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
}

// Gerar gráficos com Chart.js
function gerarGraficos(dadosMes, todosOsDados) {
    // === Gráfico de Fluxo de Caixa ===
    const ctxFluxo = document.getElementById('graficoFluxo').getContext('2d');
    const agrupado = {};

    todosOsDados.forEach(d => {
        const chave = `${d.Data_Vencimento.getFullYear()}-${String(d.Data_Vencimento.getMonth() + 1).padStart(2, '0')}`;
        if (!agrupado[chave]) agrupado[chave] = { entradas: 0, saidas: 0 };
        if (d.Tipo === 'Recebível') agrupado[chave].entradas += d.Valor;
        else agrupado[chave].saidas += d.Valor;
    });

    const labels = Object.keys(agrupado).sort();
    const entradas = labels.map(m => agrupado[m].entradas);
    const saidas = labels.map(m => agrupado[m].saidas);

    if (window.graficoFluxo) window.graficoFluxo.destroy();
    window.graficoFluxo = new Chart(ctxFluxo, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Entradas', data: entradas, backgroundColor: 'rgba(54, 162, 235, 0.6)' },
                { label: 'Saídas', data: saidas, backgroundColor: 'rgba(255, 99, 132, 0.6)' }
            ]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // === Gráfico de Entradas por Produto ===
    const ctxProduto = document.getElementById('graficoEntradasProduto').getContext('2d');
    const porProduto = {};
    dadosMes.filter(d => d.Tipo === 'Recebível').forEach(d => {
        porProduto[d.Produto] = (porProduto[d.Produto] || 0) + d.Valor;
    });

    if (window.graficoProduto) window.graficoProduto.destroy();
    window.graficoProduto = new Chart(ctxProduto, {
        type: 'doughnut',
        data: {
            labels: Object.keys(porProduto),
            datasets: [{
                data: Object.values(porProduto),
                backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF6384']
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // === Gráfico de Status Recebíveis ===
    const ctxStatus = document.getElementById('graficoStatusRecebiveis').getContext('2d');
    const statusData = { Pago: 0, Pendente: 0, Atrasado: 0 };
    dadosMes.filter(d => d.Tipo === 'Recebível').forEach(d => {
        statusData[d.Status] = (statusData[d.Status] || 0) + d.Valor;
    });

    if (window.graficoStatus) window.graficoStatus.destroy();
    window.graficoStatus = new Chart(ctxStatus, {
        type: 'bar',
        data: {
            labels: Object.keys(statusData),
            datasets: [{ data: Object.values(statusData), backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384'] }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

// Preencher tabela de detalhes
function preencherTabela(dadosMes) {
    const tbody = document.querySelector('#tabela-detalhes tbody');
    tbody.innerHTML = '';
    dadosMes.forEach(d => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${d.Data_Vencimento.toISOString().split('T')[0]}</td>
            <td>${d.Tipo}</td>
            <td>${d.Descricao}</td>
            <td>${d.Produto}</td>
            <td>${d.Valor.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</td>
            <td>${d.Status}</td>
            <td>${d.Cliente_Fornecedor}</td>
        `;
        tbody.appendChild(linha);
    });
}

// Atualizar todo o dashboard
function atualizarDashboard(dados, mesSelecionado) {
    const dadosMes = filtrarPorMes(dados, mesSelecionado);
    const kpis = calcularKPIs(dadosMes);
    atualizarKPIs(kpis);
    gerarGraficos(dadosMes, dados);
    preencherTabela(dadosMes);
}

// Inicialização principal
(async function init() {
    const dados = await carregarDados();
    const meses = obterMesesDisponiveis(dados);
    const seletor = document.getElementById('mes-seletor');

    meses.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.text = m;
        seletor.appendChild(opt);
    });

    seletor.value = meses[meses.length - 1]; // mês mais recente
    atualizarDashboard(dados, seletor.value);

    seletor.addEventListener('change', () => atualizarDashboard(dados, seletor.value));
})();
