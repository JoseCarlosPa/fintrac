"use client"
import Modal from "@/app/componentes/Modal";
import {Dispatch, SetStateAction, useState} from "react";
import {db, auth} from "@/firebase";
import {addDoc, collection, doc} from "firebase/firestore";
import {toast} from "sonner";
import {LuLoader2} from "react-icons/lu";

type AddNewCardModalProps = {
  open: boolean;
  onClose: () => void;
  setCards: Dispatch<SetStateAction<any[]>>
}
const AddNewCardModal = ({open, onClose, setCards}: AddNewCardModalProps) => {

  const [payload, setPayload] = useState({
    name: "",
    number: "",
    expiryDate: "",
    maxAmount: "",
    usedAmount: "",
    isVisa: false
  })

  const [loading, setLoading] = useState(false)

  const AddCard = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      const creditCardsRef = collection(db,'users',user.uid,'credit_cards')
      setLoading(true)

      await addDoc(creditCardsRef,payload).then((doc:any)=>{
        setCards((cards) => [...cards,{
          id: doc.id,
          ...payload
        }])
        toast.success("Tarjeta agregada correctamente")
      })
      setLoading(false)
      onClose()
    })
  }


  return (
    <Modal onClose={onClose} show={open} >
      <div className="flex flex-col p-4 ">
        <div className="flex flex-row justify-center">
          <span className="font-bold text-xl">Agregar nueva tarjeta</span>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12  flex flex-row justify-center mt-4">
            <input
              onChange={(e) => setPayload({...payload, name: e.target.value})}
              type="text" placeholder="Nombre" className="border-2 border-gray-200 p-2 rounded-md w-full"/>
          </div>

          <div className="col-span-12 md:col-span-6 flex flex-row justify-center mt-4">
            <input
              onChange={(e) => setPayload({...payload, number: e.target.value})}
              type="number" min={0} max={999} placeholder="Número de tarjeta (Ultimos 3 digitos )"
                   className="border-2 border-gray-200 p-2 rounded-md w-full"/>
          </div>
          <div className="col-span-12 md:col-span-3 flex flex-row justify-center mt-4">
            <select
              onChange={(e) => setPayload({...payload, isVisa: e.target.value === "visa"})}
              className="border-2 border-gray-200 p-2 rounded-md w-full">
              <option value="">Selecciona</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
            </select>
          </div>
          <div className="col-span-12 md:col-span-3 flex flex-row justify-center mt-4">
            <input
              onChange={(e) => setPayload({...payload, expiryDate: e.target.value})}
              type="text" placeholder="Fecha de expiración"
                   className="border-2 border-gray-200 p-2 rounded-md w-full"/>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-row justify-center mt-4">
            <input
              onChange={(e) => setPayload({...payload, maxAmount: e.target.value})}
              type="number" min={0} placeholder="Monto Maximo de la tarjeta"
                   className="border-2 border-gray-200 p-2 rounded-md w-full"/>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-row justify-center mt-4">
            <input
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
              onClick={AddCard}
              disabled={loading}
              type="button" className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2 w-32">
              {loading ? <LuLoader2 className="animate-spin w-4 h-4 text-white mx-auto" />
                :
              'Agregar'}
            </button>
          </div>
        </div>


      </div>
    </Modal>
  );
}

export default AddNewCardModal