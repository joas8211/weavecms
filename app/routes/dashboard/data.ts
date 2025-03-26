import { LibrarySymbolGroup } from '$lib/common/models/LibrarySymbolGroup'
import type { Site } from '$lib/common/models/Site'
import { SiteGroup } from '$lib/common/models/SiteGroup'
import type { Starter } from '$lib/common/models/Starter'
import { LibrarySettings, LibrarySymbolGroups, SiteGroups, Starters } from '$lib/pocketbase/collections'
import { writable } from 'svelte/store'
import { LibrarySettings as LibrarySettingsModel } from '$lib/common/models/LibrarySettings'
import type { LibrarySymbol } from '$lib/common/models/LibrarySymbol'

const marketplace_symbol_groups = writable([])
let marketplace_symbol_groups_loaded = false
export const require_marketplace_symbol_groups = () => {
	if (marketplace_symbols_loaded) {
		return marketplace_symbol_groups
	}
	marketplace_symbol_groups_loaded = true
	fetch('https://weave-marketplace.vercel.app/api/symbol_groups')
		.then((response) => response.json())
		.then((value) => marketplace_symbol_groups.set(value))
	return marketplace_symbol_groups
}

const marketplace_symbols = writable([])
let marketplace_symbols_loaded: number | false = false
export const require_marketplace_symbols = (group_id: number) => {
	if (marketplace_symbols_loaded === group_id) {
		return marketplace_symbols
	}
	marketplace_symbols_loaded = group_id
	fetch(`https://weave-marketplace.vercel.app/api/symbol_groups/${group_id}`)
		.then((response) => response.json())
		.then((value) => marketplace_symbols.set(value))
	return marketplace_symbols
}

const marketplace_starters = writable<Starter[]>([])
let marketplace_starters_loaded = false
export const require_marketplace_starters = () => {
	if (marketplace_starters_loaded) {
		return marketplace_starters
	}
	marketplace_starters_loaded = true
	fetch('https://weave-marketplace.vercel.app/api/starters')
		.then((response) => response.json())
		.then((value) => marketplace_starters.set(value))
	return marketplace_starters
}

const library_settings = writable<LibrarySettingsModel>()
let library_settings_loaded = false
export const require_library_settings = () => {
	if (library_settings_loaded) {
		return library_settings
	}
	library_settings_loaded = true
	LibrarySettings.getList(0, 1).then((value) => library_settings.set(value[0]))
	return library_settings
}

const site_groups = writable<(SiteGroup & { sites: Site[] })[]>([])
let site_groups_loaded = false
export const require_site_groups = () => {
	if (site_groups_loaded) {
		return site_groups
	}
	site_groups_loaded = true
	SiteGroups.getFullList({ expand: 'sites_via_group' })
		.then((value) => value.map((record) => ({ ...record, sites: record.expand?.sites_via_group, expand: undefined })))
		.then((value) => site_groups.set(value))
	return site_groups
}

const starters = writable<Starter[]>([])
let starters_loaded = false
export const require_starters = () => {
	if (starters_loaded) {
		return starters
	}
	starters_loaded = true
	Starters.getFullList().then((value) => starters.set(value))
	return starters
}

const library_symbol_groups = writable<(LibrarySymbolGroup & { symbols: LibrarySymbol[] })[]>([])
let library_symbol_groups_loaded = false
export const require_library_symbol_groups = () => {
	if (library_symbol_groups_loaded) {
		return library_symbol_groups
	}
	library_symbol_groups_loaded = true
	LibrarySymbolGroups.getFullList({ expand: 'library_symbols_via_group' })
		.then((value) => value.map((record) => ({ ...record, symbols: record.expand?.library_symbols_via_group, expand: undefined })))
		.then((value) => library_symbol_groups.set(value))
	return library_symbol_groups
}

export const invalidate_all = () => {
	marketplace_symbols_loaded = false
	marketplace_starters_loaded = false
	library_settings_loaded = false
	site_groups_loaded = false
	starters_loaded = false
	library_symbol_groups_loaded = false
}
