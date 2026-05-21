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
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password,
          role: "admin",
        }
      );

      alert("Signup Successful");

      // REDIRECT TO LOGIN
      window.location.href = "/login";

    } catch (error) {

      console.log(error);

      if (error.response) {

        alert(error.response.data.message);

      } else {

        alert("Signup Failed");
      }
    }
  };

  return (

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >

      <form
        onSubmit={handleSignup}
        style={{
          width: "350px",
        }}
      >

        <h1>Signup</h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            border: "1px solid black",
            borderRadius: "5px",
          }}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            border: "1px solid black",
            borderRadius: "5px",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            border: "1px solid black",
            borderRadius: "5px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Signup
        </button>

      </form>

    </div>
  );
}

export default Signup;