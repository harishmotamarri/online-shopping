import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import API from "../api";


function Signup() {

  const navigate = useNavigate();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const handleSignup = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    if (
      !name ||
      !email ||
      !password
    ) {

      setError(
        "Please fill all fields."
      );

      return;
    }


    try {

      const response = await fetch(
        `${API}/auth/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name: name,
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
          "Signup failed."
        );

      }


      setMessage(
        data.message ||
        "Signup successful!"
      );


      setName("");
      setEmail("");
      setPassword("");


      setTimeout(() => {

        navigate("/login");

      }, 1200);


    } catch (err) {

      setError(
        err.message ||
        "Signup failed."
      );

    }

  };


  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>
          📝 Signup
        </h1>


        <p className="auth-subtitle">
          Create a new account
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
          onSubmit={handleSignup}
          className="auth-form"
        >

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


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
            Signup
          </button>

        </form>


        <p className="auth-link">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}


export default Signup;