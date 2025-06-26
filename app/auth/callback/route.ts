import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const resetToken = requestUrl.searchParams.get('token')

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
    
    // If this is a password reset, show the HTML redirect to profile settings
    if (resetToken) {
      const profileSettingsUrl = `${requestUrl.origin}/dashboard?tab=profile-settings`;
      const html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta http-equiv="refresh" content="2;url=${profileSettingsUrl}" />
            <script>setTimeout(function(){ window.location.href = '${profileSettingsUrl}'; }, 1500);</script>
          </head>
          <body>
            <p>One moment... Redirecting you to your profile settings to change your password.</p>
            <p>If you are not redirected, <a href="${profileSettingsUrl}">click here to continue</a>.</p>
          </body>
        </html>`
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
    }
    // Otherwise, just redirect to dashboard
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
} 