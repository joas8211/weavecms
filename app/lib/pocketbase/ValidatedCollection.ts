import type { RecordFullListOptions, RecordListOptions, RecordModel, RecordOptions } from 'pocketbase'
import { z } from 'zod'
import { pb } from './PocketBase'

export const createValidatedCollection = <T extends z.AnyZodObject>(idOrName: string, schema: T) => {
	type Values = z.TypeOf<T>
	type ValuesWithExpand = Values & { expand?: { [key: string]: any } }
	type Record = RecordModel & Values
	const collection = pb.collection<Record>(idOrName)
	const schemaWithExpand = schema.extend({ expand: z.record(z.any()).optional() })
	return {
		getOne: async (id: string, options?: RecordOptions): Promise<ValuesWithExpand> => {
			const record = await collection.getOne(id, options)
			return schemaWithExpand.parse(record) as ValuesWithExpand
		},
		getList: async (page?: number, perPage?: number, options?: RecordListOptions): Promise<ValuesWithExpand[]> => {
			const result = await collection.getList(page, perPage, options)
			return result.items.map((record) => schemaWithExpand.parse(record) as ValuesWithExpand)
		},
		getFullList: async (options?: RecordFullListOptions): Promise<ValuesWithExpand[]> => {
			const records = await collection.getFullList(options)
			return records.map((record) => schemaWithExpand.parse(record) as ValuesWithExpand)
		},
		create: async (values: Values): Promise<Values> => {
			const input = schema.parse(values)
			const record = await collection.create(input)
			const output = schema.parse(record)
			return output
		},
		update: async (id: string, values: Partial<Values>): Promise<Values> => {
			const input = schema.partial().parse(values)
			const record = await collection.update(id, input)
			const output = schema.parse(record)
			return output
		},
		delete: (id: string) => collection.delete(id),
		authWithPassword: (usernameOrEmail: string, password: string) => collection.authWithPassword(usernameOrEmail, password),
		requestPasswordReset: (email: string) => collection.requestPasswordReset(email),
		confirmPasswordReset: (passwordResetToken: string, password: string, passwordConfirm: string) => collection.confirmPasswordReset(passwordResetToken, password, passwordConfirm)
	}
}
