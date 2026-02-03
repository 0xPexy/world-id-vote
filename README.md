# World ID Anonymous Vote (Mini App Demo)

World App 내부에서 실행되는 Mini App 데모입니다. World ID `verify`로 익명 인증을 받고, 서버 메모리에서 nullifier를 저장해 **중복 투표를 방지**합니다.

## Features
- MiniKit 초기화 및 World App 내 인증
- 2개 안건 투표 UI
- 백엔드에서 `nullifier_hash` 기반 중복 방지
- Tunnelmole로 모바일 실기기 테스트

## Prerequisites
- Node.js 18+ (권장: 20+)
- World App 최신 버전
- Worldcoin Developer Portal에 Action 등록

## Setup
```bash
npm install
```

### Environment
`.env.local` 파일에 App ID가 있어야 합니다.
```
WORLDCOIN_APP_ID=app_...
```

## Run (Local)
```bash
npm run dev
```

## Expose with Tunnelmole (Mobile Test)
```bash
npm run share
```
- 출력된 Public URL을 **World App 내부 브라우저**에서 열어 테스트합니다.

## Action 등록 (Developer Portal)
1. Developer Portal → App 선택
2. `Incognito Actions`(또는 `Actions`) → `Create Action`
3. **Action Name**: 코드의 `action` 값과 동일 (예: `anonymous-vote`)
4. **Description**: `익명 인기투표에 1인 1표를 행사합니다.`
5. **Max Verifications**: `1`

## Duplicate Vote Prevention
서버는 다음 키로 중복 투표를 막습니다.
```
action + signal + nullifier_hash
```
즉, **안건별로 1번씩** 투표 가능합니다.

## API
`POST /api/vote`
```json
{
  "action": "anonymous-vote",
  "signal": "점심시간 2시간 확대",
  "proof": {
    "status": "success",
    "nullifier_hash": "...",
    "proof": "...",
    "merkle_root": "...",
    "verification_level": "device",
    "version": 1
  }
}
```

## Notes
- 이 데모는 **서버 메모리**에만 저장하므로 서버 재시작 시 중복 방지 정보가 초기화됩니다.
- 프로덕션에서는 **proof 검증**과 **DB 저장**이 필요합니다.
