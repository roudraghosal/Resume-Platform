import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsChart = ({ data }) => {
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Resume Views',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
            {
                label: 'Downloads',
                data: [2, 3, 20, 5, 1, 4],
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Resume Analytics',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default AnalyticsChart;
