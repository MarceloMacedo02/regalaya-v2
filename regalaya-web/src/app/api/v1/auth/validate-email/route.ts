import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ available: false, message: 'Email é obrigatório' }, { status: 400 });
  }

  try {
    const response = await fetch(`http://localhost:8080/api/v1/auth/validate-email?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { available: false, message: 'Erro ao validar email' },
      { status: 500 }
    );
  }
}
