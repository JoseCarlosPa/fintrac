"use client"
import React from "react";
import {FaChartPie} from "react-icons/fa";
import {HiOutlineSignal} from "react-icons/hi2";

const SideBarWeb = () => {
  return (
    <nav className="h-screen bg-white rounded-r-lg shadow-lg w-1/6 hidden md:block">
      <div className="flex flex-col py-8">
        <h1 className="px-4 text-4xl Avenir tracking-tighter text-gray-900 md:text-4x1 lg:text-3xl">
          FinTrac
        </h1>
        <div className="flex flex-row py-3">
          <HiOutlineSignal className="text-green-500 w-3 h-3 my-auto"/>
          <span className="text-sm"></span>
        </div>
        <div
          className="py-3 pl-4 flex flex-row hover:bg-gray-200 transition duration-300 hover:border-r-gray-600 hover:border-r-2 ">
          <FaChartPie className="my-auto w-4 h-4 mr-2 "/>
          <span className="font-semibold text-lg">Inicio</span>
        </div>

      </div>
    </nav>
  );
}

export default React.memo(SideBarWeb)