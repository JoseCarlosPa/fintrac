import { Dispatch, SetStateAction } from "react";

type QuestionProps = {
    question: string;
    index: number;
    anwers: { answer: string; value: number; }[];
    setAnswers?: Dispatch<SetStateAction<{
        0: number;
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
        9: number;
        10: number;
        11: number;
        12: number;
        13: number;
        14: number;
        15: number;
    }>>;

}
const Question = ({ question, index,anwers,setAnswers }:QuestionProps) => {

    const handleAnswer = (value: number) => {
        if (setAnswers) {
            setAnswers((prev) => {
                return { ...prev, [index]: value };
            });
        }
    }

    return (
        <div className="flex flex-col mt-12 md:mt-8">
            <div className="flex flex-row">
                <span className="font-semibold">{index + 1} .- {question}</span>
            </div>
            <div className="flex flex-col">
                {anwers.map((answer, index) => (
                    
                    <div key={index} className="flex flex-row mt-2">
                        <input
            
                            onChange={() => handleAnswer(answer.value)}
                         type="radio" name="answer" id={answer.answer} value={answer.value} />
                        <label htmlFor={answer.answer} className="ml-2">{answer.answer}</label>
                    </div>
                ))}
                
            </div>
        </div>
    );
}
export default Question;