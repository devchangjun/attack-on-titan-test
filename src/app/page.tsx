"use client";
import React, { useState } from "react";
import questions from "../lib/questions.json";
import characters from "../lib/characters.json";

interface QuestionType {
  id: number;
  question: string;
  options: { text: string; characterIds: string[] }[];
}

interface CharacterType {
  id: string;
  name: string;
  keywords: string[];
  mbti: string[];
  description: string;
  detail: string;
  image?: string[];
}

function Question({
  question,
  onAnswer,
  step,
  total,
}: {
  question: QuestionType;
  onAnswer: (characterIds: string[]) => void;
  step: number;
  total: number;
}) {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 items-center">
      <h2 className="text-lg font-bold text-center">
        Q{step + 1}. {question.question}
      </h2>
      <ul className="w-full flex flex-col gap-3">
        {question.options.map((opt, idx) => (
          <li key={idx}>
            <button
              className="w-full py-3 px-4 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition text-base"
              onClick={() => onAnswer(opt.characterIds)}
            >
              {opt.text}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500">
        {step + 1} / {total}
      </p>
    </div>
  );
}

function Result({ character }: { character: CharacterType | undefined }) {
  if (!character) return <div className="text-center">결과를 찾을 수 없습니다.</div>;
  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h2 className="text-2xl font-bold mb-2">진격의 거인 세계관에 태어났다면 당신은?</h2>
      <div className="flex flex-row gap-4 items-center justify-center">
        {character.image && character.image.length > 0 ? (
          character.image.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={character.name + " 이미지 " + (idx + 1)}
              width={140}
              height={140}
              className="rounded-lg border object-cover"
              style={{ aspectRatio: "1/1" }}
            />
          ))
        ) : (
          <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-200 rounded-lg border text-gray-500 text-xl">
            이미지 없음
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold">{character.name}</h3>
      <p className="text-base text-center max-w-md">{character.description}</p>
      <p className="text-sm text-gray-600">MBTI: {character.mbti.join(", ")}</p>
      <p className="text-sm text-gray-600">키워드: {character.keywords.join(", ")}</p>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border max-w-lg text-sm text-gray-700 dark:text-gray-300">
        <b>상세 설명</b>
        <br />
        {character.detail}
      </div>
      <button
        className="mt-6 px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        다시하기
      </button>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (characterIds: string[]) => {
    setAnswers((prev) => [...prev, ...characterIds]);
    setStep((prev) => prev + 1);
  };

  if (step >= (questions as QuestionType[]).length) {
    // 결과 계산
    const count: Record<string, number> = {};
    answers.forEach((id) => {
      count[id] = (count[id] || 0) + 1;
    });
    const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
    const topId = sorted[0]?.[0];
    const character = (characters as CharacterType[]).find((c) => c.id === topId) as CharacterType | undefined;
    return <Result character={character} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold mb-8 text-center">어택온타이탄 성격 테스트</h1>
      <Question
        question={(questions as QuestionType[])[step]}
        onAnswer={handleAnswer}
        step={step}
        total={(questions as QuestionType[]).length}
      />
    </div>
  );
}
