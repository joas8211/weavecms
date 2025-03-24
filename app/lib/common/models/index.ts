import { Site } from './Site'
import { SiteGroup } from './SiteGroup'

export const models = {
	siteGroups: SiteGroup,
	sites: Site
} satisfies Record<string, import('zod').AnyZodObject>
