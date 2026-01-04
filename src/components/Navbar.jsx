import React from "react";
import { FaUser } from "react-icons/fa";
import { HiSun, HiMoon } from "react-icons/hi";
import { RiSettings3Fill } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="
      flex items-center justify-between px-[100px] h-[90px]
      border-b
      bg-white text-black border-gray-200
      dark:bg-[#0f0f14] dark:text-white dark:border-gray-800
      transition-all
    "
    >
      <h3 className="text-[37px] font-[700] sp-text">GenUI</h3>

      <div className="flex items-center gap-[22px] text-[25px]">
        <button onClick={toggleTheme} className="hover:scale-110 transition">
          {theme === "dark" ? <HiSun /> : <HiMoon />}
        </button>

        <FaUser />
        <RiSettings3Fill />
      </div>
    </div>
  );
};

export default Navbar;
