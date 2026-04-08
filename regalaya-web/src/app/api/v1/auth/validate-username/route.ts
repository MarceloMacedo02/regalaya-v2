import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ available: false, message: 'Username é obrigatório' }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/auth/validate-username?username=${encodeURIComponent(username)}`);

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { available: false, message: 'Erro ao validar username' },
      { status: 500 }
    );
  }
}
