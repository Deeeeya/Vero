import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "react-router-dom";
import api from "@/services/api";
import type { Project } from "@/types/projects";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProjectDetails = () => {
  // Type tells TypeScript exactly what shape my project data has
  const [project, setProject] = useState<Project | null>(null); // null represents no data loaded yet
  const [isLoading, setIsLoading] = useState(true); // initialize with true because component will immediately start loading data
  const [error, setError] = useState(""); // when api call fails, update this with error message

  const { id } = useParams(); // this hook returns an object containing all dynamic params from current URL
  const { user, logout } = useAuth(); // gets user and logout function (user to display email in header and logout for logout button in header)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // response variable will contain the HTTP response with project data
        const response = await api.get("/api/projects/" + id); // constructs the full URL like "/api/projects/abc123"
        setProject(response.data.project); // backend controller returns an object with a "project" property containing the project data
        setIsLoading(false); // tells UI that loading is complete and it should show the data
      } catch {
        setError("API Call Failed");
        setIsLoading(false); // Loading spinner stops even when there is an error
      }
    };
    fetchProjectDetails();
  }, [id]); // array means "runs this once the component mounts", automatically fetching project data as soon as the page loads or when the id changes (navigating to a different project)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {project != null ? project.name : "Project Details"}
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-900">Welcome, {user?.email}</span>
          <Button onClick={logout}>Logout</Button>
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
        <main className="flex-1 p-6">
          {isLoading && (
            <div className="flex justify-center items-center p-8">
              <p className="text-gray-500">Loading project details...</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="text-center p-8">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          )}
          {!isLoading && project && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {project.name}
                </h2>
                {project?.description && (
                  <p className="text-gray-600 mt-1">{project?.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Platform
                  </p>
                  <p className="text-base text-gray-900 capitalize">
                    {project.platform}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Access Token TTL
                  </p>
                  <p className="text-base text-gray-900">
                    {project.accessTTL} seconds
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Refresh Token TTL
                  </p>
                  <p className="text-base text-gray-900">
                    {project.refreshTTL} seconds
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Single Session
                  </p>
                  <p className="text-base text-gray-900">
                    {project.singleSession ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total Users
                  </p>
                  <p className="text-base text-gray-900">
                    {project._count?.users || 0}
                  </p>
                </div>
              </div>
              <div className="border-top border-gray-200 mt-6 pt-6">
                <div className="flex justify-end gap-3">
                  <Button onClick={} variant="outline">
                    Edit Project
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;
