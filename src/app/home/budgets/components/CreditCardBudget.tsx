"use client"
import {Card} from "@/types/Card";
import {auth, db} from "@/firebase";
import {collection, getDocs} from "firebase/firestore";
import {useEffect, useState} from "react";

type CreditCardBudgetType = {
    card: Card
    onTotalChange: (total: number) => void; // Nueva prop

}
const CreditCardBudget = ({card,onTotalChange }:CreditCardBudgetType) => {

    const [purchases, setPurchases] = useState<any[]>([])

    const getPurchases = async () => {
        setPurchases([])
        auth.onAuthStateChanged((user) => {
            if (user === null) return
            const purchasesArray = collection(db, "users", user.uid, "credit_cards", card.id, "msi")
            const purchasesSnapshot = getDocs(purchasesArray)
            purchasesSnapshot.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setPurchases((purchases) => [...purchases, {id: doc.id, ...doc.data()}])
                });
            });
        })
    }

    const monthAndYear = () =>{
        const date = new Date()
        const month = date.toLocaleString('default', { month: 'short' })
        const year = date.getFullYear()
        return `${month}/${year}`
    }

    const total = () => {

        const total = purchases.reduce((acc, purchase) => {
            return acc + (purchase.per_pay)
        }, 0)

        return total

    }

    useEffect(() => {
        // Llama a la función onTotalChange con el total calculado
        onTotalChange(total());
    }, [purchases]); // Llama a la función cuando las compras cambien

    useEffect(() => {
        getPurchases()
    }, []);

    return (
        <tr >
            <td className=" px-2 py-2 text-sm border border-gray-400 text-blue-700">{card.name}</td>
            <td className=" px-2 py-2 text-sm border border-gray-400">
                {total().toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                })}
            </td>
            <td className=" px-2 py-2 text-sm border border-gray-400">
                {`${card.cut_date}/${monthAndYear()}`}
            </td>
            <td className=" px-2 py-2 text-sm border border-gray-400 text-center">
                <input
                    className={`form-checkbox h-5 w-5 text-gray-600`}
                    type="checkbox"/>
            </td>
        </tr>
    )

}

export default CreditCardBudget