"use client";
import React, { useState, useEffect } from "react";
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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    Kakao: any;
  }
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
  useEffect(() => {
    if (window.Kakao) return;
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("YOUR_KAKAO_APP_KEY");
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.Share) {
      alert("카카오톡 공유 기능을 사용할 수 없습니다. 새로고침 후 다시 시도해 주세요.");
      return;
    }
    if (!character) return;
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `나는 ${character.name} 타입!`,
        description: character.description,
        imageUrl:
          character.image && character.image[0]
            ? window.location.origin + character.image[0]
            : window.location.origin + "/images/og-default.png",
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "테스트 하러 가기",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  if (!character) return <div className="text-center">결과를 찾을 수 없습니다.</div>;
  return (
    <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-sm mx-auto px-2">
      <h2 className="text-xl sm:text-2xl font-bold mb-1 text-center leading-tight">
        진격의 거인 세계관에 태어났다면 당신은?
      </h2>
      <div className="flex flex-row gap-2 items-center justify-center w-full overflow-x-auto pb-2">
        {character.image && character.image.length > 0 ? (
          character.image.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={character.name + " 이미지 " + (idx + 1)}
              width={100}
              height={100}
              className="rounded-lg border object-cover flex-shrink-0"
              style={{ aspectRatio: "1/1" }}
            />
          ))
        ) : (
          <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-200 rounded-lg border text-gray-500 text-base">
            이미지 없음
          </div>
        )}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mt-2 text-center">{character.name}</h3>
      <p className="text-xs sm:text-sm text-gray-600">MBTI: {character.mbti.join(", ")}</p>
      <p className="text-xs sm:text-sm text-gray-600 mb-1">키워드: {character.keywords.join(", ")}</p>
      <p className="text-sm sm:text-base text-center max-w-xs text-gray-800 dark:text-gray-200 my-2">
        {character.description}
      </p>
      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border max-w-xs text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center">
        <b>상세 설명</b>
        <br />
        {character.detail}
      </div>
      <button
        className="w-full mt-4 px-4 py-3 rounded bg-blue-500 text-white hover:bg-blue-600 text-base font-semibold transition"
        onClick={() => window.location.reload()}
      >
        다시하기
      </button>
      <button
        className="w-full mt-2 px-4 py-3 rounded bg-yellow-400 text-black hover:bg-yellow-500 font-semibold text-base transition"
        onClick={handleKakaoShare}
      >
        카카오톡으로 공유하기
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
