"use client"
import Modal from "@/app/componentes/Modal";
import {Purchase} from "@/types/Purchase";
import React, {Dispatch, SetStateAction, useState} from "react";
import {LuLoader2} from "react-icons/lu";
import {db, auth} from "@/firebase";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {Card} from "@/types/Card";
import {toast} from "sonner";

type CardPurchaseModalProps = {
  open: boolean;
  onClose: () => void;
  purchase?: Purchase
  edit?: boolean
  card: Card
  setPurchases: Dispatch<SetStateAction<any[]>>
}
const CardPurchaseModal = ({open,onClose,edit,purchase,card,setPurchases}:CardPurchaseModalProps) => {

  const [loading, setLoading] = useState(false)

  const [payload, setPayload] = useState({
    id: edit ? purchase?.id : undefined,
    name: edit ? purchase?.name : "",
    payments: edit ? purchase?.payments : undefined,
    paid:  edit ? purchase?.paid : undefined,
    per_pay: edit ? purchase?.per_pay : undefined,
  })

  const AddPurchase = async () => {
    if(payload?.name === "" || payload?.payments === undefined || payload?.paid === undefined || payload?.per_pay === undefined){
      toast.error("Todos los campos son requeridos")
      return
    }
    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      const purchasesRef = collection(db,'users',user.uid,'credit_cards',card?.id ,'msi')
      setLoading(true)
      await addDoc(purchasesRef,payload).then(()=>{
        setLoading(false)
        setPurchases((purchases:Purchase[]) => [...purchases,payload])
        toast.success("Compra agregada correctamente")
        onClose()
      })
    })
  }

  const EditPurchase = async () => {
    if(payload.name === "" || payload.payments === 0 || payload.paid === 0 || payload.per_pay === 0){
      toast.error("Todos los campos son requeridos")
      return
    }
    auth.onAuthStateChanged(async (user) => {
      if (user === null || purchase === undefined) return
      setLoading(true)
      const purchaseRef = doc(db,'users',user.uid,'credit_cards',card.id,'msi',purchase.id)
      await updateDoc(purchaseRef,payload).then(()=>{
        setLoading(false)
        setPurchases((prevState:Purchase[]) => {
          return prevState.map(pur => {
            if(pur.id === payload.id){
              return payload
            }
            return pur
          })
        })
        toast.success("Compra actualizada correctamente")
        onClose()
      })
    })
  }


  return(
    <Modal show={open} onClose={onClose} >
      <div className="flex flex-col p-4">
        <div className="flex flex-row justify-between">
          <span className="text-lg font-semibold">{edit ? `Editar compra a MSI de ${purchase?.name}` : "Agregar compra a MSI"} </span>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Nombre de la compra</label>
            <input
              onChange={(e) => setPayload({...payload, name: e.target.value})}
              className="border-2 border-gray-200 p-2 rounded-md w-full"
              type="text"
              value={payload?.name}
              id="cardName"
              placeholder="Nombre de la compra"
            />
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Pagos</label>
            <input
              onChange={(e) => setPayload({...payload, payments: parseInt(e.target.value)})}
              className="border-2 border-gray-200 p-2 rounded-md w-full"
              type="number"
              value={payload?.payments}
              id="payments"
              placeholder="Pagos"
            />
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Pagado</label>
            <input
              onChange={(e) => setPayload({...payload, paid: parseInt(e.target.value)})}
              className="border-2 border-gray-200 p-2 rounded-md w-full"
              type="number"
              value={payload?.paid}
              id="paid"
              placeholder="Pagado"
            />
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">$ Por pago</label>
            <input
              onChange={(e) => setPayload({...payload, per_pay: parseInt(e.target.value)})}
              className="border-2 border-gray-200 p-2 rounded-md w-full"
              type="number"
              value={payload?.per_pay}
              id="per_pay"
              placeholder="$ Por pago"
            />
          </div>

        </div>
        <div className="flex flex-row justify-center gap-x-4 my-2">
          <button
            type={"button"}
            onClick={onClose}
            className="bg-gray-800 rounded px-2 py-1 text-white ">
            Cancelar</button>
          <button
            type={"button"}
            onClick={edit ? EditPurchase : AddPurchase}
            className="bg-gray-900 rounded px-2 py-1 text-white w-32 ">
            {loading ? <LuLoader2 className="animate-spin w-4 h-4 text-white mx-auto"/>
              :
              edit ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
      </div>

    </Modal>
  );
}

export default CardPurchaseModal