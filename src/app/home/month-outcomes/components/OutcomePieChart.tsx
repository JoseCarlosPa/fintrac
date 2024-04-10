import { OutCome } from "@/types/OutCome";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

type OutcomePieChartProps = {
    outcomes: OutCome[]
}

ChartJS.register(ArcElement, Tooltip, Legend);

const OutComePieChart = ({ outcomes }: OutcomePieChartProps) => {

    const [categories, setCategories] = useState([] as string[])
    const [data, setData] = useState({
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

    function getRandomRGBColor(): string {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(160);
        const b = Math.floor(Math.random() * 255);
        const color = `rgb(${r}, ${g}, ${b})`;
        return color;
    }

    const categoriesArray = () => {
        setCategories([])
        outcomes.forEach((outcome) => {
            setCategories((prevCategories: any) => {
                return prevCategories.includes(outcome.category) ? prevCategories : [...prevCategories, outcome.category]
            })
        })
    }

    useEffect(() => {
        categoriesArray()
    }, [])

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
        outcomes.forEach((outcome) => {
            setData((prevData: any) => {
                return {
                    ...prevData,
                    labels: prevData.labels.includes(outcome.category) ? prevData.labels : [...prevData.labels, outcome.category],
                    datasets: [
                        {
                            label: '',
                            data: prevData.labels.includes(outcome.category) ? prevData.datasets[0].data.map((value: number, index: number) => {
                                if (index === prevData.labels.indexOf(outcome.category)) {
                                    return Number(value) + Number(outcome.amount)
                                }
                                return value
                            }, outcome.amount) : [...prevData.datasets[0].data, outcome.amount],
                            backgroundColor: [
                                ...prevData.datasets[0].backgroundColor,
                                getRandomRGBColor()
                            ],
                            borderColor: [
                                ...prevData.datasets[0].borderColor,
                                getRandomRGBColor()
                            ],
                            borderWidth: 1,
                        },
                    ],
                }
            })
        })

    }

    useEffect(() => {
        loadData()
    }, [outcomes])

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context:any) {
                        const value = context.parsed;
                        console.log('Value',context.parsed)
                        const label = context.label;
                        const total = context.dataset.data.reduce((a:any, b:any) => Number(a) + Number(b), 0);
                        const percentage = ((Number(value) / Number(total)) * 100).toFixed(2);
                    
                        return `${label}: ${percentage}% - $${value}`;
                    }
                }
            }
        }
    };
    
    return (
        <div className="flex flex-row mx-auto my-auto">
            <Pie data={data} options={options} />
        </div>
    );
}

export default OutComePieChart;