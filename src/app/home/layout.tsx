"use client"
import React, { useState} from "react";
import SideBarWeb from "@/app/home/components/SideBarWeb";
import NavBarMobile from "@/app/home/components/NavBarMobile";
import {useRouter} from "next/navigation";
import useUserState from "@/utils/hook/useUserState";
import LoadingAuth from "@/app/home/components/LoadingAuth";

type HomeLayoutProps = {
  children: React.ReactNode
}
const HomeLayout = ({children}:HomeLayoutProps) => {

  const user  = useUserState();
  const router = useRouter()

  if(user === false) return <LoadingAuth />;
  if(!user) return router.push('/login') ;

  return (
    <div className="min-w-screen min-h-screen bg-gray-200 md:grid md:grid-cols-12 pb-8">
      <div className="md:col-span-2">
        <SideBarWeb email={user.email} />
        <NavBarMobile email={user.email}/>
      </div>
      <div className="md:col-span-10 md:px-8 px-4 pt-24 md:pt-4">
        {children}
      </div>
    </div>
  );
}

export default HomeLayout