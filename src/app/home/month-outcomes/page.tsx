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
import OutcomesPerDay from "@/app/home/month-outcomes/components/OutcomesPerDay";

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
                        className="my-auto w-8 h-8 cursor-pointer text-blue-700 hover:text-blue-900 transition-colors" />
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-4xl font-extrabold text-blue-800 drop-shadow-sm tracking-wide mb-1 flex items-center gap-2">
                            <svg className="w-7 h-7 text-blue-400 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
                            Gastos del mes de <span className="uppercase ml-2">{monthName(month)} {yearName(year)}</span>
                        </span>
                        <span className="text-base text-blue-500 font-medium">¡Lleva el control de tus finanzas fácilmente!</span>
                    </div>
                    <FaAngleRight
                        onClick={rightArrow}
                        className="my-auto w-8 h-8 cursor-pointer text-blue-700 hover:text-blue-900 transition-colors" />
                </div>
                <div className="flex flex-row justify-end items-center gap-4 mb-2 px-4">
                    <div className="bg-blue-100 text-blue-800 font-bold rounded-lg px-4 py-2 shadow border border-blue-200 flex items-center gap-2">
                        <span>Total del mes:</span>
                        <span className="font-mono text-lg">{calculateTotalOutcomes()}</span>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                    <div className="flex flex-col w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow p-4">
                        <div className="flex flex-row justify-center items-center gap-2 mb-2">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8zm0 0v4m0 0v4" /></svg>
                            <span className="font-bold text-blue-800 text-lg">Categorías</span>
                        </div>
                        <OutComePieChart outcomes={outcomes}/>
                    </div>
                    <div className="flex flex-col w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100  rounded-xl shadow p-4">
                        <div className="flex flex-row justify-center items-center gap-2 mb-2">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h2l1 2h13l1-2h2M5 10V6a2 2 0 012-2h10a2 2 0 012 2v4" /></svg>
                            <span className="font-bold text-green-800 text-lg">Gastos por Día</span>
                        </div>
                        <OutcomesPerDay outcomes={outcomes}/>
                    </div>
                </div>


                <div className="flex flex-row mt-4">
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full rounded-lg shadow-lg bg-white">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                                    <th className="px-4 py-3 text-sm font-semibold border-b border-blue-200 text-center">Día</th>
                                    <th className="px-4 py-3 text-sm font-semibold border-b border-blue-200 text-center">Nombre</th>
                                    <th className="px-4 py-3 text-sm font-semibold border-b border-blue-200 text-center">Monto</th>
                                    <th className="px-4 py-3 text-sm font-semibold border-b border-blue-200 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortOutcomesByDate().map((outcome, idx) => (
                                    <tr key={outcome.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition-colors'}>
                                        <td className="px-4 py-3 text-sm border-b border-blue-100 text-center align-middle">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs text-gray-500">{parseDateOnlyNameOfDay(outcome.date)}</span>
                                                <span className="text-lg font-bold text-blue-700">{parseDateOnlyDay(outcome.date)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-blue-100 text-center align-middle">
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold text-blue-800">{outcome.category}</span>
                                                <span className="truncate max-w-[120px] text-gray-700">{outcome.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-blue-100 text-center align-middle font-mono  rounded">
                                            <span className="text-green-600 font-semibold">$ {outcome.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-blue-100 text-center align-middle">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditOutcome(true)
                                                        setSelectedOutcome(outcome)
                                                    }}
                                                    className="bg-yellow-400 hover:bg-yellow-500 transition-colors px-2 py-1 rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-300 group relative flex items-center"
                                                    title="Editar">
                                                    <MdEdit className="text-white mx-auto w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    <span className="ml-1 hidden md:inline text-xs text-white">Editar</span>
                                                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs bg-black text-white rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">Editar</span>
                                                </button>
                                                <button
                                                    onClick={() => askDeleteOutcome(outcome.id)}
                                                    className="bg-red-600 hover:bg-red-700 transition-colors text-white px-2 py-1 rounded shadow focus:outline-none focus:ring-2 focus:ring-red-300 group relative flex items-center"
                                                    title="Eliminar">
                                                    <MdDelete className="text-white mx-auto w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    <span className="ml-1 hidden md:inline text-xs text-white">Eliminar</span>
                                                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs bg-black text-white rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">Eliminar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MonthOutcomesPage