// import OpenAI from 'openai';

// // @ts-ignore
// const openai = new OpenAI({
//   apiKey: 'My API Key', // defaults to process.env["OPENAI_API_KEY"]
// });

// export default async function callOpenAI() {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: 'user', content: 'Say this is a test' }],
//     model: 'gpt-3.5-turbo',
//   });
//   console.log(chatCompletion)
// }
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET(request: Request) {
  return new Response('Playground is up and running!')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
 
export const runtime = 'edge'
 
export async function POST(req: Request) {
  const { messages, stream=false } = await req.json()
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: stream,
    messages,
  })

  if (response.error) {
    console.log(response.error)
    return Response.text(response, { status: 500 })
  }

  if (stream) {
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } else {
    return Response.json(response)
  }
}