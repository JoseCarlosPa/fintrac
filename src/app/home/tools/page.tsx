import {TbDiscount2} from "react-icons/tb";
import {PiCoinsDuotone, PiCoinVerticalDuotone, PiHandCoinsBold} from "react-icons/pi";
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
          className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg">
          <div className="mx-auto my-auto flex flex-col">
            <TbDiscount2 className="w-8 h-8 text-yellow-400 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">Calculadora de descuentos</span>
          </div>
        </a>
        <a
          className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg">
          <div className="mx-auto my-auto flex flex-col">
            <PiCoinsDuotone className="w-8 h-8 text-blue-500 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">Inversion compuesta</span>
          </div>
        </a>
        <a
          className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg">
          <div className="mx-auto my-auto flex flex-col">
            <PiCoinVerticalDuotone className="w-8 h-8 text-blue-500 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">Inversion Simple</span>
          </div>
        </a>
        <a
          className="col-span-12 md:col-span-4 bg-gray-100 shadow rounded-md px-8 py-12 hover:bg-white hover:shadow-lg">
          <div className="mx-auto my-auto flex flex-col">
            <BsTable  className="w-8 h-8 text-green-500 mx-auto my-auto"/>
            <span className="text-center font-bold text-lg">Tabla de amortización</span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default ToolsPage;