"use client"
import React from "react";
import MenuBar from "@/app/home/components/MenuBar";

type SideBarWebProps = {
  email?: string | null
}

const SideBarWeb = ({email}:SideBarWebProps) => {

  return (
    <nav className="min-h-screen bg-white rounded-r-lg shadow-lg hidden md:block fixed w-56">
      <div className="flex flex-col py-8 ">
        <h1 className="px-4 text-4xl Avenir tracking-tighter text-gray-900 md:text-4x1 lg:text-3xl">
          FinTrac
        </h1>
        <MenuBar email={email} onClick={()=> {}}/>
      </div>
    </nav>
  );
}

export default React.memo(SideBarWeb)