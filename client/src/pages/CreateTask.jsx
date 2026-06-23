import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (e) {
      console.error(e);
      setToast({ message: "Failed to fetch projects list", type: "error" });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setToast({ message: "Task title is required", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/tasks`,
        {
          title,
          description,
          project: projectId || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setToast({ message: "Task created successfully!", type: "success" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to create task";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-dark-text relative overflow-hidden">
      <Navbar />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl -z-10" />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md p-8 rounded-2xl glass-panel relative border border-dark-border/80 shadow-2xl animate-fade-in">
          
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white">Create New Task</h2>
            <p className="text-sm text-dark-muted mt-1">
              Add a task to organize your daily workflows
            </p>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
                Task Title
              </label>
              <input
                type="text"
                placeholder="e.g. Update user documentation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl custom-input text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe details, requirements, or attachments..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl custom-input text-sm h-28 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
                Workspace / Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl custom-input text-sm bg-dark-bg"
              >
                <option value="">Personal (No Project)</option>
                {projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    📁 {proj.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 text-sm font-semibold rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl gradient-btn font-bold text-white shadow-lg active:scale-98 transition-all flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}

export default CreateTask;