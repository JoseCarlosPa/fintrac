import {RiVisaFill} from "react-icons/ri";
import {FaTrashAlt} from "react-icons/fa";
import {MdEdit} from "react-icons/md";
import swal from "sweetalert2";
import {deleteDoc} from "@firebase/firestore";
import {db, auth} from "@/firebase";
import {doc} from "firebase/firestore";
import {toast} from "sonner";
import {Dispatch, SetStateAction, useState} from "react";
import CardModal from "@/app/home/cards/components/modals/CardModal";

type CreditCardProps = {
    card: any
    setCards: Dispatch<SetStateAction<any[]>>
}
const CreditCard = ({card, setCards}: CreditCardProps) => {

    const [open, setOpen] = useState(false)

    const deleteCard = () => {
        swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, bórralo!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                auth.onAuthStateChanged(async (user) => {
                    if (user === null) return
                    await deleteDoc(doc(db, "users", user.uid, "credit_cards", card.id))
                    toast.success("Tarjeta eliminada correctamente")
                    setCards((cards) => {
                        return cards.filter((c) => c.id !== card.id)
                    })
                })
            }
        })
    }

    return (
        <>
            {open && <CardModal edit setCards={setCards} open={open} onClose={() => {
                setOpen(false)
            }} card={card}/>}
            <div
                className={`flex flex-col justify-around ${card?.color ? `bg-${card?.color}-500` : 'bg-gray-800'}  px-4 py-2 md:p-4 border border-white border-opacity-30 rounded-lg shadow-md mx-auto mb-6`}
            >
                <div className="flex flex-row items-center justify-between mb-3">
                    <input
                        className="w-full h-10 border-none outline-none text-sm bg-transparent text-white font-semibold caret-orange-500 pl-2 mb-3 flex-grow"
                        type="text"
                        value={card?.name}
                        id="cardName"
                        disabled
                        placeholder="Full Name"
                    />
                    <div
                        className="flex items-center justify-center w-14 h-9 bg-transparent border border-white border-opacity-20 rounded-md"
                    >
                        {card?.isVisa ?
                            <RiVisaFill className="text-gray-300 w-6 h-6"/>
                            :
                            <svg
                                className="text-white fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    fill="#ff9800"
                                    d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
                                ></path>
                                <path
                                    fill="#d50000"
                                    d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
                                ></path>
                                <path
                                    fill="#ff3d00"
                                    d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
                                ></path>
                            </svg>
                        }

                    </div>
                </div>
                <div className="flex flex-col space-y-3">
            <span
                className="w-full h-8 border-none outline-none text-sm bg-transparent text-white font-semibold caret-orange-500 pl-2">
              XXXX XXXX XXXX {card?.number}
            </span>
            <span
                className="w-full border-none outline-none  bg-transparent text-white font-semibold caret-orange-500 pl-2 text-xs">
                   {(parseFloat(card?.usedAmount)).toLocaleString('es-MX', {
                           style: 'currency',
                           currency: 'MXN'
                       })}/ {(parseFloat(card?.maxAmount)).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    })}
                <span className="ml-2">({(card?.maxAmount - card?.usedAmount).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN'

                    })})
                </span>
                        <div className="mt-1 h-2 rounded-r w-full bg-neutral-200 dark:bg-neutral-600">
                        <div className="h-2 rounded-r bg-blue-800"
                             style={{'width': `${((card.usedAmount * 100) / card.maxAmount).toFixed(2)}%`}}></div>
                    </div>
            <span
                className="flex flex-row justify-center mt-2">{((card.usedAmount * 100) / card.maxAmount).toFixed(2)}%</span>
            </span>
                    <div className="flex flex-row justify-end ">
                        <div className="flex flex-row gap-x-4 my-auto">
                            <MdEdit
                                onClick={() => {
                                    setOpen(true)
                                }}
                                className="w-6 h-6 md:w-5 md:h-5 text-yellow-400 cursor-pointer"/>
                            <FaTrashAlt
                                onClick={deleteCard}
                                className="w-6 h-6 md:w-5 md:h-5 text-red-600 cursor-pointer"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreditCard