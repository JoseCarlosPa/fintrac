"use client"
import {useEffect, useState} from "react";
import {getCurrencies} from "@/utils/endpoints/Currencies";
import swal from "sweetalert2";
import {auth, db} from "@/firebase";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {toast} from "sonner";

type CurrencyCardProps = {
  baseCurrency: string
  currency: string
  setCurrencies: (currencies: string[]) => void
}
const CurrencyCard = ({currency, baseCurrency,setCurrencies}: CurrencyCardProps) => {

  const [value, setValue] = useState<number>(0)

  const fetchCurrencies = async () => {
    getCurrencies(baseCurrency, currency).then((data) => {
      const curr = Object.keys(data.data)[0]
      setValue(data.data[curr])
    })
  }

  useEffect(() => {
    //fetchCurrencies()
  }, []);

  const askDelete = () => {
    swal.fire({
      title: 'Eliminar moneda',
      text: `¿Estás seguro que deseas eliminar la moneda ${baseCurrency}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const user = auth.currentUser;
        if (user === null) return
        const userInfo = getDoc(doc(db, "users", user.uid));
        userInfo.then((document) => {
          if (document.exists()) {
            const data = document.data()
            const userCurrencies = data?.currencies
            const newCurrencies = userCurrencies.filter((c: string) => c !== baseCurrency)
            updateDoc(doc(db, "users", user.uid), {
              currencies: newCurrencies
            }).then(() => {
              setCurrencies(newCurrencies)
              toast.success("Moneda eliminada")
            }).catch((error) => {
              toast.error("Error getting document:", error);
            })
          }
        }).catch((error) => {
          toast.error("Error getting document:", error);
        })
      }
    })
  }


  return (
    <div
      onClick={askDelete}
      className="bg-white hover:bg-gray-100 shadow-md rounded-md w-44 h-32 cursor-pointer">
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-3xl font-bold">{baseCurrency}</p>
        <p className="text-sm">1 {baseCurrency} = {value.toFixed(2)} <span className="text-xs">{currency}</span></p>
      </div>
    </div>
  );
}

export default CurrencyCard