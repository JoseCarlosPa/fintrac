import { OutCome } from "@/types/OutCome";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

type OutcomePieChartProps = {
    outcomes: OutCome[]
}

ChartJS.register(ArcElement, Tooltip, Legend);

const OutComePieChart = ({ outcomes }: OutcomePieChartProps) => {

    const [data, setData] = useState<{
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        }>;
    }>({
        labels: [],
        datasets: [
            {
                label: 'Gastos por categoría',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    })

    // Paleta de colores fija por categoría
    const CATEGORY_COLORS: Record<string, string> = {
        Alimentos: '#60A5FA',
        Transporte: '#34D399',
        Entretenimiento: '#FBBF24',
        Salud: '#F87171',
        Educacion: '#A78BFA', // sin tilde
        Otros: '#F472B6',
    };
    const DEFAULT_COLORS = [
        '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6', '#FCD34D', '#818CF8', '#FCA5A5', '#6EE7B7'
    ];

    const getColorForCategory = (category: string, idx: number) => {
        return CATEGORY_COLORS[category] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
    }

    const loadData = () => {
        setData({
            labels: [],
            datasets: [
                {
                    label: 'Gastos por categoría',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                },
            ],
        })
        let labels: string[] = [];
        let values: number[] = [];
        let colors: string[] = [];
        outcomes.forEach((outcome) => {
            const catIdx = labels.indexOf(outcome.category);
            if (catIdx === -1) {
                labels.push(outcome.category);
                values.push(Number(outcome.amount));
                colors.push(getColorForCategory(outcome.category, labels.length - 1));
            } else {
                values[catIdx] += Number(outcome.amount);
            }
        });
        setData({
            labels,
            datasets: [
                {
                    label: 'Gastos por categoría',
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 2,
                },
            ],
        });
    }

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outcomes])

    const options = {
        plugins: {
            legend: {
                display: false // Ocultamos la leyenda por defecto
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const value = context.parsed;
                        const label = context.label;
                        const total = context.dataset.data.reduce((a: any, b: any) => Number(a) + Number(b), 0);
                        const percentage = ((Number(value) / Number(total)) * 100).toFixed(2);
                        return `${label}: ${percentage}% - ${Number(value).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`;
                    }
                }
            }
        },
        animation: {
            animateRotate: true,
            animateScale: true
        }
    };

    if (!outcomes || outcomes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
                <span>No hay datos para mostrar</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-xs md:max-w-sm">
                <Pie data={data} options={options} />
            </div>
            <div className="mt-4 w-full flex flex-col gap-2">
                {data.labels.map((label: string, idx: number) => (
                    <div key={label} className="flex items-center gap-2 text-sm md:text-base">
                        <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: getColorForCategory(label, idx) }}></span>
                        <span className="font-semibold text-gray-700">{label}</span>
                        <span className="ml-auto font-mono text-blue-700">{Number(data.datasets[0].data[idx]).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                        <span className="ml-2 text-xs text-gray-500">{((Number(data.datasets[0].data[idx]) / data.datasets[0].data.reduce((a: any, b: any) => Number(a) + Number(b), 0)) * 100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OutComePieChart;