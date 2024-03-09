"use client"
import React, {useEffect, useState} from "react";
import SideBarWeb from "@/app/home/components/SideBarWeb";
import NavBarMobile from "@/app/home/components/NavBarMobile";
import {auth} from "@/firebase";
import {useRouter} from "next/navigation";

type HomeLayoutProps = {
  children: React.ReactNode
}
const HomeLayout = ({children}:HomeLayoutProps) => {

  const [email, setEmail] = useState<string | null>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user?.email)
      }
    });
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-200 md:grid md:grid-cols-12">
      <div className="md:col-span-2">
        <SideBarWeb email={email} />
        <NavBarMobile email={email}/>
      </div>
      <div className="md:col-span-10 px-2 md:px-8 px-4">
        {children}
      </div>
    </div>
  );
}

export default HomeLayout