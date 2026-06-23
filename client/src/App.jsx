import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import CreateProject from "./pages/CreateProject.jsx";
import Navbar from "./components/Navbar.jsx";

// Route Guard for authenticated pages
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// Route Guard to prevent logged-in users from accessing Login/Signup
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-dark-text">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-8 animate-fade-in">
            ✨ Next Generation Task Management
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 animate-fade-in leading-tight max-w-2xl">
            Streamline Collaboration, Achieve <span className="gradient-text">Massive Goals</span>
          </h1>
          
          <p className="text-lg text-dark-muted max-w-xl mb-12 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Align your team's efforts, organize tasks into clean workspaces, and track real-time project statistics on a beautifully unified dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Link to="/signup">
              <button className="px-8 py-3.5 rounded-xl gradient-btn font-bold text-white shadow-xl hover:scale-105 active:scale-95 transition-all w-48 cursor-pointer">
                Get Started Free
              </button>
            </Link>
            
            <Link to="/login">
              <button className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-white transition-all w-48 cursor-pointer">
                View Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Grid Preview */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 w-full">
          <div className="p-6 rounded-2xl glass-panel text-left flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-400">
              📋
            </div>
            <h3 className="text-lg font-bold text-white">Kanban Workspace</h3>
            <p className="text-sm text-dark-muted leading-relaxed">
              Visualize task workflows from Pending to Completed using an interactive board structure.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel text-left flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center font-bold text-cyan-400">
              👥
            </div>
            <h3 className="text-lg font-bold text-white">Team Workspaces</h3>
            <p className="text-sm text-dark-muted leading-relaxed">
              Create dedicated projects, add team members by email, and organize tasks collectively.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel text-left flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-bold text-emerald-400">
              📊
            </div>
            <h3 className="text-lg font-bold text-white">Realtime Analytics</h3>
            <p className="text-sm text-dark-muted leading-relaxed">
              Keep tabs on team progress with clean graphs and statistics updated instantly.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-xs text-dark-muted border-t border-dark-border/40">
        &copy; {new Date().getFullYear()} TeamTask. Built for high performance teams.
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;