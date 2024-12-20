// Datos del historial financiero
const historialData = [
    { fecha: '2024-11-01', balance: 5000 },
    { fecha: '2024-11-05', balance: 7000 },
    { fecha: '2024-11-10', balance: 6500 },
    { fecha: '2024-11-15', balance: 8500 }
];

// Función para crear el gráfico de balance financiero
function crearGraficoBalance() {
    // Extraer fechas y balances del historial
    const fechas = historialData.map(item => item.fecha);
    const balances = historialData.map(item => item.balance);

    // Seleccionar el lienzo del gráfico
    const ctx = document.getElementById('balanceChart').getContext('2d');

    // Crear el gráfico usando Chart.js
    new Chart(ctx, {
        type: 'line', // Tipo de gráfico
        data: {
            labels: fechas, // Etiquetas de tiempo (fechas)
            datasets: [{
                label: 'Balance Financiero',
                data: balances,
                borderColor: '#ff6384', // Color de la línea
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color de relleno
                borderWidth: 2 // Grosor de la línea
            }]
        },
        options: {
            responsive: true, // Ajustar tamaño automáticamente
            plugins: {
                legend: {
                    display: true,
                    position: 'top' // Posición de la leyenda
                },
                tooltip: {
                    enabled: true // Mostrar tooltip al pasar el cursor
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha' // Título del eje X
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Balance ($)' // Título del eje Y
                    },
                    beginAtZero: true // Inicia desde cero
                }
            }
        }
    });
}

// Llamar a la función para inicializar el gráfico
document.addEventListener('DOMContentLoaded', () => {
    crearGraficoBalance();
});
