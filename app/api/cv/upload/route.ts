import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { CVImportService } from '@/lib/services/cv-import.service'
import { CVImportUtils } from '@/lib/utils/cv-import.utils'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * POST /api/cv/upload
 *
 * Accepts a multipart/form-data request with a `file` field (PDF ≤ 10 MB).
 * Validates, uploads to Supabase Storage, returns the storage path.
 *
 * Authentication: requires an active session.
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    // Validate file type and size
    const validation = CVImportUtils.validateFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Convert File to Buffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const path = await CVImportService.uploadCV(buffer, session.user.id, file.type)

    return NextResponse.json({ path }, { status: 200 })
  } catch (error) {
    console.error('[CV Upload] Error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
