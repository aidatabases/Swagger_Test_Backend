import { performAction } from '@/utils/ActionCache'

export function listServicesByComputeId (computeId) {
  let storeActionName = 'backups/LIST_SERVICES'
  let storeActionParams = { computeId }
  return performAction(storeActionName, storeActionParams)
}

export function getBackupIP (computeId) {
  let storeActionName = 'backups/BACKUP_IP'
  let storeActionParams = { computeId }
  return performAction(storeActionName, storeActionParams)
}

export function createInstanceService (computeId, backupFolderLocation) {
  let storeActionName = 'backups/CREATE_INSTANCE_SERVICE'
  let storeActionParams = { computeId, backupFolderLocation }
  return performAction(storeActionName, storeActionParams)
}

export function listBackupsByBackupServiceId (backupServiceId) {
  let storeActionName = 'backups/LIST_SERVICE_BACKUPS'
  let storeActionParams = { backupServiceId }
  return performAction(storeActionName, storeActionParams)
}
