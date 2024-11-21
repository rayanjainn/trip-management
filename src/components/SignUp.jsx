import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = ({ isLoggedIn, setIsLoggedIn, userData, setUserData }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle sign up logic here
    const data = {
      username: username,
      email: email,
      phonenum: phoneNumber,
      password: password,
    };
    const response = await fetch("http://localhost:3000/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (responseData.message === "User registered successfully") {
      setUserData(responseData.data);
      setIsLoggedIn(true);
      navigate("/");
    } else {
      console.log("Sign up failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-teal-500">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Join the Adventure!
          </h2>
          <p className="text-gray-600 mb-8">
            Sign up to start planning your dream trips
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By signing up, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a
              onClick={() => navigate("/signin")}
              className="text-blue-500 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/signin-agent")}
            className="text-sm text-blue-500 hover:underline focus:outline-none"
          >
            Sign in as Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
