"use client"
import React from "react";
import SideBarWeb from "@/app/home/components/SideBarWeb";
import NavBarMobile from "@/app/home/components/NavBarMobile";

type HomeLayoutProps = {
  children: React.ReactNode
}
const HomeLayout = ({children}:HomeLayoutProps) => {
  return (
    <div className="w-screen h-screen bg-gray-200">
      <SideBarWeb />
      <NavBarMobile />
      {children}
    </div>
  );
}

export default HomeLayout