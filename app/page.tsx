"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/app/firebase/config";
import JobCounter from "./components/JobCounter";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/theme-toggler";

export default function Home() {
    const [user, setUSer] = useState<User | null>(null);
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
        <main className="flex flex-col items-center p-24 gap-10">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                <div className="flex items-center justify-center gap-4">
                    <Avatar>
                        <AvatarImage src={`https://robohash.org/${Math.floor(Math.random() * 10)}`} />
                        <AvatarFallback>{user?.displayName}</AvatarFallback>
                    </Avatar>

                    <p className="font-bold text-xl"> Welcome: {user?.displayName}</p>
                </div>

                <ModeToggle />

                <Button onClick={() => auth.signOut()}>Logout</Button>
            </div>

            <div className="flex flex-col justify-center align-middle w-full">
                <JobCounter user={user?.displayName || ""} />
            </div>
        </main>
    );
}
