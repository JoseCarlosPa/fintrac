import Modal from "@/app/componentes/Modal";
import {Card} from "@/types/Card";
import {FaCheck, FaCheckDouble} from "react-icons/fa";
import {IoIosWarning} from "react-icons/io";

type RiskModalProps = {
  open: boolean
  onClose: () => void
  card: Card
}
const RiskModal = ({open,onClose,card}:RiskModalProps) => {

  const categories = ['Excelente', 'Bueno', 'Riesgoso', 'Alto riesgo']
  const text =[
    'Utilización de crédito muy baja. Esto demuestra a los prestamistas que puedes manejar tus finanzas de manera responsable',
    'Todavía estás dentro de un rango saludable, pero trata de mantenerlo lo más bajo posible para mejorar tu puntaje crediticio',
    'Estás utilizando una cantidad significativa de tu crédito disponible, lo que puede indicar que dependes demasiado de la deuda',
    'Esto puede indicar a los prestamistas que estás teniendo dificultades financieras y puede afectar negativamente tu puntaje crediticio'
  ]

  const handleRisk = () => {
    const percentage = ((parseFloat(card.usedAmount) * 100) / parseFloat(card.maxAmount))
    if (percentage >= 0 && percentage <= 10) {
      return 0
    } else if (percentage > 10 && percentage <= 30) {
      return 1
    } else if (percentage > 30 && percentage <= 50) {
      return 2
    } else if (percentage > 50) {
      return 3
    }
    return 0
  }

  const handleIcon = (num: number) => {
    switch (num) {
      case 0:
        return <FaCheckDouble className="w-20 h-20 text-green-500" />
      case 1:
        return <FaCheck className="w-20 h-20 text-green-500" />
      case 2:
        return <IoIosWarning className="w-20 h-20 text-yellow-500" />
      case 3:
        return <IoIosWarning className="w-20 h-20 text-red-500" />
    }


  }

  return(
    <Modal show={open} onClose={onClose}>
      <div className="flex flex-col items-center p-6">
        {handleIcon(handleRisk())}
        <span className="font-bold text-2xl mt-6">{categories[handleRisk()]}</span>
        <span className="text-center mt-6">{text[handleRisk()]}</span>
        <div className="flex flex-row justify-center mt-12">
          <button
            onClick={onClose}
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2"
          >
          Cerrar</button>
        </div>

      </div>

    </Modal>
  );
}

export default RiskModal