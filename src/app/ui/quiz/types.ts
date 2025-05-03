import { ReactNode, MouseEventHandler, InputHTMLAttributes } from 'react';

export type OpenEndedQuestionType = {
    question: string;
    answer: string[];
}

export type MultipleChoiceQuestionType = {
    question: string;
    options: string[];
    answer: number;
}

export type QuestionType = OpenEndedQuestionType | MultipleChoiceQuestionType

export function isMultipleChoiceQuestion(
    question: QuestionType
): question is MultipleChoiceQuestionType {
    return typeof question.answer === 'number';
}

export interface CardProps {
    children: ReactNode;
    className?: string;
}

export interface CardContentProps {
    children: ReactNode;
}

export interface ButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler;
    className: string;
    type?: "submit" | "reset" | "button" | undefined;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export interface MultipleChoiceQuestionProps {
    currentQuestion: {options: string[], answer: number};
    selectedAnswer: number;
    handleAnswer: (index: number) => void;
}

export interface OpenEndedQuestionProps {
    currentQuestion: {
      answer: string[]; // or whatever type your answers are
    };
    userInput: string[];
    setUserInput: React.Dispatch<React.SetStateAction<string[]>>;
    handleAnswer: () => void;
    canTryQuestion: boolean;
  }
