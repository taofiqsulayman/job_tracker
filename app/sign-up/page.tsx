"use client";
import { auth } from "@/app/firebase/config";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [createUserWithEmailAndPassword] =
        useCreateUserWithEmailAndPassword(auth);

const handleSignUp = async () => {
    createUserWithEmailAndPassword(email, password)
        .then((response) => {
            if (response?.user) {
                sessionStorage.setItem("user", "true");
                setEmail("");
                setPassword("");
                router.push("/sign-in");
            } else {
                alert('Something went wrong, try again later')
            }
        })
};

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl mb-5 font-bold">Job Tracker</h1>
            <div className="p-10 flex flex-col gap-5 rounded-lg shadow-xl w-96">
                <h1 className="text-2xl font-semibold">Sign Up</h1>
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

                <Button className="w-full" onClick={handleSignUp}>
                    Sign Up
                </Button>

                <p className="text-center font-semibold">
                    Already have an account?{" "}
                    <a
                        href="/sign-in"
                        className="font-bold hover:underline"
                    >
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
