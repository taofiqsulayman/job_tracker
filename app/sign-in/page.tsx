"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, provider } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            const res = await signInWithEmailAndPassword(email, password);
            console.log({ res });
            sessionStorage.setItem("user", 'true');
            setEmail("");
            setPassword("");
            router.push("/");
        } catch (e) {
            console.error(e);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const res = await signInWithPopup(auth, provider);
            sessionStorage.setItem("user", "true");
            router.push("/");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
            <h1 className="text-white text-3xl mb-5">Job Tracker</h1>
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign In</h1>
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
                    onClick={handleSignIn}
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                >
                    Sign In
                </button>
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full p-3 bg-red-600 rounded text-white hover:bg-red-500 mt-4"
                >
                    Sign In with Google
                </button>
                <p className="text-white mt-4"> {`Don't have an account?`}
                    <span
                        onClick={() => router.push('/sign-up')}
                        className="text-blue-500 hover:text-blue-400 cursor-pointer ml-2"
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
