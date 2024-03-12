"use client"
import {useEffect, useRef, useState} from "react";
import {db, auth} from "@/firebase";
import {collection, query, getDocs, orderBy, doc, updateDoc} from "firebase/firestore";
import {Budget} from "@/types/Budget";
import {Card} from "@/types/Card";
import BudgetModal from "@/app/home/budgets/components/modals/BudgetModal";
import {FaGear} from "react-icons/fa6";

const BudgetsPage = () => {

  const [open, setOpen] = useState(false)
  const [budgets, setBudgets] = useState<any[]>([])
  const [creditCards, setCreditCards] = useState<any[]>([])
  const [creditCardsTotal, setCreditCardsTotal] = useState(0);

  const handleCreditCardsTotalChange = (total: number) => {
    setCreditCardsTotal(prevState => prevState + total);
  };

  const getBudgets = async () => {
    setBudgets([])
    auth.onAuthStateChanged((user) => {
      if (user === null) return
      const budgetsArray = query(collection(db, "users", user.uid, "budgets"), orderBy('pay_date', 'desc'))
      const budgetsSnapshot = getDocs(budgetsArray)
      budgetsSnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setBudgets((budgets) => [...budgets, {id: doc.id, ...doc.data()}])
        });
      });
    })
  }

  const getCreditCards = async () => {
    setCreditCards([])
    auth.onAuthStateChanged((user) => {
      if (user === null) return
      const creditCardsArray =  query(collection(db, "users", user.uid, "credit_cards"), orderBy('name', 'desc'))
      const creditCardsSnapshot = getDocs(creditCardsArray)
      creditCardsSnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setCreditCards((creditCards) => [...creditCards, {id: doc.id, ...doc.data()}])
        });
      });
    })
  }

  useEffect(() => {
    getBudgets()
    getCreditCards()
  }, []);

  const monthAndYear = () =>{
    const date = new Date()
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    return `${month}/${year}`
  }

  const orderedBudgets = () => {
    return budgets.sort((a:Budget,b:Budget) => {
      if(parseInt(a.pay_date) > parseInt(b.pay_date)) return 1
      if(parseInt(a.pay_date) < parseInt(b.pay_date)) return -1
      return 0
    })
  }

  const orderedCreditCards = () => {
    return creditCards.sort((a:Card,b:Card) => {
      if(parseInt(a.cut_date) > parseInt(b.cut_date)) return 1
      if(parseInt(a.cut_date) < parseInt(b.cut_date)) return -1
      return 0
    })
  }

  const calculateTotal = () => {
    // Calcula el total de los presupuestos
    const totalBudgets = budgets.reduce((acc, budget) => {
      return acc + budget.amount;
    }, 0);

    // Suma el total de las tarjetas de crédito al total de los presupuestos
    const total = totalBudgets + creditCardsTotal;

    return total;
  };

  const handleIsPaid = async (budget: Budget) => {
    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      const budgetRef = doc(db, 'users', user.uid, 'budgets', budget.id)
      const payload = {
        paid: !budget.paid
      }
      await updateDoc(budgetRef, payload).then(() => {
        console.log('handleIsPaid', budgetRef, payload)

        setBudgets((prevBudgets) => {
          return prevBudgets.map((prevBudget) => {
            if (prevBudget.id === budget.id) {
              return {...prevBudget, paid: !prevBudget.paid}
            }
            return prevBudget
          })

        })
      })
    })
  }


  return(
      <div className="flex flex-col">
        {open && <BudgetModal setBudgets={setBudgets} creditCards={creditCards} open={open} onClose={() => {
          setOpen(false)
        }}/>}
        <div className="flex flex-row">
          <span className="font-bold text-xl">Presupuesto</span>
        </div>
        <div className="flex flex-row justify-end gap-x-4 mt-12">
          <button
              onClick={() => setOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2"
          >
            <FaGear className="text-white w-6 h-6"/>
          </button>
          <button
              onClick={() => setOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2"
          >
            + Agregar presupuesto
          </button>
        </div>
        <div className="flex flex-row mt-12">
          <table className="w-full">
            <thead>
            <tr>
              <th className="px-2 py-2 text-sm border border-gray-400">Nombre</th>
              <th className="px-2 py-2 text-sm border border-gray-400">Monto</th>
              <th className="px-2 py-2 text-sm border border-gray-400">Fecha de pago</th>
              <th className="px-2 py-2 text-sm border border-gray-400">Pagado</th>
            </tr>
            </thead>
            <tbody>
            {orderedBudgets().map((budget: Budget) => (
                <tr key={budget.id}>
                  <td className=" px-2 py-2 text-sm border border-gray-400 text-blue-700">{budget?.name}</td>
                  <td className=" px-2 py-2 text-sm border border-gray-400">{(budget?.amount)?.toLocaleString('es-MX',{
                    style: 'currency',
                    currency: 'MXN'

                  })}</td>
                  <td className=" px-2 py-2 text-sm border border-gray-400">{`${budget.pay_date}/${monthAndYear()}`}</td>
                  <td className=" px-2 py-2 text-sm border border-gray-400 text-center">
                    <input
                      onChange={()=>{handleIsPaid(budget)}}
                        className={`form-checkbox h-5 w-5 text-gray-600`}
                        checked={budget?.paid} type="checkbox"/>
                  </td>
                </tr>

            ))}

            <tr>
              <td className="px-2 py-2 text-sm border border-gray-400">Total</td>
              <td className="px-2 py-2 text-sm border border-gray-400" >
                {calculateTotal().toLocaleString('es-MX',{
                    style: 'currency',
                    currency: 'MXN'
                    })
                }
              </td>
              <td className=" px-2 py-2 text-sm border border-gray-400"></td>
              <td className=" px-2 py-2 text-sm border border-gray-400"></td>
            </tr>
            </tbody>
          </table>

        </div>

      </div>
  );
}

export default BudgetsPage