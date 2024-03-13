"use client";

import {useRef, useState} from "react";

const DiscountCalculatorPage = () => {

  const ref = useRef<HTMLDivElement>(null);
  const refDiscount = useRef<HTMLDivElement>(null);

  const [data, setData] = useState({
    amount: 0,
    rate: 0,
  });

  const handleCalculate = () => {
    ref.current!.querySelector('span:last-child')!.textContent = `${(data.amount - (data.amount * (data.rate/100))).toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`;
    refDiscount.current!.querySelector('span:last-child')!.textContent = `${(data.amount * (data.rate/100)).toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`;
  }

  return(
    <div className="flex flex-col">
      <div className="flex flex-row my-4">
        <span className="font-bold text-xl">Calculadora de descuentos</span>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 w-1/2 md:col-span-4 md:w-full  flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto</label>
          <input
            value={data.amount}
            onChange={(e) => setData({...data, amount: parseFloat(e.target.value)})}
            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="number" min={0}/>
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descuento %</label>
          <input
            value={data.rate}
            onChange={(e) => setData({...data, rate: parseFloat(e.target.value)})}
            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="number" min={0}/>
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
        <div ref={refDiscount} className="">
          <span className="">Descuento:</span>
          <span className="">$0.00</span>
        </div>
      </div>
    </div>

  );
}

export default DiscountCalculatorPage;
