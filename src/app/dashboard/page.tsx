import SideNav from "../ui/dashboard/sidenav"; 
import { auth } from "@/app/lib/auth/login";
import { redirect } from "next/navigation";

export default async function Dashbaord() {

    const session = await auth();

    if (!session || !session.user) {
        // redirect user to login screen
        redirect('/login');
    }
    console.log(session.user.id);

    return (
        <>
            <h1>Dashboard</h1>
            <p>Welcome {session.user.id}!</p>
            <SideNav></SideNav>
        </>
    );
}