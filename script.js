let chart;
let scrollBar = document.getElementById("scrollBar");

document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split("\n").filter(line => line.trim() !== "");
        const labels = [];
        const data = [];

        lines.forEach(line => {
            const [time, value] = line.split(',');
            if (time && value) {
                labels.push(time.trim());
                data.push(parseFloat(value.trim()));
            }
        });

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById("chartCanvas").getContext("2d");
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Значение",
                    data: data,
                    borderColor: "blue",
                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: "Время" } },
                    y: { title: { display: true, text: "Значение" } }
                },
                plugins: {
                    zoom: {
                        zoom: {
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            mode: "x"
                        }
                    }
                }
            }
        });

        // Настройка полосы прокрутки
        scrollBar.max = labels.length - 10;
        scrollBar.value = 0;
    };
    reader.readAsText(file);
});

// Прокрутка графика полосой
scrollBar.addEventListener("input", function() {
    const minIndex = parseInt(scrollBar.value);
    const maxIndex = minIndex + 10;

    chart.options.scales.x.min = minIndex;
    chart.options.scales.x.max = maxIndex;
    chart.update();
});

function zoomIn() {
    chart.zoom(1.2);
}

function zoomOut() {
    chart.zoom(0.8);
}

function resetZoom() {
    chart.resetZoom();
    scrollBar.value = 0;
}
