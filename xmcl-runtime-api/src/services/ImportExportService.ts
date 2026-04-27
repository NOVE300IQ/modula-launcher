import { ServiceKey } from './Service'

export interface ExportProfileOptions {
  /**
   * The destination path of the .modula file
   */
  destinationPath: string
  /**
   * Include instances in the backup?
   */
  includeInstances?: boolean
  /**
   * Include accounts in the backup?
   */
  includeAccounts?: boolean
  /**
   * Include settings in the backup?
   */
  includeSettings?: boolean
}

export interface ImportProfileOptions {
  /**
   * The path of the .modula file
   */
  path: string
}

/**
 * Provide the abilities to import/export the entire launcher profile
 */
export interface ImportExportService {
  /**
   * Export the launcher profile as a .modula file
   */
  exportProfile(options: ExportProfileOptions): Promise<void>
  /**
   * Import the launcher profile from a .modula file
   */
  importProfile(options: ImportProfileOptions): Promise<void>
}

export const ImportExportServiceKey: ServiceKey<ImportExportService> = 'ImportExportService'
