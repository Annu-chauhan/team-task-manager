import { useState } from "react";
import axios from "axios";

function CreateTask() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const handleCreateTask = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "https://team-task-manager-production-53bc.up.railway.app/api/tasks",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task Created Successfully");

      setTitle("");
      setDescription("");

    } catch (error) {

      console.log(error);

      alert("Task Creation Failed");
    }
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Create Task</h1>

      <form onSubmit={handleCreateTask}>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            display: "block",
            width: "300px",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            display: "block",
            width: "300px",
            height: "100px",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "20px",
          }}
        >

          <button
            type="submit"
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, #000000, #434343)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            Create Task
          </button>

          <button
            type="button"
            onClick={() => window.location.href = "/dashboard"}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            ← Back to Dashboard
          </button>

        </div>

      </form>

    </div>
  );
}

export default CreateTask;