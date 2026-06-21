import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initThreeScene, setSpeedIntensity, setAirflowOpacity } from './three-scene.js';
import * as audio from './audio-controller.js';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Configuration Constants
const TOTAL_FRAMES = 151;
const HERO_FRAME_INDEX = 16;
const IMAGES_DIR = '/ezgif-115f6705db4f5095-jpg/';
const FRAME_PREFIX = 'ezgif-frame-';
const FRAME_EXTENSION = '.jpg';

// Asset Management
const imageSequence = [];
let loadedCount = 0;
let activeFrameIndex = 0;

// Exploded Parts Configuration (For Coordinates Interpolation)
// Coordinates are specified as percentages: [left_percent, top_percent]
const primaryHotspots = [
  {
    id: 'front-wing',
    name: 'Front Wing',
    desc: 'Layered carbon profiles preparing clean flow for the nose and floor.',
    startPos: [39, 65],
    endPos: [20, 72]
  },
  {
    id: 'suspension',
    name: 'Suspension',
    desc: 'Exposed wishbones and pushrod geometry, machined for stiffness and load path clarity.',
    startPos: [44, 60],
    endPos: [32, 62]
  },
  {
    id: 'brake-systems',
    name: 'Brake Systems',
    desc: 'Carbon discs, calipers, and cooling ducts arranged around the wheel hub.',
    startPos: [36, 69],
    endPos: [12, 80]
  },
  {
    id: 'carbon-chassis',
    name: 'Carbon Chassis',
    desc: 'Matte carbon monocoque surrounding the driver cell and primary hard points.',
    startPos: [50, 48],
    endPos: [43, 22]
  },
  {
    id: 'cooling-systems',
    name: 'Cooling Systems',
    desc: 'Sidepod inlets, radiators, and compact thermal ducting.',
    startPos: [58, 49],
    endPos: [60, 34]
  },
  {
    id: 'power-unit',
    name: 'Power Unit',
    desc: 'Turbo hybrid package held low and tight behind the survival cell.',
    startPos: [61, 52],
    endPos: [65, 38]
  },
  {
    id: 'rear-wing',
    name: 'Rear Wing',
    desc: 'Carbon aero assembly and DRS plane suspended over the diffuser exit.',
    startPos: [78, 44],
    endPos: [88, 26]
  }
];

const engineeringParts = [
  { name: "Front Wing", hotspot: "front-wing", spec: "Multi-element carbon assembly" },
  { name: "Suspension", hotspot: "suspension", spec: "Double wishbone geometry" },
  { name: "Brake Systems", hotspot: "brake-systems", spec: "Carbon discs and calipers" },
  { name: "Wheel Hubs", hotspot: "brake-systems", spec: "Forged center-lock assemblies" },
  { name: "Carbon Chassis", hotspot: "carbon-chassis", spec: "Monocoque survival cell" },
  { name: "Cooling Systems", hotspot: "cooling-systems", spec: "Radiator and ducting package" },
  { name: "Power Unit", hotspot: "power-unit", spec: "Turbo hybrid architecture" },
  { name: "Gearbox", hotspot: "power-unit", spec: "Seamless-shift cassette" },
  { name: "Differential", hotspot: "power-unit", spec: "Rear torque management" },
  { name: "Rear Wing", hotspot: "rear-wing", spec: "DRS aero structure" },
  { name: "Diffuser", hotspot: "rear-wing", spec: "Underfloor pressure recovery" }
];

// Track simulation configurations (Section 5) - realistic velocities
const tracksData = {
  monaco: {
    name: "MONACO NIGHT CIRCUIT",
    speed: "292 KM/H",
    gforce: "5.2 G",
    eboost: "100%",
    desc: "Narrow tight streets requiring maximum downforce coefficients and precise turn-in response under nocturnal conditions.",
    path: "M 40,80 C 60,60 90,50 110,60 C 130,70 150,90 160,110 C 170,130 150,150 130,150 C 110,150 90,130 80,120 C 70,110 50,110 40,80 Z"
  },
  silverstone: {
    name: "SILVERSTONE RAPID SWEEPS",
    speed: "338 KM/H",
    gforce: "5.9 G",
    eboost: "85%",
    desc: "Legendary high-speed temple featuring Copse and Maggots-Becketts complexes, loading lateral suspension arrays to their absolute limits.",
    path: "M 30,120 C 40,70 80,40 120,40 C 160,40 180,80 160,120 C 140,160 100,160 60,150 C 40,140 20,170 30,120 Z"
  },
  suzuka: {
    name: "SUZUKA EIGHT PROFILE",
    speed: "318 KM/H",
    gforce: "5.6 G",
    eboost: "90%",
    desc: "The technical figure-eight masterpiece featuring high-speed S-curves and the legendary 130R left-hand sweep.",
    path: "M 30,50 C 60,50 90,120 120,120 C 150,120 170,80 150,50 C 130,20 110,70 80,90 C 50,110 20,90 30,50 Z"
  },
  vegas: {
    name: "LAS VEGAS STRIP",
    speed: "352 KM/H",
    gforce: "4.5 G",
    eboost: "95%",
    desc: "Extended full-throttle sections emphasizing thermal stability, deployment discipline, and low-drag balance.",
    path: "M 20,50 L 180,50 L 180,150 L 120,150 L 120,110 L 20,110 Z"
  }
};

// Main Initialization Function
window.addEventListener('DOMContentLoaded', () => {
  preloadImageSequence();
  setupEvents();
  setupUIHoverSounds();
});

// Preload F1 Car Image Sequence
function preloadImageSequence() {
  const progressBar = document.getElementById('progress-bar');
  const percentLabel = document.getElementById('loader-percentage');
  const preloader = document.getElementById('preloader');

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `${IMAGES_DIR}${FRAME_PREFIX}${frameNum}${FRAME_EXTENSION}`;
    
    img.onload = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (percentLabel) percentLabel.textContent = `${percent}%`;

      if (loadedCount === TOTAL_FRAMES) {
        setTimeout(() => {
          if (preloader) preloader.classList.add('fade-out');
          
          initCarCanvas();
          initThreeScene();
          setupScrollAnimations();
          setupHotspots();
          setupExplodedList();
          setupTrackSimulation();
          
          // Fade in general HUD overlay
          gsap.to('#hud-overlay', { opacity: 1, duration: 1.8, delay: 0.4 });
        }, 500);
      }
    };

    img.onerror = () => {
      console.error(`Failed to load frame ${i}`);
      loadedCount++;
    };

    imageSequence.push(img);
  }
}

// Canvas Rendering System
let canvas, ctx;

function initCarCanvas() {
  canvas = document.getElementById('car-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  drawFrame(HERO_FRAME_INDEX);
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFrame(activeFrameIndex);
}

function drawFrame(index) {
  if (!canvas || !ctx || !imageSequence[index]) return;
  
  activeFrameIndex = index;
  const img = imageSequence[index];
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const imgRatio = img.width / img.height;
  const canvasRatio = canvas.width / canvas.height;
  
  let drawWidth, drawHeight, drawX, drawY;
  
  if (canvasRatio > imgRatio) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / imgRatio;
    drawX = 0;
    drawY = (canvas.height - drawHeight) / 2;
  } else {
    drawWidth = canvas.height * imgRatio;
    drawHeight = canvas.height;
    drawX = (canvas.width - drawWidth) / 2;
    drawY = 0;
  }
  
  const studioCropScale = 1.075;
  const croppedWidth = drawWidth * studioCropScale;
  const croppedHeight = drawHeight * studioCropScale;
  const croppedX = drawX - (croppedWidth - drawWidth) * 0.46;
  const croppedY = drawY - (croppedHeight - drawHeight) * 0.42;

  ctx.drawImage(img, croppedX, croppedY, croppedWidth, croppedHeight);

  const maskWidth = canvas.width * 0.24;
  const maskHeight = canvas.height * 0.16;
  const maskX = canvas.width - maskWidth;
  const maskY = canvas.height - maskHeight;
  const mask = ctx.createLinearGradient(maskX, maskY, canvas.width, canvas.height);
  mask.addColorStop(0, 'rgba(5, 5, 5, 0)');
  mask.addColorStop(0.62, 'rgba(5, 5, 5, 0.78)');
  mask.addColorStop(1, 'rgba(5, 5, 5, 0.98)');
  ctx.fillStyle = mask;
  ctx.fillRect(maskX, maskY, maskWidth, maskHeight);

  // Update dynamic hotspots positions
  updateHotspotsPositions(index);

  // Update Telemetry values
  updateTelemetry(index);
}

// Telemetry values updating based on frame scrubbing index
function updateTelemetry(index) {
  const speedVal = document.getElementById('hud-speed');
  const downforceVal = document.getElementById('hud-downforce');
  const gearVal = document.getElementById('hud-gear');

  if (!speedVal || !downforceVal || !gearVal) return;

  if (index < 20) {
    speedVal.textContent = "0 KM/H";
    downforceVal.textContent = "0 KG";
    gearVal.textContent = "Studio";
  } else if (index < 50) {
    const speed = Math.round((index - 20) * 7.5);
    speedVal.textContent = `${speed} KM/H`;
    downforceVal.textContent = `${Math.round(speed * 4.2)} KG`;
    gearVal.textContent = "Aero";
  } else if (index < 120) {
    // Symmetrical exploded details
    speedVal.textContent = "Static Review";
    downforceVal.textContent = "Measured";
    gearVal.textContent = "Exploded";
  } else {
    const speed = Math.round(280 + (index - 120) * 2.2);
    speedVal.textContent = `${speed} KM/H`;
    downforceVal.textContent = `${Math.round(speed * 4.4)} KG`;
    gearVal.textContent = "Data";
  }
}

// GSAP ScrollTrigger Configurations
function setupScrollAnimations() {
  const scrollObj = { frame: HERO_FRAME_INDEX };
  
  gsap.to(scrollObj, {
    frame: TOTAL_FRAMES - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIdx = Math.round(scrollObj.frame);
        drawFrame(frameIdx);
        audio.setEngineLoad(self.getVelocity());
      }
    }
  });

  // Fade sections in and out
  gsap.utils.toArray('.scroll-section').forEach(section => {
    const content = section.querySelector('.section-content');
    if (!content) return;
    
    gsap.fromTo(content, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
          toggleActions: "play reverse play reverse"
        }
      }
    );
  });

  // Section 1: Airflow guidelines
  ScrollTrigger.create({
    trigger: "#science-of-air",
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () => setAirflowOpacity(1.0),
    onLeave: () => setAirflowOpacity(0),
    onEnterBack: () => setAirflowOpacity(1.0),
    onLeaveBack: () => setAirflowOpacity(0)
  });

  // Section 2: Explode Hotspots Visibility
  ScrollTrigger.create({
    trigger: "#car-explodes",
    start: "top 50%",
    end: "bottom 30%",
    onEnter: () => toggleHotspotsVisibility(true),
    onLeave: () => toggleHotspotsVisibility(false),
    onEnterBack: () => toggleHotspotsVisibility(true),
    onLeaveBack: () => toggleHotspotsVisibility(false)
  });

  // Section 3: Clean Power Unit Reveal - No shader filters applied. Retains realistic car paint.
  ScrollTrigger.create({
    trigger: "#power-unit",
    start: "top 60%",
    end: "bottom 40%"
  });

  // Section 4: Carbon Fiber Craftsmanship Macro Zoom - Clean, focused scale
  ScrollTrigger.create({
    trigger: "#craftsmanship",
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () => canvas.classList.add('macro-zoom'),
    onLeave: () => canvas.classList.remove('macro-zoom'),
    onEnterBack: () => canvas.classList.add('macro-zoom'),
    onLeaveBack: () => canvas.classList.remove('macro-zoom')
  });

  // Section 5: Studio reflections lift subtly during data review.
  ScrollTrigger.create({
    trigger: "#speed-viz",
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () => setSpeedIntensity(1.0),
    onLeave: () => setSpeedIntensity(0.0),
    onEnterBack: () => setSpeedIntensity(1.0),
    onLeaveBack: () => setSpeedIntensity(0.0)
  });
}

// Hotspots Management System
function setupHotspots() {
  const container = document.getElementById('hotspots-container');
  if (!container) return;

  container.innerHTML = '';

  primaryHotspots.forEach((h) => {
    const el = document.createElement('div');
    el.className = `hotspot hotspot-${h.id}`;
    el.setAttribute('data-id', h.id);
    
    el.innerHTML = `
      <div class="hotspot-inner"></div>
      <div class="hotspot-ring"></div>
      <div class="hotspot-card">
        <div class="hotspot-card-title">${h.name}</div>
        <div class="hotspot-card-value">${h.desc}</div>
      </div>
    `;

    el.addEventListener('click', () => {
      audio.playUIClick();
      document.querySelectorAll('.hotspot').forEach(hEl => hEl.classList.remove('active'));
      el.classList.add('active');
    });

    container.appendChild(el);
  });
}

function toggleHotspotsVisibility(visible) {
  const hotspots = document.querySelectorAll('.hotspot');
  hotspots.forEach(h => {
    if (visible) {
      h.classList.add('visible');
    } else {
      h.classList.remove('visible', 'active');
    }
  });
}

function updateHotspotsPositions(frameIndex) {
  const progress = frameIndex / (TOTAL_FRAMES - 1);

  primaryHotspots.forEach((h) => {
    const el = document.querySelector(`.hotspot-${h.id}`);
    if (!el) return;

    const left = h.startPos[0] + (h.endPos[0] - h.startPos[0]) * progress;
    const top = h.startPos[1] + (h.endPos[1] - h.startPos[1]) * progress;

    el.style.left = `${left}%`;
    el.style.top = `${top}%`;
  });
}

// Sidebar Index List
function setupExplodedList() {
  const list = document.getElementById('parts-list');
  if (!list) return;

  list.innerHTML = '';

  engineeringParts.forEach((part, index) => {
    const item = document.createElement('div');
    item.className = 'part-list-item';
    item.innerHTML = `
      <span>${String(index + 1).padStart(2, '0')} &nbsp; ${part.name}</span>
      <span class="part-arrow">&rarr;</span>
    `;

    item.addEventListener('click', () => {
      audio.playUIClick();
      
      document.querySelectorAll('.part-list-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      const targetHotspotId = part.hotspot;
      const hotspotEl = document.querySelector(`.hotspot-${targetHotspotId}`);
      if (hotspotEl) {
        document.querySelectorAll('.hotspot').forEach(h => h.classList.remove('active'));
        hotspotEl.classList.add('active');
        
        const explodedSection = document.getElementById('car-explodes');
        if (explodedSection) {
          explodedSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    list.appendChild(item);
  });
}

// Track Simulation Dashboard (Section 5)
let trackAnimationInterval;

function setupTrackSimulation() {
  const buttons = document.querySelectorAll('.track-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const trackId = btn.getAttribute('data-track');
      if (!tracksData[trackId]) return;

      audio.playUIClick();

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = tracksData[trackId];
      document.getElementById('track-name').textContent = data.name;
      document.getElementById('stat-speed').textContent = data.speed;
      document.getElementById('stat-gforce').textContent = data.gforce;
      document.getElementById('stat-eboost').textContent = data.eboost;
      document.getElementById('track-desc').textContent = data.desc;

      const pathEl = document.getElementById('track-path');
      if (pathEl) {
        pathEl.setAttribute('d', data.path);
        
        const length = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = length;
        pathEl.style.strokeDashoffset = length;
        
        gsap.to(pathEl, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power1.out"
        });

        animateTrackDot(pathEl, length);
      }
    });
  });

  const defaultBtn = document.querySelector('.track-btn[data-track="monaco"]');
  if (defaultBtn) defaultBtn.click();
}

function animateTrackDot(pathEl, pathLength) {
  const dot = document.getElementById('track-dot');
  if (!dot) return;

  if (trackAnimationInterval) clearInterval(trackAnimationInterval);

  let progress = 0;
  trackAnimationInterval = setInterval(() => {
    progress += 0.006;
    if (progress > 1) progress = 0;

    const point = pathEl.getPointAtLength(progress * pathLength);
    dot.setAttribute('cx', point.x);
    dot.setAttribute('cy', point.y);
  }, 16);
}

// Setup Event Listeners
function setupEvents() {
  // Audio toggler
  const audioToggle = document.getElementById('audio-toggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      
      const onIcon = audioToggle.querySelector('.audio-icon.on');
      const offIcon = audioToggle.querySelector('.audio-icon.off');
      const label = audioToggle.querySelector('.audio-label');

      if (isMuted) {
        onIcon.classList.add('hidden');
        offIcon.classList.remove('hidden');
        label.textContent = "AUDIO OFF";
      } else {
        onIcon.classList.remove('hidden');
        offIcon.classList.add('hidden');
        label.textContent = "AUDIO ON";
      }
    });
  }

  // Engine Startup button
  const machineStartupBtn = document.getElementById('machine-startup-btn');
  if (machineStartupBtn) {
    machineStartupBtn.addEventListener('click', () => {
      audio.playStartupRoar();
      
      const audioToggle = document.getElementById('audio-toggle');
      if (audioToggle) {
        audioToggle.querySelector('.audio-icon.on').classList.remove('hidden');
        audioToggle.querySelector('.audio-icon.off').classList.add('hidden');
        audioToggle.querySelector('.audio-label').textContent = "AUDIO ON";
      }
    });
  }

  // Scroll to first engineering section on primary CTA
  const scrollCta = document.querySelector('.scroll-to-engineering');
  if (scrollCta) {
    scrollCta.addEventListener('click', () => {
      audio.playUIClick();
      const target = document.getElementById('science-of-air');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Materials Tabs setup (Section 4)
  const matTabs = document.querySelectorAll('.materials-tab');
  const matBody = document.getElementById('material-body');
  const aeroItems = document.querySelectorAll('.aero-item');

  aeroItems.forEach(item => {
    item.addEventListener('click', () => {
      audio.playUIClick();
      aeroItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    });
  });
  
  const materialsContent = {
    carbon: {
      title: "12K Monofilament Profile",
      desc: "Pre-impregnated with high-toughened epoxy resin matrices, autoclaved at 180°C under 7 bar pressure. Offers ultimate torsional rigidity of 45,000 Nm/degree at a mere chassis weight of 82kg."
    },
    titanium: {
      title: "Grade 5 Titanium Assembly Fasteners",
      desc: "Machined fasteners and load-bearing brackets preserve strength while reducing mass around suspension and power-unit interfaces."
    },
    precision: {
      title: "Chassis Monocoque Metrology",
      desc: "Composite layers are mapped with inspection data to verify weave orientation, bonding accuracy, and structural consistency."
    }
  };

  matTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      audio.playUIClick();
      matTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const matId = tab.getAttribute('data-material');
      if (materialsContent[matId] && matBody) {
        matBody.innerHTML = `
          <h4>${materialsContent[matId].title}</h4>
          <p>${materialsContent[matId].desc}</p>
        `;
      }
    });
  });

  // Modal Setup
  setupModals();
}

function setupModals() {
  const specModal = document.getElementById('spec-modal');
  const bookingModal = document.getElementById('booking-modal');
  
  // Spec Sheet Open
  const specTrigger = document.querySelector('.toggle-spec-sheet');
  if (specTrigger) {
    specTrigger.addEventListener('click', () => {
      audio.playUIClick();
      specModal.classList.add('open');
    });
  }
  
  // Booking Open
  const bookingTriggers = document.querySelectorAll('.booking-trigger');
  bookingTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      audio.playUIClick();
      bookingModal.classList.add('open');
    });
  });

  // Closes
  const specClose = document.getElementById('modal-close-btn');
  if (specClose) {
    specClose.addEventListener('click', () => {
      audio.playUIClick();
      specModal.classList.remove('open');
    });
  }

  const bookingClose = document.getElementById('booking-close-btn');
  if (bookingClose) {
    bookingClose.addEventListener('click', () => {
      audio.playUIClick();
      bookingModal.classList.remove('open');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === specModal) {
      specModal.classList.remove('open');
    }
    if (e.target === bookingModal) {
      bookingModal.classList.remove('open');
    }
  });

  // Booking Form Submit
  const bookingForm = document.getElementById('booking-form');
  const bookingSuccess = document.getElementById('booking-success');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      audio.playUIClick();
      bookingForm.classList.add('hidden');
      if (bookingSuccess) bookingSuccess.classList.remove('hidden');
    });
  }
}

// Global UI Sounds
function setupUIHoverSounds() {
  const hoverElements = document.querySelectorAll('a, button, .part-list-item, .aero-item, .track-btn, .materials-tab');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      audio.playUIHover();
    });
  });
}
