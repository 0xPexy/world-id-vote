"use client";

import { useEffect, useState } from "react";
import {
  MiniKit,
  VerifyCommandInput,
  VerificationLevel,
} from "@worldcoin/minikit-js";

const proposals = ["점심시간 2시간 확대", "주 4일제 도입"];

export default function Page() {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const result = MiniKit.install();
    if (!result.success && result.errorCode !== "already_installed") {
      setNotice("World App에서만 투표가 가능합니다.");
    }
  }, []);

  const handleVote = async (topic: string) => {
    if (!MiniKit.isInstalled()) {
      setNotice("World App에서만 투표가 가능합니다.");
      return;
    }

    const payload: VerifyCommandInput = {
      action: "anonymous-vote",
      signal: topic,
      verification_level: VerificationLevel.Device,
    };

    const { finalPayload } = await MiniKit.commandsAsync.verify(payload);

    if (finalPayload.status === "error") {
      setNotice("인증이 취소되었거나 실패했습니다. 다시 시도해주세요.");
      return;
    }
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: payload.action,
        signal: payload.signal,
        proof: finalPayload,
      }),
    });

    if (response.ok) {
      setNotice("✅ 인증 성공! 소중한 1표가 행사되었습니다.");
      return;
    }

    const errorData = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    setNotice(errorData?.error ?? "인증 처리에 실패했습니다. 다시 시도해주세요.");
  };

  return (
    <main className="page">
      <section className="card-stack">
        <header className="title-wrap">
          <p className="eyebrow">중앙선거관리위원회</p>
          <h1 className="title">제1회 익명 인기투표</h1>
          <p className="subtitle">World ID 인증 후 1인 1표만 가능</p>
        </header>

        <div className="proposal-list">
          {proposals.map((proposal) => (
            <article className="proposal-card" key={proposal}>
              <div>
                <p className="proposal-label">안건</p>
                <h2 className="proposal-title">{proposal}</h2>
              </div>
              <button
                className="vote-button"
                type="button"
                onClick={() => handleVote(proposal)}
              >
                투표하기
              </button>
            </article>
          ))}
        </div>
      </section>

      {notice && (
        <div className="notice-overlay" role="dialog" aria-modal="true">
          <div className="notice-card">
            <p>{notice}</p>
            <button
              className="notice-button"
              type="button"
              onClick={() => setNotice(null)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
