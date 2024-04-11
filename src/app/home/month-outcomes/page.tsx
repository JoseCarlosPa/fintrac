"use client"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import OutcomeModal from "@/app/home/month-outcomes/components/modals/OutcomeModal";
import { OutCome } from "@/types/OutCome";
import { auth, db } from "@/firebase";
import { getDocs, collection, query, doc, addDoc, deleteDoc } from "firebase/firestore";
import { MdDelete, MdEdit } from "react-icons/md";
import OutComePieChart from "./components/OutcomePieChart";
import Swal from "sweetalert2";
import { toast } from "sonner";

const MonthOutcomesPage = () => {

    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const [openOutcomeModal, setOpenOutcomeModal] = useState(false)
    const [outcomes, setOutcomes] = useState<OutCome[]>([])
    const [editOutcome, setEditOutcome] = useState<boolean>(false)
    const [selectedOutcome, setSelectedOutcome] = useState<OutCome | null>(null)

    const monthName = (month: number) => {
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        return months[month]
    }

    const yearName = (year: number) => {
        return year
    }

    const leftArrow = () => {
        // change month to previous month if the month is january change year to previous year
        if (month === 0) {
            setMonth(11)
            setYear(year - 1)
        } else {
            setMonth(month - 1)
        }
    }

    const rightArrow = () => {
        // change month to next month if the month is december change year to next year
        if (month === 11) {
            setMonth(0)
            setYear(year + 1)
        } else {
            setMonth(month + 1)
        }
    }

    const getAllOutcomesFromMonthAndYear = () => {
        setOutcomes([])
        auth.onAuthStateChanged(async (user) => {
            if (user === null) return
            const outcomesRef = collection(db, 'users', user.uid, 'outcomes')
            const outcomesSnapshot = await getDocs(outcomesRef)
            outcomesSnapshot.forEach((doc) => {
                const outcome = doc.data()
                // Check if the day is 1rst of the month
            
                const date = new Date(outcome.date)
                if (date.getMonth() === month && date.getFullYear() === year) {
                    setOutcomes((prev: any) => [...prev, { id: doc.id, ...outcome }])
                }
            })
        })
    }

    const calculateTotalOutcomes = () => {
        let total = 0
        outcomes.forEach((outcome) => {
            total += Number(outcome.amount)
        })
        return total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

    }

    useEffect(() => {
        getAllOutcomesFromMonthAndYear()
    }, [month, year]);

    const parseDateOnlyDay = (date: string) => {
        const dateObj = new Date(date)
        return dateObj.getDate() + 1
    }
    const parseDateOnlyNameOfDay = (date: string) => {
        const dateObj = new Date(date)
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        return days[dateObj.getDay() + 1]
    }

    const sortOutcomesByDate = () => {
        return outcomes.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA.getDate() - dateB.getDate()
        })
    }

    const deleteOutcome = async (id: string) => {
        auth.onAuthStateChanged(async (user) => {
            if (user === null) return
            deleteDoc(doc(db, 'users', user.uid, 'outcomes', id)).then(() => {
                setOutcomes(outcomes.filter((outcome) => outcome.id !== id))
                toast.success('Gasto eliminado correctamente')
            });
        })
    }


    const askDeleteOutcome = (id: string) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, bórralo!'
        }).then((result:any) => {
            if (result.isConfirmed) {
                deleteOutcome(id)
            }
        })
    }

    return (
        <>
            {openOutcomeModal && <OutcomeModal show={openOutcomeModal} onClose={() => {
                setOpenOutcomeModal(false)
            }} setOutcome={setOutcomes} />}
            {editOutcome && <OutcomeModal show={editOutcome} onClose={() => {
                setEditOutcome(false)}} edit={true} outcome={selectedOutcome} setOutcome={setOutcomes} />}
            <div className="flex flex-col">
                <div className="flex flex-row mx-4 justify-end">
                    <button
                        onClick={() => {
                            setOpenOutcomeModal(true)
                        }}
                        className="bg-gray-900 rounded shadow px-3 py-2 text-white">+ Agregar gasto
                    </button>
                </div>
                <div className="flex flex-row justify-center my-8 gap-x-2 text-lg md:text-2xl">
                    <FaAngleLeft onClick={leftArrow}
                        className="my-auto w-6 h-6 cursor-pointer" />
                    <div className="underline font-bold ">
                        Gastos del mes de <span className="uppercase">{monthName(month)} {yearName(year)}</span>
                    </div>
                    <FaAngleRight
                        onClick={rightArrow}
                        className="my-auto w-6 h-6 cursor-pointer" />

                </div>
                <div className="flex flex-row">
                    <div className="bg-white rounded shadow  w-full md:w-60 p-4 mx-4 flex flex-col">
                        <span className="font-bold text-lg">Total de gastos</span>
                        <span className="text-lg">{calculateTotalOutcomes()}</span>
                    </div>
                </div>

                <div className="flex flex-col mt-4 gap-4">
                    <div className="flex flex-row justify-center font-bold" >Categorias</div>
                    <OutComePieChart outcomes={outcomes} />
                </div>


                <div className="flex flex-row mt-4">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-2 py-2 text-sm border border-gray-400">Día</th>
                                <th className="px-2 py-2 text-sm border border-gray-400">Nombre</th>
                                <th className="px-2 py-2 text-sm border border-gray-400">Monto</th>
                                <th className="px-2 py-2 text-sm border border-gray-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortOutcomesByDate().map((outcome) => (
                                <tr key={outcome.id}>
                                    <td className="px-2 py-2 text-sm border border-gray-400 text-center ">
                                        <div className="flex flex-col">
                                            <span>{parseDateOnlyNameOfDay(outcome.date)}</span>
                                            <span>{parseDateOnlyDay(outcome.date)}</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-sm border border-gray-400 text-center">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{outcome.category}</span>
                                            <span className="truncate">{outcome.name}</span>
                                        </div>

                                    </td>
                                    <td className="px-2 py-2 text-sm border border-gray-400 text-center">${(outcome.amount)}</td>
                                    <td className="px-2 py-2 text-sm border border-gray-400 text-center">
                                        <button 
                                            onClick={() => {
                                                setEditOutcome(true)
                                                setSelectedOutcome(outcome)
                                            }}
                                        className="bg-yellow-400 px-2 py-1 rounded mr-1">
                                            <MdEdit className="text-white mx-auto w-5 h-5 " />
                                        </button>
                                        <button
                                            onClick={() => askDeleteOutcome(outcome.id)}
                                         className="bg-red-600 text-white px-2 py-1 rounded ml-1">
                                            <MdDelete className="text-white mx-auto w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default MonthOutcomesPage