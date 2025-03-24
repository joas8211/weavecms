import { pb } from './PocketBase'
import { createValidatedCollection } from './ValidatedCollection'
import { SiteGroup } from '$lib/common/models/SiteGroup'
import { Site } from '$lib/common/models/Site'

export const Users = pb.collection('users')
export const SiteGroups = createValidatedCollection('siteGroups', SiteGroup)
export const Sites = createValidatedCollection('sites', Site)
