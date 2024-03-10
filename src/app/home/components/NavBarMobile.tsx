"use client"
import React from "react";
import {GiHamburgerMenu} from "react-icons/gi";
import MenuBar from "@/app/home/components/MenuBar";

type NavBarMobileProps = {
  email?: string | null

}
const NavBarMobile = ({email}:NavBarMobileProps) => {

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
            <MenuBar email={email} onClick={()=>{setShow(false)}}/>
          </div>
        </div>
      )}

    </div>


  );
}

export default NavBarMobile