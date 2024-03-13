"use client"
import React, {useEffect, useState} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {db, auth} from "@/firebase";
import {collection, getDocs} from "@firebase/firestore";

ChartJS.register(ArcElement, Tooltip, Legend);


const PieChart = () => {

  const [data, setData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: '# of Votes',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  })

  // Take from budgets the data from firebase and do it like the dataExample

  function getRandomRGBColor(): string {
    // Generar valores aleatorios para cada componente RGB que esten en un color parecido
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(160);
    const b = Math.floor(Math.random() * 255);

    // Formatear los valores RGB en una cadena "rgb(r, g, b)"
    const color = `rgb(${r}, ${g}, ${b})`;
    return color;
  }

  const loadData= async () => {
    auth.onAuthStateChanged((user) => {
      if (user === null) return
      const budgetsArray = collection(db, "users", user.uid, "budgets")
      const budgetsSnapshot = getDocs(budgetsArray)
      budgetsSnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setData((prevData: any) => {
            return {
              ...prevData,
              // if the label already exists, don't add it again
              labels: prevData.labels.includes(doc.data().category) ? prevData.labels : [...prevData.labels, doc.data().category],
              datasets: [
                {
                  label: '',
                  // if the label already exists add the amount to the data array
                  data: prevData.labels.includes(doc.data().category) ? prevData.datasets[0].data.map((value: any, index: number) => {
                    if (index === prevData.labels.indexOf(doc.data().category)) {
                      return value + doc.data().amount
                    }
                    return value
                  }, doc.data().amount) : [...prevData.datasets[0].data, doc.data().amount],
                  backgroundColor: [
                    ...prevData.datasets[0].backgroundColor,
                    getRandomRGBColor(),
                  ],
                  borderWidth: 1,
                },
              ],
            };

          });
        });
      });
    })

  }

  useEffect(() => {
    loadData()
  }, []);





  return(
    <Pie data={data} />
  );

}

export default PieChart;