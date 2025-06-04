import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
 try {
     const prompt = "";    //write your prompt here
   
     const result = streamText({
       model: openai('gpt-4o'),
       maxTokens:200,
       prompt
     });
   
     return result.toDataStreamResponse();
 } catch (error) {
    if (error instanceof OpenAI.APIError) {
        const {name,status,headers,message} = error;
        return NextResponse.json({
            name,status,headers,message
        },{status})
    } else {
        console.error("an unexpected error occured",error)
        throw  error;
    }
 }
}