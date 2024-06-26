"use client"
import CardPurchaseModal from "@/app/home/cards/components/modals/CardPurchaseModal";
import {Purchase} from "@/types/Purchase";
import {Card} from "@/types/Card";
import {Dispatch, SetStateAction, useState} from "react";
import swal from "sweetalert2";
import {auth, db} from "@/firebase";
import {deleteDoc} from "@firebase/firestore";
import {doc} from "firebase/firestore";
import {toast} from "sonner";

type PurchaseType = {
  purchase: Purchase
  card: Card
  setPurchases: Dispatch<SetStateAction<any[]>>

}
const Purchase = ({purchase,card,setPurchases}:PurchaseType) => {
  const [openEdit, setOpenEdit] = useState(false)

  const deletePurchase = async () => {
    swal.fire({
      title: `¿Estás seguro de borrar ${purchase?.name}?`,
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, bórralo!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        auth.onAuthStateChanged(async (user) => {
          if (user === null) return
          await deleteDoc(doc(db, "users", user.uid, "credit_cards", card.id, "msi", purchase.id))
            setPurchases((purchases:Purchase[]) => purchases.filter((p:Purchase) => p.id !== purchase.id))
          toast.success("Compra eliminada correctamente")
        })
      }
    })
  }


  return (
    <tr key={purchase.id} className="text-sm ">
      {openEdit && <CardPurchaseModal setPurchases={setPurchases} card={card} edit purchase={purchase} open={openEdit} onClose={() => {
        setOpenEdit(false)
      }}/>}
      <td className="text-center border border-gray-500 px-2">{purchase.name}</td>
      <td className="text-center border border-gray-500 px-2">{purchase.payments}</td>
      <td className="text-center border border-gray-500 px-2">{purchase.paid}</td>
      <td className="text-center border border-gray-500 px-2">{(purchase.per_pay).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
      })}</td>
      <td
        className="text-center border border-gray-500 px-2">{(purchase.payments * purchase.per_pay).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
      })}</td>
      <td
        className="text-center border border-gray-500 px-2">{((purchase.payments * purchase.per_pay) - (purchase.paid * purchase.per_pay)).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
      })}</td>
      <td className="text-center border border-gray-500 px-2">
        <div className="flex flex-row gap-x-4 justify-center py-1">
          <button
            onClick={() => setOpenEdit(true)}
            className="bg-gray-900 rounded px-2 py-1 text-white text-xs w-20">Editar
          </button>
          <button
            onClick={deletePurchase}
            className="bg-red-500 rounded px-2 py-1 text-white text-xs w-20">Eliminar
          </button>
        </div>
      </td>
    </tr>
  )
}

export default Purchase