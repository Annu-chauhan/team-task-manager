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
        "http://localhost:5000/api/tasks",
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

      alert("Task Created");

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
          onChange={(e) =>
            setTitle(e.target.value)
          }
          style={{
            display: "block",
            width: "300px",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          style={{
            display: "block",
            width: "300px",
            height: "100px",
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
          Create Task
        </button>

      </form>

    </div>
  );
}

export default CreateTask;