import { useState } from "react";
import {useNavigate, Link} from "react-router-dom";
import api from "../services/api";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e) =>{

        e.preventDefault();
        setError("");

        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6){
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
    

        try{
            const response = await api.post("/auth/register", {username, email, password});

            //Save token to local storage
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.data.user));

            navigate("/dashboard");
        }catch(err){
            setError(err.response?.data?.message || "Registration failed. Please try again");
        }finally{
            setLoading(false);
        }};

    return(

        <div className="min-h-screen flex items-center justify-center bg-dark px-4">
            <div className="bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">MzansiBuilds</h1>
                    <p className="text-secondary">Create your account</p>
                </div>

                {/* Error Message */}
                {error && (
                <div className="bg-red-600 text-white p-3 rounded-lg mb-4 text-sm">
                {error}
            </div>
            )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-secondary mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="block text-secondary mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-secondary mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div>
            <label className="block text-secondary mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-dark font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
    );
}
    
    

export default Register;