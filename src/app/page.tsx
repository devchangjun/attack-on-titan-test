"use client";
import React, { useState, useEffect } from "react";
import questionsRaw from "../lib/questions.json";
import characters from "../lib/characters.json";
import Image from "next/image";

interface QuestionType {
  id: number;
  question: string;
  options: { text: string; characterScores: Record<string, number> }[];
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
  interface Window {
    Kakao: unknown;
  }
}

function Intro({ onStart }: { onStart: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = 0;
    const end = 3216;
    const increment = Math.ceil(end / 60); // 60프레임 기준
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setCount(current);
    }, 16); // 약 60fps
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white px-4">
      <div className="max-w-lg w-full flex flex-col items-center">
        <Image
          src="/images/eren/1.webp"
          alt="Attack on Titan"
          width={160}
          height={160}
          className="w-40 h-40 object-cover rounded-full shadow-lg mb-6 border-4 border-white"
        />
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
          어떤 <span className="text-yellow-400">진격의 거인</span> 캐릭터와 닮았을까?
        </h1>
        <p className="text-lg text-gray-200 mb-8 text-center">
          간단한 질문에 답하면
          <br />
          당신과 닮은 <b>진격의 거인</b> 캐릭터를 찾아드립니다.
          <br />
          <span className="text-sm text-gray-400">(총 13문항, 1~2분 소요)</span>
        </p>
        <button
          onClick={onStart}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full text-xl shadow-lg transition"
        >
          테스트 시작하기
        </button>
        <div className="mt-6 mb-2 text-lg font-bold text-pink-500 animate-pulse text-center">
          {count.toLocaleString()}명의 조사병단이 참여했어요👍
        </div>
        <div className="mt-8 text-xs text-gray-400 text-center">
          ※ 본 테스트는 팬메이드이며, 공식 결과와 다를 수 있습니다.
          <br />ⓒ Hajime Isayama / Kodansha / WIT Studio / MAPPA / 웹공방
        </div>
      </div>
    </div>
  );
}

function Question({
  question,
  onAnswer,
  step,
  total,
}: {
  question: QuestionType;
  onAnswer: (characterScores: Record<string, number>) => void;
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
              onClick={() => onAnswer(opt.characterScores)}
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
      const kakao = window.Kakao as { isInitialized?: () => boolean; init?: (key: string) => void };
      if (kakao && typeof kakao.isInitialized === "function" && kakao.init && !kakao.isInitialized()) {
        kakao.init("88e96e2d11b38b5956c91ad7c69bb41b");
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleKakaoShare = () => {
    if (!window.Kakao || typeof (window.Kakao as { Share?: unknown }).Share !== "object") {
      alert("카카오톡 공유 기능을 사용할 수 없습니다. 새로고침 후 다시 시도해 주세요.");
      return;
    }
    if (!character) return;
    const kakao = window.Kakao as { Share: { sendDefault: (args: unknown) => void } };
    kakao.Share.sendDefault({
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
            <Image
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
      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border max-w-xs text-base sm:text-lg text-gray-700 dark:text-gray-300 text-center">
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

// Utility to sanitize characterScores (remove undefined values)
type RawQuestion = {
  id: number;
  question: string;
  options: { text: string; characterScores: Record<string, number | undefined> }[];
};

function sanitizeQuestions(raw: RawQuestion[]): QuestionType[] {
  return raw.map((q) => ({
    ...q,
    options: q.options.map((opt) => ({
      text: opt.text,
      characterScores: Object.fromEntries(
        Object.entries(opt.characterScores).filter(([, v]) => typeof v === "number" && v !== undefined)
      ) as Record<string, number>,
    })),
  }));
}

const questions: QuestionType[] = sanitizeQuestions(questionsRaw as RawQuestion[]);

export default function Home() {
  const [step, setStep] = useState<number>(-1);
  // 캐릭터별 점수 누적
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleAnswer = (characterScores: Record<string, number>) => {
    setScores((prev) => {
      const next = { ...prev };
      for (const [id, score] of Object.entries(characterScores)) {
        next[id] = (next[id] || 0) + score;
      }
      return next;
    });
    setStep((prev) => prev + 1);
  };

  if (step === -1) {
    return <Intro onStart={() => setStep(0)} />;
  }

  if (step >= questions.length) {
    // 결과 계산
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    console.log(sorted);
    const topId = sorted[0]?.[0];
    const character = (characters as CharacterType[]).find((c) => c.id === topId) as CharacterType | undefined;

    return <Result character={character} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-black">
      <h1 className="text-xl font-bold mb-8 text-center">진격의거인 세계관에 태어났다면 누구였을까?</h1>
      <Question question={questions[step]} onAnswer={handleAnswer} step={step} total={questions.length} />
    </div>
  );
}
