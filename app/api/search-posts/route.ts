import { NextResponse } from 'next/server'
import { searchPostsQuery } from '@/sanity/lib/queries'
import { client } from "@/sanity/lib/client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const searchTerm = searchParams.get('searchTerm')
  
  if (!searchTerm) {
    return NextResponse.json({ error: 'Invalid search term' }, { status: 400 })
  }

  try {
    const posts = await client.fetch(searchPostsQuery, { searchTerm })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}