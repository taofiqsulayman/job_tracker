import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import {
    collection,
    query,
    onSnapshot,
    where,
    Timestamp,
    addDoc,
    setDoc,
    doc,
    arrayUnion,
} from "firebase/firestore";
import { log } from "console";

type JobCounterProps = {
    user: string;
};

const JobCounter = ({ user }: JobCounterProps) => {
    const [count, setCount] = useState<number>(() => {
        const savedCount = localStorage.getItem("jobCount");
        return savedCount ? parseInt(savedCount, 10) : 0;
    });
    const [weeklyTotal, setWeeklyTotal] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [refreshPage, setRefreshPage] = useState(false);

    useEffect(() => {
        localStorage.setItem("jobCount", count.toString());
    }, [count]);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const saveCountToFireStore = async (
        user: string,
        date: Date,
        count: number
    ) => {
        const docRef = doc(
            db,
            "userJobCounts",
            date.toISOString().split("T")[0]
        );
        await setDoc(
            docRef,
            {
                user,
                date: Timestamp.fromDate(date),
                counts: arrayUnion(count),
            },
            { merge: true }
        );
        setCount(0);
    };

    const handleSave = () => {
        saveCountToFireStore(user, new Date(), count)
            .then(() => {
                alert("Count saved successfully.");
            })
            .catch((error) => {
                console.error("Error saving counts:", error);
                alert("Error saving counts.");
            });
        setRefreshPage(true);
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        console.log("user", user);

        const startOfWeek = Timestamp.fromDate(
            new Date(
                new Date().setDate(new Date().getDate() - new Date().getDay())
            )
        );
        const startOfMonth = Timestamp.fromDate(
            new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        );

        const q = query(
            collection(db, "userJobCounts"),
            where("user", "==", user),
            where("date", ">=", startOfMonth)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let countsArr: any[] = [];
            let weeklyCountsArr: any[] = [];

            console.log("querySnapshot", querySnapshot);

            querySnapshot.forEach((doc) => {
                const dailyCounts = doc.data().counts;
                const dailyTotal = dailyCounts.reduce(
                    (sum: any, count: any) => sum + count,
                    0
                );
                countsArr.push(dailyTotal);
                if (doc.data().date.toDate() >= startOfWeek.toDate()) {
                    weeklyCountsArr.push(dailyTotal);
                }
            });

            const monthlyTotal = countsArr.reduce(
                (sum, count) => sum + count,
                0
            );
            setMonthlyTotal(monthlyTotal);

            const weeklyTotal = weeklyCountsArr.reduce(
                (sum, count) => sum + count,
                0
            );
            setWeeklyTotal(weeklyTotal);
        });

        return () => unsubscribe();
    }, [refreshPage, user]);

    return (
        <div className="flex flex-col items-center justify-between space-y-4 w-full h-2/3 gap-16 dark:bg-black bg-white">
            <h2 className="text-2xl font-bold text-blue-500 dark:text-white">
                Number of Jobs Done
            </h2>
            <div className="flex items-center justify-center space-x-4 gap-4">
                <button
                    onClick={decrement}
                    className="px-16 py-10 bg-red-500 text-white rounded text-2xl font-bold"
                >
                    -
                </button>
                <p className="text-6xl font-bold dark:text-white">{count}</p>
                <button
                    onClick={increment}
                    className="px-16 py-10 bg-green-500 text-white rounded text-2xl font-bold"
                >
                    +
                </button>
            </div>
            <button
                onClick={handleSave}
                className="px-8 py-5 bg-blue-500 text-white rounded text-2xl font-bold"
            >
                Save Count
            </button>
            <div className="flex space-x-4">
                <div className="flex flex-col items-center justify-center bg-gray-200 p-4 rounded dark:bg-gray-800 dark:text-white">
                    <h3 className="text-xl font-bold text-blue-500 dark:text-white">
                        Weekly Total
                    </h3>
                    <p className="text-4xl font-bold dark:text-white">
                        {weeklyTotal}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-200 p-4 rounded dark:bg-gray-800 dark:text-white">
                    <h3 className="text-xl font-bold text-blue-500 dark:text-white">
                        Monthly Total
                    </h3>
                    <p className="text-4xl font-bold dark:text-white">
                        {monthlyTotal}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobCounter;
