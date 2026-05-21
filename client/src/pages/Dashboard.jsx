import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {

  const [tasks, setTasks] = useState([]);

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {

    fetchTasks();
    fetchStats();

  }, []);

  // FETCH TASKS
  const fetchTasks = async () => {

    try {

      const res = await axios.get(
        "https://team-task-manager-production-53bc.up.railway.app/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // FETCH DASHBOARD STATS
  const fetchStats = async () => {

    try {

      const res = await axios.get(
        "https://team-task-manager-production-53bc.up.railway.app/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id) => {

    try {

      await axios.put(
        `https://team-task-manager-production-53bc.up.railway.app/api/tasks/${id}`,
        {
          status: "completed",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
      fetchStats();

    } catch (error) {

      console.log(error);
    }
  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>

        <Link to="/create-project">

          <button
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Create Project
          </button>

        </Link>

        <Link to="/create-task">

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
            Create Task
          </button>

        </Link>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

      </div>

      <div
        style={{
          marginBottom: "30px",
          border: "1px solid black",
          padding: "20px",
          borderRadius: "5px",
        }}
      >

        <h2>Task Statistics</h2>

        <p>Total Tasks: {stats.totalTasks}</p>

        <p>Completed Tasks: {stats.completedTasks}</p>

        <p>Pending Tasks: {stats.pendingTasks}</p>

        <p>In Progress Tasks: {stats.inProgressTasks}</p>

      </div>

      <h2>All Tasks</h2>

      {
        tasks.length === 0 ? (

          <p>No Tasks Found</p>

        ) : (

          tasks.map((task) => (

            <div
              key={task._id}
              style={{
                border: "1px solid black",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "5px",
              }}
            >

              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <p>
                Status:
                {" "}
                <b>{task.status}</b>
              </p>

              <button
                onClick={() =>
                  updateStatus(task._id)
                }
                style={{
                  padding: "8px 15px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Mark Completed
              </button>

            </div>
          ))
        )
      }

    </div>
  );
}

export default Dashboard;