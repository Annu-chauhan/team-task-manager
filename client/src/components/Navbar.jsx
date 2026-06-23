import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Basic User parsing from localStorage
  let user = null;
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      user = JSON.parse(savedUser);
    }
  } catch (e) {
    console.error(e);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border/80 bg-dark-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl gradient-btn flex items-center justify-center font-bold text-white shadow-indigo-500/20 shadow-md">
            T
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Team<span className="gradient-text">Task</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {token ? (
            <>
              <div className="hidden sm:flex items-center gap-3 pr-2">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-semibold text-indigo-400 text-sm">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="text-sm font-medium text-dark-text opacity-90">{user?.name || "User"}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-dark-text/90 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold rounded-xl gradient-btn text-white shadow-lg cursor-pointer"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
