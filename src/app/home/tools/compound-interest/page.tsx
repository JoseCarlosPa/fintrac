"use client";
import {useRef, useState} from "react";
import {toast} from "sonner";

const CompoundInterestPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const refInterest = useRef<HTMLDivElement>(null);

  const [data, setData] = useState({
    amount: 0,
    rate: 0,
    time: 0,
    timeUnit: 'años',
  });


  const calcularInteresCompuesto = (amount: number, rate: number, time: number, timeUnit: string): number =>  {
    switch (timeUnit) {
      case 'dias':
        time /= 365;
        break;
      case 'meses':
        time /= 12;
        break;
      case 'años':
        break;
      default:
        throw new Error('Unidad de tiempo no válida. Debe ser "dias", "meses" o "años"');
    }
    return amount * Math.pow((1 + (rate/100)), time);
  }

  const handleCalculate = () => {
    if(data.amount <= 0 || data.rate <= 0 || data.time <= 0) {
      toast.error('Los valores deben ser mayores a 0');
      return;
    }
    const result = calcularInteresCompuesto(data.amount, data.rate, data.time, data.timeUnit);
    ref.current!.querySelector('span:last-child')!.textContent = `${result.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`;
    const interests = result - data.amount;
    refInterest.current!.querySelector('span:last-child')!.textContent = `${interests.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`;
  }

  return(
    <div className="flex flex-col">
      <div className="flex flex-row my-4">
        <span className="font-bold text-xl">Calculadora de Interes compuesto</span>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 w-1/2 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto</label>
          <input
            value={data.amount}
            onChange={(e) => setData({...data, amount: parseFloat(e.target.value)})}
            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="number" />
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasa %</label>
          <input
            value={data.rate}
            onChange={(e) => setData({...data, rate: parseFloat(e.target.value)})}
            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="number" />
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de tiempo</label>
          <select
            value={data.timeUnit}
            onChange={(e) => setData({...data, timeUnit: e.target.value})}
            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">

            <option value="dias">Días</option>
            <option value="meses">Meses</option>
            <option value="años">Años</option>
          </select>
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tiempo</label>
          <input
            value={data.time}
            onChange={(e) => setData({...data, time: parseInt(e.target.value)})}
            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="number" />
        </div>
      </div>
      <div className="col-span-12  flex flex-col my-6">
        <button onClick={handleCalculate} className="w-full bg-gray-900 rounded text-white">Calcular</button>
      </div>
      <div className="col-span-12 md:col-span-6 flex flex-col">
        <div ref={ref} className="">
          <span className="">Resultado:</span>
          <span className="">$0.00</span>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 flex flex-col">
        <div ref={refInterest} className="">
          <span className="">Intereses generados:</span>
          <span className="">$0.00</span>
        </div>
      </div>
    </div>

  );
}

export default CompoundInterestPage;
