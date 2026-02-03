import { NextResponse } from "next/server";

type VerifySuccessPayload = {
  status: "success";
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verification_level: string;
  version: number;
};

type VoteRequestBody = {
  action?: string;
  signal?: string;
  proof?: VerifySuccessPayload;
};

const usedNullifiers = new Set<string>();

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as VoteRequestBody | null;
  const action = body?.action?.trim();
  const signal = body?.signal?.trim();
  const proof = body?.proof;

  if (!action || !signal || !proof || proof.status !== "success") {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  if (!proof.nullifier_hash) {
    return NextResponse.json(
      { error: "인증 정보가 부족합니다." },
      { status: 400 }
    );
  }

  const key = `${action}:${signal}:${proof.nullifier_hash}`;
  if (usedNullifiers.has(key)) {
    return NextResponse.json(
      { error: "🚫 이미 참여하셨습니다!" },
      { status: 409 }
    );
  }

  usedNullifiers.add(key);

  return NextResponse.json({ ok: true });
}
