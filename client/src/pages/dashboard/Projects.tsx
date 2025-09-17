import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import api from "../../services/api";
import type { Project } from "../../types/projects";
import { Button } from "@/components/ui/button";
type MyState = string | null;

const Projects = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<MyState>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "all",
    accessTTL: 900,
    refreshTTL: 43200,
    singleSession: false,
  });

  const fetchProjects = async () => {
    try {
      const response = await api.get("/api/projects");
      setProjects(response.data.projects);
      setIsLoading(false);
    } catch {
      setError("Failed to load projects");
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      await api.post("/api/projects", formData);
      fetchProjects();
      setShowCreateModal(false);
      setFormData({
        name: "",
        description: "",
        platform: "all",
        accessTTL: 900,
        refreshTTL: 43200,
        singleSession: false,
      });
    } catch {
      setError("Failed to submit form");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    try {
      setDeletingProjectId(projectId);
      const userChoice = window.confirm(
        "Are you sure you want to delete this project?"
      );
      if (userChoice) {
        await api.delete("/api/projects/" + projectId);
        fetchProjects();
      } else {
        setDeletingProjectId(null);
        return;
      }
    } catch {
      setError("Failed to delete project.");
    } finally {
      setDeletingProjectId(null);
    }
  };

  console.log(projects);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-900">Welcome, {user?.email}</span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors cursor-pointer"
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
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            >
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
                          <button
                            onClick={() => {
                              handleDeleteProject(project.id);
                            }}
                            className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors cursor-pointer"
                          >
                            {deletingProjectId === project.id
                              ? "Deleting..."
                              : "Delete"}
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
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Project
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
              >
                X
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-offset-2 focus:outline-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md min-h-24 resize-y focus:border-blue-500 focus:outline-offset-2 focus:outline-blue-500"
                  ></textarea>
                </div>
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-7000 block mb-2">
                    Platform
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:border-blue-500 focus:outline-blue-500 focus:outline-offset-2"
                  >
                    <option value="all">All Platforms</option>
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                  </select>
                </div>
                <div className="flex justify-center gap-5 mt-6">
                  <Button
                    variant="outline"
                    className=""
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
