// Sophisticated Web Audio API Controller (Monochrome Luxury Profile)
// Generates deep, organic, mechanical and pneumatic soundscapes.

let audioCtx = null;
let masterGain = null;
let ambientSynth = null;
let engineSynth = null;

let isMuted = true;
let isStarted = false;
let enginePitchTarget = 1;
let currentEnginePitch = 1;

export function initAudio() {
  if (audioCtx) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  // Create Master Gain node
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  // Deep, warm background hum (analog equipment room hum)
  setupAmbientHum();

  // Low mechanical engine turnover
  setupEngineSynth();

  isStarted = true;
}

function setupAmbientHum() {
  if (!audioCtx) return;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gainNode = audioCtx.createGain();

  // Deep low-frequency room drone (50Hz electrical hum)
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(50, audioCtx.currentTime);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(100, audioCtx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(80, audioCtx.currentTime);

  // Extremely faint background level
  gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);

  osc1.start();
  osc2.start();

  ambientSynth = { osc1, osc2, gainNode };
}

function setupEngineSynth() {
  if (!audioCtx) return;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gainNode = audioCtx.createGain();

  // Pure analog engine low frequency drone (V6 cylinder rumble at idle)
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(65, audioCtx.currentTime);

  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(65.2, audioCtx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(120, audioCtx.currentTime);
  filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime); // Soft idle level

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);

  osc1.start();
  osc2.start();

  engineSynth = { osc1, osc2, filter, gainNode };
  
  interpolateEnginePitch();
}

function interpolateEnginePitch() {
  if (!isMuted && engineSynth && audioCtx) {
    const t = audioCtx.currentTime;
    
    currentEnginePitch += (enginePitchTarget - currentEnginePitch) * 0.08;
    
    // Low, throaty mechanical pitch (slowing down frequencies to sound like combustion)
    const baseFreq = 50 + currentEnginePitch * 45; 
    
    engineSynth.osc1.frequency.setValueAtTime(baseFreq, t);
    engineSynth.osc2.frequency.setValueAtTime(baseFreq * 2.0, t); // Octave combustion sweep
    
    // Control mechanical tone filters
    engineSynth.filter.frequency.setValueAtTime(100 + currentEnginePitch * 180, t);
  }
  requestAnimationFrame(interpolateEnginePitch);
}

// Public API
export function toggleMute(muteState) {
  if (!isStarted) {
    initAudio();
  }

  isMuted = muteState !== undefined ? muteState : !isMuted;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const volume = isMuted ? 0 : 0.6;
  masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.5);

  return isMuted;
}

export function playStartupRoar() {
  if (isMuted) {
    toggleMute(false);
  }

  const t = audioCtx.currentTime;

  // Mechanical volume swell (simulating starter torque coupling)
  engineSynth.gainNode.gain.cancelScheduledValues(t);
  engineSynth.gainNode.gain.setValueAtTime(0.04, t);
  engineSynth.gainNode.gain.linearRampToValueAtTime(0.35, t + 0.6);
  engineSynth.gainNode.gain.exponentialRampToValueAtTime(0.08, t + 2.0);

  // Pitch turnover
  enginePitchTarget = 3.5;
  
  setTimeout(() => {
    enginePitchTarget = 1.0;
  }, 700);

  // Air pressure starter click (noise burst)
  playPneumaticRelease(1.0);
}

export function setEngineLoad(scrollDelta) {
  const absDelta = Math.min(Math.abs(scrollDelta) * 0.015, 2.0);
  enginePitchTarget = 1.0 + absDelta;

  clearTimeout(window.audioSettleTimeout);
  window.audioSettleTimeout = setTimeout(() => {
    enginePitchTarget = 1.0;
  }, 200);
}

export function playUIHover() {
  if (isMuted || !audioCtx) return;
  
  // Extremely soft, organic tactile relay damp click (low pitch, short)
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(450, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(250, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

export function playUIClick() {
  if (isMuted || !audioCtx) return;
  
  // Heavy tactile contact relay switch
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, audioCtx.currentTime);
  osc.frequency.setValueAtTime(100, audioCtx.currentTime + 0.06);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(150, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

function playPneumaticRelease(duration) {
  if (!audioCtx) return;

  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(450, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + duration);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  noiseNode.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noiseNode.start();
  noiseNode.stop(audioCtx.currentTime + duration);
}
