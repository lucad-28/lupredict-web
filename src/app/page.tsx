"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchVerifyMail } from "@/fetchers/email";

export default function WordCountVelocimeter() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<"Spam" | "Ham">();
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [probability, setProbability] = useState(0);

  const handleVerify = async () => {
    setProbability(0);
    setResult(undefined);
    setIsLoading(true);
    try {
      const { result, proba } = await fetchVerifyMail(text);
      console.log(result, proba);
      setResult(result);
      setProbability(proba);
      setIsLoading(false);
      setIsIncreasing(true);
      setTimeout(() => {
        setIsIncreasing(false);
      }, 300);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setRotation(Math.min(probability * 180, 180));
  }, [probability]);

  return (
    <div className="max-w-full flex flex-col h-lvh md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="mb-4 text-3xl text-center font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-gray-900 from-blue-950">
          Span
        </span>{" "}
        or{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-950 from-gray-900">
          Ham
        </span>{" "}
      </h1>

      <div className="w-full my-auto flex  items-center justify-center">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="space-y-3 md:w-[70%] w-full rounded-lg bg-gray-100/20 p-4 shadow-lg">
            <label htmlFor="text-input" className="text-sm font-medium">
              Enter your email below:
            </label>
            <Textarea
              id="text-input"
              placeholder="Start typing or paste your email here..."
              className={`min-h-[300px] max-h-[80%] mt-1 text-base break-words bg-white ${
                isLoading && "animate-pulse bg-gray-200"
              }`}
              value={text}
              disabled={isLoading}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="w-full flex items-center justify-center mt-4">
              <Button
                className={`w-full max-w-[70%] md:max-w-[50%] ${
                  isLoading && "animate-pulse bg-gray-200 text-gray-700"
                }`}
                onClick={handleVerify}
                disabled={isLoading}
              >
                Verify
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center md:w-[30%] w-full">
            <div className="relative w-64 h-40 overflow-hidden">
              {/* Gauge background */}
              <svg viewBox="0 0 200 100" className="w-full">
                <defs>
                  <linearGradient
                    id="strokeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#161a27" />
                    <stop offset="100%" stopColor="#13214c" />
                  </linearGradient>
                </defs>

                <path
                  d="M20,100 A80,80 0 0,1 180,100"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <foreignObject
                  x="0"
                  y="0"
                  width="100%"
                  height={"100%"}
                  className="pointer-events-none"
                >
                  <div className="absolute inset-0 flex items-end justify-center pb-3">
                    <span className="text-3xl font-bold italic">
                      {result ? (result === "Spam" ? "Spam" : "Ham") : "?"}
                    </span>
                  </div>
                </foreignObject>

                {/* Gauge fill */}
                <path
                  d="M20,100 A80,80 0 0,1 180,100"
                  fill="none"
                  stroke="url(#strokeGradient)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  className={`transition-all duration-500 ease-out ${
                    isLoading && "animate-pulse bg-gray-200"
                  }`}
                  strokeDashoffset={251.2 - (rotation / 180) * 251.2}
                />

                {/* Gauge needle */}
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="40"
                  stroke="#1e293b"
                  strokeWidth="2"
                  transform={`rotate(${rotation - 90}, 100, 100)`}
                  className="transition-all duration-500 ease-out"
                />

                {/* Needle center */}
                <circle cx="100" cy="100" r="5" fill="#1e293b" />
              </svg>

              {/* Min and max labels */}
              <div className="absolute bottom-2 left-5 text-sm font-medium">
                0%
              </div>
              <div className="absolute bottom-2 right-2 text-sm font-medium">
                100%
              </div>
            </div>

            <div className="mt text-center">
              <div
                className={`text-5xl font-bold transition-all ${
                  isIncreasing ? "scale-110 text-blue-950" : ""
                }`}
              >
                {Math.round(probability * 10000) / 100}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Certeza</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
