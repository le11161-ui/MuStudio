/**
 * Web Audio Engine for MuStudio
 * Supports polyphonic acoustic piano synthesis, plucked string, drum kit, and metronome clicks
 */

export type AudioTimbre =
  | 'grand_piano'
  | 'vintage_guitar'
  | 'synthwave'
  | 'cathedral'
  | 'lofi_electric'
  | 'chiptune_8bit'
  | 'music_box';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private metronomeTimer: number | null = null;
  private nextNoteTime: number = 0;
  private currentBeat: number = 0;
  public currentTimbre: AudioTimbre = 'grand_piano';

  public setTimbre(timbre: AudioTimbre) {
    this.currentTimbre = timbre;
  }

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getContext(): AudioContext {
    return this.initContext();
  }

  // Convert note name (e.g. "C4", "F#4", "Bb3") to frequency
  public noteToFreq(note: string): number {
    const noteMap: Record<string, number> = {
      'C': 0, 'C#': 1, 'Db': 1,
      'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4,
      'F': 5, 'F#': 6, 'Gb': 6,
      'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10,
      'B': 11
    };

    const match = note.match(/^([A-G][b#]?)(-?\d+)$/);
    if (!match) return 440;

    const pitchName = match[1];
    const octave = parseInt(match[2], 10);
    const semitonesFromC0 = octave * 12 + noteMap[pitchName];
    // C0 is ~16.3516 Hz, A4 (note 57 from C0) is 440 Hz
    return 440 * Math.pow(2, (semitonesFromC0 - 57) / 12);
  }

  // Numbered notation scale mapping (in C Major default: 1=C4, 2=D4, 3=E4...)
  public numberedToFreq(num: number, octaveOffset: number = 0): number {
    const majorScaleSemitones = [0, 2, 4, 5, 7, 9, 11]; // Do Re Mi Fa Sol La Ti
    if (num < 1 || num > 7) return 0;
    const semitone = majorScaleSemitones[num - 1] + octaveOffset * 12;
    // C4 is 261.63 Hz
    return 261.63 * Math.pow(2, semitone / 12);
  }

  // Play rich acoustic-like piano or equipped timbre note
  public playPianoNote(freq: number, duration: number = 1.0, timeOffset: number = 0, velocity: number = 0.8) {
    if (this.isMuted || freq <= 0) return;

    if (this.currentTimbre === 'vintage_guitar') {
      this.playPluckNote(freq, duration * 1.3, timeOffset, false);
      return;
    }

    const ctx = this.initContext();
    const startTime = ctx.currentTime + timeOffset;

    // Handle Chiptune 8-bit retro gaming timbre
    if (this.currentTimbre === 'chiptune_8bit') {
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(velocity * 0.28, startTime + 0.005);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);

      // Subtle 8-bit vibrato pitch flutter
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(12, startTime);
      lfoGain.gain.setValueAtTime(3, startTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(noteGain);
      noteGain.connect(ctx.destination);

      lfo.start(startTime);
      osc.start(startTime);
      lfo.stop(startTime + duration + 0.05);
      osc.stop(startTime + duration + 0.05);
      return;
    }

    // Handle Music Box crystalline bells
    if (this.currentTimbre === 'music_box') {
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(velocity * 0.38, startTime + 0.003);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.8);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.35, startTime);
      osc2Gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.8);

      osc1.connect(noteGain);
      osc2.connect(osc2Gain);
      osc2Gain.connect(noteGain);
      noteGain.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration * 1.8 + 0.05);
      osc2.stop(startTime + duration * 1.8 + 0.05);
      return;
    }

    // Handle Lo-Fi Electric Rhodes
    if (this.currentTimbre === 'lofi_electric') {
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(velocity * 0.4, startTime + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.3);

      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, startTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.003, startTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startTime);

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(filter);
      filter.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration * 1.3 + 0.05);
      osc2.stop(startTime + duration * 1.3 + 0.05);
      return;
    }

    const actualDuration = this.currentTimbre === 'cathedral' ? duration * 2.2 : duration;

    // Master gain for this note
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(velocity * (this.currentTimbre === 'synthwave' ? 0.35 : 0.45), startTime + 0.008);
    // Exponential natural decay
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + actualDuration);

    // Fundamental oscillator
    const osc1 = ctx.createOscillator();
    osc1.type = this.currentTimbre === 'synthwave' ? 'sawtooth' : 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Second harmonic (sine with subtle detune for chorus warmth)
    const osc2 = ctx.createOscillator();
    osc2.type = this.currentTimbre === 'synthwave' ? 'sawtooth' : 'sine';
    const detune = this.currentTimbre === 'synthwave' ? 1.8 : 0.5;
    osc2.frequency.setValueAtTime(freq * (this.currentTimbre === 'synthwave' ? 1 : 2) + detune, startTime);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(this.currentTimbre === 'synthwave' ? 0.25 : 0.3, startTime);
    osc2Gain.gain.exponentialRampToValueAtTime(0.001, startTime + actualDuration * 0.7);

    // Third harmonic
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, startTime);

    const osc3Gain = ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.12, startTime);
    osc3Gain.gain.exponentialRampToValueAtTime(0.001, startTime + actualDuration * 0.4);

    // Filter to simulate wooden piano body acoustic resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const maxFreq = this.currentTimbre === 'cathedral' ? 5500 : this.currentTimbre === 'synthwave' ? 3600 : Math.min(freq * 4.5, 4500);
    filter.frequency.setValueAtTime(maxFreq, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 300), startTime + actualDuration);

    osc1.connect(noteGain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(noteGain);
    osc3.connect(osc3Gain);
    osc3Gain.connect(noteGain);

    noteGain.connect(filter);
    filter.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);

    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
    osc3.stop(startTime + duration + 0.05);
  }

  // Play plucked acoustic guitar / ukulele string
  public playPluckNote(freq: number, duration: number = 1.2, timeOffset: number = 0, isUkulele: boolean = false) {
    if (this.isMuted || freq <= 0) return;
    const ctx = this.initContext();
    const startTime = ctx.currentTime + timeOffset;

    const pluckGain = ctx.createGain();
    pluckGain.gain.setValueAtTime(0, startTime);
    pluckGain.gain.linearRampToValueAtTime(0.5, startTime + 0.004);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    const osc = ctx.createOscillator();
    osc.type = isUkulele ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isUkulele ? 3200 : 2600, startTime);
    filter.frequency.exponentialRampToValueAtTime(isUkulele ? 600 : 400, startTime + duration * 0.6);

    osc.connect(pluckGain);
    pluckGain.connect(filter);
    filter.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  // Play Drum Kit sounds (Kick, Snare, Hi-Hat, Tom)
  public playDrumSound(type: 'kick' | 'snare' | 'hihat' | 'tom', timeOffset: number = 0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const startTime = ctx.currentTime + timeOffset;

    if (type === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(140, startTime);
      osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.12);

      gain.gain.setValueAtTime(1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    } else if (type === 'snare') {
      // Noise burst for snare snap
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(800, startTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // Snare drum body tone (180 Hz)
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();
      osc.frequency.setValueAtTime(180, startTime);
      toneGain.gain.setValueAtTime(0.4, startTime);
      toneGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      osc.connect(toneGain);
      toneGain.connect(ctx.destination);

      noise.start(startTime);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    } else if (type === 'hihat') {
      // Metallic noise
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(9000, startTime);
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(startTime);
    } else if (type === 'tom') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(180, startTime);
      osc.frequency.exponentialRampToValueAtTime(90, startTime + 0.2);
      gain.gain.setValueAtTime(0.8, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.26);
    }
  }

  // Metronome click (isAccent = high pitch woodblock)
  public playClick(isAccent: boolean = false, timeOffset: number = 0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const startTime = ctx.currentTime + timeOffset;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freq = isAccent ? 1400 : 880;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(isAccent ? 0.7 : 0.4, startTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.05);
  }

  // Play full Chord (arpeggiated or block)
  public playChord(frequencies: number[], arpeggiate: boolean = true, duration: number = 1.4, isGuitar: boolean = false) {
    frequencies.forEach((freq, idx) => {
      const offset = arpeggiate ? idx * 0.05 : 0;
      if (isGuitar) {
        this.playPluckNote(freq, duration, offset);
      } else {
        this.playPianoNote(freq, duration, offset, 0.7 - idx * 0.03);
      }
    });
  }

  // Play sequence of notes with progress callback
  public playScoreSequence(
    notes: { freq: number; durationSeconds: number; label: string }[],
    onNoteStart?: (index: number) => void,
    onComplete?: () => void
  ) {
    let accumulatedTime = 0;
    notes.forEach((item, index) => {
      const noteDelay = accumulatedTime;
      setTimeout(() => {
        if (onNoteStart) onNoteStart(index);
        if (item.freq > 0) {
          this.playPianoNote(item.freq, item.durationSeconds * 0.95);
        }
      }, noteDelay * 1000);
      accumulatedTime += item.durationSeconds;
    });

    if (onComplete) {
      setTimeout(onComplete, accumulatedTime * 1000);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    }
  }

  // Authentic Ambient Soundscape Player (Real high-fidelity field recordings)
  private ambientAudios: Map<string, HTMLAudioElement> = new Map();
  private synthesizedAmbientNodes: { source: AudioNode; gain: GainNode } | null = null;
  public activeAmbientType: 'rain' | 'vinyl' | 'fireplace' | 'cafe' | 'river' | null = null;
  public onAmbientChange?: (activeType: 'rain' | 'vinyl' | 'fireplace' | 'cafe' | 'river' | null) => void;

  public playAmbient(type: 'rain' | 'vinyl' | 'fireplace' | 'cafe' | 'river', volume: number = 0.4) {
    // If explicitly playing ambient sound, ensure engine is unmuted
    this.isMuted = false;

    // Stop previous single track if switching
    this.stopAmbient();

    try {
      this.initContext();
      let audio = this.ambientAudios.get(type);
      if (!audio) {
        audio = new Audio(`/ambient/${type}.mp3`);
        audio.loop = true;
        audio.preload = 'auto';
        this.ambientAudios.set(type, audio);
      }
      audio.volume = Math.max(0, Math.min(1, volume));
      try {
        if (audio.currentTime > 0) audio.currentTime = 0;
      } catch {
        // ignore seek error
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.activeAmbientType = type;
            if (this.onAmbientChange) this.onAmbientChange(type);
          })
          .catch((err) => {
            console.warn(`HTML5 Audio play failed for ${type}, falling back to WebAudio synthesis:`, err);
            this.playSynthesizedFallback(type, volume);
          });
      } else {
        this.activeAmbientType = type;
        if (this.onAmbientChange) this.onAmbientChange(type);
      }
    } catch (e) {
      console.warn(`Error initializing ambient ${type}, using synthesized fallback:`, e);
      this.playSynthesizedFallback(type, volume);
    }
  }

  // Dual-layer fallback: WebAudio procedural noise if browser blocks or fails to fetch local MP3
  private playSynthesizedFallback(type: 'rain' | 'vinyl' | 'fireplace' | 'cafe' | 'river', volume: number) {
    try {
      const ctx = this.initContext();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brown/pink/white noise texture
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain' || type === 'river') {
          // Pink/brown noise
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else if (type === 'vinyl' || type === 'fireplace') {
          // Mostly subtle noise with occasional crackle clicks
          const isCrack = Math.random() < (type === 'fireplace' ? 0.003 : 0.001);
          data[i] = isCrack ? (Math.random() * 2 - 1) * 0.9 : white * 0.05;
        } else {
          // Cafe warm murmur
          lastOut = (lastOut + 0.04 * white) / 1.04;
          data[i] = lastOut * 2;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
      } else if (type === 'river') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);
      } else if (type === 'fireplace') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.6)), ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      this.synthesizedAmbientNodes = { source: noiseSource, gain };
      this.activeAmbientType = type;
      if (this.onAmbientChange) this.onAmbientChange(type);
    } catch (synthErr) {
      console.error('Synthesized fallback failed:', synthErr);
    }
  }

  public setAmbientVolume(volume: number, type?: 'rain' | 'vinyl' | 'fireplace' | 'cafe' | 'river') {
    const targetType = type || this.activeAmbientType;
    if (!targetType) return;
    const audio = this.ambientAudios.get(targetType);
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
    if (this.synthesizedAmbientNodes) {
      this.synthesizedAmbientNodes.gain.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume * 0.6)),
        this.initContext().currentTime
      );
    }
  }

  public stopAmbient(type?: 'rain' | 'vinyl' | 'fireplace' | 'cafe' | 'river') {
    if (type) {
      const audio = this.ambientAudios.get(type);
      if (audio) {
        audio.pause();
        try {
          audio.currentTime = 0;
        } catch {
          // ignore
        }
      }
      if (this.activeAmbientType === type) {
        this.activeAmbientType = null;
        if (this.onAmbientChange) this.onAmbientChange(null);
      }
    } else {
      this.ambientAudios.forEach((audio) => {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch {
          // ignore
        }
      });
      if (this.synthesizedAmbientNodes) {
        try {
          (this.synthesizedAmbientNodes.source as AudioBufferSourceNode).stop();
          this.synthesizedAmbientNodes.source.disconnect();
          this.synthesizedAmbientNodes.gain.disconnect();
        } catch {
          // ignore
        }
        this.synthesizedAmbientNodes = null;
      }
      this.activeAmbientType = null;
      if (this.onAmbientChange) this.onAmbientChange(null);
    }
  }
}

export const audioEngine = new AudioEngine();

