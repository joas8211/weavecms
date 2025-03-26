import { z } from 'zod'

export const Site = z.object({
	id: z.string().nonempty(),
	name: z.string().nonempty(),
	description: z.string(),
	group: z.string().nonempty(),
	code: z.object({
		head: z.string(),
		foot: z.string()
	}),
	design: z.object({
		heading_font: z.string(),
		body_font: z.string(),
		primary_color: z.string(),
		radius: z.string(),
		shadow: z.string()
	}),
	published: z.boolean()
})

export type Site = z.infer<typeof Site>
