"use client"
import Modal from "@/app/componentes/Modal";
import {Dispatch, SetStateAction, useState} from "react";
import {db, auth} from "@/firebase";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {toast} from "sonner";
import {LuLoader2} from "react-icons/lu";
import {Card} from "@/types/Card";

type AddNewCardModalProps = {
  open: boolean;
  onClose: () => void;
  setCards: Dispatch<SetStateAction<any[]>>
  edit?: boolean
  card?: Card
}
const CardModal = ({open, onClose, setCards,edit,card}: AddNewCardModalProps) => {

  const [payload, setPayload] = useState({
    name: edit ? card?.name : "",
    number: edit ? card?.number : "",
    maxAmount: edit ? card?.maxAmount : "",
    usedAmount: edit ? card?.usedAmount : "",
    isVisa: edit ? card?.isVisa : true,
    color: edit ? card?.color : "",
    cut_date: edit ? card?.cut_date : ""
  })

  const [loading, setLoading] = useState(false)

  const AddCard = async () => {

    if(payload?.name === "" || payload?.number === "" || payload?.maxAmount === "" || payload?.usedAmount === ""){
        toast.error("Todos los campos son requeridos")
        return
    }
    if(payload?.number?.length !== 4){
        toast.error("El número de la tarjeta debe ser de 4 dígitos")
        return
    }

    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      const creditCardsRef = collection(db,'users',user.uid,'credit_cards')
      setLoading(true)

      await addDoc(creditCardsRef,payload).then((doc:any)=>{
        setCards((cards:Card[]) => [...cards,{
          id: doc.id,
          ...payload
        }])
        toast.success("Tarjeta agregada correctamente")
      })
      setLoading(false)
      onClose()
    })
  }

  const EditCard = async () => {

    if(payload.name === "" || payload.number === "" || payload.maxAmount === "" || payload.usedAmount === ""){
      toast.error("Todos los campos son requeridos")
      return
    }
    if(payload?.number?.length !== 4){
      toast.error("El número de la tarjeta debe ser de 4 dígitos")
      return
    }

    auth.onAuthStateChanged(async (user) => {
      if (user === null || card === undefined) return
      setLoading(true)
      const creditCardsRef = doc(db,'users',user.uid,'credit_cards',card.id)
        await updateDoc(creditCardsRef,payload).then(()=>{
            setCards((cards:Card[]) => {
            return cards.map((c) => {
                if(c.id === card?.id){
                return {
                    id: card.id,
                    ...payload
                }
                }
                return c
            })
            })
            toast.success("Tarjeta actualizada correctamente")
        })

      setLoading(false)
      onClose()
    })
  }


  return (
    <Modal onClose={onClose} show={open} >
      <div className="flex flex-col p-4 ">
        <div className="flex flex-row justify-center">
          <span className="font-bold text-xl">{edit ? `Editar tarjeta ${card?.name}` : 'Agregar nueva tarjeta' }   </span>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12  flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Nombre de la tarjeta</label>
            <input
              value={payload.name}
              onChange={(e) => setPayload({...payload, name: e.target.value})}
              type="text" placeholder="Nombre" className="border-2 border-gray-200 p-2 rounded-md w-full"/>
          </div>

          <div className="col-span-12 md:col-span-3 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Número de tarjeta</label>
            <input
              value={payload.number}
              onChange={(e) => setPayload({...payload, number: e.target.value})}
              type="number" min={0} max={9999} placeholder="Número de tarjeta (Ultimos 4 digitos )"
              className="border-2 border-gray-200 p-2 rounded-md w-full"/>
          </div>
          <div className="col-span-12 md:col-span-3 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Día de corte</label>
            <input
              value={payload.cut_date}
              onChange={(e) => setPayload({...payload, cut_date: e.target.value})}
              type="number" min={0} max={31} placeholder="Dia de corte"
              className="border-2 border-gray-200 p-2 rounded-md w-full"/>
          </div>
          <div className="col-span-12 md:col-span-3 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Tipo de tarjeta</label>
            <select
              value={payload.isVisa ? "visa" : "mastercard"}
              onChange={(e) => setPayload({...payload, isVisa: e.target.value === "visa"})}
              className="border-2 border-gray-200 p-2 rounded-md w-full">
              <option value="">Selecciona</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
            </select>
          </div>
          <div className="col-span-12 md:col-span-3 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Color de tarjeta</label>
            <select
              value={payload.color}
              onChange={(e) => setPayload({...payload, color: e.target.value})}
              className="border-2 border-gray-200 p-2 rounded-md w-full">
              <option value="">Selecciona</option>
              <option value="blue">Azul</option>
              <option value="purple">Morado</option>
              <option value="yellow">Amarillo</option>

            </select>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Capacidad de la tarjeta</label>
            <input
              value={payload.maxAmount}
              onChange={(e) => setPayload({...payload, maxAmount: e.target.value})}
              type="number" min={0} placeholder="Monto Maximo de la tarjeta"
              className="border-2 border-gray-200 p-2 rounded-md w-full"/>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-col justify-center mt-4">
            <label className="text-sm font-semibold">Monto usado de la tarjeta</label>
            <input
              value={payload.usedAmount}
              onChange={(e) => setPayload({...payload, usedAmount: e.target.value})}
              type="number" min={0} placeholder="Monto Usado de la tarjeta"
              className="border-2 border-gray-200 p-2 rounded-md w-full"/>
          </div>
          <div className="flex flex-row justify-center gap-x-4 mt-4 col-span-12 ">
            <button
              onClick={onClose}
              type="button" className="bg-gray-500 hover:bg-gray-800 text-white rounded-md px-4 py-2">Cancelar
            </button>
            <button
              onClick={edit ? EditCard : AddCard}
              disabled={loading}
              type="button" className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2 w-32">
              {loading ? <LuLoader2 className="animate-spin w-4 h-4 text-white mx-auto"/>
                :
                edit ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </div>


      </div>
    </Modal>
  );
}

export default CardModal