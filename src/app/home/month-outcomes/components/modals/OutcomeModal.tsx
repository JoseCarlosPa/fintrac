import Modal from "@/app/componentes/Modal";
import {auth, db} from "@/firebase";
import {getDocs, collection, query, doc} from "firebase/firestore";
import {useEffect, useState} from "react";


type OutcomeModalProps = {
    show: boolean;
    onClose: () => void;
    edit?: boolean;
    setOutcome?: any;
    outcome?: any;

}

const OutcomeModal = ({show,onClose,edit,setOutcome,outcome}:OutcomeModalProps) => {

    const [creditCards, setCreditCards] = useState<any>([])

    const getCreditCards = () => {
        setCreditCards([])
        auth.onAuthStateChanged(async (user) => {
            if (user === null) return
            const creditCardsRef = collection(db,'users',user.uid,'credit_cards')
            const creditCardsSnapshot = await getDocs(creditCardsRef)
            creditCardsSnapshot.forEach((doc) => {
                // add the id to the object
                setCreditCards((prevState:any) => [...prevState, {...doc.data(), id: doc.id}])
            })

        })
    }

    useEffect(() => {
        getCreditCards()
    }, []);

    return(
        <Modal show={show} onClose={onClose}>
            <div className="flex flex-col p-4">
                <span className="font-bold text-lg">{edit ? `Editar ${outcome?.name}` : 'Agregar nuevo gasto'}</span>
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col w-1/2 p-4">
                    <label htmlFor="name">Nombre</label>
                    <input type="text" id="name" className="border p-2 rounded"
                           placeholder={edit ? outcome?.name : 'Nombre del gasto'}
                           defaultValue={edit ? outcome?.name : ''}/>
                </div>
                <div className="flex flex-col w-1/2 p-4">
                    <label htmlFor="category">Categoria</label>
                    <input type="text" id="category" className="border p-2 rounded"
                           placeholder={edit ? outcome?.category : 'Categoria'}
                           defaultValue={edit ? outcome?.category : ''}/>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col w-1/2 p-4">
                    <label htmlFor="amount">Monto</label>
                    <input type="number" id="amount"

                            placeholder={edit ? outcome?.amount : 'Monto'}
                           className="border p-2 rounded"
                           defaultValue={edit ? outcome?.amount : ''}/>
                </div>
                <div className="flex flex-col w-1/2 p-4">
                    <label htmlFor="amount">Tarjeta(?)</label>
                    <select className="border p-2 rounded">
                        <option value="">Seleccionar tarjeta</option>
                        {creditCards.map((card:any) => (
                            <option key={card.name} value={card.id}>{card.name}</option>
                        ))}
                        <option value="cash">Efectivo/Debito</option>
                    </select>
                </div>

            </div>
            <div className="flex flex-row">
                <div className="flex flex-col w-1/2 p-4">
                    <label htmlFor="date">Fecha</label>
                    <input type="date" id="date" className="border p-2 rounded"
                           defaultValue={edit ? outcome?.date : ''}/>
                </div>
            </div>
            <div className="flex flex-row justify-center p-4 gap-x-4">
                <button className="bg-gray-600 text-white px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
                <button className="bg-gray-900 text-white px-4 py-2 rounded">Guardar</button>
            </div>
        </Modal>
    );
}

export default OutcomeModal