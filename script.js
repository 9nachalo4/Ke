let originalLabels = [];
let originalData = {};
const TELEGRAM_BOT_TOKEN = "7405587987:AAHJWblQgHHCVgE2e8MX0g9eKU-u94fORac"; // Токен бота
const CHAT_ID = "8139559374"; // ID чата


document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split("\n").filter(line => line.trim() !== "");
        originalLabels = [];
        originalData = {
            "Реактор 1": { data: [], color: "red" },
            "Реактор 2": { data: [], color: "green" },
            "Реактор 3": { data: [], color: "blue" },
            "Куб": { data: [], color: "orange" },
            "Холодильник": { data: [], color: "purple" }
        };

        lines.forEach(line => {
            const parts = line.split(" --- ");
            if (parts.length < 6) return;

            originalLabels.push(parts[0].trim());

            let index = 1;
            for (let key in originalData) {
                const match = parts[index].match(/[-+]?\d*\.\d+/);
                if (match) {
                    originalData[key].data.push(parseFloat(match[0]));
                }
                index++;
            }
        });

        drawChart(originalLabels, originalData);
    };
    reader.readAsText(file);
});


function sendImageToTelegram() {
    const canvas = document.getElementById("chartCanvas");
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("chat_id", CHAT_ID);
        formData.append("photo", blob, "graph.png");

        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("Изображение отправлено в Telegram!");
            } else {
                alert("Ошибка отправки: " + data.description);
            }
        })
        .catch(error => alert("Ошибка сети: " + error));
    }, "image/png");
}

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
}

// Фильтрация данных по времени
function filterChartData() {
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    const filteredLabels = [];
    const filteredData = {
        "Реактор 1": { data: [], color: "red" },
        "Реактор 2": { data: [], color: "green" },
        "Реактор 3": { data: [], color: "blue" },
        "Куб": { data: [], color: "orange" },
        "Холодильник": { data: [], color: "purple" }
    };

    for (let i = 0; i < originalLabels.length; i++) {
        if (originalLabels[i] >= startTime && originalLabels[i] <= endTime) {
            filteredLabels.push(originalLabels[i]);
            for (let key in originalData) {
                filteredData[key].data.push(originalData[key].data[i]);
            }
        }
    }

    drawChart(filteredLabels, filteredData);
}

// Сохранение графика в изображение
function saveChartAsImage() {
    const canvas = document.getElementById("chartCanvas");
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "filtered_graph.png";
    link.click();
}
