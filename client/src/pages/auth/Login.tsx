import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  /* Set the state variables for the form --> 
  [email, password, error, isLoading]
  This is to store any use input, message, or tracking
  */
  /* Get functions from provider file {specifically login}
  including navigate to redirect users after login
  */
  /* Create the form submit handler (call it handleSubmit)
  Make sure to prevent page from refreshing, and to change the state
  of isLoading, and set the error
  This will be an async function with an event
  Implement a try/catch/finally 
  DO NOT FORGET TO CHANGE THE STATE OF ISLOADING
  */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth(); // Gets function from provider
  const navigate = useNavigate(); // Used to redirect user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Sets loading state to true after submission
    setError("");

    try {
      await login(email, password); // Calls our provider login function
      navigate("/dashboard"); // Redirects to dashboard after successful login
    } catch {
      setError("Login failed. Please check your credentials");
    } finally {
      setIsLoading(false); // Sets loading state back to false
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email} // Shows the current email state
            onChange={(e) => setEmail(e.target.value)} // Updates the email state when user types
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Updates state of password when user types
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        {error && ( // Only show the error div if there's actually an error message
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "106%",
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
