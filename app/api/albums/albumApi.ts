import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

export const getAlbums = async () => {
  const { data, error } = await supabase
    .from('songs')
    .select('id, album, count, titles')
    .select(`
      album,
      count(*) as count,
      array_agg(title) as titles
    `)

  if (error) console.error('Error fetching albums:', error)
  return data
}