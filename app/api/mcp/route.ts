import { createMcpHandler } from 'mcp-handler'

import {
    registerMcpServer,
    SERVER_NAME,
    SERVER_VERSION
} from '../../../src/index'

export const runtime = 'nodejs'
export const maxDuration = 60

async function handler(request: Request): Promise<Response> {
    const hfToken = request.headers.get('x-hf-token') ?? undefined
    const mcpHandler = createMcpHandler(
        server => registerMcpServer(server, { hfToken }),
        {
            serverInfo: {
                name: SERVER_NAME,
                version: SERVER_VERSION
            },
            maxSubscriptions: 0
        }
    )

    return mcpHandler(request)
}

export async function GET(request: Request): Promise<Response> {
    const accept = request.headers.get('accept') ?? ''

    if (!accept.includes('text/event-stream')) {
        return Response.json({
            name: SERVER_NAME,
            version: SERVER_VERSION,
            status: 'ok',
            transport: 'streamable-http',
            endpoint: '/api/mcp'
        })
    }

    return handler(request)
}

export { handler as POST }
