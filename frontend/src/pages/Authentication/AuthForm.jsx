import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row transition-all duration-700">
        {/* Left Side: Forms */}
        <div className={`w-full md:w-1/2 p-8 transition-transform duration-700 ${isSignUp ? "-translate-x-full md:translate-x-0" : ""}`}>
          <h1 className="font-alatsi text-3xl text-gray-800 text-center mb-6">
            {isSignUp ? "Welcome" : "Welcome Back"}  
          </h1>  
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>

          <form className="space-y-5">
            {isSignUp && (
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {isSignUp && (
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            )}

            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <span
              className="ml-2 text-indigo-600 cursor-pointer hover:underline font-medium"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </div>

        {/* Right Side: Message */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              {isSignUp ? "Join Us Today!" : "Welcome Back!"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isSignUp
                ? "Sign up and discover great opportunities."
                : "Sign in and continue your journey with us."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
