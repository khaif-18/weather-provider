<script setup lang="ts">
const props = defineProps<{ conditionCode: number; isDay: boolean }>()

const group = computed(() => getConditionGroup(props.conditionCode))

const rnd = (min: number, max: number) => min + Math.random() * (max - min)

// Particle fields are generated once per mount; the template swaps which
// set is shown via v-if when the condition changes.
const rain = Array.from({ length: 48 }, () => ({
  left: rnd(0, 100),
  height: rnd(36, 90),
  opacity: rnd(0.08, 0.22),
  duration: rnd(0.45, 0.9),
  delay: -rnd(0, 2),
}))

const snow = Array.from({ length: 36 }, () => ({
  left: rnd(0, 100),
  size: rnd(2, 6),
  opacity: rnd(0.3, 0.75),
  drift: rnd(-40, 40),
  duration: rnd(6, 13),
  delay: -rnd(0, 10),
}))

const fog = Array.from({ length: 4 }, (_, i) => ({
  top: i * 24 + rnd(0, 8),
  opacity: rnd(0.05, 0.11),
  duration: rnd(22, 38),
  delay: -rnd(0, 20),
}))

const stars = Array.from({ length: 34 }, () => ({
  left: rnd(0, 100),
  top: rnd(0, 65),
  size: rnd(1, 2.6),
  duration: rnd(2, 5),
  delay: -rnd(0, 4),
}))

const clouds = Array.from({ length: 5 }, () => ({
  top: rnd(2, 48),
  scale: rnd(0.8, 1.6),
  opacity: rnd(0.06, 0.13),
  duration: rnd(45, 80),
  delay: -rnd(0, 40),
}))
</script>

<template>
  <!--
    Condition-driven atmospheric layer.
    Fixed, behind all content (z-index:-1, above the gradient ::before),
    pointer-events:none so it never blocks interaction.
  -->
  <div class="weather-backdrop" aria-hidden="true">
    <!-- Rain / drizzle / thunderstorm -->
    <template v-if="group === 'rain' || group === 'drizzle' || group === 'thunderstorm'">
      <div
        v-for="(d, i) in rain"
        :key="`r${i}`"
        class="rain"
        :style="{
          left: `${d.left}%`,
          height: `${d.height}px`,
          opacity: d.opacity,
          animationDuration: `${d.duration}s`,
          animationDelay: `${d.delay}s`,
        }"
      ></div>
      <div v-if="group === 'thunderstorm'" class="lightning"></div>
    </template>

    <!-- Snow -->
    <template v-else-if="group === 'snow'">
      <div
        v-for="(s, i) in snow"
        :key="`s${i}`"
        class="snow"
        :style="{
          left: `${s.left}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          opacity: s.opacity,
          '--drift': `${s.drift}px`,
          animationDuration: `${s.duration}s`,
          animationDelay: `${s.delay}s`,
        }"
      ></div>
    </template>

    <!-- Fog / mist / haze -->
    <template v-else-if="group === 'atmosphere'">
      <div
        v-for="(f, i) in fog"
        :key="`f${i}`"
        class="fog"
        :style="{
          top: `${f.top}%`,
          opacity: f.opacity,
          animationDuration: `${f.duration}s`,
          animationDelay: `${f.delay}s`,
        }"
      ></div>
    </template>

    <!-- Clear -->
    <template v-else-if="group === 'clear'">
      <div v-if="isDay" class="sun-glow"></div>
      <template v-else>
        <div
          v-for="(st, i) in stars"
          :key="`st${i}`"
          class="star"
          :style="{
            left: `${st.left}%`,
            top: `${st.top}%`,
            width: `${st.size}px`,
            height: `${st.size}px`,
            animationDuration: `${st.duration}s`,
            animationDelay: `${st.delay}s`,
          }"
        ></div>
      </template>
    </template>

    <!-- Clouds (drifting soft blobs) -->
    <template v-else-if="group === 'clouds'">
      <div
        v-for="(c, i) in clouds"
        :key="`c${i}`"
        class="cloud"
        :style="{
          top: `${c.top}%`,
          opacity: c.opacity,
          '--s': c.scale,
          animationDuration: `${c.duration}s`,
          animationDelay: `${c.delay}s`,
        }"
      ></div>
    </template>
  </div>
</template>

<style scoped>
.weather-backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;            /* above the gradient ::before, below content */
  overflow: hidden;
  pointer-events: none;
}

/* ── Rain ── */
.rain {
  position: absolute;
  top: -12%;
  width: 1.5px;
  border-radius: 1px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.7));
  animation-name: rainFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes rainFall {
  to { transform: translate3d(0, 125vh, 0); }
}

/* ── Lightning flash ── */
.lightning {
  position: absolute;
  inset: 0;
  background: #ffffff;
  opacity: 0;
  animation: flash 9s linear infinite;
}
@keyframes flash {
  0%, 92%, 100% { opacity: 0; }
  93%   { opacity: 0.30; }
  93.6% { opacity: 0.04; }
  94.2% { opacity: 0.26; }
  95%   { opacity: 0; }
}

/* ── Snow ── */
.snow {
  position: absolute;
  top: -8%;
  border-radius: 50%;
  background: #ffffff;
  animation-name: snowFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes snowFall {
  0%   { transform: translate3d(0, -8vh, 0); }
  100% { transform: translate3d(var(--drift, 0), 112vh, 0); }
}

/* ── Fog ── */
.fog {
  position: absolute;
  left: -50%;
  width: 200%;
  height: 30vh;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  filter: blur(22px);
  animation-name: fogDrift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
@keyframes fogDrift {
  from { transform: translateX(-18%); }
  to   { transform: translateX(18%); }
}

/* ── Sun glow ── */
.sun-glow {
  position: absolute;
  top: -16%;
  right: -8%;
  width: 62vh;
  height: 62vh;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 218, 150, 0.40), rgba(255, 218, 150, 0) 65%);
  animation: sunBreathe 7s ease-in-out infinite;
}
@keyframes sunBreathe {
  0%, 100% { transform: scale(1);    opacity: 0.85; }
  50%      { transform: scale(1.08); opacity: 1; }
}

/* ── Stars ── */
.star {
  position: absolute;
  border-radius: 50%;
  background: #ffffff;
  animation-name: twinkle;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.15; }
  50%      { opacity: 0.9; }
}

/* ── Clouds ── */
.cloud {
  position: absolute;
  left: -34%;
  width: 42vh;
  height: 15vh;
  border-radius: 9999px;
  background: radial-gradient(ellipse, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0) 70%);
  filter: blur(10px);
  animation-name: cloudDrift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes cloudDrift {
  from { transform: translate3d(0, 0, 0) scale(var(--s, 1)); }
  to   { transform: translate3d(165vw, 0, 0) scale(var(--s, 1)); }
}

/* Honour reduced-motion: drop the whole animated layer */
@media (prefers-reduced-motion: reduce) {
  .weather-backdrop { display: none; }
}
</style>
