/**
 * Soft wind / hush when a kite is released — Web Audio, no external files.
 * Call from a user gesture so autoplay policies allow playback.
 */
export function playKiteHushSound(): void {
  if (typeof window === "undefined") return;

  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;

  try {
    const ctx = new AC();
    const duration = 0.72;
    const sampleRate = ctx.sampleRate;
    const n = Math.floor(duration * sampleRate);
    const buffer = ctx.createBuffer(1, n, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < n; i++) {
      const t = i / sampleRate;
      const rise = Math.min(1, t / 0.12);
      const fall = Math.max(0, 1 - (t - 0.35) / (duration - 0.35));
      const envelope = rise * fall * fall;
      const pink = (Math.random() * 2 - 1) * 0.22;
      const breath = Math.sin(t * Math.PI * 6) * 0.04 * envelope;
      data[i] = (pink + breath) * envelope;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.setValueAtTime(900, ctx.currentTime);
    low.Q.setValueAtTime(0.7, ctx.currentTime);

    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.setValueAtTime(180, ctx.currentTime);

    const gain = ctx.createGain();
    const t0 = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(0.32, t0 + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.02, t0 + duration);

    src.connect(high);
    high.connect(low);
    low.connect(gain);
    gain.connect(ctx.destination);

    src.start(t0);
    src.stop(t0 + duration + 0.08);

    src.onended = () => {
      ctx.close().catch(() => {});
    };
  } catch {
    /* ignore */
  }
}
