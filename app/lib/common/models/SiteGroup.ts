import { z } from 'zod'

export const SiteGroup = z.object({
	id: z.string().nonempty().optional(),
	name: z.string().nonempty(),
	owner: z.string().nonempty()
})

export type SiteGroup = z.infer<typeof SiteGroup>
