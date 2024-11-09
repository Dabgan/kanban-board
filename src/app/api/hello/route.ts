import { NextResponse } from 'next/server';

export async function GET() {
    const data = await Promise.resolve({ message: 'Hello!' });
    return NextResponse.json(data);
}
