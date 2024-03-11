"use client"
import {useState} from "react";
import {db, auth} from "@/firebase";
import {collection, query, getDocs, orderBy } from "firebase/firestore";
import {Budget} from "@/types/Budget";

const BudgetsPage = () => {

  const [open, setOpen] = useState(false)
  const [budgets, setBudgets] = useState<Budget[]>([])

  const getBudgets = async () => {
    setBudgets([])
    auth.onAuthStateChanged((user) => {
      if (user === null) return
      const budgetsArray = query(collection(db, "users", user.uid, "budgets"), orderBy('pay_date', 'asc'))
      budgetsArray.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setBudgets((budgets) => [...budgets, {id: doc.id, ...doc.data()}])
        });
      });
    })
  }

  return(
    <div className="flex flex-col">
      <div className="flex flex-row">
        <span className="font-bold text-xl">Presupuesto</span>
      </div>
      <div className="flex flex-row justify-end">
        <button
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2"
        >
          + Agregar presupuesto
        </button>
      </div>
      <div className="grid grid-cols-12 mt-12 ">

      </div>
    </div>
  );
}

export default BudgetsPage