function loadSavedInputs() {
    document.getElementById('maintenanceFee').value = localStorage.getItem('maintenanceFee') || '3500';
    document.getElementById('propertyTax').value = localStorage.getItem('propertyTax') || '0';
    document.getElementById('membershipFee').value = localStorage.getItem('membershipFee') || '0';
    document.getElementById('exchangeFee').value = localStorage.getItem('exchangeFee') || '200';
    document.getElementById('priceIncrease').value = localStorage.getItem('priceIncrease') || '5';
}

function saveInputs() {
    localStorage.setItem('maintenanceFee', document.getElementById('maintenanceFee').value);
    localStorage.setItem('propertyTax', document.getElementById('propertyTax').value);
    localStorage.setItem('membershipFee', document.getElementById('membershipFee').value);
    localStorage.setItem('exchangeFee', document.getElementById('exchangeFee').value);
    localStorage.setItem('priceIncrease', document.getElementById('priceIncrease').value);
}

function validateInputs() {
    const maintenanceFee = parseFloat(document.getElementById('maintenanceFee').value);
    const priceIncrease = parseFloat(document.getElementById('priceIncrease').value);
    document.getElementById('error').innerText = '';
    if (isNaN(maintenanceFee) || maintenanceFee <= 0 || isNaN(priceIncrease) || priceIncrease < 0) {
        document.getElementById('error').innerText = 'Please enter valid numbers. Maintenance Fee and Price Increase % must be positive.';
        return false;
    }
    return true;
}

function calculateProjection() {
    if (!validateInputs()) return;
    saveInputs();
    const maintenanceFee = parseFloat(document.getElementById('maintenanceFee').value);
    const propertyTax = parseFloat(document.getElementById('propertyTax').value);
    const membershipFee = parseFloat(document.getElementById('membershipFee').value);
    const exchangeFee = parseFloat(document.getElementById('exchangeFee').value);
    const priceIncrease = parseFloat(document.getElementById('priceIncrease').value) / 100;

    let labels = [], data = [], totalFee = maintenanceFee + propertyTax + membershipFee + exchangeFee;
    let projectionText = "<h3>20-Year Projection:</h3><ul>";

    for (let year = 1; year <= 20; year++) {
        totalFee *= (1 + priceIncrease);
        labels.push(`Year ${year}`);
        data.push(totalFee);
        projectionText += `<li>Year ${year}: $${totalFee.toFixed(2)}</li>`;
    }
    projectionText += "</ul>";

    // Display the projection as text above the chart
    document.getElementById('results').innerHTML = projectionText;

    const ctx = document.getElementById('myChart').getContext('2d');
    if (window.myChart instanceof Chart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Projected Maintenance Fee Over 20 Years',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, ticks: { callback: value => `$${value.toFixed(2)}` } } },
            tooltips: { callbacks: { label: (tooltipItem, chart) => `${chart.datasets[tooltipItem.datasetIndex].label}: $${Number(tooltipItem.yLabel).toFixed(2)}` } }
        }
    });
    document.getElementById('success').innerText = 'Projection calculated successfully!';
}

window.onload = loadSavedInputs;
