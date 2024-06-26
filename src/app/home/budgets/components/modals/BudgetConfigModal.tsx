"use client"
import Modal from "@/app/componentes/Modal";
import {db, auth} from "@/firebase";
import {Dispatch, useState} from "react";
import {doc, updateDoc} from "firebase/firestore";
import {toast} from "sonner";

type BudgetConfigModalProps = {
  show: boolean;
  onClose: () => void;
  setUser:  Dispatch<any>
  user: any
}
const BudgetConfigModal = ({show,onClose,setUser,user}:BudgetConfigModalProps) => {

  const [payload, setPayload] = useState({
    fortnight: user.fortnight || 0,
    numberOfFortnights: user.numberOfFortnights || 0
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async()=> {
    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      setLoading(true)
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        fortnight: payload.fortnight,
        numberOfFortnights: payload.numberOfFortnights
      })
      setUser({...user, fortnight: payload.fortnight})
      toast.success('Configuración guardada')
      setLoading(false)
      onClose()
    })
  }

  return(
    <Modal show={show} onClose={onClose} >
      <div className="flex flex-col p-4">
        <div className="felx flex-row justify-center">
          <span>Configuración</span>
        </div>
        <div className="flex flex-col">
          <label htmlFor="amount">¿Cuantas veces te pagan al mes?</label>
          <input type="number"
                 value={payload.numberOfFortnights}
                 onChange={(e) => setPayload({...payload, numberOfFortnights: parseInt(e.target.value)})}
                 className="border border-gray-400 rounded-md p-2"/>
        </div>
        <div className="flex flex-col">
          <label htmlFor="amount">¿Cuanto ganas en cada pago?</label>
          <input type="number"
                 value={payload.fortnight}
                 onChange={(e) => setPayload({...payload, fortnight: parseInt(e.target.value)})}
                 className="border border-gray-400 rounded-md p-2"/>
        </div>
        <div className="flex flex-row justify-center gap-x-4 mt-4">

          <button onClick={onClose} className="bg-gray-800 hover:bg-gray-800 text-white rounded-md px-4 py-2">Cancelar
          </button>
          <button
              onClick={handleSave}
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2">{loading ? 'Guardando...' : 'Guardar'}</button>

        </div>

      </div>
    </Modal>
  );
}

export default BudgetConfigModal;