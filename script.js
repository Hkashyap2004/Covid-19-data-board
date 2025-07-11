// script.js

document.addEventListener('DOMContentLoaded', () => {
    fetchGlobalData();
    fetchHistoricalData();
    fetchTopCountriesData();
});

// API Base URL
const API_BASE_URL = 'https://disease.sh/v3/covid-19';

// Function to fetch global data
async function fetchGlobalData() {
    try {
        const response = await fetch(`${API_BASE_URL}/all`);
        const data = await response.json();

        // Update summary cards
        document.getElementById('total-cases').textContent = data.cases.toLocaleString();
        document.getElementById('total-deaths').textContent = data.deaths.toLocaleString();
        document.getElementById('total-recovered').textContent = data.recovered.toLocaleString();

        // Create Pie Chart
        createGlobalPieChart(data);

    } catch (error) {
        console.error('Error fetching global data:', error);
    }
}

// Function to fetch historical data
async function fetchHistoricalData() {
    try {
        const response = await fetch(`${API_BASE_URL}/historical/all?lastdays=30`);
        const data = await response.json();
        createHistoricalLineChart(data);
    } catch (error) {
        console.error('Error fetching historical data:', error);
    }
}


// Function to fetch data for top 10 countries
async function fetchTopCountriesData() {
    try {
        const response = await fetch(`${API_BASE_URL}/countries?sort=cases`);
        const data = await response.json();
        const top10 = data.slice(0, 10);
        createTopCountriesBarChart(top10);
    } catch (error) {
        console.error('Error fetching country data:', error);
    }
}
// Function to create the global data pie chart
function createGlobalPieChart(data) {
    const ctx = document.getElementById('globalPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Active Cases', 'Deaths', 'Recovered'],
            datasets: [{
                data: [data.active, data.deaths, data.recovered],
                backgroundColor: ['#f39c12', '#e74c3c', '#2ecc71'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Global COVID-19 Distribution'
                }
            }
        }
    });
}

// Function to create the historical data line chart
function createHistoricalLineChart(data) {
    const ctx = document.getElementById('historicalLineChart').getContext('2d');
    const labels = Object.keys(data.cases);
    const cases = Object.values(data.cases);
    const deaths = Object.values(data.deaths);
    const recovered = Object.values(data.recovered);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cases',
                    data: cases,
                    borderColor: '#3498db',
                    fill: false,
                },
                {
                    label: 'Deaths',
                    data: deaths,
                    borderColor: '#e74c3c',
                    fill: false,
                },
                {
                    label: 'Recovered',
                    data: recovered,
                    borderColor: '#2ecc71',
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Date' }
                },
                y: {
                    title: { display: true, text: 'Number of People' }
                }
            }
        }
    });
}

// Function to create the top countries bar chart
function createTopCountriesBarChart(data) {
    const ctx = document.getElementById('topCountriesBarChart').getContext('2d');
    const countryNames = data.map(country => country.country);
    const caseCounts = data.map(country => country.cases);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countryNames,
            datasets: [{
                label: 'Total Cases',
                data: caseCounts,
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
            }]
        },
        options: {
            indexAxis: 'y', // To make it a horizontal bar chart
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}