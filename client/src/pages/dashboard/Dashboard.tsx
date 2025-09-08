import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  console.log("User data:", user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="flex justify-between items-center p-6 bg-white shadow-sm">
          Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content Wrapper */}
      <div className="flex">
        <nav className="w-80 bg-gray-100 min-h-screen p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="block p-2 hover:bg-gray-200 rounded mb-2"
              >
                Overview
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/projects"
                className="block p-2 hover:bg-gray-200 rounded mb-2"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/users"
                className="block p-2 hover:bg-gray-200 rounded mb-2"
              >
                All Users
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <p className="text-gray-600 mb-2">Total Projects: Coming Soon</p>
            <p className="text-gray-600 mb-2">Total Users: Coming Soon</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
