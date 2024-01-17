import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    const response = await fetch(imageUrl as string);

    const arrayBuffer = await response.arrayBuffer();

    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const imageUrlBase64 = `data:image/png;base64,${base64Image}`;

    const data = {
      imageUrlBase64,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
