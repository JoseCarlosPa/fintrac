"use client"
import {Card} from "@/types/Card";
import {useEffect, useState} from "react";
import {collection, deleteDoc, getDocs} from "@firebase/firestore";
import {db, auth} from "@/firebase";
import CardPurchaseModal from "@/app/home/cards/components/modals/CardPurchaseModal";
import swal from "sweetalert2";
import {doc} from "firebase/firestore";

type CardPurchasesProps = {
  card: Card

}
const CardPurchases = ({card}: CardPurchasesProps) => {

  const [purchases, setPurchases] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
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

  const deletePurchase = async (purchaseId: string) => {
    swal.fire({
      title: '¿Estás seguro?',
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
          await deleteDoc(doc(db, "users", user.uid, "credit_cards", card.id, "msi", purchaseId))
          getPurchases()
        })
      }
    })
  }


  return (
    <div className="flex flex-col h-56 overflow-y-auto ">
      <div className="flex flex-row justify-between mt-4">
        <span className="text-sm font-semibold">Gastos y MSI de {card?.name}</span>
        {open && <CardPurchaseModal card={card} open={open} onClose={() => {
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
                {openEdit && <CardPurchaseModal card={card} edit purchase={purchase} open={openEdit} onClose={() => {
                  setOpenEdit(false)
                }}/>}
                <td className="text-center border border-gray-500">{purchase.name}</td>
                <td className="text-center border border-gray-500">{purchase.payments}</td>
                <td className="text-center border border-gray-500">{purchase.paid}</td>
                <td className="text-center border border-gray-500">{(purchase.per_pay).toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN'
                })}</td>
                <td
                  className="text-center border border-gray-500">{(purchase.payments * purchase.per_pay).toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN'
                })}</td>
                <td
                  className="text-center border border-gray-500">{((purchase.payments * purchase.per_pay) - purchase.paid).toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN'
                })}</td>
                <td className="text-center border border-gray-500">
                  <div className="flex flex-row gap-x-4 justify-center">
                    <button
                      onClick={() => setOpenEdit(true)}
                      className="bg-gray-900 rounded px-2 py-1 text-white text-xs">Editar
                    </button>
                    <button
                      onClick={() => deletePurchase(purchase.id)}
                      className="bg-red-500 rounded px-2 py-1 text-white text-xs">Eliminar
                    </button>
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