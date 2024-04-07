"use client"
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import {useState} from "react";
import OutcomeModal from "@/app/home/month-outcomes/components/modals/OutcomeModal";

const MonthOutcomesPage = () => {

    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const [openOutcomeModal, setOpenOutcomeModal] = useState(false)

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


    return (
        <>
            {openOutcomeModal && <OutcomeModal show={openOutcomeModal} onClose={()=>{setOpenOutcomeModal(false)}} />}
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


                <div className="flex flex-row mt-2">
                    <table className="table-auto w-full">
                        <thead>
                        <tr>
                            <th className="px-4 py-2">Fecha</th>
                            <th className="px-4 py-2">Categoria</th>
                            <th className="px-4 py-2">Monto</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </>
    );
}

export default MonthOutcomesPage