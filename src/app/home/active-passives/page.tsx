"use client"
import {GiReceiveMoney} from "react-icons/gi";
import {useEffect, useState} from "react";
import AddNewActivePassive from "@/app/home/active-passives/components/modals/AddNewActivePassive";
import {ActivePassive} from "@/types/ActivePasive";
import {getDocs, collection, query, doc} from "firebase/firestore";
import {auth, db} from "@/firebase";
import {MdEdit} from "react-icons/md";
import {FaTrash} from "react-icons/fa";
import swal from "sweetalert2";
import {deleteDoc} from "@firebase/firestore";
import {toast} from "sonner";

const ActivePassivesPage = () => {

  const [showAddNewActivePassiveModal, setShowAddNewActivePassiveModal] = useState(false);
  const [activePassives, setActivePassives] = useState<ActivePassive[]>([]);
  const [showEditActivePassiveModal, setShowEditActivePassiveModal] = useState(false);
  const [selectedActivePassive, setSelectedActivePassive] = useState<ActivePassive >();
  const getActivePassives = async () => {
    setActivePassives([])
    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      const activePassivesRef = collection(db, 'users', user.uid, 'activesPassives')
      const activePassivesSnapshot = await getDocs(activePassivesRef)
      activePassivesSnapshot.forEach((doc) => {
        setActivePassives((prev: any) => [...prev, {id: doc.id, ...doc.data()}])
      })
    })
  }

  useEffect(() => {
    getActivePassives()
  }, []);

  const passives = activePassives.filter((activePassive) => activePassive.type === 'passive')
  const actives = activePassives.filter((activePassive) => activePassive.type === 'active')
  const goals = activePassives.filter((activePassive) => activePassive.type === 'goal')

  const calculateTotalPassives = () => {
    let total = 0
    passives.forEach((passive) => {
      total += passive?.missing
    })
    return total
  }

  const calculateTotalActives = () => {
    let total = 0
    actives.forEach((active) => {
      total += active?.value
    })

    goals.forEach((goal) => {
      total += goal?.value
    })

    return total
  }

  const deleteActivePassive = async (id: string) => {

    auth.onAuthStateChanged(async (user) => {
      if (user === null) return
      await deleteDoc(doc(db, 'users', user.uid, 'activesPassives', id))
      setActivePassives(activePassives.filter((activePassive) => activePassive.id !== id))
    })
  }

  const askForDelete = (active: ActivePassive) => {
    swal.fire({
      title: `¿Estás seguro que deseas eliminar ${active?.name}? `,
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && active?.id !== undefined) {
        deleteActivePassive(active?.id).then(()=>{
          toast.success(`${active?.type} eliminado correctamente`)
        })
      }
    })
  }

  return (
    <>
      {showAddNewActivePassiveModal &&
          <AddNewActivePassive setActivePassives={setActivePassives} show={showAddNewActivePassiveModal}
                               onClose={() => {
                                 setShowAddNewActivePassiveModal(false)
                               }}/>}
      {showEditActivePassiveModal &&
          <AddNewActivePassive setActivePassives={setActivePassives} show={showEditActivePassiveModal}
                               edit
                               activePassive={selectedActivePassive}
                               onClose={() => {
                                 setShowEditActivePassiveModal(false)
                               }}/>
      }
      <div className="flex flex-col">

        <div className="flex flex-row mb-12">
          <span className="font-bold text-xl">Activos y pasivos</span>
        </div>

        {activePassives.length <= 0 ?
          <div className="flex flex-row justify-center mt-60">
            <div className="flex flex-col">
              <GiReceiveMoney className="w-12 h-12 mx-auto"/>
              <span className="font-bold text-xl">Aun no tienes activos ni pasivos</span>
              <button
                onClick={() => setShowAddNewActivePassiveModal(true)}
                className="bg-gray-900 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4">Agregar
                activo / Pasivo
              </button>
            </div>
          </div>
          :
          <div className="flex flex-col">
            <div className="flex flex-row justify-end mb-8">
              <button
                onClick={() => setShowAddNewActivePassiveModal(true)}
                className="rounded bg-gray-900 hover:bg-gray-800 text-white px-3 py-2">+ Agregar Activo
                / Pasivo
              </button>
            </div>
            <div className="flex flex-row gap-4 mb-12">
              <div className="flex flex-col w-1/2 bg-white rounded-md shadow-md p-4">
                <span className="font-bold">Total Activos</span>
                <span className="">{calculateTotalActives().toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN'
                })}</span>
              </div>
              <div className="flex flex-col w-1/2 bg-white rounded-md shadow-md p-4">
                <span className="font-bold">Total Pasivos</span>
                <span className="">{calculateTotalPassives().toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN'
                })}</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="font-bold text-xl">Metas</div>
                {goals.map((activePassive, index) => (
                  <div key={index}
                       className="flex bg-white px-4 py-2 rounded-md shadow-md w-full md:h-48">
                    <div className="flex flex-col w-full">
                      <span className="font-bold text-lg">{activePassive.name}</span>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-4 mt-4 ">
                                                      <span
                                                        className="text-sm"><b>Cantidad</b>: {activePassive.quantity}</span>
                          <span
                            className="text-sm"><b>Tengo</b>: {(activePassive.value)?.toLocaleString('es-MX', {
                            style: 'currency',
                            currency: 'MXN'
                          })}</span>
                          <span
                            className="text-sm"><b>Faltan</b>: {activePassive.goal !== undefined && (activePassive?.goal - activePassive.value).toLocaleString('es-MX', {
                            style: 'currency',
                            currency: 'MXN'
                          })}</span>
                        </div>
                        <div className="flex flex-row gap-4 my-auto">
                          <button
                            onClick={() => {
                              setSelectedActivePassive(activePassive)
                              setShowEditActivePassiveModal(true)
                            }}
                            className="bg-yellow-500 rounded p-1 text-white md:px-3 md:py-2">
                            <MdEdit/>
                          </button>
                          <button
                            onClick={() => askForDelete(activePassive)}
                            className="bg-red-500 text-white p-1 md:px-3 md:py-2 rounded">
                            <FaTrash/>
                          </button>
                        </div>
                      </div>


                      {activePassive.goal !== undefined && activePassive.value !== undefined &&
                          <div className="flex flex-col gap-4 mt-4">
                              <div
                                  className="mt-1 h-2 rounded-r w-full bg-neutral-200 dark:bg-neutral-600">
                                  <div className="h-2 rounded-r bg-blue-800"
                                       style={{'width': `${(((activePassive.value) * 100) / activePassive.goal).toFixed(2)}%`}}>
                                  </div>
                              </div>
                              <span
                                  className="flex flex-row justify-center mt-2">{(((activePassive.value) * 100) / activePassive.goal).toFixed(2)}%
                                                        </span>
                          </div>
                      }

                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="font-bold text-xl">Activos</div>
                {actives?.map((active, index) => {
                  return (
                    <div key={index}
                         className="flex bg-white px-4 py-2 rounded-md shadow-md w-full md:h-48">
                      <div className="flex flex-col w-full gap-4">
                        <span className="font-bold text-lg">{active?.name}</span>
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-row gap-4 mt-4 ">
                                                        <span
                                                          className="text-sm"><b>Cantidad</b>: {active?.quantity}</span>
                            <span
                              className="text-sm"><b>Valor</b>: {(active?.quantity * active?.value).toLocaleString('es-MX', {
                              style: 'currency',
                              currency: 'MXN'
                            })}</span>
                          </div>

                        </div>
                        <div className="flex flex-row gap-4 my-auto">
                          <button
                            onClick={() => {
                              setSelectedActivePassive(active)
                              setShowEditActivePassiveModal(true)
                            }}
                            className="bg-yellow-500 rounded text-white p-1 md:px-3 md:py-2">
                            <MdEdit/>
                          </button>
                          <button
                            onClick={() => askForDelete(active)}
                            className="bg-red-500 text-white p-1 md:px-3 md:py-2 rounded">
                            <FaTrash/>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
                }
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-4 h-screen overflow-auto">
                <div className="font-bold text-xl">Pasivos</div>
                {passives.map((activePassive, index) => (
                  <div key={index}
                       className="flex bg-white px-4 py-2 rounded-md shadow-md w-full md:h-48">
                    <div className="flex flex-col w-full">
                      <span className="font-bold text-lg">{activePassive.name}</span>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-2 mt-4 ">
                                                      <span
                                                        className="text-sm"><b>Cantidad</b>: {activePassive.quantity}</span>
                          <span
                            className="text-sm"><b>Valor</b>: {(activePassive.value)?.toLocaleString('es-MX', {
                            style: 'currency',
                            currency: 'MXN'
                          })}</span>
                          <span
                            className="text-sm"><b>Faltan</b>: {(activePassive?.missing).toLocaleString('es-MX', {
                            style: 'currency',
                            currency: 'MXN'
                          })}</span>
                        </div>
                        <div className="flex flex-row gap-2 my-auto">
                          <button
                            onClick={() => {
                              setSelectedActivePassive(activePassive)
                              setShowEditActivePassiveModal(true)
                            }}
                            className="bg-yellow-500 rounded p-1 text-white md:px-3 md:py-2">
                            <MdEdit/>
                          </button>
                          <button
                            onClick={() => askForDelete(activePassive)}
                            className="bg-red-500 text-white p-1 md:px-3 md:py-2 rounded">
                            <FaTrash/>
                          </button>
                        </div>
                      </div>


                      {activePassive.missing !== undefined && activePassive.value !== undefined &&
                          <div className="flex flex-col gap-4 mt-4">
                              <div
                                  className="mt-1 h-2 rounded-r w-full bg-neutral-200 dark:bg-neutral-600">
                                  <div className="h-2 rounded-r bg-blue-800"
                                       style={{'width': `${(((activePassive.value - activePassive.missing) * 100) / activePassive.value).toFixed(2)}%`}}>
                                  </div>
                              </div>
                              <span
                                  className="flex flex-row justify-center mt-2">{(((activePassive.value - activePassive.missing) * 100) / activePassive.value).toFixed(2)}%
                                                        </span>
                          </div>
                      }

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        }

      </div>
    </>

  );
}

export default ActivePassivesPage