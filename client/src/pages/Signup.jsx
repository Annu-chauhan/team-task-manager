import { useState } from "react";
import axios from "axios";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "https://team-task-manager-production-53bc.up.railway.app/api/auth/signup",
        {
          name,
          email,
          password,
          role: "admin",
        }
      );

      alert("Signup Successful");

      window.location.href = "/login";

    } catch (error) {

      console.log(error);

      alert("Signup Failed");
    }
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Signup</h1>

      <form onSubmit={handleSignup}>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            display: "block",
            width: "300px",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: "block",
            width: "300px",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            display: "block",
            width: "300px",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Signup
        </button>

        <button
  onClick={() => window.location.href = "/login"}
  style={{
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  ← Go to Login
</button>

      </form>

    </div>
  );
}

export default Signup;