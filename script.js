document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split("\n").filter(line => line.trim() !== "");
        const labels = [];
        const datasets = {
            "Реактор 1": { data: [], color: "orange" },
            "Реактор 2": { data: [], color: "red" },
            "Реактор 3": { data: [], color: "pink" },
            "Куб": { data: [], color: "magenta" },
            "Холодильник": { data: [], color: "blue" }
        };

        lines.forEach(line => {
            const parts = line.split(" --- ");
            if (parts.length < 6) return;

            labels.push(parts[0].trim()); // Время

            Object.keys(datasets).forEach((key, index) => {
                const match = parts[index + 1].match(/[-+]?\d*\.\d+/);
                if (match) {
                    datasets[key].data.push(parseFloat(match[0]));
                }
            });
        });

        createChart(labels, datasets);
    };
    reader.readAsText(file);
});

function createChart(labels, datasets) {
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
                    pan: { enabled: true, mode: "xy" },
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "xy" }
                }
            }
        }
    });
}