"use client"
import {useEffect, useState} from "react";
import {auth, db} from "@/firebase";
import {collection, doc, getDocs, orderBy, query, updateDoc,getDoc} from "firebase/firestore";
import {Budget} from "@/types/Budget";
import BudgetModal from "@/app/home/budgets/components/modals/BudgetModal";
import {FaGear} from "react-icons/fa6";
import BudgetConfigModal from "@/app/home/budgets/components/modals/BudgetConfigModal";

const BudgetsPage = () => {

  const [open, setOpen] = useState(false)
  const [openGear, setOpenGear] = useState(false)
  const [budgets, setBudgets] = useState<any[]>([])
  const [creditCards, setCreditCards] = useState<any[]>([])
  const [user, setUser] = useState<any>()

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
      const creditCardsArray = query(collection(db, "users", user.uid, "credit_cards"), orderBy('name', 'desc'))
      const creditCardsSnapshot = getDocs(creditCardsArray)
      creditCardsSnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setCreditCards((creditCards) => [...creditCards, {id: doc.id, ...doc.data()}])
        });
      });
    })
  }

  const getUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      const userRef = doc(db, 'users', user.uid)
      const userSnapshot = await getDoc(userRef)
      setUser(userSnapshot.data())
    })

  }

  useEffect(() => {
    getBudgets()
    getCreditCards()
    getUserData()
  }, []);

  const monthAndYear = () => {
    const date = new Date()
    const month = date.toLocaleString('default', {month: 'short'})
    const year = date.getFullYear()
    return `${month}/${year}`
  }

  const orderedBudgets = () => {
    return budgets.sort((a: Budget, b: Budget) => {
      if (parseInt(a.pay_date) > parseInt(b.pay_date)) return 1
      if (parseInt(a.pay_date) < parseInt(b.pay_date)) return -1
      return 0
    })
  }

  const calculateTotal = () => {
    return budgets.reduce((acc, budget) => {
      return acc + budget.amount;
    }, 0);
  };

  const calculateFirstFortnight = (start: number, end: number) => {
    const firstFortnight = budgets.filter((budget: Budget) => {
      return parseInt(budget.pay_date) >= start && parseInt(budget.pay_date) <= end
    })
    return firstFortnight.reduce((acc, budget) => {
      return acc + budget.amount;
    }, 0);

  }

  const handleIsPaid = async (budget: Budget) => {
    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      const budgetRef = doc(db, 'users', user.uid, 'budgets', budget.id)
      const payload = {
        paid: !budget.paid
      }
      await updateDoc(budgetRef, payload).then(() => {
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

  return (
    <div className="flex flex-col">
      {open && <BudgetModal setBudgets={setBudgets} creditCards={creditCards} open={open} onClose={() => {
        setOpen(false)
      }}/>}

      {openGear && <BudgetConfigModal user={user} setUser={setUser} onClose={() => {
        setOpenGear(false)
      }} show={openGear}/>}

      <div className="flex flex-row justify-end gap-x-4 mt-4">
        <button
          onClick={() => setOpenGear(true)}
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
      <span className="font-bold my-4">Cálculo por Quincena y Mes</span>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4 flex flex-col bg-gray-100 p-4 shadow rounded-md w-full h-24">
          <span
            className="my-auto"><b>1ra Quincena:</b> {parseFloat(calculateFirstFortnight(1, 15)).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })}</span>
          <span
            className=" my-auto"><b>Sobran:</b> {(parseFloat(user?.fortnight) - parseFloat(calculateFirstFortnight(1, 15))).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })}</span>
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col bg-gray-100 p-4 shadow rounded-md w-full h-24">
          <span
            className="my-auto"><b>2ra Quincena:</b> {parseFloat(calculateFirstFortnight(16, 31)).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })}</span>
          <span
            className="my-auto"><b>Sobran:</b> {(parseFloat(user?.fortnight) - parseFloat(calculateFirstFortnight(16, 31))).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })}</span>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col bg-gray-100 p-4 shadow rounded-md w-full h-24">
          <span className="my-auto"><b>Mes:</b> {parseFloat(calculateFirstFortnight(1, 31)).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })}</span>
          <span
            className="my-auto"><b>Sobran:</b> {((parseFloat(user?.fortnight) * 2) - parseFloat(calculateFirstFortnight(1, 31))).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })}</span>
        </div>

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
          {orderedBudgets().map((budget: Budget, index: number) => (
            <tr key={budget.id} className={`${index % 2 == 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
              <td className=" px-2 py-2 text-sm border border-gray-400 text-blue-700">{budget?.name}</td>
              <td className=" px-2 py-2 text-sm border border-gray-400">{(budget?.amount)?.toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN'

              })}</td>
              <td className=" px-2 py-2 text-sm border border-gray-400">{`${budget.pay_date}/${monthAndYear()}`}</td>
              <td className=" px-2 py-2 text-sm border border-gray-400 text-center">
                <input
                  onChange={() => {
                    handleIsPaid(budget)
                  }}
                  className={`form-checkbox h-5 w-5 text-gray-600`}
                  checked={budget?.paid} type="checkbox"/>
              </td>
            </tr>

          ))}

          <tr>
            <td className="px-2 py-2 text-sm border border-gray-400">Total</td>
            <td className="px-2 py-2 text-sm border border-gray-400">
              {calculateTotal().toLocaleString('es-MX', {
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