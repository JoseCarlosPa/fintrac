"use client"
import React from "react";

type NavBarButtonProps = {
  onClick: () => void
  icon: React.ReactNode
  label: string | null | undefined
}
const NavBarButton = ({onClick,icon,label}:NavBarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="py-4 pl-4 flex flex-row hover:bg-gray-200 transition duration-300 hover:border-r-gray-600 hover:border-r-4">
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

export default NavBarButton