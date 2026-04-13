import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import api from "../services/api";

const Login = ({onLogin}) =>{

    //Adding set states to componenets
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError("");
        setLoading(true);
    

        try{
            const response = await api.post("/auth/login", {email, password});

            //Saving token to local storage
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.data.user));

            //Sends a message to app.js that the user is authenticated
            if(onLogin) onLogin();

            navigate("/dashboard");
    
        }catch(error){
            setError(error.response.data?.message || "Login failed. Please try again.");
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark px-4">
            <div className="bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2"> Mzansi Builds</h1>
                    <p className="text-secondary">Please sign into your account</p>
                </div>


                {/*Error message */}
                {error && (
                    <div className="bg-red-600 text-white p-3 rounded-lg mb-4 text-sm"> 
                    {error}
                    </div>
                )}

                {/*Login form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        <label className= "block text-secondary mb-2">Password</label>

                        <input

                            type = "password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className = "w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                            placeholder = "Enter your password"
                            required

                        />
                    </div>

                    <button
                    type= "submit"
                    disabled = {loading}
                    className="w-full bg-primary text-dark font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                    >

                        {loading ? "Signing in...": "Sign In"}

                    </button>

                </form>

                {/*Register Link */}
                <p className = "text-center text-gray-400 mt-6 text-sm">
                    Don't have an ancount?{" "}
                    <Link to="/register" className= "text-primary hover:underline">
                    Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;





