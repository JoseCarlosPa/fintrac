"use client"
import {HiOutlineSignal} from "react-icons/hi2";
import {FaChartBar, FaChartPie, FaCreditCard} from "react-icons/fa";
import {IoIosToday} from "react-icons/io";
import {BsCashCoin, BsTools} from "react-icons/bs";
import {IoLogOutSharp} from "react-icons/io5";
import React, {useCallback} from "react";
import {useRecoilValue} from "recoil";
import {signOut} from "@firebase/auth";
import {auth} from "@/firebase";
import {UserState} from "@/store/recoil/User";
import {GiHamburgerMenu} from "react-icons/gi";

const NavBarMobile = () => {

  const userState = useRecoilValue(UserState)

  const logOut = useCallback(()=>{
    return signOut(auth)
  },[auth])

  const [show, setShow] = React.useState(false)

  return (
    <div className="mb-8">
      <div className="flex flex-row justify-between py-4 bg-white shadow-md rounded-b-lg">
        <div></div>
        <h1 className="px-4 text-4xl Avenir tracking-tighter text-gray-900 md:text-4x1 lg:text-3xl">
          FinTrac
        </h1>
        <div className="flex flex-row mr-2">
          <GiHamburgerMenu
            onClick={() => setShow(!show)}
            className="w-6 h-6 my-auto text-gray-900" />
        </div>
      </div>
      {show && (
        <div className="py-2 bg-white rounded-b-lg shadow-lg w-full md:hidden">
          <div className="flex flex-col py-8">

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
        </div>
      )}

    </div>


  );
}

export default NavBarMobile