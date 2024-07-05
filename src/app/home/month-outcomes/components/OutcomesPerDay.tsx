import {OutCome} from "@/types/OutCome";
import {Bar} from "react-chartjs-2";
import React, {useEffect, useState} from "react";

type OutcomesPerDayProps = {
  outcomes: OutCome[]
}
const OutcomesPerDay = ({outcomes}: OutcomesPerDayProps) => {

  const [labels, setLabels] = useState<number[]>([])
  const [outcomesPerDay, setOutcomesPerDay] = useState<any[]>([])

  const [data, setData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Gastos por dia',
        data: [],
        backgroundColor: 'rgba(99,125,255,0.5)',
      },
    ],
  });

  const days = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()

  const calculateLabels = () => {
    const labels = []
    for (let i = 1; i <= days;
         i++
    ) {
      labels.push(i)
    }
    setLabels(labels)
  }

  const calculateOutcomesPerDay = () => {
    const outcomesPerDay = []
    for (let i = 1; i <= days; i++) {
      let total = 0
      outcomes.forEach((outcome) => {
        const date = new Date(outcome.date)
        if (date.getDate() === i) {
          total += Number(outcome.amount)
        }
      })
      outcomesPerDay.push(total)
    }
    setOutcomesPerDay(outcomesPerDay)
  }

  useEffect(() => {
    calculateLabels()
    calculateOutcomesPerDay()
  }, [outcomes]);


  useEffect(() => {
    setData((prevData: any) => {
      return {
        ...prevData,
        labels: labels,
        datasets: [
          {
            label: 'Gastos por dia',
            data: outcomesPerDay,
            backgroundColor: 'rgba(99,125,255,0.5)',
          },
        ],
      };
    });
  }, [labels,outcomesPerDay]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gastos por dia',
      },
    },
  };

  console.log('Repeat')


  return (
    <div className="w-full">
      <Bar options={options} data={data} className="h-full"/>

    </div>
  );

}

export default OutcomesPerDay