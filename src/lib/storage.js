import { supabase } from './supabaseClient.js'

const USER_KEY = 'cadp_user_id'

// El código de usuario reemplaza al antiguo device_id aleatorio.
// Así, escribiendo el mismo código en cualquier navegador, se comparte el progreso.
export function getUserId() {
  return localStorage.getItem(USER_KEY) || null
}

export function setUserId(raw) {
  const id = String(raw)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (id) localStorage.setItem(USER_KEY, id)
  return id
}

export function clearUserId() {
  localStorage.removeItem(USER_KEY)
}

function localKey(userId) {
  return `cadp_progress_${userId}`
}

export async function loadProgress() {
  const userId = getUserId()
  if (!userId) return {}

  if (supabase) {
    const { data, error } = await supabase
      .from('progress')
      .select('data')
      .eq('device_id', userId)
      .maybeSingle()
    if (!error && data) {
      // Cacheamos localmente para poder seguir si no hay conexión
      localStorage.setItem(localKey(userId), JSON.stringify(data.data))
      return data.data
    }
  }

  const raw = localStorage.getItem(localKey(userId))
  return raw ? JSON.parse(raw) : {}
}

export async function saveProgress(progress) {
  const userId = getUserId()
  if (!userId) return

  // Siempre guardamos copia local (respaldo / offline)
  localStorage.setItem(localKey(userId), JSON.stringify(progress))

  if (supabase) {
    const { error } = await supabase.from('progress').upsert({
      device_id: userId,
      data: progress,
      updated_at: new Date().toISOString(),
    })
    if (error) console.error('Error guardando en Supabase:', error.message)
  }
}
