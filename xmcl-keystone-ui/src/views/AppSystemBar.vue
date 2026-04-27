<template>
  <v-system-bar
    topbar
    window
    :color="'transparent'"
    class="moveable flex w-full grow-0 gap-1 p-0"
    :style="{ 'backdrop-filter': `blur(${blurAppBar}px)` }"
  >
    <!-- Back button (leftmost, only when in notch sidebar mode) -->
    <span
      v-if="back"
      class="flex shrink grow-0 p-0"
    >
      <div
        v-if="shouldShiftBackControl"
        style="width: 80px"
      />
      <div
        v-ripple
        class="non-moveable flex justify-center cursor-pointer select-none rounded py-2 after:hidden hover:bg-[rgba(255,255,255,0.2)]"
        style="width: 36px;"
        @click="onBack"
      >
        <v-icon class="mx-0" small>
          arrow_back
        </v-icon>
      </div>
    </span>

    <!-- Modula brand mark -->
    <span class="modula-brand non-moveable flex items-center gap-1 select-none flex-shrink-0" :class="back ? 'pl-1 pr-2' : 'pl-2 pr-2'">
      <img :src="modulaLogo" alt="Modula" class="modula-brand-logo" />
      <span class="modula-brand-text">Modula</span>
    </span>

    <slot />

    <AppAudioPlayer
      v-if="!noDebug"
      class="ml-22"
    />
    <div class="grow " />

    <TaskSpeedMonitor v-if="!noTask" />
    <PerformanceMonitor v-if="!noDebug" />
    <AppSystemBarBadge
      v-if="!noTask"
      icon="assignment"
      :can-hide-text="count === 0"
      :text="count === 0 ? t('task.empty') : t('task.nTaskRunning', { count })"
      @click="showTaskDialog()"
    />
    <AppSystemBarAvatar
      v-if="!noUser"
    />
    <AppSystemBarBadge
      v-if="tutor"
      id="tutor-button"
      icon="quiz"
      :text="t('help')"
      can-hide-text
      @click="tutor.start()"
    />
    <AppSystemBarBadge
      id="discord-button"
      icon="discord"
      text="Community"
      can-hide-text
      @click="openDiscord"
    />
    <AppSystemBarBadge
      v-if="!noDebug"
      id="feedback-button"
      icon="bug_report"
      :text="t('feedback.name')"
      can-hide-text
      @click="showFeedbackDialog"
    />

    <span class="flex h-full shrink grow-0 p-0">
      <v-icon
        v-if="!hideWindowControl"
        v-ripple
        tabindex="-1"
        class="xy-0 non-moveable mr-0 flex cursor-pointer select-none items-center px-3 py-1 after:hidden! hover:bg-[rgba(255,255,255,0.5)]"

        small
        @click="minimize"
      >minimize</v-icon>
      <v-icon
        v-if="!hideWindowControl"
        v-ripple
        tabindex="-1"
        class="non-moveable top-0 mr-0 flex cursor-pointer select-none items-center px-3 py-1 after:hidden! hover:bg-[rgba(255,255,255,0.5)]"
        small
        @click="maximize"
      >crop_din</v-icon>
      <v-icon
        v-if="!hideWindowControl"
        v-ripple
        class="non-moveable top-0 mr-0 flex cursor-pointer select-none items-center px-3 py-1 after:hidden! hover:bg-[rgb(209,12,12)]"
        small
        @click="close"
      >close</v-icon>
    </span>
  </v-system-bar>
</template>
<script lang="ts" setup>
import { useDialog } from '../composables/dialog'
import { useTaskCount } from '../composables/task'

import TaskSpeedMonitor from '../components/TaskSpeedMonitor.vue'
import { injection } from '@/util/inject'
import { useWindowStyle } from '@/composables/windowStyle'
import AppSystemBarAvatar from './AppSystemBarUserMenu.vue'
import { kTutorial } from '@/composables/tutorial'
import AppSystemBarBadge from '@/components/AppSystemBarBadge.vue'
import AppAudioPlayer from '@/components/AppAudioPlayer.vue'
import PerformanceMonitor from './PerformanceMonitor.vue'
import { kTheme } from '@/composables/theme'
import modulaLogo from '@/assets/modula-logo.png'

const openDiscord = () => {
  window.open('https://discord.gg/gyjG6NjYcR', '_blank')
}

const props = defineProps<{
  noUser?: boolean
  noTask?: boolean
  noDebug?: boolean
  back?: boolean
}>()

const { appBarColor, blurAppBar } = injection(kTheme)
const { maximize, minimize, close, hide } = windowController
const { shouldShiftBackControl, hideWindowControl } = useWindowStyle()
const { show: showFeedbackDialog } = useDialog('feedback')
const { show: showTaskDialog } = useDialog('task')
const { t } = useI18n()
const { count } = useTaskCount()
const tutor = inject(kTutorial, undefined)

const router = useRouter()
const onBack = () => {
  router.back()
}
</script>

<style scoped>
.modula-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  padding: 0 12px 0 8px;
  cursor: default;
  transition: opacity 0.2s ease;
}

.modula-brand:hover {
  opacity: 0.8;
}

.modula-brand-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
  opacity: 0.95;
  filter: drop-shadow(0 0 4px rgba(139, 92, 246, 0.3));
}

.modula-brand-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

/* Micro-animations for system bar icons */
.v-icon {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.v-icon:hover {
  transform: scale(1.1);
}

.non-moveable.px-3.py-1 {
  transition: background-color 0.2s ease;
}
</style>
