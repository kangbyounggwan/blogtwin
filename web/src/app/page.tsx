"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Splash screen 효과 후 dashboard로 이동
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">✍️</div>
        <h1 className="text-4xl font-bold text-white mb-2">BlogTwin</h1>
        <p className="text-white/80">AI 블로그 자동 작성</p>
        <div className="mt-8">
          <div className="w-16 h-1 bg-white/30 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-white rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
