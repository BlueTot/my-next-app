import { redirect } from "next/navigation";
import { auth } from "../lib/auth/login";
import { getUserStats } from "../lib/auth/queries";
import QuizComponent from "../ui/quiz/quiz";

export default async function Quiz() {

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
    
    return <QuizComponent /> 
}

