"use client"

import CurrencyCard from "@/app/home/components/Cards/CurrencyCard";
import VerticalBarChart from "@/app/home/components/Charts/VerticalBarChart";
import PieChart from "@/app/home/components/Charts/PieChart";
import React, {useEffect, useState} from "react";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db,auth} from "@/firebase";
import {toast} from "sonner";
import swal from "sweetalert2";
import {currenciesValues} from "@/store/currencies";
const Home = () => {

  const [currencies, setCurrencies] = useState<any>([])
  const [mainCurrency, setMainCurrency] = useState('MXN')
  const [loading, setLoading] = useState(true)

  const getCurrency = async () => {
    auth.onAuthStateChanged((user) => {
      if (user === null) return
      const userInfo = getDoc(doc(db, "users", user.uid));
      userInfo.then((doc) => {
        if (doc.exists()) {
          const data = doc.data()
          const userCurrencies = data?.currencies
          const mainCurrency = data?.mainCurrency
          if (userCurrencies) {
            setMainCurrency(mainCurrency)
          }
          if (userCurrencies) {
            setCurrencies(userCurrencies)
          }
        }
      }).catch((error) => {
        toast.error("Error getting document:", error);
      })
    })

    setLoading(false)
  }

  useEffect(() => {
    getCurrency()
  }, []);

  const handleAddNewCurrency = () => {
    swal.fire({
      title: 'Agregar nueva moneda',
      input: 'select',
      inputOptions: currenciesValues,
      inputLabel: 'Moneda',
      inputPlaceholder: 'USD',
      confirmButtonText: 'Agregar moneda',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar una moneda'
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newCurrency = result.value
        setCurrencies([...currencies, newCurrency])
        const user = auth.currentUser;
        if (user === null) return
        const userInfo = getDoc(doc(db, "users", user.uid));
        userInfo.then(async (document) => {
          if (document.exists()) {
            const data = document.data()
            const userCurrencies = data?.currencies
            if (userCurrencies) {
              const value =
                {
                  currencies: [...userCurrencies, newCurrency]
                }
              const creditCardsRef = doc(db, 'users', user.uid)
              await updateDoc(creditCardsRef, value).then(() => {
                toast.success('Moneda agregada correctamente')
              }).catch((error) => {
                toast.error("Error getting document:", error);
              })
            }
          }
        }).catch((error) => {
          toast.error("Error getting document:", error);
        })
      }
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row md:justify-start justify-center md:mt-4 ">
        <div className="flex flex-col text-gray-800">
          <span className="text-2xl font-bold">Bienvenido de regreso!</span>
          <span className="hidden md:block">Es genial verte por aquí. En Fintrac, entendemos lo importante que es el control de tus finanzas personales. Por eso, estamos aquí para ayudarte a simplificar y optimizar ese proceso. </span>
        </div>
      </div>
      <div className="grid grid-cols-12 mt-4 gap-x-4 gap-y-4">
        {loading ?
          <>
            <div className="w-44 h-32 animate-pulse bg-gray-400 rounded-md md:col-span-2 col-span-6 "/>
            <div className="w-44 h-32 animate-pulse bg-gray-400 rounded-md md:col-span-2 col-span-6"/>
          </>
          : currencies.map((currency: any,index:number) => {
            return (
              <div key={index} className="col-span-6 md:col-span-2">
                <CurrencyCard currency={mainCurrency} baseCurrency={currency} setCurrencies={setCurrencies}/>
              </div>
            )
          })}
        <div className="col-span-12 md:col-span-2">
          <button
            onClick={handleAddNewCurrency}
            className="bg-transparent shadow-md rounded-md w-full md:w-44 h-12 md:h-32 cursor-pointer hover:bg-white transition">
            <div

              className="text-gray-800 flex flex-col justify-center items-center h-full border-gray-500 border-dotted border-2 rounded-md">
              + Agregar
            </div>
          </button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-6">
        <div className="col-span-12 md:col-span-6 bg-white rounded shadow-md p-4">
          <div className="flex flex-row justify-center h-72">
            <PieChart/>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6  bg-white rounded shadow-md p-4">
          <div className="flex flex-row justify-center ">
            <VerticalBarChart/>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;