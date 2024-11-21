import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { useState } from "react";
import Home from "./components/Home";
import SignInAgent from "./components/SignInAgent";
import AdminPanel from "./components/AdminPanel";
import AdminSignIn from "./components/AdminSignIn";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState({});
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin-signin"
            element={<AdminSignIn isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
          />
          <Route
            path="/admin"
            element={<AdminPanel isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
          />
          <Route
            path="/signin"
            element={
              <SignIn
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                userData={userData}
                setUserData={setUserData}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUp
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                userData={userData}
                setUserData={setUserData}
              />
            }
          />
          <Route
            path="/"
            element={
              <Home
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                userData={userData}
              />
            }
          />
          <Route
            path="/signin-agent"
            element={
              <SignInAgent
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
