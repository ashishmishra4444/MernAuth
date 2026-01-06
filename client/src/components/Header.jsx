import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { userData, isLoading } = React.useContext(AppContext);

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
          <img
            src={assets.header_img}
            className="h-36 w-36 rounded-full mb-6"
            alt="Header Image"
          />
          <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
            Hey {userData?.name || "Developer"}
            <img src={assets.hand_wave} className="w-8 aspect-square" alt="" />
          </h1>
          <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
            Welcome to our app
          </h2>
          <p className="mb-8 max-w-md">
            Let's start with a quick product tour and we will have you up and
            running in no time!
          </p>
          <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all cursor-pointer">
            Get Started
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-40">
          <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
        </div>
      )}
    </>
  );
};

export default Header;
