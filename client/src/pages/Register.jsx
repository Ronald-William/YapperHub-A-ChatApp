import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/users/register", form);

      setUser(res.data);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-80 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Register</h2>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <input
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
        />

        <input
          name="username"
          placeholder="Username (unique)"
          required
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
        />

        <button
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
