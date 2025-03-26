import { z } from 'zod'

export const LibrarySettings = z.object({
	id: z.string().nonempty(),
	owner: z.string().nonempty(),
	value: z.object({
		head: z.string(),
		design: z.object({
			heading_font: z.string(),
			body_font: z.string(),
			primary_color: z.string(),
			radius: z.string(),
			shadow: z.string()
		})
	})
})

export type LibrarySettings = z.infer<typeof LibrarySettings>
