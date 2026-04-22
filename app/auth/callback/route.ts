import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Sanitize the `next` redirect param to prevent open-redirect attacks.
 * Only allow single-slash relative paths (e.g. `/dashboard`).
 * Reject protocol-relative (`//evil.com`), backslash variants (`/\evil.com`),
 * and anything that doesn't start with `/`.
 */
function sanitizeNext(raw: string | null): string {
  if (!raw) return '/dashboard'
  if (!raw.startsWith('/')) return '/dashboard'
  if (raw.startsWith('//')) return '/dashboard'
  if (raw.startsWith('/\\')) return '/dashboard'
  return raw
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = sanitizeNext(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Detect first-time OAuth signups: check if the profile row was created
      // within the last 60 seconds (profile is inserted on first sign-in via
      // the handle_new_user trigger). If so, redirect to onboarding with a
      // flag so the client can fire the conversion event.
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', user.id)
          .single()

        if (profile) {
          const createdAt = new Date(profile.created_at as string).getTime()
          const isNewUser = Date.now() - createdAt < 60_000
          if (isNewUser) {
            return NextResponse.redirect(`${origin}/onboarding?new_signup=true`)
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
