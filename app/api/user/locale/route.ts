import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { UserService } from '@/lib/services/user.service'
import { createAdminClient } from '@/lib/supabase/admin'
import { isValidLocale } from '@/i18n/config'

/**
 * PATCH /api/user/locale
 *
 * Persists the user's preferred_locale to their Supabase profile
 * so it is restored across devices when they are authenticated.
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { locale } = body as { locale?: string }

    if (!isValidLocale(locale)) {
      return NextResponse.json({ error: 'Invalid locale.' }, { status: 400 })
    }

    const adminClient = createAdminClient()
    const userService = new UserService(adminClient)
    await userService.updateUser(session.user.id, {
      preferred_locale: locale,
    } as any)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[User Locale] Error:', error)
    return NextResponse.json({ error: 'Failed to update locale.' }, { status: 500 })
  }
}
