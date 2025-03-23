<script>
	import Primo from '$lib/builder/Primo.svelte'
	import { show } from '$lib/components/Modal.svelte'

	let { data, children } = $props()
	let primo_symbols = []
</script>

<Primo
	{data}
	on:publish={() => show({ id: 'DEPLOY', options: { max_width: '700px' } })}
	role={data.role}
	{primo_symbols}
	primary_buttons={[
		{
			icon: 'solar:pallete-2-bold',
			label: 'Design',
			onclick: () => show({ id: 'DESIGN', options: { height: '100%' } })
		}
	]}
	secondary_buttons={[
		{
			icon: 'clarity:users-solid',
			label: 'Editors',
			onclick: () => {
				show({
					id: 'COLLABORATION',
					options: { max_width: '500px' }
				})
			}
		}
	]}
>
	{@render children?.()}
</Primo>
