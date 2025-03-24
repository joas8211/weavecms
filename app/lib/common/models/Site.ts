import { z } from 'zod'

export const Site = z.object({
	id: z.string().nonempty().optional(),
	name: z.string().nonempty(),
	owner: z.string().nonempty(),
	group: z.string(),
	code: z.object({
		foot: z.string(),
		head: z.string()
	}),
	design: z.object({
		radius: z.string(),
		shadow: z.string(),
		body_font: z.string(),
		heading_font: z.string(),
		primary_color: z.string()
	}),
	isStarter: z.boolean()
})

export type Site = z.infer<typeof Site>
