'use client'
import { auth } from "@/app/firebase/config";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useState } from "react";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [createUserWithEmailAndPassword] =
        useCreateUserWithEmailAndPassword(auth);

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(email, password);
            sessionStorage.setItem("user", "true");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
            <h1 className="text-white text-3xl mb-5">Job Tracker</h1>
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign Up</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <button
                    onClick={handleSignUp}
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                >
                    Sign Up
                </button>
                <p className="text-white text-center mt-4">
                    Already have an account?{" "}
                    <a
                        href="/sign-in"
                        className="text-indigo-600 hover:text-indigo-500"
                    >
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
