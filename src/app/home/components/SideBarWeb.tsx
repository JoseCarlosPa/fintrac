"use client"
import React, {useCallback} from "react";
import {FaChartBar, FaChartPie, FaCreditCard} from "react-icons/fa";
import {HiOutlineSignal} from "react-icons/hi2";
import {UserState} from "@/store/recoil/User";
import {useRecoilValue} from "recoil";
import {BsCashCoin, BsTools} from "react-icons/bs";
import {IoIosToday} from "react-icons/io";
import {IoLogOutSharp} from "react-icons/io5";
import {auth } from "@/firebase";
import {signOut} from "@firebase/auth";

const SideBarWeb = () => {
  const userState = useRecoilValue(UserState)

  const logOut = useCallback(()=>{
    return signOut(auth)
  },[auth])

  return (
    <nav className="h-screen bg-white rounded-r-lg shadow-lg w-1/6 hidden md:block">
      <div className="flex flex-col py-8">
        <h1 className="px-4 text-4xl Avenir tracking-tighter text-gray-900 md:text-4x1 lg:text-3xl">
          FinTrac
        </h1>
        <div className="flex flex-row py-3 pl-4">
          <HiOutlineSignal className="text-green-500 w-5 h-5 my-auto mr-2"/>
          <span className="text-xs">{userState?.email}</span>
        </div>
        <div
          className="py-3 pl-4 flex flex-row hover:bg-gray-200 transition duration-300 hover:border-r-gray-600 hover:border-r-2 ">
          <FaChartPie className="my-auto w-4 h-4 mr-2 "/>
          <span className="font-semibold text-lg">Inicio</span>
        </div>
        <div
          className="py-3 pl-4 flex flex-row hover:bg-gray-200 transition duration-300 hover:border-r-gray-600 hover:border-r-2 ">
          <IoIosToday
            className="my-auto w-4 h-4 mr-2 "/>
          <span className="font-semibold text-lg">Gastos del mes</span>
        </div>
        <div
          className="py-3 pl-4 flex flex-row hover:bg-gray-200 transition duration-300 hover:border-r-gray-600 hover:border-r-2 ">
          <FaCreditCard className="my-auto w-4 h-4 mr-2 "/>
          <span className="font-semibold text-lg">Mis tarjetas</span>
        </div>
        <div
          className="py-3 pl-4 flex flex-row hover:bg-gray-200 transition duration-300 hover:border-r-gray-600 hover:border-r-2 ">
          <BsCashCoin
            className="my-auto w-4 h-4 mr-2 "/>
          <span className="font-semibold text-lg">Presupuestos</span>
        </div>
        <div
          className="py-3 pl-4 flex flex-row hover:bg-gray-200 transition duration-300 hover:border-r-gray-600 hover:border-r-2 ">
          <FaChartBar
            className="my-auto w-4 h-4 mr-2 "/>
          <span className="font-semibold text-lg">Estadisticas</span>
        </div>
        <div
          className="py-3 pl-4 flex flex-row hover:bg-gray-200 transition duration-300 hover:border-r-gray-600 hover:border-r-2 ">
          <BsTools
            className="my-auto w-4 h-4 mr-2 "/>
          <span className="font-semibold text-lg">Herramientas</span>
        </div>
        <div
          onClick={logOut}
          className="py-3 pl-4 flex flex-row hover:bg-gray-200 transition duration-300 hover:border-r-gray-600 hover:border-r-2 ">
          <IoLogOutSharp
          className="my-auto w-4 h-4 mr-2 "/>
          <span className="font-semibold text-lg">Cerrar sesion</span>
        </div>

      </div>
    </nav>
  );
}

export default React.memo(SideBarWeb)