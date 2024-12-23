let chart;
const CLOUD_FUNCTION_URL = 'YOUR_CLOUD_FUNCTION_URL';
const BUCKET_NAME = 'YOUR_BUCKET_NAME';

async function fetchNewData() {
    const data = {
        ticker: document.getElementById('ticker').value.toUpperCase(),
        interval: document.getElementById('interval').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        bucket_name: BUCKET_NAME
    };

    try {
        const response = await fetch(CLOUD_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            await listFiles();
        } else {
            console.error('Error fetching data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function listFiles() {
    try {
        const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${BUCKET_NAME}/o`);
        const data = await response.json();
        
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        
        data.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.textContent = item.name;
            div.onclick = () => loadDataFromFile(item.name);
            fileList.appendChild(div);
        });
    } catch (error) {
        console.error('Error listing files:', error);
    }
}

async function loadDataFromFile(filename) {
    try {
        const response = await fetch(`https://storage.googleapis.com/${BUCKET_NAME}/${filename}`);
        const csvData = await response.text();
        const data = parseCSV(csvData);
        renderChart(data);
    } catch (error) {
        console.error('Error loading file:', error);
    }
}

function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        if (line.length >= 5) {
            data.push({
                x: new Date(line[0]),
                o: parseFloat(line[1]),
                h: parseFloat(line[2]),
                l: parseFloat(line[3]),
                c: parseFloat(line[4])
            });
        }
    }
    return data;
}

function renderChart(data) {
    const ctx = document.getElementById('chart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: 'Stock Price',
                data: data,
                color: {
                    up: '#4CAF50',
                    down: '#FF5252',
                }
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#d4d4d4'
                    }
                },
                y: {
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#d4d4d4'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#d4d4d4'
                    }
                }
            }
        }
    });
}

// Initialize
document.getElementById('endDate').valueAsDate = new Date();
document.getElementById('startDate').valueAsDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
listFiles();