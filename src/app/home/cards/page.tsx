"use client"
import CreditCard from "@/app/home/cards/components/CreditCard";
import {db,auth} from "@/firebase";
import {collection, query, getDocs, orderBy,doc,getDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import CardExample from "@/app/home/cards/components/CardExample";

const CreditCards = () => {

  const [cards, setCards] = useState<Array<any>>([])


  const getCreditCards = async () => {
    setCards([])
    auth.onAuthStateChanged((user) => {
      if (user === null) return
      const creditCardsArray = query(collection(db, "users", user.uid, "credit_cards"), orderBy('name', 'asc'))
      const creditCardsSnapshot = getDocs(creditCardsArray)
      creditCardsSnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

          setCards([...cards, doc.data()])
        });
      });
    })
  }

  useEffect(() => {
    getCreditCards()
  }, []);

  return(
    <div className="flex flex-col">
      <span className="font-bold text-lg">Mis tarjetas</span>
      <div className="grid grid-cols-12 mt-12">
        {cards?.length > 0 ?
          <div className="col-span-12  md:col-span-4">
            {cards.map((card: any, index: number) => {
              return <CreditCard key={index} number={card.number} expiryDate={card.expiryDate} isVisa={card.isVisa}
                                 name={card.name}/>
            })}
          </div>
          :
          <div className="col-span-12 flex flex-row justify-center mt-20">
            <div className="flex flex-col">
              <CardExample/>
              <span className="text-gray-500 text-sm mx-auto mt-4">No tienes tarjetas registradas</span>
              <button
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2 mt-4"
              >
                + Agregar tarjeta
              </button>
            </div>

          </div>
        }

      </div>

    </div>
  );
}

export default CreditCards