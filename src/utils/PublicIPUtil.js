import { performAction } from '@/utils/ActionCache'

export function listPublicIPByProvider (providerId) {
  let storeActionName = 'publicIPs/LIST_IPS_BY_PROVIDER'
  let storeActionParams = { providerId }
  return performAction(storeActionName, storeActionParams)
}

export function listAllotedPublicIPByProject (projectId) {
  let storeActionName = 'publicIPs/LIST_ALLOTED_IPS_BY_PROJECT'
  let storeActionParams = { projectId }
  return performAction(storeActionName, storeActionParams)
}

export function listAllotedPublicIPByProvider (providerId) {
  let storeActionName = 'publicIPs/LIST_ALLOTED_IPS_BY_PROVIDER'
  let storeActionParams = { providerId }
  return performAction(storeActionName, storeActionParams)
}

export function listAllotedPublicIPByProviderAndProject (providerId, projectId) {
  let storeActionName = 'publicIPs/LIST_ALLOTED_IPS_BY_PROVIDER_PROJECT'
  let storeActionParams = { providerId, projectId }
  return performAction(storeActionName, storeActionParams)
}

export function listRoutableIPByOrganisationProviderAndProject (organisationId, providerId, projectId) {
  let storeActionName = 'publicIPs/LIST_ROUTABLE_IPS'
  let storeActionParams = { organisationId, providerId, projectId }
  return performAction(storeActionName, storeActionParams)
}

export function requestPublicIP (applicationName, applicationUrl, aadharCompliance, routableIp, routableIpAttachedWith) {
  let storeActionName = 'publicIPs/REQUEST_PUBLIC_IP'
  let storeActionParams = { applicationName, applicationUrl, aadharCompliance, routableIp, routableIpAttachedWith }
  return performAction(storeActionName, storeActionParams)
}
