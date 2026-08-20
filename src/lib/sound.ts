let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtxClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass();
    }
  }
  return sharedAudioCtx;
}

export async function unlockAudio(): Promise<boolean> {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    // Play a crisp test chime to verify
    playOrderBellSound(0.3);
    return true;
  } catch (err) {
    console.warn('Could not unlock audio context:', err);
    return false;
  }
}

/**
 * Authentic Kitchen Order Bell ("DING-DONG")
 * Uses dual-harmonic synthesis with natural acoustic envelope
 */
export function playOrderBellSound(volume: number = 0.5): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // === TONE 1: "DING" (High resonant bell tone ~ 830Hz G#5 + 1660Hz harmonic) ===
    const osc1 = ctx.createOscillator();
    const osc1Harmonic = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(830.61, now); // G#5

    osc1Harmonic.type = 'triangle';
    osc1Harmonic.frequency.setValueAtTime(1661.22, now); // 2nd harmonic for bell brightness

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(volume * 0.9, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc1.connect(gain1);
    osc1Harmonic.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1Harmonic.start(now);
    osc1.stop(now + 0.55);
    osc1Harmonic.stop(now + 0.55);

    // === TONE 2: "DONG" (Warm lower chime ~ 659.25Hz E5 + 1318Hz harmonic) ===
    const tone2Start = now + 0.18;
    const osc2 = ctx.createOscillator();
    const osc2Harmonic = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, tone2Start); // E5

    osc2Harmonic.type = 'triangle';
    osc2Harmonic.frequency.setValueAtTime(1318.5, tone2Start);

    gain2.gain.setValueAtTime(0, tone2Start);
    gain2.gain.linearRampToValueAtTime(volume * 1.1, tone2Start + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.0001, tone2Start + 0.95);

    osc2.connect(gain2);
    osc2Harmonic.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(tone2Start);
    osc2Harmonic.start(tone2Start);
    osc2.stop(tone2Start + 0.95);
  } catch (err) {
    console.warn('Failed to play order bell sound:', err);
  }
}

/**
 * Modern High-Tech POS Triple Beep
 */
export function playTripleChime(volume: number = 0.4): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const freqs = [523.25, 659.25, 1046.5]; // C5, E5, C6
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (err) {
    console.warn('Failed to play triple chime:', err);
  }
}

export function playNotificationSound(soundType: 'bell' | 'triple' = 'bell', volume: number = 0.5): void {
  if (soundType === 'triple') {
    playTripleChime(volume);
  } else {
    playOrderBellSound(volume);
  }
}
