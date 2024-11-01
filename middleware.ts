import { NextRequest, NextResponse, userAgent } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { device, ua, browser, isBot } = userAgent(request);

  console.log(device, ua, browser, isBot);
  return NextResponse.rewrite(url);
}
