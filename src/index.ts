import { InferenceClient } from '@huggingface/inference'
import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'

export const SERVER_NAME = 'typescript-mcp-server'
export const SERVER_VERSION = '1.0.0'

interface RegisterMcpServerOptions {
    hfToken?: string
}

export function registerMcpServer(
    server: McpServer,
    { hfToken }: RegisterMcpServerOptions = {}
): void {
    server.registerTool(
    'greet',
    {
        description: '이름과 언어를 입력하면 인사말을 반환합니다.',
        inputSchema: z.object({
            name: z.string().describe('인사할 사람의 이름'),
            language: z
                .enum(['ko', 'en'])
                .optional()
                .default('en')
                .describe('인사 언어 (기본값: en)')
        }),
        outputSchema: z.object({
            content: z
                .array(
                    z.object({
                        type: z.literal('text'),
                        text: z.string().describe('인사말')
                    })
                )
                .describe('인사말')
        })
    },
    async ({ name, language }) => {
        const greeting =
            language === 'ko'
                ? `안녕하세요, ${name}님!`
                : `Hey there, ${name}! 👋 Nice to meet you!`

        return {
            content: [
                {
                    type: 'text' as const,
                    text: greeting
                }
            ],
            structuredContent: {
                content: [
                    {
                        type: 'text' as const,
                        text: greeting
                    }
                ]
            }
        }
    }
)

server.registerTool(
    'calculator',
    {
        description:
            '두 개의 숫자와 하나의 연산자를 입력받아 계산 결과를 반환합니다.',
        inputSchema: z.object({
            a: z.number().describe('첫 번째 숫자'),
            b: z.number().describe('두 번째 숫자'),
            operator: z
                .enum(['+', '-', '*', '/'])
                .describe('수행할 연산자 (+, -, *, /)')
        }),
        outputSchema: z.object({
            content: z
                .array(
                    z.object({
                        type: z.literal('text'),
                        text: z.string().describe('계산 결과')
                    })
                )
                .describe('계산 결과')
        })
    },
    async ({ a, b, operator }) => {
        let result: number

        switch (operator) {
            case '+':
                result = a + b
                break
            case '-':
                result = a - b
                break
            case '*':
                result = a * b
                break
            case '/':
                if (b === 0) {
                    throw new Error('0으로 나눌 수 없습니다.')
                }
                result = a / b
                break
            default:
                throw new Error('지원하지 않는 연산자입니다.')
        }

        const text = `${a} ${operator} ${b} = ${result}`

        return {
            content: [
                {
                    type: 'text' as const,
                    text
                }
            ],
            structuredContent: {
                content: [
                    {
                        type: 'text' as const,
                        text
                    }
                ]
            }
        }
    }
)

const COUNTRY_TIMEZONES: Record<string, string> = {
    한국: 'Asia/Seoul',
    대한민국: 'Asia/Seoul',
    korea: 'Asia/Seoul',
    'south korea': 'Asia/Seoul',
    kr: 'Asia/Seoul',
    북한: 'Asia/Pyongyang',
    'north korea': 'Asia/Pyongyang',
    kp: 'Asia/Pyongyang',
    일본: 'Asia/Tokyo',
    japan: 'Asia/Tokyo',
    jp: 'Asia/Tokyo',
    중국: 'Asia/Shanghai',
    china: 'Asia/Shanghai',
    cn: 'Asia/Shanghai',
    대만: 'Asia/Taipei',
    taiwan: 'Asia/Taipei',
    tw: 'Asia/Taipei',
    홍콩: 'Asia/Hong_Kong',
    'hong kong': 'Asia/Hong_Kong',
    hk: 'Asia/Hong_Kong',
    싱가포르: 'Asia/Singapore',
    singapore: 'Asia/Singapore',
    sg: 'Asia/Singapore',
    태국: 'Asia/Bangkok',
    thailand: 'Asia/Bangkok',
    th: 'Asia/Bangkok',
    베트남: 'Asia/Ho_Chi_Minh',
    vietnam: 'Asia/Ho_Chi_Minh',
    vn: 'Asia/Ho_Chi_Minh',
    필리핀: 'Asia/Manila',
    philippines: 'Asia/Manila',
    ph: 'Asia/Manila',
    인도네시아: 'Asia/Jakarta',
    indonesia: 'Asia/Jakarta',
    id: 'Asia/Jakarta',
    말레이시아: 'Asia/Kuala_Lumpur',
    malaysia: 'Asia/Kuala_Lumpur',
    my: 'Asia/Kuala_Lumpur',
    인도: 'Asia/Kolkata',
    india: 'Asia/Kolkata',
    in: 'Asia/Kolkata',
    아랍에미리트: 'Asia/Dubai',
    uae: 'Asia/Dubai',
    'united arab emirates': 'Asia/Dubai',
    ae: 'Asia/Dubai',
    사우디아라비아: 'Asia/Riyadh',
    'saudi arabia': 'Asia/Riyadh',
    sa: 'Asia/Riyadh',
    미국: 'America/New_York',
    usa: 'America/New_York',
    'united states': 'America/New_York',
    'united states of america': 'America/New_York',
    us: 'America/New_York',
    캐나다: 'America/Toronto',
    canada: 'America/Toronto',
    ca: 'America/Toronto',
    멕시코: 'America/Mexico_City',
    mexico: 'America/Mexico_City',
    mx: 'America/Mexico_City',
    브라질: 'America/Sao_Paulo',
    brazil: 'America/Sao_Paulo',
    br: 'America/Sao_Paulo',
    아르헨티나: 'America/Argentina/Buenos_Aires',
    argentina: 'America/Argentina/Buenos_Aires',
    ar: 'America/Argentina/Buenos_Aires',
    영국: 'Europe/London',
    uk: 'Europe/London',
    'united kingdom': 'Europe/London',
    britain: 'Europe/London',
    gb: 'Europe/London',
    프랑스: 'Europe/Paris',
    france: 'Europe/Paris',
    fr: 'Europe/Paris',
    독일: 'Europe/Berlin',
    germany: 'Europe/Berlin',
    de: 'Europe/Berlin',
    이탈리아: 'Europe/Rome',
    italy: 'Europe/Rome',
    it: 'Europe/Rome',
    스페인: 'Europe/Madrid',
    spain: 'Europe/Madrid',
    es: 'Europe/Madrid',
    네덜란드: 'Europe/Amsterdam',
    netherlands: 'Europe/Amsterdam',
    nl: 'Europe/Amsterdam',
    스위스: 'Europe/Zurich',
    switzerland: 'Europe/Zurich',
    ch: 'Europe/Zurich',
    스웨덴: 'Europe/Stockholm',
    sweden: 'Europe/Stockholm',
    se: 'Europe/Stockholm',
    노르웨이: 'Europe/Oslo',
    norway: 'Europe/Oslo',
    no: 'Europe/Oslo',
    핀란드: 'Europe/Helsinki',
    finland: 'Europe/Helsinki',
    fi: 'Europe/Helsinki',
    폴란드: 'Europe/Warsaw',
    poland: 'Europe/Warsaw',
    pl: 'Europe/Warsaw',
    러시아: 'Europe/Moscow',
    russia: 'Europe/Moscow',
    ru: 'Europe/Moscow',
    튀르키예: 'Europe/Istanbul',
    터키: 'Europe/Istanbul',
    turkey: 'Europe/Istanbul',
    tr: 'Europe/Istanbul',
    그리스: 'Europe/Athens',
    greece: 'Europe/Athens',
    gr: 'Europe/Athens',
    이집트: 'Africa/Cairo',
    egypt: 'Africa/Cairo',
    eg: 'Africa/Cairo',
    남아프리카공화국: 'Africa/Johannesburg',
    'south africa': 'Africa/Johannesburg',
    za: 'Africa/Johannesburg',
    호주: 'Australia/Sydney',
    오스트레일리아: 'Australia/Sydney',
    australia: 'Australia/Sydney',
    au: 'Australia/Sydney',
    뉴질랜드: 'Pacific/Auckland',
    'new zealand': 'Pacific/Auckland',
    nz: 'Pacific/Auckland'
}

function resolveCountryTimezone(country: string): string | undefined {
    const key = country.trim().toLowerCase().replace(/\s+/g, ' ')
    return COUNTRY_TIMEZONES[key] ?? COUNTRY_TIMEZONES[country.trim()]
}

function formatCountryTime(country: string, timeZone: string): string {
    const formatted = new Intl.DateTimeFormat('ko-KR', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    }).format(new Date())

    return `${country}의 현재 시간: ${formatted} (${timeZone})`
}

server.registerTool(
    'time-tool',
    {
        title: 'Time Tool',
        description:
            '나라 이름을 입력하면 해당 나라의 현재 시간을 반환합니다.',
        inputSchema: z.object({
            country: z.string().describe('시간을 조회할 나라 이름')
        }),
        outputSchema: z.object({
            content: z
                .array(
                    z.object({
                        type: z.literal('text'),
                        text: z.string().describe('해당 나라의 현재 시간')
                    })
                )
                .describe('해당 나라의 현재 시간')
        })
    },
    async ({ country }) => {
        const timeZone = resolveCountryTimezone(country)

        if (!timeZone) {
            throw new Error(
                `지원하지 않는 나라입니다: ${country}. 나라 이름(예: 한국, Japan, USA)으로 다시 입력해 주세요.`
            )
        }

        const text = formatCountryTime(country, timeZone)

        return {
            content: [
                {
                    type: 'text' as const,
                    text
                }
            ],
            structuredContent: {
                content: [
                    {
                        type: 'text' as const,
                        text
                    }
                ]
            }
        }
    }
)

type OpenMeteoError = {
    error?: boolean
    reason?: string
}

type GeocodeResult = {
    name: string
    latitude: number
    longitude: number
    country?: string
    admin1?: string
    timezone?: string
}

type GeocodeResponse = OpenMeteoError & {
    results?: GeocodeResult[]
}

type CurrentWeather = {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
}

type ForecastResponse = OpenMeteoError & {
    timezone?: string
    current?: CurrentWeather
}

const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
    0: '맑음',
    1: '대체로 맑음',
    2: '부분적으로 흐림',
    3: '흐림',
    45: '안개',
    48: '착빙 안개',
    51: '약한 이슬비',
    53: '이슬비',
    55: '강한 이슬비',
    56: '약한 언 이슬비',
    57: '강한 언 이슬비',
    61: '약한 비',
    63: '비',
    65: '강한 비',
    66: '약한 언 비',
    67: '강한 언 비',
    71: '약한 눈',
    73: '눈',
    75: '강한 눈',
    77: '싸라기눈',
    80: '약한 소나기',
    81: '소나기',
    82: '강한 소나기',
    85: '약한 소낙눈',
    86: '강한 소낙눈',
    95: '뇌우',
    96: '약한 우박을 동반한 뇌우',
    99: '강한 우박을 동반한 뇌우'
}

function describeWeatherCode(code: number): string {
    return WEATHER_CODE_DESCRIPTIONS[code] ?? `알 수 없음 (코드 ${code})`
}

async function parseOpenMeteoJson<T extends OpenMeteoError>(
    response: Response
): Promise<T> {
    const data = (await response.json()) as T

    if (!response.ok || data.error) {
        throw new Error(
            data.reason ??
                `Open-Meteo 요청에 실패했습니다. (HTTP ${response.status})`
        )
    }

    return data
}

async function searchLocations(
    query: string,
    count: number
): Promise<GeocodeResult[]> {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
    url.searchParams.set('name', query)
    url.searchParams.set('count', String(count))
    url.searchParams.set('language', 'ko')

    const response = await fetch(url)
    const data = await parseOpenMeteoJson<GeocodeResponse>(response)
    const results = data.results ?? []

    if (results.length === 0) {
        throw new Error(`좌표를 찾지 못했습니다: ${query}`)
    }

    return results
}

async function fetchCurrentWeather(
    latitude: number,
    longitude: number
): Promise<{ current: CurrentWeather; timezone: string }> {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(latitude))
    url.searchParams.set('longitude', String(longitude))
    url.searchParams.set(
        'current',
        [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'precipitation',
            'weather_code',
            'wind_speed_10m'
        ].join(',')
    )
    url.searchParams.set('timezone', 'auto')

    const response = await fetch(url)
    const data = await parseOpenMeteoJson<ForecastResponse>(response)

    if (!data.current) {
        throw new Error('날씨 정보를 가져오지 못했습니다.')
    }

    return {
        current: data.current,
        timezone: data.timezone ?? 'auto'
    }
}

function formatGeocodeResults(query: string, results: GeocodeResult[]): string {
    const lines = results.map((result, index) => {
        const region = [result.admin1, result.country].filter(Boolean).join(', ')
        const timezone = result.timezone ? `, 타임존 ${result.timezone}` : ''
        const location = region ? ` (${region})` : ''

        return `${index + 1}. ${result.name}${location}: 위도 ${result.latitude}, 경도 ${result.longitude}${timezone}`
    })

    return `"${query}" 검색 결과:\n${lines.join('\n')}`
}

function formatCurrentWeather(
    latitude: number,
    longitude: number,
    current: CurrentWeather,
    timezone: string
): string {
    return [
        `위도 ${latitude}, 경도 ${longitude}의 현재 날씨`,
        `날씨: ${describeWeatherCode(current.weather_code)}`,
        `기온: ${current.temperature_2m}°C`,
        `체감온도: ${current.apparent_temperature}°C`,
        `습도: ${current.relative_humidity_2m}%`,
        `풍속: ${current.wind_speed_10m} km/h`,
        `강수량: ${current.precipitation} mm`,
        `관측 시각: ${current.time} (${timezone})`
    ].join('\n')
}

server.registerTool(
    'geocode',
    {
        description:
            '주소나 도시 이름을 입력하면 해당 장소의 위도, 경도 좌표를 반환합니다.',
        inputSchema: z.object({
            query: z
                .string()
                .describe('좌표를 조회할 도시, 장소 또는 우편번호'),
            count: z
                .number()
                .int()
                .min(1)
                .max(10)
                .optional()
                .default(5)
                .describe('반환할 검색 결과 개수 (기본값: 5, 최대: 10)')
        }),
        outputSchema: z.object({
            content: z
                .array(
                    z.object({
                        type: z.literal('text'),
                        text: z.string().describe('위도, 경도 좌표 검색 결과')
                    })
                )
                .describe('위도, 경도 좌표 검색 결과')
        })
    },
    async ({ query, count }) => {
        const results = await searchLocations(query, count)
        const text = formatGeocodeResults(query, results)

        return {
            content: [
                {
                    type: 'text' as const,
                    text
                }
            ],
            structuredContent: {
                content: [
                    {
                        type: 'text' as const,
                        text
                    }
                ]
            }
        }
    }
)

server.registerTool(
    'get_weather',
    {
        description:
            '위도와 경도 좌표로 해당 위치의 현재 날씨 정보를 반환합니다.',
        inputSchema: z.object({
            latitude: z.number().describe('위도'),
            longitude: z.number().describe('경도')
        }),
        outputSchema: z.object({
            content: z
                .array(
                    z.object({
                        type: z.literal('text'),
                        text: z.string().describe('현재 날씨 정보')
                    })
                )
                .describe('현재 날씨 정보')
        })
    },
    async ({ latitude, longitude }) => {
        const { current, timezone } = await fetchCurrentWeather(
            latitude,
            longitude
        )
        const text = formatCurrentWeather(
            latitude,
            longitude,
            current,
            timezone
        )

        return {
            content: [
                {
                    type: 'text' as const,
                    text
                }
            ],
            structuredContent: {
                content: [
                    {
                        type: 'text' as const,
                        text
                    }
                ]
            }
        }
    }
)

server.registerTool(
    'generate-image',
    {
        description: '텍스트 프롬프트로 이미지를 생성합니다.',
        inputSchema: z.object({
            prompt: z.string().describe('이미지 생성 프롬프트'),
            num_inference_steps: z
                .number()
                .int()
                .min(1)
                .max(10)
                .optional()
                .default(4)
                .describe('추론 스텝 수 (기본값: 4, 범위: 1~10)')
        })
    },
    async ({ prompt, num_inference_steps }) => {
        const normalizedHfToken = hfToken?.trim()
        if (!normalizedHfToken) {
            return {
                content: [
                    {
                        type: 'text' as const,
                        text: 'x-hf-token 요청 헤더가 필요합니다.'
                    }
                ]
            }
        }

        try {
            const client = new InferenceClient(normalizedHfToken)
            const image = await client.textToImage(
                {
                    provider: 'fal-ai',
                    model: 'black-forest-labs/FLUX.1-schnell',
                    inputs: prompt,
                    parameters: { num_inference_steps }
                },
                { outputType: 'blob' }
            )
            const base64 = Buffer.from(await image.arrayBuffer()).toString(
                'base64'
            )

            return {
                content: [
                    {
                        type: 'image' as const,
                        data: base64,
                        mimeType: 'image/png'
                    }
                ]
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error)

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: `이미지 생성에 실패했습니다: ${message}`
                    }
                ]
            }
        }
    }
)

server.registerResource(
    'server-info',
    'server://info',
    {
        title: '서버 구성 정보',
        description:
            '이 MCP 서버의 구성, 제공 도구, 런타임 상태를 보여주는 예시 리소스입니다.',
        mimeType: 'application/json'
    },
    async uri => {
        const serverInfo = {
            name: SERVER_NAME,
            version: SERVER_VERSION,
            status: 'healthy',
            environment: 'development',
            region: 'ap-northeast-2',
            datacenter: 'fake-seoul-1',
            transport: {
                type: 'streamable-http',
                protocol: 'MCP over HTTP',
                endpoint: '/api/mcp'
            },
            capabilities: {
                tools: true,
                resources: true,
                prompts: true
            },
            tools: [
                {
                    name: 'greet',
                    description: '이름과 언어를 입력하면 인사말을 반환합니다.'
                },
                {
                    name: 'calculator',
                    description:
                        '두 개의 숫자와 하나의 연산자를 입력받아 계산 결과를 반환합니다.'
                },
                {
                    name: 'time-tool',
                    description:
                        '나라 이름을 입력하면 해당 나라의 현재 시간을 반환합니다.'
                },
                {
                    name: 'geocode',
                    description:
                        '주소나 도시 이름을 입력하면 해당 장소의 위도, 경도 좌표를 반환합니다.'
                },
                {
                    name: 'get_weather',
                    description:
                        '위도와 경도 좌표로 해당 위치의 현재 날씨 정보를 반환합니다.'
                },
                {
                    name: 'generate-image',
                    description: '텍스트 프롬프트로 이미지를 생성합니다.'
                }
            ],
            resources: [
                {
                    name: 'server-info',
                    uri: 'server://info',
                    description: '가짜 서버 구성 정보'
                }
            ],
            prompts: [
                {
                    name: 'code_review',
                    description:
                        '코드를 입력받아 언어와 상관없이 단계적으로 상세 리뷰하는 프롬프트'
                }
            ],
            limits: {
                maxConcurrentRequests: 16,
                timeoutMs: 10_000,
                rateLimitPerMinute: 120
            },
            runtime: {
                language: 'TypeScript',
                node: process.version,
                platform: process.platform,
                uptimeSeconds: Math.round(process.uptime())
            },
            owner: {
                team: 'multicampus-demo',
                contact: 'demo@example.com'
            },
            generatedAt: new Date().toISOString()
        }

        return {
            contents: [
                {
                    uri: uri.href,
                    mimeType: 'application/json',
                    text: JSON.stringify(serverInfo, null, 2)
                }
            ]
        }
    }
)

function buildCodeReviewPrompt(
    code: string,
    language?: string,
    focus?: string
): string {
    const languageHint = language?.trim()
        ? `작성자가 알려준 언어/런타임: ${language.trim()}`
        : '언어는 코드 자체에서 추정하세요. 확신이 없으면 근거와 함께 추정 언어를 밝히고, 언어를 단정하지 마세요.'
    const focusHint = focus?.trim()
        ? `추가 초점: ${focus.trim()}\n이 초점을 빠뜨리지 말되, 아래 전체 절차는 그대로 수행하세요.`
        : '특정 초점 요청은 없습니다. 아래 절차를 빠짐없이 수행하세요.'

    return `당신은 특정 언어에 묶이지 않은 시니어 코드 리뷰어입니다.
문법을 외워서 평가하지 말고, 코드가 실제로 하는 일과 실패 지점을 단계적으로 추적하세요.
가정을 할 때는 가정임을 명시하세요. 코드에 없는 버그를 지어내지 마세요.

${languageHint}
${focusHint}

리뷰 대상 코드:
\`\`\`
${code}
\`\`\`

아래 순서를 건너뛰지 말고 진행하세요. 각 단계마다 코드의 구체적인 위치(함수/블록/조건)를 인용하세요.

1. 한눈에 파악하기
- 이 코드의 목적, 입력, 출력, 부작용을 한 단락으로 정리합니다.
- 진입점, 주요 데이터 흐름, 외부 의존성(I/O, 네트워크, 전역 상태, 라이브러리)을 표시합니다.
- 공개 인터페이스와 내부 구현을 구분합니다.

2. 실행 경로 따라가기
- 정상 경로를 한 줄씩 따라가며 값이 어떻게 변하는지 설명합니다.
- 분기, 반복, 재귀, 조기 반환, 예외/에러 전파가 일어나는 지점을 모두 적습니다.
- 빈 값, 경계값, 동시성, 부분 실패처럼 잘 빠지는 경로가 있는지도 확인합니다.

3. 정확성과 계약
- 의도한 계약(인자, 반환, 불변조건)과 실제 구현이 맞는지 검증합니다.
- 오프바이원, 잘못된 조건, 상태 오염, 잘못된 타입/단위, 침묵하는 실패를 찾습니다.
- 호출자가 오용하기 쉬운 API가 있으면 지적합니다.

4. 안정성과 오류 처리
- 실패 가능한 지점이 어떻게 처리되는지 확인합니다.
- 삼켜진 예외, 모호한 에러, 리소스 누수, 정리(cleanup) 누락을 표시합니다.
- 재시도, 타임아웃, 부분 성공이 필요한데도 없는 경우를 적습니다.

5. 보안과 신뢰 경계
- 입력 검증, 권한, 비밀정보, 경로/명령 주입, 로그 민감정보, 안전하지 않은 기본값을 점검합니다.
- 해당 코드에 보안 이슈가 없으면 "해당 없음"이라고 쓰고 이유를 짧게 적습니다.

6. 성능과 복잡도
- 핫 경로, 불필요한 복사, N+1, 블로킹, 과도한 할당을 찾습니다.
- 실제 비용이 커 보이지 않으면 추측성 최적화 제안은 하지 않습니다.

7. 구조, 가독성, 유지보수
- 이름, 책임 분리, 중복, 숨은 결합, 테스트하기 어려운 지점을 평가합니다.
- 언어 관용구를 강요하지 말고, 이 코드의 맥락에서 더 명확해지는 구조만 제안합니다.

8. 최종 리뷰 보고서
반드시 아래 형식으로 마무리합니다.

- 총평: 심각도(치명/높음/중간/낮음)와 한 줄 요약
- 반드시 고칠 것: 근거와 함께 우선순위 순
- 개선하면 좋은 것: 선택적 제안
- 잘된 점: 유지할 패턴
- 확인이 필요한 가정: 작성자에게 물어볼 질문

각 이슈는 "위치 / 문제 / 왜 문제인지 / 더 안전한 방향"을 포함하세요.
확신이 낮은 항목은 확신도를 함께 표시하세요.`
}

server.registerPrompt(
    'code_review',
    {
        title: '단계적 코드 리뷰',
        description:
            '코드를 입력받아 언어와 상관없이 실행 경로부터 안정성, 보안, 구조까지 단계적으로 상세 리뷰합니다.',
        argsSchema: z.object({
            code: z.string().describe('리뷰할 코드'),
            language: z
                .string()
                .optional()
                .describe(
                    '알고 있는 경우 프로그래밍 언어 또는 런타임 (선택)'
                ),
            focus: z
                .string()
                .optional()
                .describe(
                    '특별히 보고 싶은 초점. 예: 보안, 동시성, 성능, API 설계 (선택)'
                )
        })
    },
    ({ code, language, focus }) => ({
        description:
            '입력 코드를 언어와 상관없이 단계적으로 상세 리뷰하는 절차적 프롬프트',
        messages: [
            {
                role: 'user' as const,
                content: {
                    type: 'text' as const,
                    text: buildCodeReviewPrompt(code, language, focus)
                }
            }
        ]
    })
    )
}
