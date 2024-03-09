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
import NavBarButton from "@/app/home/components/NavBarButton";
import {useRouter} from "next/navigation";

type NavBarMobileProps = {
  email?: string | null

}
const NavBarMobile = ({email}:NavBarMobileProps) => {

  const userState = useRecoilValue(UserState)
  const router = useRouter()

  const logOut = useCallback(()=>{
    signOut(auth)
    return router.push('/login')
  },[auth])

  const [show, setShow] = React.useState(false)

  return (
    <div className="mb-8 md:hidden fixed w-full">
      <div className={`flex flex-row justify-between pt-4 bg-white  ${!show && 'rounded-b-lg shadow-md pb-4' }`}>
        <div></div>
        <h1 className="px-4 text-4xl Avenir tracking-tighter text-gray-900 md:text-4x1 lg:text-3xl">
          FinTrac
        </h1>
        <div className="flex flex-row mr-3">
          <GiHamburgerMenu
            onClick={() => setShow(!show)}
            className="w-7 h-7 my-auto text-gray-900" />
        </div>
      </div>
      {show && (
        <div className="py-1 bg-white rounded-b-lg shadow-lg w-full md:hidden">
          <div className="flex flex-col py-8">
            <NavBarButton onClick={()=>{}} icon={<div className="bg-green-500 rounded-full w-2 h-2 my-auto mr-2"/>}
                          label={email}/>
            <NavBarButton onClick={() => {
              router.push('/home')}} icon={<FaChartPie className="my-auto w-4 h-4 mr-2 "/>} label={'Inicio'} />
            <NavBarButton onClick={()=>{}} icon={<IoIosToday className="my-auto w-4 h-4 mr-2 "/>} label={'Gastos del mes'} />
            <NavBarButton onClick={()=>{router.push('/home/cards')}} icon={<FaCreditCard className="my-auto w-4 h-4 mr-2 "/>} label={'Mis tarjetas'} />
            <NavBarButton onClick={()=>{}} icon={<BsCashCoin className="my-auto w-4 h-4 mr-2 "/>} label={'Presupuestos'} />
            <NavBarButton onClick={()=>{}} icon={<FaChartBar className="my-auto w-4 h-4 mr-2 "/>} label={'Estadisticas'} />
            <NavBarButton onClick={()=>{}} icon={<BsTools className="my-auto w-4 h-4 mr-2 "/>} label={'Herramientas'} />
            <NavBarButton onClick={logOut} icon={<IoLogOutSharp className="my-auto w-4 h-4 mr-2 "/>} label={'Cerrar sesion'} />
          </div>
        </div>
      )}

    </div>


  );
}

export default NavBarMobile