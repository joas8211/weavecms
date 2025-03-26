import { LibrarySymbolGroup } from '$lib/common/models/LibrarySymbolGroup'
import { Site } from '$lib/common/models/Site'
import { SiteGroup } from '$lib/common/models/SiteGroup'
import { Starter } from '$lib/common/models/Starter'
import { User } from '$lib/common/models/User'
import { LibrarySettings as LibrarySettingsModel } from '$lib/common/models/LibrarySettings'
import { createValidatedCollection } from './ValidatedCollection'
import { LibrarySymbol } from '$lib/common/models/LibrarySymbol'

export const Users = createValidatedCollection('users', User)
export const SiteGroups = createValidatedCollection('site_groups', SiteGroup)
export const Sites = createValidatedCollection('sites', Site)
export const Starters = createValidatedCollection('starters', Starter)
export const LibrarySettings = createValidatedCollection('library_settings', LibrarySettingsModel)
export const LibrarySymbolGroups = createValidatedCollection('library_symbol_groups', LibrarySymbolGroup)
export const LibrarySymbols = createValidatedCollection('library_symbols', LibrarySymbol)
