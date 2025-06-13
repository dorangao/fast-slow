import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai';

type Mode = 'fast' | 'slow' | 'auto';

async function decideModelForQuery(query: string): Promise<string> {
  const openai = getOpenAI();
  const classification = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a router that decides if a question needs a slow, thorough AI or a fast, simple AI.' },
      { role: 'user', content: `Should the following question use the FAST model or SLOW model? Only answer with "FAST" or "SLOW". Question: "${query}"` }
    ],
    temperature: 0,
    max_tokens: 1,
  });
  const result = classification.choices[0].message?.content?.trim().toUpperCase();
  return result === 'SLOW' ? 'gpt-4' : 'gpt-3.5-turbo';
}

export async function POST(req: NextRequest) {
  try {
    const { query, mode }: { query?: string; mode?: Mode } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }
    let model: string;
    if (mode === 'fast') {
      model = 'gpt-3.5-turbo';
    } else if (mode === 'slow') {
      model = 'gpt-4';
    } else {
      model = await decideModelForQuery(query);
    }

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: query },
      ],
      temperature: 0.7,
    });
    const answer = completion.choices[0].message?.content || '';
    return NextResponse.json({ model, answer });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
