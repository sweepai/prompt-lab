import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

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

  if (response.error) {
    return Response.text(response, { status: 500 })
  }

  if (stream) {
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } else {
    return Response.json(response)
  }
}