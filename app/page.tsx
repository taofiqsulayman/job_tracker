"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/app/firebase/config";
import CustomDatePicker from "./components/DatePicker";
import JobCounter from "./components/JobCounter";

export default function Home() {
    const [user, setUSer] = useState({});
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                sessionStorage.setItem("user", "true");
                setUSer(user);
            } else {
                sessionStorage.removeItem("user");
                router.push("/sign-in");
            }
        });
        return () => unsubscribe();
    }, [router]);

    return (
        <main className="flex min-h-screen flex-col items-center p-24 gap-20">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Welcome {user.displayName}
                </p>
                <button
                    onClick={() => auth.signOut()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>

            <div className="flex flex-col justify-center align-middle w-full">
                <JobCounter user={user.displayName} />
            </div>
        </main>
    );
}
