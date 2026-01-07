import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    const lastIndex = pasteArray.length - 1;
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      {/* enter email id */}
      <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset password
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter your registered email address.
        </p>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.mail_icon} alt="" className="w-3 h-3" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email id"
            className="bg-transparent outline-none text-white"
            required
          />
        </div>

        <button className="w-full py-2.5 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer mt-3 tracking-wide shadow-md hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg hover:scale-95 transition-all duration-500">
          Verify Email
        </button>
      </form>



      //for adding the otp
      <form
        // onSubmit={}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset password OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email id.
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button className="w-full py-2.5 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer tracking-wide shadow-md hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg hover:scale-95 transition-all duration-500">
          Submit
        </button>
      </form>



      //enter new password
      <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          New password
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the new password below
        </p>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.lock_icon} alt="" className="w-3 h-3" />
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            type="password"
            placeholder="Password"
            className="bg-transparent outline-none text-white"
            required
          />
        </div>

        <button className="w-full py-2.5 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer mt-3 tracking-wide shadow-md hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg hover:scale-95 transition-all duration-500">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
