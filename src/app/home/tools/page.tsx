import {TbBeach, TbDiscount2, TbUserDollar, TbWorldDollar} from "react-icons/tb";
import {PiCoinsDuotone } from "react-icons/pi";
import {BsTable} from "react-icons/bs";

const ToolsPage = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <span className="font-bold text-xl">Herramientas</span>
      </div>
      <div className="grid grid-cols-12 mt-12 gap-4">
        <a
            href={"/home/tools/discount-calculator"}
            className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg transition">
          <div className="mx-auto my-auto flex flex-col">
            <TbDiscount2 className="w-8 h-8 text-yellow-400 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">Calculadora de descuentos</span>
          </div>
        </a>
        <a
            href={"/home/tools/compound-interest"}
            className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg transition">
          <div className="mx-auto my-auto flex flex-col">
            <PiCoinsDuotone className="w-8 h-8 text-blue-500 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">Interes compuesto</span>
          </div>
        </a>
        <a
            href={"/home/tools/amortization-table"}
            className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg transition">
          <div className="mx-auto my-auto flex flex-col">
            <BsTable className="w-8 h-8 text-green-500 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">Tabla de amortización</span>
          </div>
        </a>
        <a
            href={"/home/tools/vacations-payment-calculator"}
            className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg transition">
          <div className="mx-auto my-auto flex flex-col">
            <TbBeach className="w-8 h-8 text-yellow-500 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">Calculadora de prima vacacional</span>
          </div>
        </a>
        <a
            href={"/home/tools/end-of-the-year-bonus"}
            className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg transition">
          <div className="mx-auto my-auto flex flex-col">
            <TbWorldDollar   className="w-8 h-8 text-blue-500 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">Calculadora de Aguinaldo</span>
          </div>
        </a>
        <a
            href={"/home/tools/investor-test"}
            className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg transition">
          <div className="mx-auto my-auto flex flex-col">
          <TbUserDollar  className="w-8 h-8 text-orange-500 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">¿Que tipo de inversionista eres?</span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default ToolsPage;