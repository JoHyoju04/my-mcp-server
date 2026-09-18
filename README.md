# TypeScript HTTP MCP Server

Next.js App Router와 `mcp-handler`를 사용해 Streamable HTTP로 제공하는 MCP
서버입니다. 로컬 실행과 Vercel 배포를 모두 지원합니다.

## 요구 사항

- Node.js 20 이상
- npm
- 이미지 생성 도구 사용 시 Hugging Face 토큰

## 로컬 실행

```bash
npm install
npm run dev
```

MCP 엔드포인트는 `http://localhost:3000/api/mcp`입니다.

프로덕션 빌드는 다음 명령으로 확인할 수 있습니다.

```bash
npm run typecheck
npm run build
npm start
```

## Cursor 연결

Cursor는 HTTP MCP 요청마다 `headers` 설정을 전송합니다. 토큰을 파일에 직접
쓰지 말고 환경변수 보간을 사용하세요.

```json
{
    "mcpServers": {
        "typescript-mcp-server": {
            "url": "http://localhost:3000/api/mcp",
            "headers": {
                "x-hf-token": "${env:HF_TOKEN}"
            }
        }
    }
}
```

Cursor를 시작한 셸에 토큰을 설정한 뒤 서버 설정을 다시 로드합니다.

```bash
export HF_TOKEN="hf_..."
```

`generate-image` 도구는 `x-hf-token` 요청 헤더만 사용합니다. 서버의
`HF_TOKEN` 환경변수로 대체하지 않으며 토큰을 로그나 응답에 포함하지 않습니다.

## Vercel 배포

1. 저장소를 Vercel 프로젝트로 가져옵니다.
2. Framework Preset이 자동으로 감지되지 않으면 Next.js를 선택합니다.
3. 배포 후 Cursor 설정의 URL을 아래처럼 변경합니다.

```json
{
    "mcpServers": {
        "typescript-mcp-server": {
            "url": "https://YOUR-PROJECT.vercel.app/api/mcp",
            "headers": {
                "x-hf-token": "${env:HF_TOKEN}"
            }
        }
    }
}
```

이미지 생성 토큰은 MCP 클라이언트가 제공하므로 Vercel 환경변수로 저장할 필요가
없습니다. 공개 엔드포인트의 다른 도구에도 접근 제한이 필요하면 별도의 MCP OAuth
인증을 추가해야 합니다.

## 제공 기능

- Tools: `greet`, `calculator`, `time-tool`, `geocode`, `get_weather`,
  `generate-image`
- Resource: `server://info`
- Prompt: `code_review`

서버 등록 로직은 `src/index.ts`, HTTP Route Handler는
`app/api/mcp/route.ts`에 있습니다.

## 보안 주의

과거 설정 파일이나 채팅, 로그 등에 실제 Hugging Face 토큰이 노출됐다면 해당
토큰을 즉시 폐기하고 새 토큰을 발급하세요. 비밀값은 커밋하지 마세요.

## 참고

- [Deploy MCP servers to Vercel](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel)
- [vercel/mcp-handler](https://github.com/vercel/mcp-handler)
