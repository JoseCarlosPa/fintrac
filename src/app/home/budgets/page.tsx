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
              className="my-auto"><b>1ra Quincena:</b> {parseFloat(String(calculateFirstFortnight(1, 15))).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN'
          })}</span>
                    <span
                        className=" my-auto"><b>Sobran:</b> {(parseFloat(user?.fortnight) - parseFloat(String(calculateFirstFortnight(1, 15)))).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    })}</span>
                </div>
                <div className="col-span-12 md:col-span-4 flex flex-col bg-gray-100 p-4 shadow rounded-md w-full h-24">
          <span
              className="my-auto"><b>2ra Quincena:</b> {parseFloat(String(calculateFirstFortnight(16, 31))).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN'
          })}</span>
                    <span
                        className="my-auto"><b>Sobran:</b> {(parseFloat(user?.fortnight) - parseFloat(String(calculateFirstFortnight(16, 31)))).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    })}</span>
                </div>

                <div className="col-span-12 md:col-span-4 flex flex-col bg-gray-100 p-4 shadow rounded-md w-full h-24">
          <span
              className="my-auto"><b>Mes:</b> {parseFloat(String(calculateFirstFortnight(1, 31))).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN'
          })}</span>
                    <span
                        className="my-auto"><b>Sobran:</b> {((parseFloat(user?.fortnight) * 2) - parseFloat(String(calculateFirstFortnight(1, 31)))).toLocaleString('es-MX', {
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
                        <th className="px-2 py-2 text-sm border border-gray-400 hidden md:block">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderedBudgets().map((budget: Budget, index: number) => (
                        <BudgetTable budget={budget} index={index} handleIsPaid={handleIsPaid} key={budget.id}
                                     deleteBudget={deleteBudget} setBudgets={setBudgets}/>
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