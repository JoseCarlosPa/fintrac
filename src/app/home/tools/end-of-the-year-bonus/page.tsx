"use client";
import {useRef, useState} from "react";

const EndOfYearBonusPage = () => {

    const ref = useRef<any>(null)

    const [data, setData] = useState({
        salary: 0,
        days: 0,
        daysToPay: 15,
    });

    const calculate = () => {
        const aguinaldo = (data.salary / 30) * data.days * (data.daysToPay / 365);
        ref.current.querySelector('span:last-child').textContent = `${aguinaldo.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`;
    }

    return(
        <div className="flex flex-col">
            <div className="flex flex-row my-4">
                <span className="font-bold text-xl">Calculadora de Aguinaldo</span>
            </div>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 w-1/2 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salario</label>
                    <input
                        value={data.salary}
                        onChange={(e) => setData({...data, salary: parseFloat(e.target.value)})}
                        className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        type="number" />
                </div>
                <div className="col-span-12 md:col-span-4 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dias trabajados</label>
                    <input
                        value={data.days}
                        onChange={(e) => setData({...data, days: parseFloat(e.target.value)})}
                        className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        type="number" />
                </div>
                <div className="col-span-12 md:col-span-4 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dias a pagar</label>
                    <input
                        value={data.daysToPay}
                        onChange={(e) => setData({...data, daysToPay: parseFloat(e.target.value)})}
                        className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        type="number" />
                </div>
            </div>
            <div className="col-span-12  flex flex-col my-6">
                <button
                    onClick={calculate}
                    className="w-full bg-gray-900 rounded text-white">Calcular</button>
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

export default EndOfYearBonusPage;