'use client'

import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, MultipleChoiceQuestion, OpenEndedQuestion } from "../ui/quiz/components";

export type OpenEndedQuestionType = {
    question: string;
    answer: string[];
}

export type MultipleChoiceQuestionType = {
    question: string;
    options: string[];
    answer: number;
}

function isMultipleChoiceQuestion(
    question: QuestionType
): question is MultipleChoiceQuestionType {
    return typeof question.answer === 'number';
}

export type QuestionType = OpenEndedQuestionType | MultipleChoiceQuestionType

export default function Quiz() {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType>({ question: "", answer: [""] });
    const [selectedAnswer, setSelectedAnswer] = useState<string[] | number | null>(null);
    const [userInput, setUserInput] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string>("");
    const [wrongAttempts, setWrongAttempts] = useState<number>(0);
    const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
    const [quizStarted, setQuizStarted] = useState<boolean>(false);
    const [numAnsweredQs, setNumAnsweredQs] = useState<number>(0);
    const [numCorrectQs, setNumCorrectQs] = useState<number>(0);
    const [canTryQuestion, setCanTryQuestion] = useState<boolean>(true);


    //   const [user, setUser] = useState(null);

    //   const fetchUserData = async () => {
    //     const token = localStorage.getItem('token');
    //     if (!token) return;

    //     try {
    //       // Adjusted the URL to include the /auth prefix
    //       const response = await fetch("http://localhost:5000/auth/user", {
    //         method: "GET",
    //         headers: { Authorization: `Bearer ${token}` },
    //       });

    //       const userData = await response.json();
    //       if (response.ok) {
    //         setUser(userData); // Save the user data in the state
    //       } else {
    //         console.error(userData.error); // Display error from backend if any
    //       }
    //     } catch (err) {
    //       console.error("Error fetching user data", err);
    //     }
    //   };

    //   useEffect(() => {
    //     fetchUserData(); // Fetch user data when the component loads
    //   }, []);


    // useEffect(() => {
    //     fetch('/public/questions2.json')
    //       .then((res) => res.json())
    //       .then((json) => setData(json))
    //       .catch((err) => console.error('Failed to load JSON:', err));
    //   }, []);
    // fetch questions from public directory
    useEffect(() => {
        fetch(`/questions2.json`) // Ensure this file is in "public/"
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then((data) => {
                setQuestions(data); // Set the questions state
            })
            .catch((error) => console.error("Error loading JSON:", error)); // Catch and log errors
    }, [loadNewQuestion]);

    // load new question, and set title
    useEffect(() => {
        document.title = `CS133 Revision Quiz - ${questions.length} Questions`;
        loadNewQuestion();
    }, [questions.length]);

    // load new question
    function loadNewQuestion() {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setCurrentQuestion(questions[randomIndex]);
        setSelectedAnswer(null);
        const answerLength = Array.isArray(questions[randomIndex]?.answer) ? questions[randomIndex]?.answer.length : 0;
        setUserInput(new Array(answerLength).fill("")); // reset user input
        setFeedback("");
        setWrongAttempts(0);
        setShowCorrectAnswer(false);
        setCanTryQuestion(true);
    }

    function startQuiz() {
        setQuizStarted(true);
        loadNewQuestion();
    }

    function stopQuiz() {
        setQuizStarted(false);
    }

    // multiple choice answer
    function handleMultipleChoiceAnswer(index: number) {
        if (canTryQuestion) {
            if (index === currentQuestion.answer) {
                setFeedback("✅ Correct!");
                setShowCorrectAnswer(false);
                setNumCorrectQs(count => count + 1);
                setNumAnsweredQs(count => count + 1);
                setCanTryQuestion(false);
            } else {
                const newWrongAttempts = wrongAttempts + 1;
                setFeedback(`❌ Incorrect! (${newWrongAttempts}/3)`);
                setWrongAttempts(newWrongAttempts);
                if (newWrongAttempts >= 3) {
                    setShowCorrectAnswer(true);
                    setNumAnsweredQs(count => count + 1);
                    setCanTryQuestion(false);
                }
            }
            setSelectedAnswer(index);
        }
    }

    // text answer
    function handleTextAnswer() {

        if (typeof currentQuestion.answer === "number") return;

        if (canTryQuestion) {
            const sortedAnswers = [...currentQuestion.answer].sort().map(item => item.toLowerCase())
            const sortedUserInput = [...userInput].sort().map((item: string) => item.toLowerCase())

            const intersection = sortedUserInput.filter(item => sortedAnswers.includes(item))
            if (intersection.length === currentQuestion.answer.length) {
                setFeedback((userInput.length === 1) ? "✅ Answer is correct!" : "✅ All answers correct!");
                setShowCorrectAnswer(false);
                setNumCorrectQs(count => count + 1);
                setNumAnsweredQs(count => count + 1);
                setCanTryQuestion(false);
            } else {
                const newWrongAttempts = wrongAttempts + 1;
                if (userInput.length === 1) {
                    setFeedback(`❌ Answer is incorrect. (${newWrongAttempts}/3)`);
                } else {
                    setFeedback(`❌ ${intersection.length} answers are correct. (${newWrongAttempts}/3)`);
                }
                setWrongAttempts(newWrongAttempts);
                if (newWrongAttempts >= 3) {
                    setShowCorrectAnswer(true);
                    setNumAnsweredQs(count => count + 1);
                    setCanTryQuestion(false);
                }
            }
        }
    }

    // main html return statement
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            {/* {user && <p>Welcome, {user.username}!</p>} Display username */}
            {!quizStarted ? (
                <Card className="max-w-lg text-center p-6">
                    <h1 className="text-3xl font-bold mb-4">CS133 Revision Quiz</h1>
                    <p className="text-lg mb-6">Test your knowledge and track your progress!</p>
                    <p className="text-lg mb-6">Score: {numCorrectQs}/{numAnsweredQs}</p>
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={startQuiz}>
                        Start Quiz
                    </Button>
                </Card>
            ) : (
                <Card className="max-w-md w-full text-center p-4">
                    <p>Score: {numCorrectQs}/{numAnsweredQs}</p>
                    <CardContent>
                        {currentQuestion && (
                            <>
                                <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>

                                {isMultipleChoiceQuestion(currentQuestion) && typeof selectedAnswer === 'number' &&
                                    <MultipleChoiceQuestion
                                        currentQuestion={currentQuestion}
                                        selectedAnswer={selectedAnswer}
                                        handleAnswer={handleMultipleChoiceAnswer}
                                    />
                                }
                                {!isMultipleChoiceQuestion(currentQuestion) && typeof selectedAnswer !== 'number' &&
                                    <OpenEndedQuestion
                                        userInput={userInput}
                                        currentQuestion={currentQuestion}
                                        setUserInput={setUserInput}
                                        handleAnswer={handleTextAnswer}
                                        canTryQuestion={canTryQuestion}
                                    />
                                }

                                <p className="mt-4 font-bold">{feedback}</p>

                                {showCorrectAnswer && (
                                    <p className="mt-2 text-red-500">✅ Correct Answer: {Array.isArray(currentQuestion.answer) ?
                                        currentQuestion.answer.join(", ") :
                                        currentQuestion.answer}</p>
                                )}

                                <Button className="mt-4 bg-gray-700 hover:bg-gray-800" onClick={loadNewQuestion}>
                                    Next Question
                                </Button>

                                <Button className="mt-4 bg-gray-700 hover:bg-gray-800" onClick={stopQuiz}>
                                    Stop Quiz
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
