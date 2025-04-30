import SideNav from "../ui/dashboard/sidenav"; 
import { auth } from "@/app/lib/auth/login";
import { redirect } from "next/navigation";
import { getUserStats } from "../lib/auth/queries";

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
        </>
    );
}