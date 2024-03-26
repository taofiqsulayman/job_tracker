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
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type JobCounterProps = {
    user: string;
};

//TODO: make the weekly and monthly totals a reflection of the selected date
//TODO: make app a PWA

const JobCounter = ({ user }: JobCounterProps) => {
    const [count, setCount] = useState(0);
    const [dailyTotal, setDailyTotal] = useState(0);
    const [weeklyTotal, setWeeklyTotal] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [refreshPage, setRefreshPage] = useState(false);
    const [date, setDate] = useState(new Date());
    const { toast } = useToast();

    const handleDateChange = (event: {
        target: { value: string | number | Date };
    }) => {
        if (!date) return;
        setDate(new Date(event.target.value));
        setRefreshPage(true);
        console.log(date);
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
                counts: arrayUnion({
                    timestamp: Timestamp.fromDate(new Date()),
                    count,
                }),
            },
            { merge: true }
        );
        setCount(0);
    };

    const handleSave = () => {
        saveCountToFireStore(user, date, count)
            .then(() =>
                toast({
                    title: "Count saved successfully.",
                    description: "Your count has been saved.",
                })
            )
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was an error saving your count.",
                });
                console.error("Error", error);
            });
        setRefreshPage(true);
    };

    const data = [
        { title: "Daily Total", total: dailyTotal },
        { title: "Weekly Total", total: weeklyTotal },
        { title: "Monthly Total", total: monthlyTotal },
    ];

    useEffect(() => {
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
                    (sum: any, countObj: { count: any }) =>
                        sum + countObj.count,
                    0
                );
                countsArr.push(dailyTotal);
                if (doc.data().date.toDate() >= startOfWeek.toDate()) {
                    weeklyCountsArr.push(dailyTotal);
                }

                if (doc.id === date.toISOString().split("T")[0]) {
                    setDailyTotal(dailyTotal);
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
    }, [user, date, refreshPage]);

    return (
        <div className="flex flex-col items-center justify-between space-y-4 w-full h-2/3 gap-6 p-4">
            <div className="flex gap-5 items-center align-middle">
                <h2 className="text-2xl font-bold">Select Date</h2>
                <input
                    type="date"
                    value={date.toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    className="px-4 py-2 border"
                />
            </div>
            <h2 className="text-2xl font-bold">Number of Jobs Done</h2>
            <div className="flex items-center justify-center space-x-4 gap-4">
                <Button
                    onClick={decrement}
                    className="rounded-full text-6xl font-bold px-20 py-24 bg-secondary text-red-500"
                >
                    -
                </Button>
                <Card className="rounded-full">
                    <CardContent className="flex flex-col items-center justify-center p-20">
                        <p className="text-6xl font-bold">{count}</p>
                    </CardContent>
                </Card>
                <Button
                    onClick={increment}
                    className="rounded-full text-6xl font-bold px-20 py-24 bg-secondary text-green-500"
                >
                    +
                </Button>
            </div>

            <Button className="text-2xl p-5" onClick={handleSave}>
                Save Count
            </Button>

            <div className="flex space-x-4">
                {data.map((item) => (
                    <Card key={item.title}>
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center">
                            <p className="text-4xl font-bold">{item.total}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default JobCounter;
