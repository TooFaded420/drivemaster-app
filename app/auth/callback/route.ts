import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Detect first-time OAuth signups: check if the profile row was created
      // within the last 60 seconds (profile is inserted on first sign-in via
      // the handle_new_user trigger). If so, redirect to onboarding with a
      // flag so the client can fire the conversion event.
      //
      // TODO(oauth-conversion): fireConversion('signup_completed') is
      // client-gated (requires window + consent), so we can't call it here.
      // The onboarding page should read `?new_signup=true` on mount and call
      // fireConversion('signup_completed') then strip the param from the URL.
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
