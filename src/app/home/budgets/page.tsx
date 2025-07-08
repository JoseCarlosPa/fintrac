"use client"
import {useEffect, useState} from "react";
import {auth, db} from "@/firebase";
import {collection, doc, getDocs, orderBy, query, updateDoc, getDoc} from "firebase/firestore";
import {Budget} from "@/types/Budget";
import BudgetModal from "@/app/home/budgets/components/modals/BudgetModal";
import {FaGear} from "react-icons/fa6";
import BudgetConfigModal from "@/app/home/budgets/components/modals/BudgetConfigModal";
import BudgetTable from "@/app/home/budgets/components/BudgetTable";
import {Card} from "@/types/Card";
import {deleteDoc} from "@firebase/firestore";

const BudgetsPage = () => {

    const [open, setOpen] = useState<boolean>(false)
    const [openGear, setOpenGear] = useState<boolean>(false)
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [creditCards, setCreditCards] = useState<Card[]>([])
    const [user, setUser] = useState<any>()

    const getBudgets = async () => {
        setBudgets([])
        auth.onAuthStateChanged((user) => {
            if (user === null) return
            const budgetsArray = query(collection(db, "users", user.uid, "budgets"), orderBy('pay_date', 'desc'))
            const budgetsSnapshot = getDocs(budgetsArray)
            budgetsSnapshot.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setBudgets((prev: any) => [...prev, {id: doc.id, ...doc.data()}])
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
                    setCreditCards((creditCards: any) => [...creditCards, {id: doc.id, ...doc.data()}])
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

    const deleteBudget = async (budget: Budget) => {
        auth.onAuthStateChanged(async (user) => {
            if (user === null) return
            deleteDoc(doc(db, 'users', user.uid, 'budgets', budget.id)).then(() => {
                setBudgets((prevBudgets) => {
                    return prevBudgets.filter((prevBudget) => {
                        return prevBudget.id !== budget.id
                    })
                })
            });
        })
    }



    return (
        <div className="flex flex-col gap-8 px-2 md:px-8 py-6 bg-gray-50 min-h-screen rounded-lg shadow">
            {open && <BudgetModal setBudgets={setBudgets} creditCards={creditCards} open={open} onClose={() => {
                setOpen(false)
            }}/>}

            {openGear && <BudgetConfigModal user={user} setUser={setUser} onClose={() => {
                setOpenGear(false)
            }} show={openGear}/>}

            <div className="flex flex-row justify-end gap-x-4 mt-4 mb-6">
                <button
                    onClick={() => setOpenGear(true)}
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2 shadow transition hover:scale-105 flex items-center gap-2"
                >
                    <FaGear className="text-white w-6 h-6"/>
                    <span className="hidden md:inline">Configuración</span>
                </button>
                <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-4 py-2 shadow transition hover:scale-105"
                >
                    + Agregar presupuesto
                </button>
            </div>
            <span className="font-bold my-2 text-lg text-gray-700">Cálculo por Quincena y Mes</span>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-4 flex flex-col bg-white p-6 shadow-lg rounded-xl w-full h-28 border border-blue-100 hover:shadow-xl transition">
          <span className="my-auto text-blue-800 font-semibold text-base">
            <b>1ra Quincena:</b> {parseFloat(String(calculateFirstFortnight(1, 15))).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN'
          })}
          </span>
                    <span className="my-auto text-green-700 font-medium text-sm">
            <b>Sobran:</b> {(parseFloat(user?.fortnight) - parseFloat(String(calculateFirstFortnight(1, 15)))).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    })}
          </span>
                </div>
                <div className="col-span-12 md:col-span-4 flex flex-col bg-white p-6 shadow-lg rounded-xl w-full h-28 border border-blue-100 hover:shadow-xl transition">
          <span className="my-auto text-blue-800 font-semibold text-base">
            <b>2da Quincena:</b> {parseFloat(String(calculateFirstFortnight(16, 31))).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN'
          })}
          </span>
                    <span className="my-auto text-green-700 font-medium text-sm">
            <b>Sobran:</b> {(parseFloat(user?.fortnight) - parseFloat(String(calculateFirstFortnight(16, 31)))).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    })}
          </span>
                </div>

                <div className="col-span-12 md:col-span-4 flex flex-col bg-white p-6 shadow-lg rounded-xl w-full h-28 border border-blue-100 hover:shadow-xl transition">
          <span className="my-auto text-blue-800 font-semibold text-base">
            <b>Mes:</b> {parseFloat(String(calculateFirstFortnight(1, 31))).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN'
          })}
          </span>
                    <span className="my-auto text-green-700 font-medium text-sm">
            <b>Sobran:</b> {((parseFloat(user?.fortnight) * 2) - parseFloat(String(calculateFirstFortnight(1, 31)))).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    })}
          </span>
                </div>
            </div>
            <div className="flex flex-row mt-12">
                <div className="w-full overflow-x-auto rounded-xl shadow-lg bg-white border border-gray-200">
                    <table className="w-full min-w-[700px]">
                        <thead>
                        <tr className="bg-blue-100">
                            <th className="px-2 py-3 text-sm border-b border-gray-300 text-blue-900">Nombre</th>
                            <th className="px-2 py-3 text-sm border-b border-gray-300 text-blue-900">Monto</th>
                            <th className="px-2 py-3 text-sm border-b border-gray-300 text-blue-900">Fecha de pago</th>
                            <th className="px-2 py-3 text-sm border-b border-gray-300 text-blue-900">Pagado</th>
                            <th className="px-2 py-3 text-sm border-b border-gray-300 text-blue-900 hidden md:table-cell">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderedBudgets().map((budget: Budget, index: number) => (
                            <BudgetTable budget={budget} index={index} handleIsPaid={handleIsPaid} key={budget.id}
                                         deleteBudget={deleteBudget} setBudgets={setBudgets}/>
                        ))}
                        <tr className="bg-blue-50 font-bold">
                            <td className="px-2 py-2 text-sm border-t border-gray-300">Total</td>
                            <td className="px-2 py-2 text-sm border-t border-gray-300">
                                {calculateTotal().toLocaleString('es-MX', {
                                    style: 'currency',
                                    currency: 'MXN'
                                })}
                            </td>
                            <td className="px-2 py-2 text-sm border-t border-gray-300"></td>
                            <td className="px-2 py-2 text-sm border-t border-gray-300"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BudgetsPage

