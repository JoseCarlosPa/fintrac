"use client"

import Modal from "@/app/componentes/Modal";
import {Budget} from "@/types/Budget";
import {useState} from "react";
import {toast} from "sonner";
import swal from "sweetalert2";

type ActionsModalProps = {
    show: boolean;
    onClose: () => void;
    budget: Budget
    deleteBudget: any
    setOpenEditModal: any
}
const ActionsModal = ({ show, onClose,budget ,deleteBudget,setOpenEditModal}:ActionsModalProps) => {

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

    return(
        <Modal show={show} onClose={onClose} >
            <div className="flex flex-col p-4 gap-4">
                <h1 className="text-center">Acciones</h1>
                <div className="flex flex-row justify-center gap-x-2">
                    <button
                        onClick={() =>{
                            setOpenEditModal(true)
                        onClose()
                        }}
                        className="bg-yellow-500  text-white rounded-md px-4 py-2">Editar</button>
                    <button
                        onClick={() => {
                            askDelete(budget)
                            onClose()
                        }}
                        className="bg-red-500  text-white rounded-md px-4 py-2">Eliminar</button>
                </div>
            </div>

        </Modal>
    );
}

export default ActionsModal