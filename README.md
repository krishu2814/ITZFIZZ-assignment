# Scroll-Driven Hero Section Animation

> **Itzfizz Digital — Web Development Internship Assignment**  
> Developed by **Krishu Kumar**  
> **GitHub Profile**: [github.com/krishu2814](https://github.com/krishu2814)  
> **GitHub Repository**: [github.com/krishu2814/ITZFIZZ-assignment](https://github.com/krishu2814/ITZFIZZ-assignment)  
> **Live Demo (GitHub Pages)**: [https://krishu2814.github.io/ITZFIZZ-assignment/](https://krishu2814.github.io/ITZFIZZ-assignment/)

---

## 📌 Project Overview
This project is an advanced, high-performance recreate of the scroll-driven hero section inspired by the reference demo ([paraschaturvedi.github.io/car-scroll-animation](https://paraschaturvedi.github.io/car-scroll-animation)).

It has been engineered from the ground up using **Vanilla HTML5, modern CSS3, ES6+ JavaScript, and GSAP ScrollTrigger**. The implementation prioritizes fluid 60+ FPS motion, GPU hardware acceleration, zero layout thrashing, and full mobile responsiveness.

---

## ✨ Features & Requirements Checklist

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **1. Hero Section Layout** | Occupies the first screen (above the fold) with letter-spaced `W E L C O M E   I T Z F I Z Z` and surrounding impact metric cards (`58%`, `23%`, `27%`, `40%`). | ✅ Complete |
| **2. Initial Load Animation** | Smooth entrance for header, headline letters, car starting grid position, and dynamic count-up statistical numbers. | ✅ Complete |
| **3. Scroll-Based Animation (Core)** | Pinned 100vh viewport synchronized with page scroll using a scrub factor of `1.2s`. Car drives from left to right along the asphalt raceway. | ✅ Complete |
| **4. Dynamic Letter Illumination** | Dual letter illumination: letters on top and asphalt grid stencil illuminate in intense glowing McLaren papaya as the car crosses them. | ✅ Complete |
| **5. Motion & Performance** | Pure GPU transforms (`translate3d`, `scaleX`), cached layout measurements on resize, zero layout reflows on scroll. | ✅ Complete |
| **6. Metric Waypoint Highlights** | Each metric card triggers an active illuminated waypoint ring and pulse when the car reaches its milestone. | ✅ Complete |
| **7. Interactive Audio Synthesizer** | Built-in Web Audio API engine sound synthesizer with pitch modulated by scroll speed (optional audio toggle). | ✅ Complete |
| **8. Responsive Engineering** | Adaptive typography with `clamp()`, symmetric mobile card framing, and touch-tested scrolling for iPhone/Android. | ✅ Complete |

---

## 🛠️ Tech Stack
- **HTML5**: Semantic tags, accessible skip links, OpenGraph metadata, descriptive ARIA attributes.
- **CSS3 (Vanilla)**: Custom properties (`:root`), glassmorphism, hardware-accelerated transforms (`will-change: transform`), fluid clamp typography.
- **JavaScript (ES6+)**: Clean, modular code without framework bloat.
- **GSAP 3.12.5 & ScrollTrigger**: Smooth scrubbed pinning and timeline orchestration.
- **Web Audio API**: Real-time procedural engine rev synthesis.

---

## 📁 Project Structure
```text
itzfizz-scroll-animation/
├── index.html              # Semantic markup and component layout
├── css/
│   └── style.css           # Modular styling and design tokens
├── js/
│   └── script.js           # GSAP ScrollTrigger logic and spatial hit-testing
├── assets/
│   └── images/
│       ├── mclaren-car.png # High-definition top-view transparent sports car
│       └── favicon.svg     # SVG brand favicon
├── .gitignore              # Git ignore rules
└── README.md               # Documentation and submission details
```

---

## ⚡ Performance Optimizations
1. **Zero Layout Thrashing**: In traditional implementations, expanding the trail by updating `width` forces a DOM reflow on every scroll tick. In this implementation, the trail uses `transform: scaleX()` with `transform-origin: 0% 50%` on a GPU layer (`will-change: transform`).
2. **Spatial Coordinate Caching**: Letter and waypoint bounding coordinates are precomputed once on load and updated only during debounced window resize events. No `getBoundingClientRect()` calls are performed inside the active scroll loop.
3. **Smooth Scrubbing**: A GSAP scrub factor of `1.2s` introduces subtle momentum and inertia, making touchpad and mouse wheel interactions feel exceptionally natural and premium.

---

## 🌐 Deploy to GitHub Pages (Step-by-Step)

1. Use your existing GitHub repository:
   `https://github.com/krishu2814/ITZFIZZ-assignment`

2. Push the local code to your GitHub repository:
   ```bash
   git remote add origin https://github.com/krishu2814/ITZFIZZ-assignment.git
   git branch -M main
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repository settings on GitHub (`Settings` -> `Pages`).
   - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   - Select branch: `main` and folder: `/ (root)`.
   - Click **Save**.
   - Your live webpage will be available at:
     `https://krishu2814.github.io/ITZFIZZ-assignment/`
