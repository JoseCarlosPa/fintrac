"use client"
import { use, useEffect, useState } from "react";
import Question from "./components/Question";
import { Answer, QuestionAndAnswers } from "./store/QuestionsAndAnswers";
import { FaIdCardClip } from "react-icons/fa6";

const InvestorTestPage = () => {

    const [answers, setAnswers] = useState<any>(Answer);
    const [question, setQuestion] = useState<number>(0);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [result, setResult] = useState<number>(0);

    const nextQuestion = () => {
        if (question >= QuestionAndAnswers.length - 1) {
            return;
        }
        setQuestion(question + 1);
    }

    const previousQuestion = () => {
        if (question <= 0) {
            return;
        }
        setQuestion(question - 1);
    }

    const calculateResult = () => {
        
        let result = 0;
        for (const key in answers) {
            if (Object.prototype.hasOwnProperty.call(answers, key)) {
                const element = answers[key];
                result += element;
            }
        }
        return result;
       
    }

    const showInvestorProfile = () => {
        if(showResult){
            if (calculateResult() >= 8 && calculateResult() <= 29) {
                return<div><b>Conservador: </b>Prefieres los rendimientos estables y los plazos cortos. Es adverso al riesgo (o sea, le da pánico perder y prefiere ganar menos, pero no andar viendo números rojos). </div>;
            }
            if (calculateResult() >= 30 && calculateResult() <= 70) {
                return <div><b>Moderado: </b>Tolera los riesgos moderados y le gusta mantener una peuqeña parte de sus inversiones ñíquidas (disponibles a corto plazo) y otra parte mayor a la mediano plazo</div>;
            }
            return <div><b>Agresivo: </b>Le gusta el riesgo y la posibildiad de obtener altos rendimeintos en el largo plazo, aunque exista la posibilidad de perder parte de minusvalóa o pérdida.</div> ;
        }
    }

    return (
        <div className="flex flex-col mt-4 md:mt-12">
            <h1 className="font-bold text-3xl">¿Que tipo de inversionista eres? </h1>
            <span className="text-gray-900 mt-2 text-sm md:text-md">A continuación, encontrarás una serie de preguntas destinadas a evaluar tu tolerancia al riesgo y tus objetivos financieros. Por favor, responde sinceramente marcando la opción que mejor refleje tu situación.</span>
            <span className="mt-4">Total: {calculateResult()}</span>
            <div className="h-72 md:h-60 mb-12">
                {!showResult ?
                    <Question key={QuestionAndAnswers[question].question} setAnswers={setAnswers} question={QuestionAndAnswers[question].question} index={question} anwers={QuestionAndAnswers[question].answers} />
                    :
                    <div className="flex flex-col mt-12">
                        {showInvestorProfile()}
                        <FaIdCardClip className="mt-12 mx-auto w-24 h-24 text-gray-600" />

                    </div>
                }

            </div>
            <div className="flex flex-row mt-4 gap-x-4 justify-center md:justify-start">
                <button
                    onClick={() =>{
                        setShowResult(false);
                        previousQuestion();
                    } }
                    className="bg-gray-900 text-white w-32 py-2 rounded">
                    Anterior
                </button>
                {question >= QuestionAndAnswers.length - 1 ?
                    <button
                        onClick={() => {
                            setShowResult(true);
                        }}
                        className="bg-gray-900 text-white w-32 py-2 rounded">
                        Ver Resultado
                    </button>
                    :
                    <button
                        onClick={() => nextQuestion()}
                        className="bg-gray-900 text-white w-32 py-2 rounded">
                        Sigueinte
                    </button>
                }


            </div>
        </div>
    );
}

export default InvestorTestPage;