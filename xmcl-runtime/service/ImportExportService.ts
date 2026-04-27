import { ExportProfileOptions, ImportExportService as IImportExportService, ImportExportServiceKey, ImportProfileOptions } from '@xmcl/runtime-api'
import { open, openEntryReadStream, readAllEntries } from '@xmcl/unzip'
import { createWriteStream, existsSync } from 'fs'
import { copyFile, emptyDir, ensureDir, readdir, remove } from 'fs-extra'
import { basename, dirname, join } from 'path'
import { ZipFile } from 'yazl'
import { Inject, kGameDataPath, LauncherAppKey, PathResolver } from '~/app'
import { AbstractService, ExposeServiceKey } from '~/service'
import { pipeline } from '~/util/fs'
import { includeAs, writeZipFile } from '~/util/zip'
import { LauncherApp } from '../app/LauncherApp'

@ExposeServiceKey(ImportExportServiceKey)
export class ImportExportService extends AbstractService implements IImportExportService {
  constructor(
    @Inject(LauncherAppKey) app: LauncherApp,
    @Inject(kGameDataPath) private getPath: PathResolver,
  ) {
    super(app)
  }

  async exportProfile(options: ExportProfileOptions): Promise<void> {
    const { destinationPath, includeInstances = true, includeAccounts = true, includeSettings = true } = options
    const zipFile = new ZipFile()

    this.log(`Exporting profile to ${destinationPath}`)

    if (includeInstances) {
      const instancesDir = this.getPath('instances')
      if (existsSync(instancesDir)) {
        this.log('Adding instances directory to backup')
        await includeAs(zipFile, instancesDir, 'instances')
      }
      const instancesJson = this.getAppDataPath('instances.json')
      if (existsSync(instancesJson)) {
        zipFile.addFile(instancesJson, 'instances.json')
      }
    }

    if (includeAccounts) {
      const userJson = this.getAppDataPath('user.json')
      if (existsSync(userJson)) {
        this.log('Adding user accounts to backup')
        zipFile.addFile(userJson, 'user.json')
      }
    }

    if (includeSettings) {
      const settingsJson = this.getAppDataPath('settings.json')
      if (existsSync(settingsJson)) {
        this.log('Adding settings to backup')
        zipFile.addFile(settingsJson, 'settings.json')
      }
      const themeJson = this.getAppDataPath('theme.json')
      if (existsSync(themeJson)) {
        zipFile.addFile(themeJson, 'theme.json')
      }
      const themeMedia = this.getAppDataPath('theme-media')
      if (existsSync(themeMedia)) {
        await includeAs(zipFile, themeMedia, 'theme-media')
      }
    }

    // Add a marker file
    zipFile.addBuffer(Buffer.from(JSON.stringify({ version: this.app.version, timestamp: Date.now() })), 'modula.json')

    await writeZipFile(zipFile, destinationPath)
    this.log('Profile export completed successfully')
  }

  async importProfile(options: ImportProfileOptions): Promise<void> {
    const { path } = options
    if (!existsSync(path)) {
      throw new Error(`Backup file not found: ${path}`)
    }

    this.log(`Importing profile from ${path}`)
    const zipFile = await open(path)
    const entries = await readAllEntries(zipFile)

    // Verify this is a valid modula backup
    if (!entries.some(e => e.fileName === 'modula.json')) {
      throw new Error('Invalid backup file: missing modula.json marker')
    }

    // We should probably warn the user that this will overwrite current data
    // But since this is a service call, we assume the UI handled the warning

    for (const entry of entries) {
      if (entry.fileName === 'modula.json') continue

      const isAppDataFile = ['instances.json', 'user.json', 'settings.json', 'theme.json'].includes(entry.fileName)
      const isAppDataFolder = entry.fileName.startsWith('theme-media/')
      const isGameData = entry.fileName.startsWith('instances/')

      let targetPath: string
      if (isAppDataFile || isAppDataFolder) {
        targetPath = this.getAppDataPath(entry.fileName)
      } else if (isGameData) {
        targetPath = this.getPath(entry.fileName)
      } else {
        continue
      }

      if (entry.fileName.endsWith('/')) {
        await ensureDir(targetPath)
        continue
      }

      await ensureDir(dirname(targetPath))
      const readStream = await openEntryReadStream(zipFile, entry)
      const writeStream = createWriteStream(targetPath)
      await pipeline(readStream, writeStream)
    }

    this.log('Profile import completed. Relaunching app to apply changes...')
    // Relaunch the app to reload all services with new data
    this.app.relaunch()
  }
}
