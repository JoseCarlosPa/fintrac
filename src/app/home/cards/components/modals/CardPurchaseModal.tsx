import Modal from "@/app/componentes/Modal";
import {Purchase} from "@/types/Purchase";
import {useState} from "react";
import {LuLoader2} from "react-icons/lu";
import {db, auth} from "@/firebase";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {Card} from "@/types/Card";

type CardPurchaseModalProps = {
  open: boolean;
  onClose: () => void;
  purchase?: Purchase
  edit?: boolean
  card: Card
}
const CardPurchaseModal = ({open,onClose,edit,purchase,card}:CardPurchaseModalProps) => {

  const [loading, setLoading] = useState(false)

  const [payload, setPayload] = useState({
    name: edit ? purchase?.name : "",
    payments: edit ? purchase?.payments : 0,
    paid:  edit ? purchase?.paid : 0,
    per_pay: edit ? purchase?.per_pay : 0,
  })

  const AddPurchase = async () => {
    if(payload?.name === "" || payload?.payments === 0 || payload?.paid === 0 || payload?.per_pay === 0){
      return
    }
    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      const purchasesRef = collection(db,'users',user.uid,'credit_cards', 'msi')
      setLoading(true)
      await addDoc(purchasesRef,payload).then(()=>{
        setLoading(false)
        onClose()
      })
    })
  }

  const EditPurchase = async () => {
    if(payload.name === "" || payload.payments === 0 || payload.paid === 0 || payload.per_pay === 0){
      return
    }
    auth.onAuthStateChanged(async (user) => {
      if (user === null || purchase === undefined) return
      setLoading(true)
      const purchaseRef = doc(db,'users',user.uid,'credit_cards',card.id,'msi',purchase.id)
      await updateDoc(purchaseRef,payload).then(()=>{
        setLoading(false)
        onClose()
      })
    })
  }


  return(
    <Modal show={open} onClose={onClose} >
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <span className="text-lg font-semibold">{edit ? "Editar" : "Agregar"} compra a MSI</span>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 flex flex-col justify-center mt-4">
            <span className="text-xs text-white font-semibold">Nombre de la compra</span>
            <input
              onChange={(e) => setPayload({...payload, name: e.target.value})}
              className="border-2 border-gray-200 p-2 rounded-md w-full"
              type="text"
              value={payload?.name}
              id="cardName"
              disabled
              placeholder="Nombre de la compra"
            />
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-center mt-4">
            <span className="text-xs text-white font-semibold">Pagos</span>
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
            <span className="text-xs text-white font-semibold">Pagado</span>
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
            <span className="text-xs text-white font-semibold">$ Por pago</span>
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
        <div className="flex flex-row justify-end">
          <button
            onClick={edit ? EditPurchase :AddPurchase}
            className="bg-gray-900 rounded px-2 py-1 text-white text-xs">
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