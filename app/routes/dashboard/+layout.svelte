<script>
	import * as Sidebar from '$lib/components/ui/sidebar'
	import AppSidebar from '$lib/components/app-sidebar.svelte'
	import { Globe, LayoutTemplate, Store, Library, Cuboid } from 'lucide-svelte'
	import { page } from '$app/stores'
	import { pb } from '$lib/pocketbase/PocketBase'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { require_site_groups, require_symbol_groups } from './data'

	let site_groups = require_site_groups()
	let symbol_groups = require_symbol_groups()

	onMount(async () => {
		if (!pb.authStore.isValid) {
			await goto('/auth')
		}
	})

	let { children } = $props()

	const sidebar_menu = $derived.by(() => {
		const pathname = $page.url.pathname
		const path = pathname.split('/').slice(0, 3).join('/')
		return {
			'/dashboard/sites': {
				title: 'Sites',
				icon: Globe,
				site_groups: $site_groups
			},
			'/dashboard/library': {
				title: 'Library',
				icon: Library,
				buttons: [
					{
						icon: LayoutTemplate,
						label: 'Starters',
						url: '/dashboard/library/starters',
						isActive: pathname === '/dashboard/library/starters'
					},
					{
						icon: Cuboid,
						label: 'Blocks',
						url: '/dashboard/library/blocks',
						isActive: pathname === '/dashboard/library/blocks',
						items: $symbol_groups
					}
				]
			},
			'/dashboard/marketplace': {
				title: 'Marketplace',
				icon: Store,
				buttons: [
					{
						icon: LayoutTemplate,
						label: 'Starters',
						url: '/dashboard/marketplace/starters',
						isActive: pathname === '/dashboard/marketplace/starters'
					},
					{
						icon: Cuboid,
						label: 'Blocks',
						url: '/dashboard/marketplace/blocks',
						isActive: pathname === '/dashboard/marketplace/blocks'
					}
				]
			}
		}[path]
	})
</script>

<Sidebar.Provider>
	<AppSidebar {sidebar_menu} />
	<Sidebar.Inset>
		{@render children?.()}
	</Sidebar.Inset>
</Sidebar.Provider>
