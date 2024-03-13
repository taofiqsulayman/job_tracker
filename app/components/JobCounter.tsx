import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import {
    collection,
    query,
    onSnapshot,
    where,
    Timestamp,
    setDoc,
    doc,
    arrayUnion,
    getDoc,
} from "firebase/firestore";

type JobCounterProps = {
    user: string;
};

const JobCounter = ({ user }: JobCounterProps) => {
    const [count, setCount] = useState(0);
    const [dailyTotal, setDailyTotal] = useState(0);
    const [weeklyTotal, setWeeklyTotal] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [refreshPage, setRefreshPage] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (event: {
        target: { value: string | number | Date };
    }) => {
        setSelectedDate(new Date(event.target.value));
    };

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
        saveCountToFireStore(user, selectedDate, count)
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
        localStorage.setItem("jobCount", count.toString());
    }, [count]);

    useEffect(() => {
        const fetchDailyTotal = async () => {
            if (!user) {
                return;
            }

            const selectedDateString = selectedDate.toISOString().split("T")[0];
            const docRef = doc(db, "userJobCounts", selectedDateString);

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const dailyCounts = docSnap.data().counts;
                const dailyTotal = dailyCounts.reduce(
                    (sum: any, count: any) => sum + count,
                    0
                );
                setDailyTotal(dailyTotal);
            } else {
                setDailyTotal(0);
            }
        };

        if (!user) {
            return;
        }

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

        fetchDailyTotal();
        return () => unsubscribe();
    }, [refreshPage, user, selectedDate]);

    return (
        <div className="flex flex-col items-center justify-between space-y-4 w-full h-2/3 gap-10 dark:bg-black p-4">
            <div className="flex gap-5 items-center align-middle">
                <h2 className="text-2xl font-bold text-blue-500 dark:text-white">
                    Select Date
                </h2>
                <input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    className="px-4 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
                />
            </div>
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
                        Daily Total
                    </h3>
                    <p className="text-4xl font-bold dark:text-white">
                        {dailyTotal}
                    </p>
                </div>
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
