"use client"
import {Card} from "@/types/Card";
import {useEffect, useState} from "react";
import {collection, getDocs} from "@firebase/firestore";
import {db, auth} from "@/firebase";

type CardPurchasesProps = {
  card: Card

}
const CardPurchases = ({card}: CardPurchasesProps) => {

  const [purchases, setPurchases] = useState<any[]>([])
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

  return (
    <div className="flex flex-col h-56 overflow-y-auto ">
      <div className="flex flex-row justify-between mt-4">
        <span className="text-sm font-semibold">Gastos y MSI de {card?.name}</span>
        <button className="bg-gray-900 rounded px-2 py-1 text-white text-xs">+ Agregar compra a MSI</button>
      </div>
      <div className="flex flex-row mt-4">
        <table className="w-full">
          <thead>
          <tr className="text-sm ">
            <th className="text-center border border-gray-500 b">Nombre</th>
            <th className="text-center border border-gray-500">Pagos</th>
            <th className="text-center border border-gray-500">Pagados</th>
            <th className="text-center border border-gray-500">$ por pago</th>
            <th className="text-center border border-gray-500">Total</th>
            <th className="text-center border border-gray-500">Faltante</th>
            <th className="text-center border border-gray-500">Acciones</th>
          </tr>
          </thead>
          <tbody>
          {purchases.map((purchase) => {
            return (
              <tr key={purchase.id} className="text-sm ">
                <td className="text-center border border-gray-500">{purchase.name}</td>
                <td className="text-center border border-gray-500">{purchase.payments}</td>
                <td className="text-center border border-gray-500">{purchase.paid}</td>
                <td className="text-center border border-gray-500">{(purchase.per_pay).toLocaleString('es-MX',{
                  style: 'currency',
                  currency: 'MXN'
                })}</td>
                <td className="text-center border border-gray-500">{(purchase.payments * purchase.per_pay).toLocaleString('es-MX',{
                  style: 'currency',
                  currency: 'MXN'
                })}</td>
                <td className="text-center border border-gray-500">{((purchase.payments * purchase.per_pay) - purchase.paid).toLocaleString('es-MX',{
                  style: 'currency',
                  currency: 'MXN'
                })}</td>
                <td className="text-center border border-gray-500">
                  <div className="flex flex-row gap-x-4 justify-center">
                    <button className="bg-gray-900 rounded px-2 py-1 text-white text-xs">Editar</button>
                    <button className="bg-red-500 rounded px-2 py-1 text-white text-xs">Eliminar</button>
                  </div>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default CardPurchases