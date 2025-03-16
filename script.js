document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
        const labels = [];
        const data = [];

        lines.forEach(line => {
            const [time, value] = line.split(',');
            if (time && value) {
                labels.push(time.trim());
                data.push(parseFloat(value.trim()));
            }
        });

        if (window.myChart) {
            window.myChart.destroy();
        }

        const ctx = document.getElementById('chartCanvas').getContext('2d');
        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Значение',
                    data: data,
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Время' } },
                    y: { title: { display: true, text: 'Значение' } }
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,   // Перемещение мышью
                            mode: 'x'        // Двигаем только по оси X
                        },
                        zoom: {
                            wheel: { enabled: true }, // Зум колесиком
                            pinch: { enabled: true }, // Зум на тачскрине
                            mode: 'x'                // Зумируем только по X
                        }
                    }
                },
                onClick: function(evt, elements) {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        alert(`Время: ${labels[index]}, Значение: ${data[index]}`);
                    }
                }
            }
        });
    };
    reader.readAsText(file);
});

function zoomIn() {
    window.myChart.zoom(1.2);
}

function zoomOut() {
    window.myChart.zoom(0.8);
}

function resetZoom() {
    window.myChart.resetZoom();
}
