"use client"
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import {useEffect, useState} from "react";
import OutcomeModal from "@/app/home/month-outcomes/components/modals/OutcomeModal";
import {OutCome} from "@/types/OutCome";
import {auth, db} from "@/firebase";
import {getDocs, collection, query, doc, addDoc} from "firebase/firestore";

const MonthOutcomesPage = () => {

    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const [openOutcomeModal, setOpenOutcomeModal] = useState(false)
    const [outcomes, setOutcomes] = useState<OutCome[]>([])

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
                const date = new Date(outcome.date)
                if (date.getMonth() === month && date.getFullYear() === year) {
                    setOutcomes((prev: any) => [...prev, {id: doc.id, ...outcome}])
                }
            })
        })
    }

    const calculateTotalOutcomes = () => {
        let total = 0
        outcomes.forEach((outcome) => {
            total += Number(outcome.amount)
        })
        console.log(total)
        return total.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})

    }

    useEffect(() => {
        getAllOutcomesFromMonthAndYear()
    }, [month, year]);

    const parseDateOnlyDay = (date: string) => {
        const dateObj = new Date(date)
        return dateObj.getDate()

    }

    return (
        <>
            {openOutcomeModal && <OutcomeModal show={openOutcomeModal} onClose={() => {
                setOpenOutcomeModal(false)
            }} setOutcome={setOutcomes}/>}
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
                                 className="my-auto w-6 h-6 cursor-pointer"/>
                    <div className="underline font-bold ">
                        Gastos del mes de <span className="uppercase">{monthName(month)} {yearName(year)}</span>
                    </div>
                    <FaAngleRight
                        onClick={rightArrow}
                        className="my-auto w-6 h-6 cursor-pointer"/>

                </div>
                <div className="flex flex-row">
                    <div className="bg-white rounded shadow  w-full md:w-60 p-4 mx-4 flex flex-col">
                        <span className="font-bold text-lg">Total de gastos</span>
                        <span className="text-lg">{calculateTotalOutcomes()}</span>
                    </div>
                </div>


                <div className="flex flex-row mt-4">
                    <table className="table-auto w-full">
                        <thead>
                        <tr>
                            <th className="px-4 py-2">Día</th>
                            <th className="px-4 py-2">Categoria</th>
                            <th className="px-4 py-2">Monto</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {outcomes.map((outcome) => (
                            <tr key={outcome.id}>
                                <td className="border px-4 py-2">{parseDateOnlyDay(outcome.date)}</td>
                                <td className="border px-4 py-2">{outcome.category}</td>
                                <td className="border px-4 py-2">${(outcome.amount)}</td>
                                <td className="border px-4 py-2">
                                    <button className="bg-gray-900 text-white px-2 py-1 rounded">
                                        ED
                                    </button>
                                    <button className="bg-red-600 text-white px-2 py-1 rounded">EL</button>
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