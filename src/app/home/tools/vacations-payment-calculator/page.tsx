"use client"
import {useRef, useState} from "react";

const VacationPaymentCalculator = () => {

    const ref = useRef<any>(null)


    const [data, setData] = useState({
        salary: 0,
        vacations: 0,
        percentage: 25,

    });

    function calculate() {
        const percepcionGravable = (data.salary / 30) * data.vacations * (data.percentage / 100);
        let primaVacacional = percepcionGravable;
        if(percepcionGravable > 3105) {
            const isr = percepcionGravable * 0.03;
             primaVacacional = percepcionGravable - isr;
        }

        ref.current.querySelector('span:last-child').textContent = `${primaVacacional.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`;

    }



    return(
        <div className="flex flex-col">
            <div className="flex flex-row my-4">
                <span className="font-bold text-xl">Calculadora de Prima Vacacional</span>
            </div>

            <div className="col-span-12 md:col-span-6 flex flex-col">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 w-1/2 md:col-span-4 md:w-full  flex flex-col">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salario</label>
                        <input
                            value={data.salary}
                            onChange={(e) => setData({...data, salary: parseFloat(e.target.value)})}
                            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            type="number" min={0}/>
                    </div>
                    <div className="col-span-12 md:col-span-4 flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Porcentaje
                            %</label>
                        <input
                            value={data.percentage}
                            onChange={(e) => setData({...data, percentage: parseFloat(e.target.value)})}
                            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            type="number" min={25}/>
                    </div>
                    <div className="col-span-12 md:col-span-4 flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dias de
                            vacaciones</label>
                        <input
                            value={data.vacations}
                            onChange={(e) => setData({...data, vacations: parseFloat(e.target.value)})}
                            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            type="number" min={0}/>
                    </div>
                </div>
                <div className="col-span-12  flex flex-col my-6">
                    <button onClick={calculate} className="w-full bg-gray-900 rounded text-white">Calcular
                    </button>
                </div>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col">
                <div ref={ref} className="">
                    <span className="">Resultado:</span>
                    <span className="">$0.00</span>
                </div>
            </div>
        </div>

    );
}

export default VacationPaymentCalculator;