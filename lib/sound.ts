// Sound effects for the quiz system
// Uses Web Audio API for simple sound generation
// Respects user preferences for sound

export type SoundType = 
  | "correct" 
  | "wrong" 
  | "click" 
  | "complete" 
  | "streak" 
  | "levelUp" 
  | "achievement";

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig | SoundConfig[]> = {
  correct: {
    frequency: 800,
    duration: 0.15,
    type: "sine",
    volume: 0.3,
  },
  wrong: {
    frequency: 200,
    duration: 0.3,
    type: "sawtooth",
    volume: 0.2,
  },
  click: {
    frequency: 400,
    duration: 0.05,
    type: "sine",
    volume: 0.1,
  },
  complete: [
    { frequency: 523.25, duration: 0.1, type: "sine", volume: 0.3 }, // C5
    { frequency: 659.25, duration: 0.1, type: "sine", volume: 0.3 }, // E5
    { frequency: 783.99, duration: 0.1, type: "sine", volume: 0.3 }, // G5
    { frequency: 1046.5, duration: 0.3, type: "sine", volume: 0.3 }, // C6
  ],
  streak: [
    { frequency: 600, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 800, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 1000, duration: 0.2, type: "sine", volume: 0.3 },
  ],
  levelUp: [
    { frequency: 440, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 554, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 659, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 880, duration: 0.4, type: "sine", volume: 0.3 },
  ],
  achievement: [
    { frequency: 523, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 659, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 784, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 1047, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 1319, duration: 0.4, type: "sine", volume: 0.3 },
  ],
};

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    // Check for saved preferences
    if (typeof window !== "undefined") {
      const savedEnabled = localStorage.getItem("soundEnabled");
      const savedVolume = localStorage.getItem("soundVolume");
      
      if (savedEnabled !== null) {
        this.enabled = savedEnabled === "true";
      }
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    // Resume if suspended (browser policy)
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  private playTone(config: SoundConfig): void {
    const ctx = this.getAudioContext();
    if (!ctx || !this.enabled) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = config.frequency;
    oscillator.type = config.type;

    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(config.volume * this.volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + config.duration);

    oscillator.start(now);
    oscillator.stop(now + config.duration);
  }

  play(type: SoundType): void {
    const config = SOUND_CONFIGS[type];
    
    if (Array.isArray(config)) {
      // Play sequence
      let delay = 0;
      config.forEach((tone) => {
        setTimeout(() => this.playTone(tone), delay * 1000);
        delay += tone.duration;
      });
    } else {
      this.playTone(config);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("soundEnabled", enabled.toString());
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (typeof window !== "undefined") {
      localStorage.setItem("soundVolume", this.volume.toString());
    }
  }

  getVolume(): number {
    return this.volume;
  }

  toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Haptic feedback for mobile devices
export function triggerHaptic(type: "light" | "medium" | "heavy" = "light"):
  boolean {
  if (typeof navigator === "undefined") return false;
  
  const navigatorVibrate = navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean };
  
  if (!navigatorVibrate.vibrate) return false;

  const patterns = {
    light: 10,
    medium: 20,
    heavy: 30,
  };

  try {
    return navigatorVibrate.vibrate(patterns[type]);
  } catch {
    return false;
  }
}

// Combined feedback function
export function triggerFeedback(
  type: "correct" | "wrong" | "click" | "complete",
  options: { sound?: boolean; haptic?: boolean } = {}
): void {
  const { sound = true, haptic = true } = options;

  if (sound) {
    soundManager.play(type);
  }

  if (haptic) {
    const hapticType = type === "correct" ? "light" : type === "wrong" ? "medium" : "light";
    triggerHaptic(hapticType);
  }
}

export default soundManager;
