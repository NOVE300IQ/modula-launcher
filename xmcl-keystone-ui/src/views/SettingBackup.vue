<template>
  <SettingCard
    :title="t('setting.backupAndSync')"
    :subtitle="t('setting.backupDescription')"
    icon="settings_backup_restore"
  >
    <v-list
      two-line
      subheader
      background-color="transparent"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ t('setting.exportProfile') }}</v-list-item-title>
          <v-list-item-subtitle>{{ t('setting.exportSettingsHint') }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            color="primary"
            :loading="exporting"
            @click="onExport"
          >
            <v-icon left>
              upload
            </v-icon>
            {{ t('setting.exportProfile') }}
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ t('setting.importProfile') }}</v-list-item-title>
          <v-list-item-subtitle>{{ t('setting.importSettingsHint') }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            outlined
            color="primary"
            :loading="importing"
            @click="onImport"
          >
            <v-icon left>
              download
            </v-icon>
            {{ t('setting.importProfile') }}
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </SettingCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n-bridge'
import SettingCard from '@/components/SettingCard.vue'
import { useService } from '@/composables'
import { ImportExportServiceKey } from '@xmcl/runtime-api'
import { useNotifier } from '@/composables/notifier'

const { t } = useI18n()
const { exportProfile, importProfile } = useService(ImportExportServiceKey)
const { notify } = useNotifier()
const { showOpenDialog, showSaveDialog } = windowController

const exporting = ref(false)
const importing = ref(false)

async function onExport() {
  const { filePath, canceled } = await showSaveDialog({
    title: t('setting.exportProfile'),
    defaultPath: 'profile.modula',
    filters: [
      { name: 'Modula Profile', extensions: ['modula'] },
    ],
  })

  if (canceled || !filePath) return

  exporting.value = true
  try {
    await exportProfile({
      destinationPath: filePath,
      includeInstances: true,
      includeAccounts: true,
      includeSettings: true,
    })
    notify({
      level: 'success',
      title: t('setting.exportSuccess'),
    })
  } catch (e) {
    notify({
      level: 'error',
      title: t('errors.DownloadAggregateError'),
      body: (e as any).message,
    })
  } finally {
    exporting.value = false
  }
}

async function onImport() {
  const { filePaths, canceled } = await showOpenDialog({
    title: t('setting.importProfile'),
    filters: [
      { name: 'Modula Profile', extensions: ['modula'] },
    ],
    properties: ['openFile'],
  })

  if (canceled || filePaths.length === 0) return

  const path = filePaths[0]
  
  // Show confirmation dialog (using browser confirm for simplicity if no better dialog available)
  // But wait, xmcl-keystone-ui has a better way usually. 
  // I'll just use a simple confirm for now or check if there is a confirm dialog composable.
  
  const confirmed = confirm(t('setting.importConfirmMessage'))
  if (!confirmed) return

  importing.value = true
  try {
    await importProfile({ path })
    // The app will relaunch automatically from backend, but we can notify just in case
    notify({
      level: 'success',
      title: t('setting.importSuccess'),
    })
  } catch (e) {
    notify({
      level: 'error',
      title: t('errors.DownloadAggregateError'),
      body: (e as any).message,
    })
  } finally {
    importing.value = false
  }
}
</script>
