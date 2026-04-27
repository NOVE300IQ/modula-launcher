<template>
  <section class="about-modula">
    <SettingCard>
      <!-- ── Header ── -->
      <div class="modula-header">
        <div class="logo-ring">
          <img :src="modulaLogo" alt="Modula Logo" class="modula-logo" />
        </div>
        <div class="modula-title-block">
          <h1 class="modula-name">Modula</h1>
          <p class="modula-tagline">A Modern Minecraft Launcher by <span class="highlight">Team Pixel Buff</span></p>
          <div class="modula-badges">
            <span class="badge">v{{ version }}</span>
            <span class="badge badge-mit">MIT License</span>
            <span class="badge badge-electron">Electron</span>
          </div>
        </div>
      </div>

      <!-- ── About Text ── -->
      <div class="about-text-card">
        <p>
          Modula Launcher is a modern Minecraft launcher made by <strong>Team Pixel Buff</strong>.
          It features an easy-to-use, aesthetic, and optimised UI along with powerful mod management, multi-instancing, and more.
        </p>
      </div>

      <!-- ── Debug Info ── -->
      <div class="debug-card">
        <div class="debug-label">System Info</div>
        <v-textarea filled readonly class="debug-textarea" :value="debugInfo" />
      </div>

      <!-- ── Core Team ── -->
      <div class="section-container">
        <div class="section-header-wrap">
          <div class="section-title-premium">⚡ Core Team</div>
          <div class="section-divider"></div>
        </div>
        <div class="team-grid">
          <!-- Founder -->
          <div class="premium-member-card founder-main">
            <div class="avatar-ring-premium">
              <img :src="imgNoveOp" alt="NoveOp" class="member-photo" />
              <div class="glow-layer"></div>
            </div>
            <div class="member-info">
              <div class="member-name">NoveOp</div>
              <div class="member-role">Founder & Lead Dev</div>
            </div>
          </div>
          <!-- Co-Founder -->
          <div class="premium-member-card co-founder-main">
            <div class="avatar-ring-premium co-founder-ring">
              <img :src="imgMagma" alt="Magma" class="member-photo" />
              <div class="glow-layer"></div>
            </div>
            <div class="member-info">
              <div class="member-name">Magma</div>
              <div class="member-role">Co-Founder</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Project Philosophy ── -->
      <div class="section-container">
        <div class="section-header-wrap">
          <div class="section-title-premium">✨ Our Philosophy</div>
          <div class="section-divider"></div>
        </div>
        <div class="philosophy-card">
          <div class="philosophy-content">
            <p>
              Modula is built on the belief that a launcher should be more than just a tool—it should be an experience. 
              We focus on <strong>performance</strong>, <strong>privacy</strong>, and <strong>perfection</strong> in every pixel. 
              Our mission is to empower players and creators alike with a platform that is as beautiful as the worlds they build.
            </p>
          </div>
        </div>
      </div>

      <!-- ── Bug Bounties / Contributors ── -->
      <div class="section-container">
        <div class="section-header-wrap">
          <div class="section-title-premium">🐛 Bug Bounties</div>
          <div class="section-divider"></div>
        </div>
        <div class="wall-of-fame">
          <div
            v-for="c in contributors"
            :key="c.name"
            class="fame-card"
          >
            <div class="fame-avatar-wrap">
              <img :src="c.img" :alt="c.name" class="fame-avatar" />
              <div class="fame-glow"></div>
            </div>
            <div class="fame-name">{{ c.name }}</div>
          </div>
        </div>
      </div>

    </SettingCard>
  </section>
</template>

<script lang="ts" setup>
import SettingCard from '@/components/SettingCard.vue'
import { kEnvironment } from '@/composables/environment'
import { injection } from '@/util/inject'

import modulaLogo from '@/assets/modula-logo.png'
import imgNoveOp from '@/assets/contrib-noveop.png'
import imgMagma from '@/assets/contrib-magma.png'
import imgMarco from '@/assets/contrib-marco.png'
import imgShifazuu from '@/assets/contrib-shifazuu.png'
import imgHeistra from '@/assets/contrib-heistra.png'
import imgJeff from '@/assets/contrib-jeff.png'
import imgZiyaziyu from '@/assets/contrib-ziyaziyu.png'
import imgSaniljith from '@/assets/contrib-saniljith.png'

const env = injection(kEnvironment)
const { t } = useI18n()

const version = computed(() => env.value?.version ?? '')

const debugInfo = computed(() => JSON.stringify({ ...env.value }, null, 2))

const contributors = [
  { name: 'Marco', img: imgMarco },
  { name: 'Shifazuu', img: imgShifazuu },
  { name: 'Heistra', img: imgHeistra },
  { name: 'Jeff', img: imgJeff },
  { name: 'Ziyaziyu', img: imgZiyaziyu },
  { name: 'Saniljith SVG', img: imgSaniljith },
]
</script>

<style scoped>
.about-modula {
  padding: 16px;
  color: #e2e8f0;
}

/* ── Header ── */
.modula-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 24px 20px;
  border-bottom: 1px solid rgba(167, 139, 250, 0.15);
}

.logo-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  padding: 3px;
  box-shadow: 0 0 32px rgba(124, 58, 237, 0.5), 0 0 8px rgba(79, 70, 229, 0.4);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: logoPulse 3s ease-in-out infinite;
}

.modula-logo {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  object-fit: contain;
  background: #0d0d1f;
}

.modula-title-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modula-name {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(90deg, #a78bfa, #6366f1, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
}

.modula-tagline {
  font-size: 0.92rem;
  color: #94a3b8;
  margin: 0;
}

.highlight { color: #a78bfa; font-weight: 600; }

.modula-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.badge {
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(167, 139, 250, 0.3);
  color: #c4b5fd;
  background: rgba(124, 58, 237, 0.08);
  transition: all 0.3s ease;
}

.badge:hover {
  background: rgba(124, 58, 237, 0.15);
  border-color: rgba(167, 139, 250, 0.5);
  transform: translateY(-2px);
}

.badge-mit { color: #86efac; border-color: rgba(134, 239, 172, 0.25); background: rgba(34, 197, 94, 0.05); }
.badge-electron { color: #93c5fd; border-color: rgba(147, 197, 253, 0.25); background: rgba(59, 130, 246, 0.05); }

/* ── About text ── */
.about-text-card {
  margin: 24px 0;
  padding: 20px 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.7;
  position: relative;
  overflow: hidden;
}

.about-text-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.2), transparent);
}

.about-text-card strong { color: #a78bfa; }

/* ── Debug ── */
.debug-card {
  margin: 16px 0;
  padding: 16px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.debug-label {
  font-size: 0.72rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 8px;
}

.debug-textarea {
  font-size: 0.78rem;
}

/* ── Section titles ── */
/* ── Premium Section Headers ── */
.section-container {
  margin-top: 32px;
}

.section-header-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.section-title-premium {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  background: linear-gradient(135deg, #a78bfa 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  text-shadow: 0 10px 20px rgba(124, 58, 237, 0.2);
}

.section-divider {
  height: 1px;
  flex-grow: 1;
  background: linear-gradient(to right, rgba(167, 139, 250, 0.4), rgba(251, 191, 36, 0.1), transparent);
}

/* ── Premium Member Cards ── */
.team-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.premium-member-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.premium-member-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(167, 139, 250, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.premium-member-card:hover {
  transform: translateY(-8px);
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.6);
}

.premium-member-card:hover::before {
  opacity: 1;
}

.founder-main { border-color: rgba(124, 58, 237, 0.3); }
.co-founder-main { border-color: rgba(251, 191, 36, 0.3); }

.avatar-ring-premium {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.4);
}

.co-founder-ring {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
}

.member-photo {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0f172a;
}

.glow-layer {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.3), transparent 70%);
  opacity: 0.6;
  z-index: -1;
  animation: premiumPulse 4s ease-in-out infinite;
}

.co-founder-ring .glow-layer {
  background: radial-gradient(circle, rgba(251, 191, 36, 0.3), transparent 70%);
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1;
}

.member-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}

.member-role {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ── Wall of Fame ── */
.wall-of-fame {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
}

.fame-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.fame-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(167, 139, 250, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.fame-avatar-wrap {
  position: relative;
  width: 72px;
  height: 72px;
}

.fame-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(167, 139, 250, 0.2);
  padding: 2px;
  transition: border-color 0.3s ease;
}

.fame-card:hover .fame-avatar {
  border-color: #fbbf24;
}

.fame-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.2), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fame-card:hover .fame-glow {
  opacity: 1;
}

.fame-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #cbd5e1;
  transition: color 0.3s ease;
}

.fame-card:hover .fame-name {
  color: #fff;
}

/* ── Philosophy Card ── */
.philosophy-card {
  padding: 32px;
  border-radius: 24px;
  background: rgba(139, 92, 246, 0.03);
  border: 1px solid rgba(139, 92, 246, 0.1);
  position: relative;
  overflow: hidden;
}

.philosophy-card::before {
  content: '"';
  position: absolute;
  top: -20px;
  left: 20px;
  font-size: 120px;
  font-family: 'serif';
  color: rgba(139, 92, 246, 0.05);
  line-height: 1;
}

.philosophy-content p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #cbd5e1;
  font-style: italic;
  margin: 0;
  text-align: center;
}

.philosophy-content strong {
  color: #fbbf24;
  font-weight: 700;
  font-style: normal;
}

@keyframes premiumPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0.8; }
}
</style>
