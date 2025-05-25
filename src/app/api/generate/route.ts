import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { fullName, jobTitle, summary, experience, education, skills } = body;

  const prompt = `
You are a professional resume writer. Write a strong 3-line summary and 3 bullet points of work experience for:
- Name: ${fullName}
- Job Title: ${jobTitle}
- Summary: ${summary}
- Experience: ${experience}
- Education: ${education}
- Skills: ${skills}
Make it clean, professional, and impactful.
`;

  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  });

  const result = response.choices[0]?.message?.content;

  return NextResponse.json({ result });
}
