/**
 * Itzfizz Digital - Scroll-Driven Hero Animation
 * 
 * Features:
 * - Fluid scrubbed GSAP ScrollTrigger car driving animation
 * - GPU-accelerated transforms (translate3d, scaleX) with zero layout thrashing
 * - Dynamic letter illumination triggered by car position (dual overlay sync)
 * - Animated statistical counter numbers on load
 * - Synthesized Web Audio engine sound on scroll (optional toggle)
 * 
 * Author: Krishu Kumar
 */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- Cached DOM References ---
const car = document.getElementById("carContainer");
const trail = document.getElementById("carTrail");
const road = document.getElementById("roadTrack");
const headlineChars = document.querySelectorAll(".headline-char:not(.space)");
const trackChars = document.querySelectorAll(".track-char:not(.space)");
const progressLine = document.getElementById("scrollProgressLine");
const speedVal = document.getElementById("speedVal");
const audioToggleBtn = document.getElementById("audioToggleBtn");
const metricBoxes = [
  { el: document.getElementById("box-pickup"), threshold: 0.18 },
  { el: document.getElementById("box-support"), threshold: 0.42 },
  { el: document.getElementById("box-retention"), threshold: 0.68 },
  { el: document.getElementById("box-velocity"), threshold: 0.90 }
];

// Layout & tracking state
let cachedHeadlineLetters = [];
let cachedTrackLetters = [];
let roadLeft = 0;
let roadWidth = 0;
let carWidth = 0;
let maxTravelDistance = 0;
let isAudioEnabled = false;
let audioCtx = null;
let engineOsc = null;
let engineGain = null;

/**
 * Pre-measure geometry and spatial coordinates
 * Avoids getBoundingClientRect calls during scroll loops to eliminate layout thrashing.
 */
function measureGeometry() {
  if (!road || !car) return;

  const roadRect = road.getBoundingClientRect();
  roadLeft = roadRect.left;
  roadWidth = roadRect.width;
  carWidth = car.offsetWidth || 180;
  
  // Maximum horizontal travel distance for the car
  maxTravelDistance = roadWidth - (carWidth * 0.85);

  // Cache horizontal centers for both headline sets
  cachedHeadlineLetters = Array.from(headlineChars).map((char) => {
    const rect = char.getBoundingClientRect();
    return {
      el: char,
      centerX: rect.left + rect.width / 2
    };
  });

  cachedTrackLetters = Array.from(trackChars).map((char) => {
    const rect = char.getBoundingClientRect();
    return {
      el: char,
      centerX: rect.left + rect.width / 2
    };
  });
}

/**
 * Count-up animation for metric numbers on initial load
 */
function animateStatCounters() {
  const counterElements = document.querySelectorAll(".metric-val[data-target]");
  
  counterElements.forEach((counter) => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const suffix = counter.getAttribute("data-suffix") || "";
    const prefix = counter.getAttribute("data-prefix") || "";
    const isFloat = !Number.isInteger(target);
    const counterState = { count: 0 };

    gsap.to(counterState, {
      count: target,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        const formatted = isFloat ? counterState.count.toFixed(1) : Math.round(counterState.count);
        counter.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
  });
}

/**
 * Core Feature: Scroll-Driven Hero Animation
 * Pin the hero container and scrub the car motion & trail based on scroll progress.
 */
function initScrollAnimation() {
  measureGeometry();

  ScrollTrigger.create({
    trigger: ".scroll-hero-section",
    start: "top top",
    end: "bottom bottom",
    pin: ".hero-track-wrapper",
    scrub: 1.2, // Smooth interpolation for natural momentum
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const progress = self.progress;

      // 1. Move car horizontally using transform (translate3d)
      const currentX = progress * maxTravelDistance;
      gsap.set(car, {
        x: currentX,
        force3D: true
      });

      // 2. Expand trail using scaleX to avoid expensive layout reflows
      const carMidPoint = currentX + (carWidth * 0.45);
      const trailScale = Math.min(1, Math.max(0, carMidPoint / roadWidth));
      gsap.set(trail, {
        scaleX: trailScale,
        force3D: true
      });

      // 3. Dynamic headline letter illumination
      // Letters light up as the car's front passes their horizontal center
      const carNoseGlobalX = roadLeft + currentX + (carWidth * 0.85);

      // Top headline
      cachedHeadlineLetters.forEach((item) => {
        if (carNoseGlobalX >= item.centerX) {
          if (!item.el.classList.contains("illuminated")) {
            item.el.classList.add("illuminated");
          }
        } else {
          if (item.el.classList.contains("illuminated")) {
            item.el.classList.remove("illuminated");
          }
        }
      });

      // Track stencil letters on the road
      cachedTrackLetters.forEach((item) => {
        if (carNoseGlobalX >= item.centerX) {
          if (!item.el.classList.contains("active-char")) {
            item.el.classList.add("active-char");
          }
        } else {
          if (item.el.classList.contains("active-char")) {
            item.el.classList.remove("active-char");
          }
        }
      });

      // 4. Update top global scroll progress bar
      if (progressLine) {
        gsap.set(progressLine, {
          scaleX: progress,
          force3D: true
        });
      }

      // 5. Update simulated speedometer (0 to 240 km/h)
      if (speedVal) {
        const speed = Math.round(progress * 240);
        speedVal.textContent = speed;
      }

      // 6. Highlight metric cards when car reaches their waypoint
      metricBoxes.forEach((box) => {
        if (!box.el) return;
        if (progress >= box.threshold) {
          if (!box.el.classList.contains("active-waypoint")) {
            box.el.classList.add("active-waypoint");
          }
        } else {
          box.el.classList.remove("active-waypoint");
        }
      });

      // 7. Modulate engine audio if active
      if (isAudioEnabled && engineOsc) {
        const velocity = Math.abs(self.getVelocity() || 0);
        const pitch = 65 + (progress * 110) + Math.min(60, velocity * 0.05);
        engineOsc.frequency.setTargetAtTime(pitch, audioCtx.currentTime, 0.05);
      }
    }
  });
}

/**
 * Web Audio API Engine Rev Synthesizer
 * Generates dynamic pitch-shifted acceleration sound without external audio files.
 */
function toggleEngineSound() {
  if (!isAudioEnabled) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    engineOsc = audioCtx.createOscillator();
    engineGain = audioCtx.createGain();

    // Warm low-frequency engine hum
    engineOsc.type = "sawtooth";
    engineOsc.frequency.setValueAtTime(65, audioCtx.currentTime);

    // Filter to soften harsh edges
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);

    engineGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

    engineOsc.connect(filter);
    filter.connect(engineGain);
    engineGain.connect(audioCtx.destination);

    engineOsc.start();
    isAudioEnabled = true;
    audioToggleBtn.classList.add("active");
    audioToggleBtn.setAttribute("aria-label", "Mute engine sound");
  } else {
    if (audioCtx) {
      audioCtx.close();
    }
    isAudioEnabled = false;
    audioToggleBtn.classList.remove("active");
    audioToggleBtn.setAttribute("aria-label", "Enable engine sound");
  }
}

/**
 * Helper to jump directly to specific milestones (used by control buttons)
 */
function jumpToMilestone(percentage) {
  const heroSection = document.querySelector(".scroll-hero-section");
  if (!heroSection) return;

  const rect = heroSection.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const targetScroll = scrollTop + rect.top + (heroSection.offsetHeight - window.innerHeight) * percentage;

  window.scrollTo({
    top: targetScroll,
    behavior: "smooth"
  });
}

/**
 * Replay initial entrance animation
 */
function replayAnimation() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => {
    // Reset letters & metric elements
    headlineChars.forEach(char => char.classList.remove("illuminated"));
    trackChars.forEach(char => char.classList.remove("active-char"));
    metricBoxes.forEach(b => b.el && b.el.classList.remove("active-waypoint"));
    animateStatCounters();
  }, 300);
}

// --- Event Listeners ---

// Initialize on DOM load
window.addEventListener("DOMContentLoaded", () => {
  initScrollAnimation();
  animateStatCounters();

  // Audio toggle
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", toggleEngineSound);
  }

  // Interactive control buttons
  const replayBtn = document.getElementById("replayBtn");
  if (replayBtn) {
    replayBtn.addEventListener("click", replayAnimation);
  }

  const milestoneBtns = document.querySelectorAll("[data-milestone]");
  milestoneBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pct = parseFloat(btn.getAttribute("data-milestone"));
      jumpToMilestone(pct);
    });
  });
});

// Debounced resize handler to update layout metrics cleanly
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    measureGeometry();
    ScrollTrigger.refresh();
  }, 180);
});
