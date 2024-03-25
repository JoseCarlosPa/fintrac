import Modal from "@/app/componentes/Modal";
import {Budget} from "@/types/Budget";
import {auth, db} from "@/firebase";
import {doc, updateDoc} from "firebase/firestore";
import {Dispatch, SetStateAction, useState} from "react";
import {toast} from "sonner";

type EditBudgetModalProps = {
    budget: Budget;
    show: boolean;
    onClose: () => void;
    setBudgets: Dispatch<SetStateAction<Budget[]>>;

}
const EditBudgetModal = ({ budget, onClose,show,setBudgets }: EditBudgetModalProps) => {

    const [payload, setPayload] = useState({
        name: budget.name,
        amount: budget.amount,
        pay_date: budget.pay_date
    })


    const handleSave = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user === null) return
            const budgetRef = doc(db, 'users', user.uid, 'budgets', budget.id)
            await updateDoc(budgetRef, payload)
            setBudgets((prevBudgets: Budget[]) => {
                return prevBudgets.map((prevBudget) => {
                    if (prevBudget.id === budget.id) {
                        return {...prevBudget, ...payload}
                    }
                    return prevBudget
                })
            })
            toast.success('Presupuesto actualizado')
            onClose()
        })
    }

    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex flex-col p-4 gap-2">
                <h1>Editar - {budget?.name}</h1>
                <div className="flex flex-col">
                    <label htmlFor="name">Nombre</label>
                    <input type="text" value={payload?.name}
                            onChange={(e) => setPayload({...payload, name: e.target.value})}
                           className="border border-gray-400 rounded-md p-2"/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="amount">Monto</label>
                    <input type="number"
                            onChange={(e) => setPayload({...payload, amount: parseInt(e.target.value)})}
                           value={payload?.amount} className="border border-gray-400 rounded-md p-2"/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="pay_date">Fecha de pago en cada mes</label>
                    <input type="number"
                            onChange={(e) => setPayload({...payload, pay_date: e.target.value})}
                           value={payload?.pay_date} className="border border-gray-400 rounded-md p-2"/>
                </div>
                <div className="flex flex-row justify-center gap-x-4 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white rounded-md px-4 py-2">Cancelar</button>
                    <button
                        onClick={handleSave}
                        className="bg-gray-800 hover:bg-gray-900 text-white rounded-md px-4 py-2">Guardar</button>
                </div>
            </div>

        </Modal>
    );
}

export default EditBudgetModal