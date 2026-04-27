import { LauncherAppPlugin } from '~/app'
import { LaunchService } from './LaunchService'
import { exec } from 'child_process'
import { kSettings } from '~/settings'

export const pluginPerformance: LauncherAppPlugin = async (app) => {
  const launchService = await app.registry.get(LaunchService)
  const logger = app.getLogger('PerformanceOptimizer')

  launchService.on('minecraft-start', async (payload) => {
    const settings = await app.registry.get(kSettings)
    if (!settings.globalOptimizeJVM) return

    const pid = payload.pid
    if (typeof pid !== 'number') return

    if (process.platform === 'win32') {
      // Set process priority to "Above Normal" (128)
      // We use Above Normal instead of High to prevent input lag on some systems
      const command = `wmic process where processid=${pid} CALL setpriority 128`
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.warn(`Failed to set process priority for PID ${pid}: ${error.message}`)
          return
        }
        logger.log(`Successfully elevated Minecraft process (PID: ${pid}) priority to Above Normal`)
      })
    }
  })

  // Force Discrete GPU on Windows for Laptops
  launchService.registerMiddleware({
    name: 'performance-env',
    async onBeforeLaunch(input, payload, context) {
      const settings = await app.registry.get(kSettings)
      if (!settings.enableDedicatedGPUOptimization) return

      if (!input.env) input.env = {}

      if (process.platform === 'win32') {
         // Windows specific hint for some drivers
         input.env.SHIM_MC_PERFORMANCE = '1'
      } else if (process.platform === 'linux') {
        // Linux PRIME offload
        input.env.__NV_PRIME_RENDER_OFFLOAD = '1'
        input.env.__GLX_VENDOR_LIBRARY_NAME = 'nvidia'
        input.env.DRI_PRIME = '1'
      }
      
      logger.log('Applied High-Performance GPU environment variables')
    }
  })
}
