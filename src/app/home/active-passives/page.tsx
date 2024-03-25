import {GiReceiveMoney} from "react-icons/gi";

const ActivePassivesPage = () => {
  return(
    <div className="flex flex-col">
      <div className="flex flex-row">
        <span className="font-bold text-xl">Activos y pasivos</span>
      </div>
        <div className="flex flex-row justify-center mt-60">
            <div className="flex flex-col">
                <GiReceiveMoney className="w-12 h-12 mx-auto"/>
                <span className="font-bold text-xl">Aun no tienes activos ni pasivos</span>
                <button className="bg-gray-900 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4">Agregar activo / Pasivo</button>
            </div>
        </div>
    </div>
  );
}

export default ActivePassivesPage