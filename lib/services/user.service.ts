import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export type UserRow = Database['public']['Tables']['users']['Row']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export class UserService {
  private supabase: SupabaseClient<Database>

  constructor(supabaseClient?: SupabaseClient<Database>) {
    // Default to client-side browser client if not provided
    this.supabase = supabaseClient || createBrowserClient()
  }

  /**
   * Fetches a public user profile by their ID.
   */
  async getUserById(id: string): Promise<UserRow> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching user profile for ${id}:`, error.message)
      throw error
    }

    return data
  }

  /**
   * Updates user profile fields for the authenticated user.
   */
  async updateUser(id: string, updates: UserUpdate): Promise<UserRow> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating user profile for ${id}:`, error.message)
      throw error
    }

    return data
  }
}
