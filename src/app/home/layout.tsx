"use client"
import React from "react";
import SideBarWeb from "@/app/home/components/SideBarWeb";
import NavBarMobile from "@/app/home/components/NavBarMobile";

type HomeLayoutProps = {
  children: React.ReactNode
}
const HomeLayout = ({children}:HomeLayoutProps) => {
  return (
    <div className="w-screen h-screen bg-gray-200 md:grid md:grid-cols-12">
      <div className="md:col-span-2">
        <SideBarWeb />
        <NavBarMobile/>
      </div>
      <div className="md:col-span-10 px-2 md:px-8 px-4">
        {children}
      </div>
    </div>
  );
}

export default HomeLayout