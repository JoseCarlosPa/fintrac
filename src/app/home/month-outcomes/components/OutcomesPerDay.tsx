import {OutCome} from "@/types/OutCome";
import {Bar} from "react-chartjs-2";
import React, {useEffect, useState, useCallback} from "react";

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
        label: 'Gastos por día',
        data: [],
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(99,125,255,0.8)');
          gradient.addColorStop(1, 'rgba(99,125,255,0.2)');
          return gradient;
        },
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 28,
      },
    ],
  });

  const days = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()

  const calculateLabels = useCallback(() => {
    const labels = []
    for (let i = 1; i <= days; i++) {
      labels.push(i)
    }
    setLabels(labels)
  }, [days]);

  const calculateOutcomesPerDay = useCallback(() => {
    const outcomesPerDay = []
    for (let i = 1; i <= days; i++) {
      let total = 0
      outcomes.forEach((outcome) => {
        const date = new Date(outcome.date)
        if (date.getDate() + 1 === i) {
          total += Number(outcome.amount)
        }
      })
      outcomesPerDay.push(total)
    }
    setOutcomesPerDay(outcomesPerDay)
  }, [days, outcomes]);

  useEffect(() => {
    calculateLabels();
    calculateOutcomesPerDay();
  }, [calculateLabels, calculateOutcomesPerDay]);


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
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Día ${context.label}: ${Number(context.parsed.y).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`;
          }
        }
      },
      title: {
        display: true,
        text: 'Gastos por día',
        color: '#6366f1',
        font: {
          size: 18,
          weight: 700
        },
        padding: {top: 10, bottom: 20}
      },
    },
    animation: {
      duration: 900,
      easing: 'easeOutQuart' as const,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Día del mes',
          color: '#64748b',
          font: { size: 14, weight: 700 }
        },
        ticks: {
          color: '#64748b',
          font: { size: 12 }
        },
        grid: {
          color: '#e0e7ef',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Monto',
          color: '#64748b',
          font: { size: 14, weight: 700 }
        },
        ticks: {
          color: '#64748b',
          font: { size: 12 },
        },
        grid: {
          color: '#e0e7ef',
        }
      }
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
    <div className="w-full">
      <Bar options={options} data={data}/>
    </div>
  );

}

export default OutcomesPerDay