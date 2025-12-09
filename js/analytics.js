// Analytics and Dashboard Summary

let expenseChart = null;

function updateDashboardSummary() {
    if (!currentUserData) return;
    
    const monthlyIncome = currentUserData.profile.monthlyIncome || 0;
    
    // Calculate totals
    let totalAllocated = 0;
    let totalSpent = 0;
    
    envelopes.forEach(envelope => {
        totalAllocated += envelope.allocated || 0;
        totalSpent += envelope.spent || 0;
    });
    
    const totalAvailable = monthlyIncome - totalSpent;
    
    // Update summary cards
    document.getElementById('totalIncome').textContent = formatCurrency(monthlyIncome);
    document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);
    document.getElementById('totalAvailable').textContent = formatCurrency(totalAvailable);
    
    // Calculate 50/30/20 distribution
    calculate503020(monthlyIncome);
    
    // Update chart
    updateChart();
}

function calculate503020(monthlyIncome) {
    const needs = monthlyIncome * 0.50;
    const personal = monthlyIncome * 0.30;
    const savings = monthlyIncome * 0.20;
    
    // Calculate actual spending by category
    let needsSpent = 0;
    let personalSpent = 0;
    let savingsSpent = 0;
    
    envelopes.forEach(envelope => {
        if (envelope.category === 'necesidades') {
            needsSpent += envelope.spent || 0;
        } else if (envelope.category === 'personales') {
            personalSpent += envelope.spent || 0;
        } else if (envelope.category === 'ahorro') {
            savingsSpent += envelope.spent || 0;
        }
    });
    
    // Update needs section
    document.getElementById('needsAmount').textContent = formatCurrency(needs);
    const needsPercentage = needs > 0 ? (needsSpent / needs) * 100 : 0;
    document.getElementById('needsPercentage').textContent = `${Math.min(needsPercentage, 100).toFixed(0)}%`;
    document.getElementById('needsProgress').style.width = `${Math.min(needsPercentage, 100)}%`;
    
    // Update personal section
    document.getElementById('personalAmount').textContent = formatCurrency(personal);
    const personalPercentage = personal > 0 ? (personalSpent / personal) * 100 : 0;
    document.getElementById('personalPercentage').textContent = `${Math.min(personalPercentage, 100).toFixed(0)}%`;
    document.getElementById('personalProgress').style.width = `${Math.min(personalPercentage, 100)}%`;
    
    // Update savings section
    document.getElementById('savingsAmount').textContent = formatCurrency(savings);
    const savingsPercentage = savings > 0 ? (savingsSpent / savings) * 100 : 0;
    document.getElementById('savingsPercentage').textContent = `${Math.min(savingsPercentage, 100).toFixed(0)}%`;
    document.getElementById('savingsProgress').style.width = `${Math.min(savingsPercentage, 100)}%`;
}

function initializeChart() {
    const ctx = document.getElementById('expenseChart');
    if (!ctx) return;
    
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    // Prepare data
    const chartData = prepareChartData();
    
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.data,
                backgroundColor: chartData.colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${formatCurrency(value)}`;
                        }
                    }
                }
            }
        }
    });
}

function prepareChartData() {
    const labels = [];
    const data = [];
    const colors = [];
    
    if (envelopes.length === 0) {
        return {
            labels: ['Sin datos'],
            data: [1],
            colors: ['#e5e7eb']
        };
    }
    
    envelopes.forEach(envelope => {
        if (envelope.spent > 0) {
            labels.push(envelope.name);
            data.push(envelope.spent);
            colors.push(envelope.color);
        }
    });
    
    // If no spending yet, show allocated amounts
    if (data.length === 0) {
        envelopes.forEach(envelope => {
            if (envelope.allocated > 0) {
                labels.push(envelope.name);
                data.push(envelope.allocated);
                colors.push(envelope.color);
            }
        });
    }
    
    return { labels, data, colors };
}

function updateChart() {
    if (!expenseChart) {
        initializeChart();
        return;
    }
    
    const chartData = prepareChartData();
    
    expenseChart.data.labels = chartData.labels;
    expenseChart.data.datasets[0].data = chartData.data;
    expenseChart.data.datasets[0].backgroundColor = chartData.colors;
    expenseChart.update();
}
