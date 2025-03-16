document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
        const labels = [];
        const dataSets = {
            "Реактор 1": { data: [], color: "red" },
            "Реактор 2": { data: [], color: "green" },
            "Реактор 3": { data: [], color: "blue" },
            "Куб": { data: [], color: "orange" },
            "Холодильник": { data: [], color: "purple" }
        };

        lines.forEach(line => {
            const parts = line.split(" --- ");
            if (parts.length < 6) return;  // Пропускаем строки, если данных мало

            labels.push(parts[0].trim()); // Время фиксации

            let index = 1;
            for (let key in dataSets) {
                const match = parts[index].match(/[-+]?\d*\.\d+/);
                if (match) {
                    dataSets[key].data.push(parseFloat(match[0]));
                }
                index++;
            }
        });

        drawChart(labels, dataSets);
    };
    reader.readAsText(file);
});

function drawChart(labels, dataSets) {
    const ctx = document.getElementById('chartCanvas').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: Object.keys(dataSets).map((key) => ({
                label: key,
                data: dataSets[key].data,
                borderColor: dataSets[key].color,
                fill: false,
                pointRadius: 3,
                pointHoverRadius: 6
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Время" } },
                y: { title: { display: true, text: "Температура (°C)" }, suggestedMin: 0, suggestedMax: 100 }
            },
            plugins: {
                zoom: {
                    pan: { enabled: true, mode: "x" },
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Время: ${tooltipItem.label}, Значение: ${tooltipItem.raw}°C`;
                        }
                    }
                }
            }
        }
    });
}

function zoomIn() {
    window.myChart.zoom(1.2);
}

function zoomOut() {
    window.myChart.zoom(0.8);
}

function resetZoom() {
    window.myChart.resetZoom();
}
