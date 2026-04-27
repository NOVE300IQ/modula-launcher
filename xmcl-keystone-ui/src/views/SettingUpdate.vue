<template>
  <v-card
    v-if="!disableUpdate"
    class="update-card overflow-hidden"
    elevation="0"
  >
    <div
      class="update-card-bg"
      :class="{ 'checking': checkingUpdate, 'has-update': hasNewUpdate }"
    />
    
    <v-card-text class="relative py-6 px-6">
      <div class="flex items-center justify-space-between">
        <div class="flex items-center space-x-5">
          <div 
            class="update-icon-wrapper p-3 rounded-xl transition-all duration-500"
            :class="hasNewUpdate ? 'bg-primary/20 rotate-12' : 'bg-grey/10'"
          >
            <v-icon
              :color="hasNewUpdate ? 'primary' : 'grey lighten-1'"
              size="32"
            >
              {{ hasNewUpdate ? 'upgrade' : 'verified' }}
            </v-icon>
          </div>
          
          <div class="flex flex-col">
            <h3 class="text-xl font-bold mb-0 flex items-center space-x-2">
              <span class="title-text">{{ hasNewUpdate ? 'New Version Released' : 'Modula Launcher' }}</span>
              <v-chip
                v-if="hasNewUpdate"
                x-small
                color="primary"
                class="font-weight-bold pulse-animation ml-2"
                label
              >
                NEW
              </v-chip>
            </h3>
            <span class="text-subtitle-2 grey--text text--lighten-1 mt-1 font-italic">
              Current: v{{ version }}
              <template v-if="hasNewUpdate && updateInfo">
                <v-icon x-small class="mx-1">arrow_forward</v-icon>
                <span class="primary--text font-weight-bold">v{{ updateInfo.name.replace('v', '') }}</span>
              </template>
              <template v-else>
                <span class="ml-2 grey--text text--darken-1">• {{ t('launcherUpdate.noUpdateAvailable') }}</span>
              </template>
            </span>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <v-btn
            v-shared-tooltip="_ => t('setting.checkUpdate')"
            icon
            small
            outlined
            color="grey lighten-1"
            :loading="checkingUpdate"
            class="check-btn transition-transform hover:rotate-180"
            @click="checkUpdate"
          >
            <v-icon size="18">refresh</v-icon>
          </v-btn>

          <v-divider vertical class="mx-2 my-2 h-8" />

          <v-btn
            :loading="checkingUpdate || installing"
            :disabled="updateStatus === 'none'"
            :color="updateStatus !== 'none' ? 'primary' : 'grey darken-3'"
            class="rounded-xl px-6 h-[44px] font-bold text-none hover-glow btn-modern"
            elevation="0"
            @click="showUpdateInfo()"
          >
            <v-icon left size="20" v-if="updateStatus !== 'none'">system_update_alt</v-icon>
            {{
              updateStatus === "none"
                ? t("launcherUpdate.alreadyLatest")
                : updateStatus === "pending"
                  ? t("launcherUpdate.updateToThisVersion")
                  : t("launcherUpdate.installAndQuit")
            }}
          </v-btn>
        </div>
      </div>

      <v-expand-transition>
        <div v-if="downloadingUpdate" class="mt-6 pt-4 border-t border-white/5">
          <div class="flex justify-space-between text-caption mb-2 font-weight-bold">
            <span class="primary--text flex items-center">
              <v-progress-circular indeterminate size="12" width="2" class="mr-2" />
              Downloading technical update...
            </span>
            <span class="grey--text opacity-50 font-italic">Stability improvements and features</span>
          </div>
          <v-progress-linear
            indeterminate
            rounded
            height="6"
            color="primary"
            class="rounded-pill overflow-hidden"
            background-color="rgba(255, 255, 255, 0.05)"
          />
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n-bridge'
import { vSharedTooltip } from '@/directives/sharedTooltip'
import { injection } from '@/util/inject'
import { useDialog } from '../composables/dialog'
import { kUpdateSettings } from '../composables/setting'

const { show: showUpdateInfo } = useDialog('update-info')
const disableUpdate = false // state.env !== 'raw'
const { updateInfo, installing, updateStatus, checkUpdate, checkingUpdate, version, downloadingUpdate } = injection(kUpdateSettings)
const hasNewUpdate = computed(() => updateInfo.value?.newUpdate)
const { t } = useI18n()

</script>

<style scoped>
.update-card {
  position: relative;
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.update-card:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px);
}

.update-card-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(var(--v-primary-base), 0.05), transparent 70%);
  pointer-events: none;
  transition: all 1s ease;
}

.update-card-bg.checking {
  opacity: 0.8;
  animation: bg-pulse 2s infinite ease-in-out;
}

.update-card-bg.has-update {
  background: radial-gradient(circle at top right, rgba(var(--v-primary-base), 0.12), transparent 60%);
}

.title-text {
  background: linear-gradient(90deg, #fff, rgba(255,255,255,0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-modern {
  letter-spacing: 0.5px;
  text-transform: none;
  transition: all 0.3s ease;
}

.hover-glow:hover:not(:disabled) {
  box-shadow: 0 0 20px rgba(var(--v-primary-base), 0.3);
  transform: scale(1.02);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.space-x-2 > * + * { margin-left: 8px; }
.space-x-4 > * + * { margin-left: 16px; }
.space-x-5 > * + * { margin-left: 20px; }

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bg-pulse {
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
  100% { transform: scale(1); opacity: 0.3; }
}

.check-btn {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.check-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3) !important;
}
</style>
