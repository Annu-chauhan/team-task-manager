import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import Modal from "../components/Modal";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // null means "All Workspaces"
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Form States
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskProjId, setTaskProjId] = useState(""); // selected project for new task
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const token = localStorage.getItem("token");

  // Get current user role/id
  let currentUser = null;
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) currentUser = JSON.parse(savedUser);
  } catch (e) {
    console.error(e);
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Whenever selectedProject changes, fetch tasks for that scope
  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProjects(), fetchTasks()]);
    } catch (e) {
      console.error(e);
      setToast({ message: "Error loading initial dashboard data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const url = selectedProject
        ? `${API_URL}/api/tasks?project=${selectedProject._id}`
        : `${API_URL}/api/tasks`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to fetch tasks", type: "error" });
    }
  };

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to fetch projects", type: "error" });
    }
  };

  // CREATE TASK
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setToast({ message: "Task title is required", type: "error" });
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/tasks`,
        {
          title: taskTitle,
          description: taskDesc,
          project: taskProjId || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setToast({ message: "Task created successfully!", type: "success" });
      setTaskTitle("");
      setTaskDesc("");
      setTaskProjId("");
      setIsTaskModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to create task";
      setToast({ message: msg, type: "error" });
    }
  };

  // CREATE PROJECT
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      setToast({ message: "Project title is required", type: "error" });
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/projects`,
        {
          title: projectTitle,
          description: projectDesc,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setToast({ message: "Project created successfully!", type: "success" });
      setProjectTitle("");
      setProjectDesc("");
      setIsProjectModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to create project";
      setToast({ message: msg, type: "error" });
    }
  };

  // INVITE MEMBER
  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedProject) return;

    setInviting(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/projects/${selectedProject._id}/members`,
        { email: inviteEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setToast({ message: "Member added to project!", type: "success" });
      setInviteEmail("");
      
      // Update selected project structure
      setSelectedProject(res.data);
      fetchProjects();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to invite member";
      setToast({ message: msg, type: "error" });
    } finally {
      setInviting(false);
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (id, currentStatus) => {
    let nextStatus = "pending";
    if (currentStatus === "pending") nextStatus = "in-progress";
    else if (currentStatus === "in-progress") nextStatus = "completed";

    try {
      await axios.put(
        `${API_URL}/api/tasks/${id}`,
        { status: nextStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchTasks();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Unauthorized to update task";
      setToast({ message: msg, type: "error" });
    }
  };

  // REOPEN TASK (Move back to in-progress)
  const handleReopenTask = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/tasks/${id}`,
        { status: "in-progress" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchTasks();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Unauthorized to update task";
      setToast({ message: msg, type: "error" });
    }
  };

  // CONFIRM DELETE TASK
  const triggerDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToast({ message: "Task deleted successfully", type: "success" });
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Unauthorized to delete task";
      setToast({ message: msg, type: "error" });
      setIsDeleteModalOpen(false);
    }
  };

  // Calculate statistics for tasks loaded in current view
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-dark-text relative">
      <Navbar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Main Dashboard Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
          {/* Workspaces & Projects */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                Workspaces
              </h2>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="p-1 rounded bg-white/5 hover:bg-indigo-500/20 text-indigo-400 hover:text-white transition-all text-xs font-semibold cursor-pointer"
                title="Create Project"
              >
                ＋ New
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedProject(null)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  selectedProject === null
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-dark-text/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                🌐 All Workspaces
              </button>

              {projects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all truncate flex items-center justify-between cursor-pointer ${
                    selectedProject?._id === project._id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-dark-text/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="truncate">📁 {project.title}</span>
                  <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-full border border-white/5">
                    {project.members.length}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Project Details / Members Management (Only when a project is selected) */}
          {selectedProject && (
            <div className="p-5 rounded-2xl glass-panel flex flex-col gap-4 animate-fade-in">
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Project Info
                </h3>
                <p className="text-xs text-dark-muted mt-2 leading-relaxed">
                  {selectedProject.description || "No description provided."}
                </p>
              </div>

              <div className="border-t border-dark-border/40 pt-4">
                <h3 className="text-xs font-bold text-dark-text uppercase tracking-wider mb-3">
                  Members ({selectedProject.members.length})
                </h3>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                  {selectedProject.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between text-xs p-2 rounded bg-black/15 border border-white/5"
                    >
                      <span className="font-medium truncate" title={member.email}>
                        {member.name}
                      </span>
                      {selectedProject.admin?._id === member._id && (
                        <span className="text-[9px] uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Invitation Form (Only Project Admin can invite) */}
              {selectedProject.admin?._id === currentUser?.id && (
                <form
                  onSubmit={handleInviteMember}
                  className="border-t border-dark-border/40 pt-4 flex flex-col gap-2"
                >
                  <label className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">
                    Invite Member
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      disabled={inviting}
                      className="flex-1 px-3 py-1.5 rounded-lg custom-input text-xs"
                    />
                    <button
                      type="submit"
                      disabled={inviting}
                      className="px-3 py-1.5 rounded-lg gradient-btn text-xs font-bold text-white cursor-pointer"
                    >
                      Invite
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </aside>

        {/* WORKSPACE AREA */}
        <main className="flex-1 flex flex-col gap-8">
          
          {/* Workspace Title & Create Task */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                {selectedProject ? selectedProject.title : "Global Dashboard"}
              </h1>
              <p className="text-sm text-dark-muted mt-1">
                {selectedProject
                  ? "Project workspace task workflow"
                  : "Overview of all tasks across your workspaces"}
              </p>
            </div>

            <button
              onClick={() => {
                if (selectedProject) {
                  setTaskProjId(selectedProject._id);
                }
                setIsTaskModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl gradient-btn font-bold text-white text-sm shadow-lg shadow-indigo-500/20 hover:scale-102 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>＋</span> Create Task
            </button>
          </div>

          {/* Statistics Grid */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl glass-panel border border-dark-border/50">
              <span className="text-xs text-dark-muted font-semibold uppercase tracking-wider">Total Tasks</span>
              <p className="text-2xl font-black text-white mt-1">{totalTasks}</p>
            </div>
            
            <div className="p-4 rounded-xl glass-panel border border-dark-border/50 border-l-amber-500/40">
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Pending</span>
              <p className="text-2xl font-black text-white mt-1">{pendingTasks.length}</p>
            </div>

            <div className="p-4 rounded-xl glass-panel border border-dark-border/50 border-l-indigo-500/40">
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">In Progress</span>
              <p className="text-2xl font-black text-white mt-1">{inProgressTasks.length}</p>
            </div>

            <div className="p-4 rounded-xl glass-panel border border-dark-border/50 border-l-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Completed</span>
              <p className="text-2xl font-black text-white mt-1">{completedTasks.length}</p>
            </div>
          </section>

          {/* KANBAN BOARD */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
              <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm text-dark-muted font-medium">Loading workspace board...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
              
              {/* PENDING COLUMN */}
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-black/15 border border-dark-border/40 min-h-[450px]">
                <div className="flex justify-between items-center px-1 border-b border-dark-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-dark-text">Pending</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {pendingTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3.5">
                  {pendingTasks.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-dark-border/30 rounded-xl text-xs text-dark-muted">
                      No pending tasks
                    </div>
                  ) : (
                    pendingTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={triggerDeleteTask}
                        currentUser={currentUser}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* IN PROGRESS COLUMN */}
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-black/15 border border-dark-border/40 min-h-[450px]">
                <div className="flex justify-between items-center px-1 border-b border-dark-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-dark-text">In Progress</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {inProgressTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3.5">
                  {inProgressTasks.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-dark-border/30 rounded-xl text-xs text-dark-muted">
                      No in-progress tasks
                    </div>
                  ) : (
                    inProgressTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={triggerDeleteTask}
                        currentUser={currentUser}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* COMPLETED COLUMN */}
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-black/15 border border-dark-border/40 min-h-[450px]">
                <div className="flex justify-between items-center px-1 border-b border-dark-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-dark-text">Completed</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {completedTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3.5">
                  {completedTasks.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-dark-border/30 rounded-xl text-xs text-dark-muted">
                      No completed tasks
                    </div>
                  ) : (
                    completedTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onReopen={handleReopenTask}
                        onDelete={triggerDeleteTask}
                        currentUser={currentUser}
                      />
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* CREATE TASK MODAL */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Refactor database queries"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl custom-input text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Describe the objective and requirements of the task..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl custom-input text-sm h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
              Associate Project Workspace
            </label>
            <select
              value={taskProjId}
              onChange={(e) => setTaskProjId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl custom-input text-sm bg-dark-bg"
            >
              <option value="">Personal Workspace (No Project)</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  📁 {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-dark-muted hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gradient-btn text-xs font-bold text-white cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE PROJECT MODAL */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Website Redesign"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl custom-input text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Short summary of project scope..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl custom-input text-sm h-24 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-dark-muted hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gradient-btn text-xs font-bold text-white cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE TASK CONFIRM MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        title="Delete Task?"
      >
        <div className="space-y-4">
          <p className="text-sm text-dark-muted leading-relaxed">
            Are you sure you want to delete task <strong className="text-white">"{taskToDelete?.title}"</strong>? This action is permanent and cannot be undone.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setTaskToDelete(null);
              }}
              className="px-4 py-2 text-xs font-bold text-dark-muted hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 border border-rose-500/25 hover:border-transparent text-rose-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// INTERNAL TASK CARD COMPONENT
function TaskCard({ task, onStatusChange, onReopen, onDelete, currentUser }) {
  // Check ownership
  const ownsTask = task.user?._id === currentUser?.id || task.user === currentUser?.id;
  const isCompleted = task.status === "completed";

  return (
    <div className="w-full p-4 rounded-xl border border-dark-border/60 bg-dark-card hover:border-dark-border transition-all flex flex-col gap-3 group shadow-md hover:shadow-lg">
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors leading-tight">
          {task.title}
        </h4>
        
        {ownsTask && (
          <button
            onClick={() => onDelete(task)}
            className="text-xs text-dark-muted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer"
            title="Delete task"
          >
            🗑
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-dark-muted leading-relaxed truncate-2-lines">
          {task.description}
        </p>
      )}

      {/* Tags and Dates */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dark-border/40 mt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {task.project ? (
            <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 max-w-[100px] truncate" title={`Project: ${task.project.title}`}>
              📁 {task.project.title}
            </span>
          ) : (
            <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-white/5 text-dark-muted border border-white/5">
              Personal
            </span>
          )}
          
          <span className="text-[9px] font-medium text-dark-muted">
            By {task.user?.name || "Me"}
          </span>
        </div>

        {/* Action button based on status */}
        {ownsTask && (
          <div className="flex items-center">
            {isCompleted ? (
              <button
                onClick={() => onReopen(task._id)}
                className="text-[10px] font-bold px-2 py-1 bg-white/5 hover:bg-white/10 text-indigo-400 hover:text-white rounded border border-white/5 transition-all cursor-pointer"
                title="Move task back to In Progress"
              >
                ↩ Reopen
              </button>
            ) : (
              <button
                onClick={() => onStatusChange(task._id, task.status)}
                className="text-[10px] font-bold px-2.5 py-1 gradient-btn text-white rounded shadow transition-all cursor-pointer flex items-center gap-1"
                title={task.status === "pending" ? "Move to In Progress" : "Mark as Completed"}
              >
                <span>➔</span> {task.status === "pending" ? "Work" : "Done"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;