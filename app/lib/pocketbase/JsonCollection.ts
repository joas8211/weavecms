import type { z } from 'zod'
import type { RecordModel } from 'pocketbase'
import { pb } from './PocketBase'

export const createJsonCollection = <T extends z.AnyZodObject>(idOrName: string, schema: T) => {
	type Value = z.TypeOf<T>
	type Record = RecordModel & { value: Value }
	const collection = pb.collection<Record>(idOrName)
	return {
		list: async () => collection.getFullList({ fields: 'value' }).then((records) => records.map((record) => record.value)),
		create: async (value: Value) => {
			value = await schema.parseAsync(value)
			const record = await collection.create({
				value: JSON.stringify(value)
			})
			return record.value
		},
		update: async (id: string, value: Partial<Value>) => {
			value = await schema.partial().parseAsync(value)
			const record = await collection.update(id, { value: JSON.stringify(value) })
			return record.value
		}
	}
}
