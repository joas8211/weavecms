import { writable } from 'svelte/store'

const marketplace_symbols = writable([])
let marketplace_symbols_loaded = false
export const require_marketplace_symbols = () => {
	if (marketplace_symbols_loaded) {
		return marketplace_symbols
	}
	// TODO: Implement
	throw new Error('Not implemented')
	return marketplace_symbols
}

const marketplace_starters = writable([])
let marketplace_starters_loaded = false
export const require_marketplace_starters = () => {
	if (marketplace_starters_loaded) {
		return marketplace_starters
	}
	// TODO: Implement
	throw new Error('Not implemented')
	return marketplace_starters
}

const library_settings = writable()
let library_settings_loaded = false
export const require_library_settings = () => {
	if (library_settings_loaded) {
		return library_settings
	}
	// TODO: Implement
	throw new Error('Not implemented')
	return library_settings
}

const site_groups = writable([])
let site_groups_loaded = false
export const require_site_groups = () => {
	if (site_groups_loaded) {
		return site_groups
	}
	// TODO: Implement
	throw new Error('Not implemented')
	return site_groups
}

const starters = writable([])
let starters_loaded = false
export const require_starters = () => {
	if (starters_loaded) {
		return starters
	}
	// TODO: Implement
	throw new Error('Not implemented')
	return starters
}

const symbol_groups = writable([])
let symbol_groups_loaded = false
export const require_symbol_groups = () => {
	if (symbol_groups_loaded) {
		return symbol_groups
	}
	// TODO: Implement
	throw new Error('Not implemented')
	return symbol_groups
}

export const invalidate_all = () => {
	marketplace_symbols_loaded = false
	marketplace_starters_loaded = false
	library_settings_loaded = false
	site_groups_loaded = false
	starters_loaded = false
	symbol_groups_loaded = false
}
