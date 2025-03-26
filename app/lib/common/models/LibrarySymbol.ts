import { z } from 'zod'

export const LibrarySymbol = z.object({
	id: z.string().nonempty(),
	name: z.string().nonempty(),
	group: z.string().nonempty(),
	code: z.object({
		js: z.string(),
		css: z.string(),
		html: z.string()
	}),
	index: z.number().int().nonnegative()
})

export type LibrarySymbol = z.infer<typeof LibrarySymbol>
