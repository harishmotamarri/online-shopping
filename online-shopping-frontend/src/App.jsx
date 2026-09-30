import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Cart from "./components/Cart";
import Orders from "./components/Orders";


function App() {

  const [user, setUser] = useState(null);


  // Get logged-in user from localStorage
  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {

      try {

        setUser(
          JSON.parse(savedUser)
        );

      } catch (error) {

        localStorage.removeItem("user");

      }

    }

  }, []);


  return (

    <BrowserRouter>

      <Navbar
        user={user}
        setUser={setUser}
      />


      <Routes>

        {/* Home / Products */}
        <Route
          path="/"
          element={
            <Products user={user} />
          }
        />


        {/* Login */}
        <Route
          path="/login"
          element={
            <Login
              setUser={setUser}
            />
          }
        />


        {/* Signup */}
        <Route
          path="/signup"
          element={
            <Signup />
          }
        />


        {/* Cart */}
        <Route
          path="/cart"
          element={
            <Cart user={user} />
          }
        />


        {/* Orders */}
        <Route
          path="/orders"
          element={
            <Orders user={user} />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;