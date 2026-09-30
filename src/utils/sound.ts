// Web Audio API & Speech Synthesis for SmartQueue Audio Chimes

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Plays the iconic SmartQueue two-tone chime:
 * Tone 1: 523.25 Hz (C5) for 250ms
 * Tone 2: 783.99 Hz (G5) for 450ms
 */
export function playQueueChime(volume = 0.25): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(volume, now)
    masterGain.connect(ctx.destination)

    // First tone (pleasant chime)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(587.33, now) // D5
    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(1, now + 0.04)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
    osc1.connect(gain1)
    gain1.connect(masterGain)
    osc1.start(now)
    osc1.stop(now + 0.38)

    // Second tone (higher harmony)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880.0, now + 0.22) // A5
    gain2.gain.setValueAtTime(0, now + 0.22)
    gain2.gain.linearRampToValueAtTime(1, now + 0.26)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85)
    osc2.connect(gain2)
    gain2.connect(masterGain)
    osc2.start(now + 0.22)
    osc2.stop(now + 0.88)
  } catch (err) {
    console.warn('Audio chime could not be played:', err)
  }
}

/**
 * Announcement audio for VIP / Emergency Triage alerts
 */
export function playAlertChime(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(659.25, now) // E5
    osc.frequency.setValueAtTime(880.0, now + 0.15) // A5
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.55)
  } catch {
    // ignore
  }
}

/**
 * Text-to-speech voice callout for kiosks and waiting displays
 */
export function speakTicketAnnouncement(ticketId: string, counterNumber: number | string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel() // clear queued speech
    const cleanId = ticketId.replace(/([A-Za-z]+)-?(\d+)/, '$1 $2')
    const utterance = new SpeechSynthesisUtterance(`Ticket ${cleanId}, please proceed to counter ${counterNumber}`)
    utterance.rate = 0.95
    utterance.pitch = 1.05
    utterance.volume = 0.8
    window.speechSynthesis.speak(utterance)
  } catch (err) {
    console.warn('Speech synthesis unavailable:', err)
  }
}
