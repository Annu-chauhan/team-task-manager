import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import CreateProject from "./pages/CreateProject.jsx";

function Home() {

  return (

    <div style={{ padding: "40px" }}>

      <h1>Team Task Manager</h1>

      <div style={{ marginTop: "20px" }}>

        <Link to="/signup">

          <button
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Signup
          </button>

        </Link>

        <Link to="/login">

          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>

        </Link>

      </div>

    </div>
  );
}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/create-task"
          element={<CreateTask />}
        />

        <Route
          path="/create-project"
          element={<CreateProject />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;