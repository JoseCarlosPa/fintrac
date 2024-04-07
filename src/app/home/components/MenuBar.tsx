import NavBarButton from "@/app/home/components/NavBarButton";
import {FaChartBar, FaChartPie, FaCreditCard} from "react-icons/fa";
import {IoIosToday} from "react-icons/io";
import {BsCashCoin, BsTools} from "react-icons/bs";
import {IoLogOutSharp} from "react-icons/io5";
import React, {useCallback} from "react";
import {useRouter} from "next/navigation";
import {signOut} from "@firebase/auth";
import {auth} from "@/firebase";
import {GiTwoCoins} from "react-icons/gi";

type NavBarMobileProps = {
  email?: string | null
  onClick: () => void

}
const MenuBar = ({email, onClick}: NavBarMobileProps) => {

  const router = useRouter()

  const logOut = useCallback(() => {
    signOut(auth)
    return router.push('/login')
  }, [auth])


  return (
    <>
      <NavBarButton onClick={() => {
      }} icon={<div className="bg-green-500 rounded-full w-2 h-2 my-auto mr-2"/>}
                    label={email}/>
      <NavBarButton onClick={() => {
        router.push('/home')
        onClick()
      }} icon={<FaChartPie className="my-auto w-4 h-4 mr-2 "/>} label={'Inicio'}/>
      <NavBarButton onClick={() => {
        router.push('/home/month-outcomes')
        onClick()
      }} icon={<IoIosToday className="my-auto w-4 h-4 mr-2 "/>} label={'Gastos no presupuestados'}/>
      <NavBarButton onClick={() => {
        router.push('/home/cards')
        onClick()
      }} icon={<FaCreditCard className="my-auto w-4 h-4 mr-2 "/>} label={'Mis tarjetas'}/>
      <NavBarButton onClick={() => {
        router.push('/home/budgets')
        onClick()
      }} icon={<BsCashCoin className="my-auto w-4 h-4 mr-2 "/>} label={'Presupuestos'}/>
      <NavBarButton onClick={() => {
        router.push('/home/active-passives')
        onClick()
      }} icon={<GiTwoCoins className="my-auto w-4 h-4 mr-2 "/>} label={'Activos / pasivos'}/>
      <NavBarButton onClick={() => {
        router.push('/home/statistics')
        onClick()
      }} icon={<FaChartBar className="my-auto w-4 h-4 mr-2 "/>} label={'Estadisticas'}/>
      <NavBarButton onClick={() => {
        router.push('/home/tools')
        onClick()
      }} icon={<BsTools className="my-auto w-4 h-4 mr-2 "/>} label={'Herramientas'}/>
      <NavBarButton onClick={logOut} icon={<IoLogOutSharp className="my-auto w-4 h-4 mr-2 "/>} label={'Cerrar sesion'}/>
    </>
  );
}

export default MenuBar