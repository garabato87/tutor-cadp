import { supabase } from './supabaseClient.js'

function getDeviceId() {
  let id = localStorage.getItem('cadp_device_id')
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2) + Date.now()
    localStorage.setItem('cadp_device_id', id)
  }
  return id
}

export async function loadProgress() {
  const deviceId = getDeviceId()
  if (supabase) {
    const { data, error } = await supabase
      .from('progress')
      .select('data')
      .eq('device_id', deviceId)
      .single()
    if (!error && data) return data.data
  }
  const raw = localStorage.getItem('cadp_progress')
  return raw ? JSON.parse(raw) : {}
}

export async function saveProgress(progress) {
  const deviceId = getDeviceId()
  localStorage.setItem('cadp_progress', JSON.stringify(progress))
  if (supabase) {
    await supabase.from('progress').upsert({
      device_id: deviceId,
      data: progress,
      updated_at: new Date().toISOString(),
    })
  }
}
