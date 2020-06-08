import store from 'vuex-store'

export function canRead (head) {
  return store.getters['auth/myScope'].indexOf(`${head}:read`) >= 0
}
export function canWrite (head) {
  return store.getters['auth/myScope'].indexOf(`${head}:write`) >= 0
}

export function canReadUsers () { return canRead('users') }
export function canWriteUsers () { return canWrite('users') }
export function canReadVolumes () { return canRead('volumes') }
export function canWriteVolumes () { return canWrite('volumes') }
export function canReadAuth () { return canRead('auth') }
export function canWriteAuth () { return canWrite('auth') }
export function canReadCompute () { return canRead('compute') }
export function canWriteCompute () { return canWrite('compute') }
export function canReadNetworks () { return canRead('networks') }
export function canWriteNetworks () { return canWrite('networks') }
export function canReadOrganisations () { return canRead('organisations') }
export function canWriteOrganisations () { return canWrite('organisations') }
export function canReadProjects () { return canRead('projects') }
export function canWriteProjects () { return canWrite('projects') }
export function canReadProjectGateway () { return canRead('project_gateway') }
export function canWriteProjectGateway () { return canWrite('project_gateway') }
export function canReadRoles () { return canRead('role_permission') }
export function canWriteRoles () { return canWrite('role_permission') }
export function canReadQuotaPackages () { return canRead('quotapackages') }
export function canWriteQuotaPackages () { return canWrite('quotapackages') }
export function canReadSnapshots () { return canRead('snapshots') }
export function canWriteSnapshots () { return canWrite('snapshots') }
export function canReadProviders () { return canRead('providers') }
export function canWriteProviders () { return canWrite('providers') }
export function canReadLoadBalancer () { return canRead('load-balancers') }
export function canWriteLoadBalancer () { return canWrite('load-balancers') }
