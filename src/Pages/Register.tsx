import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

import "./Logins.css";

interface ErrorResponse {
  message: string;
}

function Register() {
  //Create all the states to manage the form input and  registering
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();

  const login = async () => {
    //Functionn is used to send a post request to register a user
    setLoading(true);
    setError("");

    //Set loading to true while the server is trying to log in the user
    if (password !== conpassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:7000/api/v1/users/signup",
        {
          username: user,
          password,
        }
      );

      console.log(res);
      setLoading(false);
      setError("");
      nav("/login");
      //As the user to log in with new account
    } catch (err: unknown) {
      console.error(err);
      setLoading(false);

      if (isAxiosError(err)) {
        const errorData = err.response?.data as ErrorResponse;
        setError(errorData.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const isAxiosError = (error: unknown): error is AxiosError => {
    return (error as AxiosError).isAxiosError !== undefined;
  };

  return (
    <div className="login-page">
      <p>Register Below</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>Username</label>
      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="input-field"
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <label>Confirm Password</label>
      <input
        className="input-field"
        type="password"
        value={conpassword}
        onChange={(e) => setConpassword(e.target.value)}
      />
      <div>
        <button
          onClick={login}
          className="login-button-class"
          disabled={loading}
        >
          {loading ? "Loading.." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default Register;
