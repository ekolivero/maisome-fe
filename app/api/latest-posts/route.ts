import { NextResponse } from 'next/server'
import { latestPostsQuery } from '@/sanity/lib/queries'
import { client } from "@/sanity/lib/client"

export async function GET() {
  try {
    const posts = await client.fetch(latestPostsQuery)
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching latest posts' }, { status: 500 })
  }
}