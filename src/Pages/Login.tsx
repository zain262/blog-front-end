import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Logins.css";
import axios from "axios";
import UserContext from "../context";

function Login() {

  //Create all the states to manage the form input and logging in
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  //Get users context
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("useContext must be used within a UserProvider");
  }

  const { setUser: setUserContext } = userContext;

  const login = async () => {
    setLoading(true);
    setError("");
    //Set loading to true while the server is trying to log in the user
    try {

      const res = await axios.post(
        "http://localhost:7000/api/v1/users/login",
        {
          username: user,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      const loggedInUser = {
        id: res.data.id,
        role: res.data.role,
        username: user,
      };
      //Extract the users info from the response
      setUserContext(loggedInUser);
      //Set the context for global state
      nav("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const register = () => {
    nav("/register");
  };
  //If the user has no account they can register
  return (
    <div className="login-page">
      <p>Welcome! Please Log-in</p>
      <p>{error}</p>
      <label>Username</label>
      <input
        type="text"
        onChange={(e) => setUser(e.target.value)}
        className="input-field"
      />
      <label>Password</label>
      <input
        className="input-field"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button
          onClick={login}
          className="login-button-class"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
        <button onClick={register} className="login-button-class">
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
