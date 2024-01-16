import { NextRequest, NextResponse } from "next/server";


export async function GET (request: NextRequest, { params }: { params: { slug: string } }){
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    // @ts-ignore
    const response = await fetch(url);

    // @ts-ignore
    const arrayBuffer = await response.arrayBuffer();

    // ArrayBuffer'ı base64'e çevir
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    const json = {
      imageUrl: dataUrl
    };

    return NextResponse.json(json);
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.error('Internal Server Error', 500);
  }
}