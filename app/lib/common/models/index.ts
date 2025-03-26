import { LibrarySettings } from './LibrarySettings'
import { LibrarySymbol } from './LibrarySymbol'
import { LibrarySymbolGroup } from './LibrarySymbolGroup'
import { Site } from './Site'
import { SiteGroup } from './SiteGroup'
import { Starter } from './Starter'
import { User } from './User'

export const models = {
	users: User,
	site_groups: SiteGroup,
	sites: Site,
	starters: Starter,
	library_settings: LibrarySettings,
	library_symbol_groups: LibrarySymbolGroup,
	library_symbols: LibrarySymbol
} satisfies Record<string, import('zod').AnyZodObject>
