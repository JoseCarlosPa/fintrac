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
import NavBarButton from "@/app/home/components/NavBarButton";

const SideBarWeb = () => {
  const userState = useRecoilValue(UserState)

  const logOut = useCallback(()=>{
    return signOut(auth)
  },[auth])

  return (
    <nav className="h-screen bg-white rounded-r-lg shadow-lg hidden md:block">
      <div className="flex flex-col py-8 ">
        <h1 className="px-4 text-4xl Avenir tracking-tighter text-gray-900 md:text-4x1 lg:text-3xl">
          FinTrac
        </h1>
        <NavBarButton onClick={()=>{}} icon={<HiOutlineSignal className="text-green-500 w-5 h-5 my-auto mr-2"/>} label={'USER'} />
        <NavBarButton onClick={()=>{}} icon={<FaChartPie className="my-auto w-4 h-4 mr-2 "/>} label={'Inicio'} />
        <NavBarButton onClick={()=>{}} icon={<IoIosToday className="my-auto w-4 h-4 mr-2 "/>} label={'Gastos del mes'} />
        <NavBarButton onClick={()=>{}} icon={<FaCreditCard className="my-auto w-4 h-4 mr-2 "/>} label={'Mis tarjetas'} />
        <NavBarButton onClick={()=>{}} icon={<BsCashCoin className="my-auto w-4 h-4 mr-2 "/>} label={'Presupuestos'} />
        <NavBarButton onClick={()=>{}} icon={<FaChartBar className="my-auto w-4 h-4 mr-2 "/>} label={'Estadisticas'} />
        <NavBarButton onClick={()=>{}} icon={<BsTools className="my-auto w-4 h-4 mr-2 "/>} label={'Herramientas'} />
        <NavBarButton onClick={logOut} icon={<IoLogOutSharp className="my-auto w-4 h-4 mr-2 "/>} label={'Cerrar sesion'} />
      </div>
    </nav>
  );
}

export default React.memo(SideBarWeb)