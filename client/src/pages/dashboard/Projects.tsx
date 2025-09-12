import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Projects = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Test Project",
      description: "Test description",
      platform: "web",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-900">Welcome, {user?.email}</span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>
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
                className="block p-2 hover:bg-gray-200 rounded mb-2 bg-gray-200"
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
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Projects</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Create Project
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            {isLoading && (
              <div className="flex justify-center items-center p-8">
                <p className="text-gray-500">Loading projects...</p>
              </div>
            )}
            {!isLoading && projects.length === 0 && (
              <div className="text-center p-8">
                <p className="text-gray-500 text-lg">No projects yet</p>
                <p className="text-gray-400 text-sm">
                  Create your first project to get started with authentication
                  management
                </p>
              </div>
            )}
            {!isLoading && projects.length > 0 && (
              <table className="min-w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-4 text-left text-sm font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-3 py-4 text-left text-sm font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-3 py-4 text-left text-sm font-medium text-gray-500 uppercase">
                      Platform
                    </th>
                    <th className="px-3 py-4 text-left text-sm font-medium text-gray-500 uppercase">
                      Users
                    </th>
                    <th className="px-3 py-4 text-left text-sm font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-3 py-4 text-base text-gray-900 font-medium">
                        {project.name}
                      </td>
                      <td
                        className={
                          project.description
                            ? "px-3 py-4 text-base text-gray-900"
                            : "px-3 py-4 text-base text-gray-500 italic"
                        }
                      >
                        {project.description || "No description"}
                      </td>
                      <td className="px-3 py-4 text-base text-gray-900 capitalize">
                        {project.platform}
                      </td>
                      <td className="px-3 py-4 text-base text-gray-500">
                        {project._count?.users || 0}
                      </td>
                      <td className="px-3 py-4 text-base text-gray-900">
                        <div className="flex gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer">
                            Edit
                          </button>
                          <button className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors cursor-pointer">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;
