import { ReactNode, MouseEventHandler, InputHTMLAttributes } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

interface CardContentProps {
    children: ReactNode;
}

interface ButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler;
    className: string;
    type?: "submit" | "reset" | "button" | undefined;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

interface MultipleChoiceQuestionProps {
    currentQuestion: {options: string[], answer: number};
    selectedAnswer: number;
    handleAnswer: (index: number) => void;
}

interface OpenEndedQuestionProps {
    currentQuestion: {
      answer: string[]; // or whatever type your answers are
    };
    userInput: string[];
    setUserInput: React.Dispatch<React.SetStateAction<string[]>>;
    handleAnswer: () => void;
    canTryQuestion: boolean;
  }

// Custom Card component
export function Card({ children, className } : CardProps) {
  return (
    <div className={`border rounded-2x1 shadow-lg p-6 bg-white ${className}`}>
      {children}
    </div>
  );
}

// Custom CardContent component
export function CardContent({ children } : CardContentProps) {
  return <div className="p-2">{children}</div>;
}

// Custom Button component
export function Button({ children, onClick, className, type} : ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold text-white transition ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}

// Custom Input component with forwardRef to handle focus
export const Input = ({ value, onChange, placeholder, className } : InputProps) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);


// Multiple-Choice Answer Component
export const MultipleChoiceQuestion = ({ currentQuestion, selectedAnswer, handleAnswer } : MultipleChoiceQuestionProps) => (
  <div className="mt-4 flex flex-col gap-3">
    {currentQuestion.options.map((option, index) => (
      <Button
      key={index}
      className={`w-full ${selectedAnswer === index
        ? index === currentQuestion.answer
          ? "bg-green-500 hover:bg-green-600"
          : "bg-red-500 hover:bg-red-600"
        : "bg-blue-500 hover:bg-blue-600"}
        `}
      onClick={() => handleAnswer(index)}
    >
      {option}
    </Button>
    ))}
  </div>
);


// Open-Ended Question Component
export const OpenEndedQuestion = ({ currentQuestion, userInput, setUserInput, handleAnswer, canTryQuestion } : OpenEndedQuestionProps) => {
  // Handler for input changes
  const handleInputChange = (index : number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setUserInput((prevInput) => {
      const updatedInput = [...prevInput];
      updatedInput[index] = newValue;
      return updatedInput;
    });
  };

  // Handle form submission
  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault(); // Prevent form from refreshing the page
    handleAnswer(); // Call the provided handleAnswer function
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
      {currentQuestion.answer.map((_, index) => (
        <div key={index} className="flex flex-col">
          <label className="text-sm font-medium">{(currentQuestion.answer.length === 1) ? `Answer: ` : `Answer ${index + 1}: `}</label>
          <Input
            value={userInput[index] || ""}
            onChange={(e) => handleInputChange(index, e)}
            placeholder={(currentQuestion.answer.length === 1) ? `Type answer` : `Type answer ${index + 1}`}
            className="mt-1 border border-gray-300 rounded-lg p-2"
          />
        </div>
      ))}
      {canTryQuestion && (<Button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600">
        Check Answer
      </Button>)}
    </form>
  );
};