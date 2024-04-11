"use client"
import Modal from "@/app/componentes/Modal";
import {Dispatch, SetStateAction, useState} from "react";
import {ActivePassive} from "@/types/ActivePasive";
import {addDoc, collection, doc, setDoc} from "firebase/firestore";
import {auth, db} from "@/firebase";
import {toast} from "sonner";

type AddNewActivePassiveProps = {
    show: boolean;
    onClose: () => void;
    edit?:boolean;
    activePassive?: ActivePassive;
    setActivePassives:  Dispatch<SetStateAction<ActivePassive[]>>
}
const AddNewActivePassive = ({show,onClose,activePassive,edit,setActivePassives}:AddNewActivePassiveProps) =>{

    const [payload,setPayload] = useState<ActivePassive>({
        name:activePassive?.name ?? "",
        quantity: activePassive?.quantity ?? 0,
        type:activePassive?.type ?? "active",
        value:activePassive?.value ?? 0,
        missing: activePassive?.missing ?? 0,
        goal: activePassive?.goal ?? 0,
    });
    const [loading, setLoading] = useState(false)

    const onSave = async () => {
        
        if(edit){
            auth.onAuthStateChanged(async (user) => {
                if (user === null) return
                const activesPassivesRef = collection(db,'users',user.uid,"activesPassives")
                await setDoc(doc(activesPassivesRef, activePassive?.id), payload).then(() => {
                    setActivePassives((prev: any) => prev.map((item: any) => item.id === activePassive?.id ? payload : item))
                    toast.success(`${payload.type === "active" ? "Activo" : "Pasivo"} editado correctamente`)
                })
                setLoading(false)
                onClose()
                return
            })
        }else{
            auth.onAuthStateChanged(async (user) => {
                if (user === null) return
                const activesPassivesRef = collection(db,'users',user.uid,"activesPassives")
                setLoading(true)
                await addDoc(activesPassivesRef,payload).then((doc:any)=>{
                    setActivePassives((prev: any) => [...prev, {id: doc.id, ...payload}])
                    toast.success(`${payload.type === "active" ? "Activo" : "Pasivo"} agregado correctamente`)
                })
                setLoading(false)
                onClose()
            })
        }
    }

    return(
        <Modal show={show} onClose={onClose} >
            <div className="flex flex-col p-4 gap-4">
                <span className="text-xl font-bold">{edit ? `Editar ${activePassive?.name}` : 'Agregar nuevo activo o Pasivo'}</span>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 flex flex-col">
                        <label>Nombre</label>
                        <input
                            value={payload.name}
                            placeholder={"Nombre del activo o pasivo"}
                            onChange={(e) => setPayload({...payload, name: e.target.value})}
                            type="text" className="border border-gray-300 p-1 rounded"/>
                    </div>
                    <div className="col-span-12 md:col-span-6  flex flex-col">
                        <label>Cantidad</label>
                        <input
                            value={payload.quantity}
                            onChange={(e) => setPayload({...payload, quantity: parseInt(e.target.value)})}
                            type="number" className="border border-gray-300 p-1 rounded"/>
                    </div>
                    <div className="col-span-12 md:col-span-6 flex flex-col">
                        <label>Valor(Ahorita tengo)</label>
                        <input
                            value={payload.value}
                            onChange={(e) => setPayload({...payload, value: parseInt(e.target.value)})}
                            type="number" className="border border-gray-300 p-1 rounded"/>
                    </div>
                    <div className="col-span-12 flex flex-col">
                        <label>Tipo</label>
                        <select
                          value={payload.type}
                          onChange={(e) => setPayload({...payload, type: e.target.value})}
                          className="border border-gray-300 p-1 rounded">
                            <option value={"active"}>Activo</option>
                            <option value={"passive"}>Pasivo</option>
                            <option value={"goal"}>Objectivo/Meta</option>
                        </select>
                    </div>

                    {payload.type === "passive" &&
                        <div className="col-span-12 flex flex-col">
                            <label>Faltante</label>
                            <input
                                value={payload.missing}
                                onChange={(e) => setPayload({...payload, missing: parseInt(e.target.value)})}
                                type="number" className="border border-gray-300 p-1 rounded"/>
                        </div>
                    }
                    {payload.type === "goal" &&
                      <div className="col-span-12 flex flex-col">
                          <label>Meta</label>
                          <input
                            value={payload.goal !== 0 ? payload.goal : ""}
                            onChange={(e) => setPayload({...payload, goal: parseInt(e.target.value)})}
                            type="number" className="border border-gray-300 p-1 rounded"/>
                      </div>
                    }
                    <div className="col-span-12 flex flex-row justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancelar
                        </button>
                        <button
                            disabled={loading}
                            onClick={onSave}
                            className="bg-gray-900 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
                            {loading ? "Guardando..." : "Guardar" }
                        </button>
                    </div>

                </div>

            </div>

        </Modal>
    );
}

export default AddNewActivePassive;