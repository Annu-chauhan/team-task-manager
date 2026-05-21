import { useState } from "react";
import axios from "axios";

function CreateProject() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const handleCreateProject = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "https://team-task-manager-production-53bc.up.railway.app/api/projects",
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

      alert("Project Created Successfully");

      setTitle("");
      setDescription("");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Project Creation Failed"
      );
    }
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Create Project</h1>

      <form onSubmit={handleCreateProject}>

        <input
          type="text"
          placeholder="Project Title"
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
          placeholder="Project Description"
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
          Create Project
        </button>

      </form>

    </div>
  );
}

export default CreateProject;