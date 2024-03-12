"use client"
import {Card} from "@/types/Card";
import {useEffect, useState} from "react";
import {collection, deleteDoc, getDocs, where} from "@firebase/firestore";
import {db, auth} from "@/firebase";
import CardPurchaseModal from "@/app/home/cards/components/modals/CardPurchaseModal";
import Purchase from "@/app/home/cards/components/Purchase";
import {doc, query, updateDoc} from "firebase/firestore";

type CardPurchasesProps = {
  card: Card
}
const CardPurchases = ({card}: CardPurchasesProps) => {

  const [purchases, setPurchases] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const getPurchases = async () => {
    setPurchases([])
    auth.onAuthStateChanged((user) => {
      if (user === null) return
      const purchasesArray = collection(db, "users", user.uid, "credit_cards", card.id, "msi")
      const purchasesSnapshot = getDocs(purchasesArray)
      purchasesSnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setPurchases((purchases) => [...purchases, {id: doc.id, ...doc.data()}])
        });
      });
    })
  }

  useEffect(() => {
    getPurchases()
  }, []);

  const calculateTotal = () => {

    const total = purchases.reduce((acc, purchase) => {
      return acc + (purchase.per_pay)
    }, 0)

    auth.onAuthStateChanged((user) => {
      if(user === null) return

      const budgetRef = collection(db, "users", user.uid, "budgets")
      const CardFilter = query(budgetRef,where('category', '==', 'Tarjetas') )
      const budgetSnapshot = getDocs(CardFilter)

      budgetSnapshot.then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          if(doc.data().credit_card === card.id && doc.data().category === "Tarjetas"){
            await updateDoc(doc.ref, {
              id: doc.id,
              amount: total,
              credit_card: card.id,
              category: "Tarjetas",
              name: card.name,
              paid: false,
              pay_date: card.cut_date
            })
          }
        });
      });

    })



    return  total
  }


  return (
    <div className="flex flex-col md:h-56 md:overflow-y-auto overflow-x-auto ">
      <div className="flex flex-row justify-between mt-4">
        <span className="text-sm font-semibold">Gastos y MSI de {card?.name}</span>
        {open && <CardPurchaseModal setPurchases={setPurchases} card={card} open={open} onClose={() => {
          setOpen(false)
        }}/>}
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-900 rounded px-2 py-1 text-white text-xs">+ Agregar compra a MSI
        </button>
      </div>
      <div className="flex flex-row mt-4">
        <table className="w-full">
          <thead>
          <tr className="text-sm px-2">
            <th className="text-center border border-gray-500 px-2">Nombre</th>
            <th className="text-center border border-gray-500 px-2">Pagos</th>
            <th className="text-center border border-gray-500 px-2">Pagados</th>
            <th className="text-center border border-gray-500 px-2">$ por pago</th>
            <th className="text-center border border-gray-500 px-2">Total</th>
            <th className="text-center border border-gray-500 px-2">Faltante</th>
            <th className="text-center border border-gray-500 px-2">Acciones</th>
          </tr>
          </thead>
          <tbody>
          {purchases.map((purchase: Purchase, index: number) => {
            return (<Purchase key={index} purchase={purchase} card={card} setPurchases={setPurchases}/>)
          })}
          <tr className="text-sm ">
            <td className="text-center border border-gray-500">Total</td>
            <td className="text-center border border-gray-500"></td>
            <td className="text-center border border-gray-500"></td>
            <td className="text-center border border-gray-500">{calculateTotal().toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN'
            })}</td>
            <td className="text-center border border-gray-500"></td>
            <td className="text-center border border-gray-500"></td>
            <td className="text-center border border-gray-500"></td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default CardPurchases