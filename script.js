let chart;
let scrollBar = document.getElementById("scrollBar");

document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split("\n").filter(line => line.trim() !== "");
        const labels = [];
        const datasets = {
            "Реактор 1": { data: [], color: "red" },
            "Реактор 2": { data: [], color: "green" },
            "Реактор 3": { data: [], color: "blue" },
            "Куб": { data: [], color: "orange" },
            "Холодильник": { data: [], color: "purple" }
        };

        lines.forEach(line => {
            const parts = line.split(" --- ");
            if (parts.length < 6) return;

            labels.push(parts[0].trim());

            let index = 1;
            for (let key in datasets) {
                const match = parts[index].match(/[-+]?\d*\.\d+/);
                if (match) {
                    datasets[key].data.push(parseFloat(match[0]));
                }
                index++;
            }
        });

        drawChart(labels, datasets);
        setTimeout(() => showScrollbar(), 500); // Принудительное отображение полосы
    };
    reader.readAsText(file);
});

function drawChart(labels, datasets) {
    const ctx = document.getElementById("chartCanvas").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: Object.keys(datasets).map(key => ({
                label: key,
                data: datasets[key].data,
                borderColor: datasets[key].color,
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 6
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Время" } },
                y: { title: { display: true, text: "Температура (°C)" }, suggestedMin: 0, suggestedMax: 50 }
            },
            plugins: {
                zoom: {
                    pan: { enabled: true, mode: "x" },
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" }
                }
            }
        }
    });

    scrollBar.max = labels.length - 10;
    scrollBar.value = 0;
}

// Функция для отображения полосы прокрутки
function showScrollbar() {
    document.getElementById("chart-container").style.overflowX = "scroll";
    scrollBar.style.display = "block";
}

// Прокрутка графика полосой
scrollBar.addEventListener("input", function() {
    const minIndex = parseInt(scrollBar.value);
    const maxIndex = minIndex + 10;

    chart.options.scales.x.min = minIndex;
    chart.options.scales.x.max = maxIndex;
    chart.update();
});

function zoomIn() {
    window.myChart.zoom(1.2);
}

function zoomOut() {
    window.myChart.zoom(0.8);
}

function resetZoom() {
    window.myChart.resetZoom();
    scrollBar.value = 0;
}
function saveChartAsImage() {
    const canvas = document.getElementById("chartCanvas");
    const image = canvas.toDataURL("image/png"); // Создаём изображение PNG

    const link = document.createElement("a");
    link.href = image;
    link.download = "graph.png"; // Имя файла
    link.click(); // Запускаем скачивание
}
