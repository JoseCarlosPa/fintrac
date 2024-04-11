"use client"
import React, {useEffect, useState} from 'react';
import {db, auth} from "@/firebase";
import {collection, getDocs} from "@firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const VerticalBarChart = () => {

  const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const [data, setData] = useState<any>({
    labels: labels,
    datasets: [
      {
        label: 'Gastos mensuales no planeados',
        data: [],
        backgroundColor: 'rgba(99,125,255,0.5)',
      },
    ],
  });

  const[dataPerMonth, setDataPerMonth] = useState<any>()

  const monthName = (month: number) => {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    return months[month]
  }

  const loadData = async () => {
    setDataPerMonth({
      "Enero": 0,
      "Febrero": 0,
      "Marzo": 0,
      "Abril": 0,
      "Mayo": 0,
      "Junio": 0,
      "Julio": 0,
      "Agosto": 0,
      "Septiembre": 0,
      "Octubre": 0,
      "Noviembre": 0,
      "Diciembre": 0
    })

    auth.onAuthStateChanged((user) => {
      if (user === null) return
      const outcomesArray = collection(db, "users", user.uid, "outcomes")
      const outcomesSnapshot = getDocs(outcomesArray)
      outcomesSnapshot.then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
          const year = new Date(doc.data().date).getFullYear()
          if (year !== new Date().getFullYear()) return
          setDataPerMonth((prevData: any) => {
            const date = new Date(doc.data().date)
            const month = monthName(date.getMonth())
            return {
              ...prevData,
              [month]: prevData[month] + Number(doc.data().amount)
            }}
          )
        })
      })
    })
  }


  useEffect(() => {
    loadData()
  }, []);


  useEffect(() => {
    if(!dataPerMonth) return
    setData((prevData: any) => {
      return {
        ...prevData,
        datasets: [
          {
            label: 'Gastos mensuales',
            data: Object.values(dataPerMonth),
            backgroundColor: 'rgba(99,125,255,0.5)',
          },
        ],
      };
    });
  }, [dataPerMonth]);




  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gastos no planeados por mes',
      },
    },
  };


  return(
  
    <Bar options={options} data={data} className="h-full" />
  
  );

}

export default VerticalBarChart;