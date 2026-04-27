import { AbstractService, ExposeServiceKey } from '../service'
import { LauncherApp, Inject, LauncherAppKey } from '../app'
import { InstanceService } from '../instance'
import { join } from 'path'
import { existsSync, ensureDir, writeFile } from 'fs-extra'

export const ModulaClientServiceKey = Symbol('ModulaClientServiceKey')

@ExposeServiceKey(ModulaClientServiceKey)
export class ModulaClientService extends AbstractService {
  constructor(
    @Inject(LauncherAppKey) app: LauncherApp,
    @Inject(InstanceService) private instanceService: InstanceService,
  ) {
    super(app)
  }

  async initModulaClient(instancePath: string) {
    this.log(`Initializing Modula Client for: ${instancePath}`)
    
    // 1. Ensure the mod directory exists
    const modsPath = join(instancePath, 'mods')
    await ensureDir(modsPath)

    // 2. Configure the mods (write config files)
    await this.setupModConfigs(instancePath)
  }

  private async setupModConfigs(instancePath: string) {
    const configPath = join(instancePath, 'config')
    await ensureDir(configPath)

    // Setup ModMenu to use Right Shift
    const modMenuConfig = {
      "common": {
          "mod_menu_button_config": "RIGHT_SHIFT"
      }
    }
    const modMenuPath = join(configPath, 'modmenu.json')
    await writeFile(modMenuPath, JSON.stringify(modMenuConfig, null, 2))
    
    this.log('Modula configs applied.')
  }
}
