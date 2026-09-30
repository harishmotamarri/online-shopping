import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import API from "../api";


function Login({ setUser }) {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const handleLogin = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    if (!email || !password) {

      setError(
        "Please enter email and password."
      );

      return;
    }


    try {

      const response = await fetch(
        `${API}/auth/signin`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Invalid email or password."
        );

      }


      /*
       * If backend returns:
       *
       * {
       *   user: {...}
       * }
       *
       * use data.user
       *
       * Otherwise use data directly.
       */

      const loggedUser =
        data.user || data;


      localStorage.setItem(
        "user",
        JSON.stringify(loggedUser)
      );


      setUser(loggedUser);


      setMessage(
        data.message ||
        "Login successful!"
      );


      setTimeout(() => {

        navigate("/");

      }, 500);


    } catch (err) {

      setError(
        err.message ||
        "Login failed."
      );

    }

  };


  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>
          🔐 Login
        </h1>


        <p className="auth-subtitle">
          Login to continue shopping
        </p>


        {message && (
          <div className="success-message">
            {message}
          </div>
        )}


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form
          onSubmit={handleLogin}
          className="auth-form"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          <button
            type="submit"
            className="primary-button"
          >
            Login
          </button>

        </form>


        <p className="auth-link">

          Don't have an account?{" "}

          <Link to="/signup">
            Signup
          </Link>

        </p>

      </div>

    </div>

  );

}


export default Login;