"use client"
import {MdDelete, MdEdit} from "react-icons/md";
import {Budget} from "@/types/Budget";
import swal from "sweetalert2";
import {toast} from "sonner";
import {Dispatch, SetStateAction, useState} from "react";
import EditBudgetModal from "@/app/home/budgets/components/modals/EditBudgetModal";
import ActionsModal from "@/app/home/budgets/components/modals/ActionsModal";

type BudgetTableProps = {
    budget: Budget
    index: number
    handleIsPaid: (budget: any) => void
    deleteBudget: (budget: any) => void
    setBudgets:  Dispatch<SetStateAction<Budget[]>>
}
const BudgetTable = ({budget,index,handleIsPaid,deleteBudget,setBudgets}:BudgetTableProps) => {

    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    const [openActionsModal, setOpenActionsModal] = useState<boolean>(false)

    const monthAndYear = () => {
        const date = new Date()
        const month = date.toLocaleString('default', {month: 'short'})
        const year = date.getFullYear()
        return `${month}/${year}`
    }

    const askDelete = (budget: Budget) => {
        swal.fire({
            title: '¿Estás seguro?',
            text: `Eliminarás el presupuesto de ${budget.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBudget(budget)
                toast.success('Presupuesto eliminado')
            }
        })

    }

    return (
        <>
            {openEditModal && <EditBudgetModal setBudgets={setBudgets} budget={budget} show={openEditModal} onClose={()=>{setOpenEditModal(false)}}/>}
            {openActionsModal && <ActionsModal setOpenEditModal={setOpenEditModal} show={openActionsModal} onClose={()=>{setOpenActionsModal(false)}} budget={budget} deleteBudget={deleteBudget}/>}

            <tr
                key={budget.id}
                className={`group transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 hover:shadow-md`}
            >
                <td
                    onClick={() => setOpenActionsModal(true)}
                    className="px-3 py-2 text-sm border-b border-gray-200 text-blue-800 font-medium cursor-pointer group-hover:underline group-hover:text-blue-900 transition"
                >{budget?.name}</td>
                <td className="px-3 py-2 text-sm border-b border-gray-200 text-gray-700 font-semibold">{(budget?.amount)?.toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                })}</td>
                <td className="px-3 py-2 text-sm border-b border-gray-200 text-gray-600">{`${budget.pay_date}/${monthAndYear()}`}</td>
                <td className="px-3 py-2 text-sm border-b border-gray-200 text-center">
                    <input
                        onChange={() => {
                            handleIsPaid(budget)
                        }}
                        className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 transition"
                        checked={budget?.paid} type="checkbox"/>
                </td>
                <td className="px-3 py-2 text-sm border-b border-gray-200 text-center hidden md:table-cell">
                    <div className="flex flex-row gap-x-2 justify-center">
                        <button
                            onClick={() => setOpenEditModal(true)}
                            className="bg-yellow-400 hover:bg-yellow-500 rounded p-1 transition shadow-sm border border-yellow-300"
                        >
                            <MdEdit className="w-4 h-4 text-white mx-auto"/>
                        </button>
                        <button
                            onClick={() => askDelete(budget)}
                            className="bg-red-500 rounded p-1 hover:bg-red-600">
                            <MdDelete className="w-4 h-4 text-white mx-auto"/>
                        </button>
                    </div>
                </td>
            </tr>
        </>

    )
}
export default BudgetTable