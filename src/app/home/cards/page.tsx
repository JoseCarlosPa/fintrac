"use client"
import CreditCard from "@/app/home/cards/components/CreditCard";
import {db, auth} from "@/firebase";
import {collection, query, getDocs, orderBy, doc, getDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import CardExample from "@/app/home/cards/components/CardExample";
import CardModal from "@/app/home/cards/components/modals/CardModal";
import {Card} from "@/types/Card";
import CardPurchases from "@/app/home/cards/components/CardPurchases";

const CreditCards = () => {

  const [cards, setCards] = useState<Array<any>>([])
  const [showPurchases, setShowPurchases] = useState<boolean>(false)

  const getCreditCards = async () => {
    setCards([])
    auth.onAuthStateChanged((user) => {
      if (user === null) return
      const creditCardsArray = query(collection(db, "users", user.uid, "credit_cards"), orderBy('name', 'asc'))
      const creditCardsSnapshot = getDocs(creditCardsArray)
      creditCardsSnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setCards((cards) => [...cards, {id: doc.id, ...doc.data()}])
        });
      });
    })
  }

  useEffect(() => {
    getCreditCards()
  }, []);

  const [open, setOpen] = useState(false)

  return (
    <>
      {open && <CardModal setCards={setCards} open={open} onClose={() => {
        setOpen(false)
      }}/>}

      <div className="flex flex-col">
        <span className="font-bold text-lg">Mis tarjetas</span>
        {cards?.length !== 0 &&
            <div className="flex flex-row justify-end mt-4 mr-4 gap-x-4">
                <button
                    onClick={() => setShowPurchases(!showPurchases)}
                    className="text-gray-500 text-sm md:hidden bg-gray-900 hover:bg-gray-800 px-4 py-2"
                >
                  {showPurchases ? 'Ocultar compras' : 'Ver compras'}
                </button>

                <button
                    onClick={() => setOpen(true)}
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2"
                >
                    + Agregar tarjeta
                </button>
            </div>
        }

        <div className="grid grid-cols-12 mt-12 ">
          {cards?.length > 0 ?
            cards.map((card: Card, index: number) => {
              return (
                <div key={index} className="col-span-12 grid grid-cols-12 gap-x-8">
                  {!showPurchases && (
                    <div className="w-full col-span-12 md:col-span-4">
                      <CreditCard card={card} setCards={setCards}/>
                    </div>
                  )}
                  <div className={`w-full ${showPurchases ? 'block': 'hidden'} col-span-12 md:block md:col-span-8`}>
                    <CardPurchases card={card}/>
                  </div>
                </div>
              );
            })
            :
            <div className="col-span-12 flex flex-row justify-center mt-20">
              <div className="flex flex-col">
                <CardExample/>
                <span className="text-gray-500 text-sm mx-auto mt-4">No tienes tarjetas registradas</span>
                <button
                  onClick={() => setOpen(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2 mt-4"
                >
                  + Agregar tarjeta
                </button>
              </div>

            </div>
          }

        </div>

      </div>
    </>

  )
    ;
}

export default CreditCards