"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, provider } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl mb-5 font-bold">Job Tracker</h1>
            <div className="flex flex-col gap-5 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-2xl font-semibold">Sign In</h1>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button className="w-full p-5" onClick={handleSignIn}>
                    {" "}
                    Sign In{" "}
                </Button>

                <Button className="w-full p-5 bg-sky-700 hover:bg-sky-300" onClick={handleGoogleSignIn}>
                    {" "}
                    Sign In with Google{" "}
                </Button>

                <p className="font-semibold">
                    {" "}
                    {`Don't have an account?`}
                    <span
                        onClick={() => router.push("/sign-up")}
                        className="cursor-pointer ml-2 font-bold hover:underline"
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
