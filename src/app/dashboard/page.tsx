import SideNav from "../ui/dashboard/sidenav"; 
import { auth } from "@/app/lib/auth/login";
import { redirect } from "next/navigation";
import { getUserStats } from "../lib/auth/queries";
import Link from "next/link";

export default async function Dashboard() {

    const session = await auth();

    if (!session || !session.user) {
        // redirect user to login screen
        redirect('/login');
    }
    console.log(session.user.id);
    const { correctQuestions, incorrectQuestions } = (session.user.id) ?
        await getUserStats(session.user.id) : 
        { correctQuestions: [], incorrectQuestions: []};
    console.log(correctQuestions);
    console.log(incorrectQuestions);


    return (
        <>
            <h1>Dashboard</h1>
            <p>Welcome {session.user.id}!</p>
            <p>Correct questions: {correctQuestions}</p>
            <p>Incorrect questions: {incorrectQuestions}</p>
            <SideNav></SideNav>
            <Link
                href="/quiz"
                className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
            Quiz
            </Link>
        </>
    );
}
