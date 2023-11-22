import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'node_modules/next/server'

export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET(request: Request) {
  return new Response('Playground is up and running!')
}

export const runtime = 'edge'
 
export async function POST(req: Request) {
  const { messages, apiKey, stream=true } = await req.json()
  const openai = new OpenAI({apiKey})
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: stream,
    messages,
  })

  if (stream) {
    // @ts-ignore
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } else {
    return NextResponse.json(response)
  }
}