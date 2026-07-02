import { createAdminClient } from '@/lib/supabase/admin'

const CV_BUCKET = 'cvs'

/**
 * CVImportService — server-only storage helpers.
 *
 * IMPORTANT: This file imports next/headers via lib/supabase/server.
 * It must NEVER be imported by Client Components or client-side hooks.
 * It is imported exclusively from API Route Handlers:
 *   - /api/cv/upload/route.ts
 *   - /api/cv/extract/route.ts
 */
export class CVImportService {
  /**
   * Uploads a PDF buffer to Supabase Storage under {userId}/{timestamp}.pdf.
   * Returns the storage path for subsequent extraction.
   */
  static async uploadCV(fileBuffer: Buffer, userId: string, mimeType: string): Promise<string> {
    const supabase = createAdminClient()
    const timestamp = Date.now()
    const path = `${userId}/${timestamp}.pdf`

    const { error } = await supabase.storage
      .from(CV_BUCKET)
      .upload(path, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      })

    if (error) {
      throw new Error(`CV upload failed: ${error.message}`)
    }

    return path
  }

  /**
   * Generates a short-lived signed URL (5 minutes) for the AI to access the CV.
   */
  static async getSignedUrl(path: string): Promise<string> {
    const supabase = createAdminClient()

    const { data, error } = await supabase.storage
      .from(CV_BUCKET)
      .createSignedUrl(path, 300) // 5 minutes

    if (error || !data?.signedUrl) {
      throw new Error(`Failed to generate signed URL: ${error?.message}`)
    }

    return data.signedUrl
  }

  /**
   * Deletes a CV from storage (used to clean up anonymous files).
   */
  static async deleteCV(path: string): Promise<void> {
    const supabase = createAdminClient()
    
    const { error } = await supabase.storage
      .from(CV_BUCKET)
      .remove([path])

    if (error) {
      console.error(`Failed to delete temporary CV ${path}:`, error)
      // We don't throw here to avoid failing the whole request if deletion fails during cleanup
    }
  }
}
