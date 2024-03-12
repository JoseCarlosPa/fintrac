"use client"
import Modal from "@/app/componentes/Modal";
import {Card} from "@/types/Card";
import {Budget} from "@/types/Budget";
import {Dispatch, SetStateAction, useState} from "react";
import {db, auth} from "@/firebase";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {toast} from "sonner";
import {LuLoader2} from "react-icons/lu";
import {Purchase} from "@/types/Purchase";

type BudgetModalProps = {
    open: boolean
    onClose: () => void
    creditCards: Card[]
    edit?: boolean
    budget?: Budget
    setBudgets:  Dispatch<SetStateAction<any[]>>
}
const BudgetModal = ({open, onClose,creditCards,edit,budget,setBudgets}: BudgetModalProps) => {

    const [loading, setLoading] = useState(false)

    const [payload, setPayload] = useState({
        name: edit ? budget?.name : '',
        amount: edit ? budget?.amount : undefined,
        category: edit ? budget?.category : '',
        pay_date: edit ? budget?.pay_date : '',
        credit_card: edit ? budget?.credit_card : '',
        paid: false
    })

    const AddBudget = async () => {
        if(payload?.name === "" || payload?.amount === undefined || payload?.category === "" || payload?.pay_date === "" || payload?.credit_card === ""){
            toast.error("Todos los campos son requeridos")
            return
        }
        auth.onAuthStateChanged(async (user) => {
            if (user === null) return
            const budgetsRef = collection(db,'users',user.uid,'budgets')
            setLoading(true)
            await addDoc(budgetsRef,payload).then((doc:any)=>{
                setBudgets((budgets:Budget[]) => [...budgets,{
                    id: doc.id,
                    ...payload
                }])
                toast.success("Presupuesto agregado correctamente")
            })
            setLoading(false)
            onClose()
        })

    }

    const EditBudget = async () => {

    }


    return (
        <Modal show={open} onClose={onClose}>
            <div className="flex flex-col md:px-6 p-4 md:py-4">
                <div className="flex flex-row">
                    <span className="font-bold text-xl">
                        {edit ? `Editar presupuesto ${budget?.name}` : 'Agregar presupuesto'}
                    </span>
                </div>
                <div className="grid grid-cols-12 mt-12 gap-4 ">
                    <div className="col-span-12 md:col-span-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Nombre
                        </label>
                        <input
                            value={payload.name}
                            onChange={(e) => setPayload({...payload, name: e.target.value})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Nombre"
                        />
                    </div>
                    <div className="col-span-12 md:col-span-6 ">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                            Monto
                        </label>
                        <input
                            value={payload.amount}
                            onChange={(e) => setPayload({...payload, amount: parseFloat(e.target.value)})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="amount"
                            type="number"
                            placeholder="Monto"
                        />
                    </div>
                    <div className="col-span-12 md:col-span-4 ">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                            Categoria
                        </label>
                        <select
                            value={payload.category}
                            onChange={(e) => setPayload({...payload, category: e.target.value})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="category"
                        >
                            <option value="">Selecciona una categoria</option>
                            <option value="Servicios">Servicios</option>
                            <option value="Comida">Comida</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Entretenimiento/Streaming">Entretenimiento/Streaming</option>
                            <option value="Prestamo">Prestamo</option>
                            <option value="Salud">Salud</option>
                            <option value="Educación">Educación</option>
                            <option value="Renta">Renta</option>
                            <option value="Inversion">Inversion</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                    <div className="col-span-12 md:col-span-8">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pay_date">
                            Dia de cada mes
                        </label>
                        <input
                            value={payload.pay_date}
                            onChange={(e) => setPayload({...payload, pay_date: e.target.value})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="pay_date"
                            type="number"
                            min={1}
                            max={31}
                            placeholder="Fecha de pago"
                        />
                    </div>
                    <div className="col-span-12 mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credit_card">
                            Tarjeta de crédito
                        </label>
                        <select
                            value={payload.credit_card}
                            onChange={(e) => setPayload({...payload, credit_card: e.target.value})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="credit_card"
                        >
                            <option value="">Selecciona una tarjeta</option>
                            {creditCards.map((card) => (
                                <option key={card.id} value={card.id}>{card.name}</option>
                            ))}
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="col-span-12 mt-4 flex flex-row justify-center gap-x-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-800 hover:bg-gray-800 text-white rounded-md px-4 py-2"
                        >
                            Cerrar
                        </button>
                        <button
                            disabled={loading}
                            onClick={edit ? EditBudget : AddBudget}
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2"
                        >
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

export default BudgetModal