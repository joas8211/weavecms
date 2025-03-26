<script>
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Sidebar from '$lib/components/ui/sidebar'
	import SiteThumbnail from '$lib/components/SiteThumbnail.svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Input } from '$lib/components/ui/input'
	import EmptyState from '$lib/components/EmptyState.svelte'
	import * as actions from '$lib/actions'
	import { Separator } from '$lib/components/ui/separator'
	import { Button } from '$lib/components/ui/button'
	import { CirclePlus, Globe, Loader, ChevronDown, SquarePen, Trash2 } from 'lucide-svelte'
	import CreateSite from '$lib/components/CreateSite.svelte'
	import { page } from '$app/stores'
	import { useSidebar } from '$lib/components/ui/sidebar'
	import { invalidate_all, require_site_groups } from '../data'
	import { goto } from '$app/navigation'

	const sidebar = useSidebar()
	const site_groups = require_site_groups()

	async function create_site({ starter_id, details, duplication_source, preview }) {
		if (!active_site_group) return
		await actions.sites.create({ starter_id, details, duplication_source, preview, group: active_site_group.id })
		invalidate_all()
		creating_site = false
	}

	let groupId = $derived($page.url.searchParams.get('group'))
	let active_site_group = $derived($site_groups.find((g) => String(g.id) === groupId))
	$effect(() => {
		if (!groupId && $site_groups.length > 0) {
			goto('?group=' + $site_groups[0].id, {})
		}
	})

	let creating_site = $state(false)

	let is_rename_open = $state(false)
	let new_name = $state('')
	$effect(() => {
		if (active_site_group) {
			new_name = active_site_group.name
		}
	})
	async function handle_rename(e) {
		e.preventDefault()
		if (!active_site_group) return
		await actions.rename_site_group(active_site_group.id, new_name)
		invalidate_all()
		is_rename_open = false
	}

	let is_delete_open = $state(false)
	let deleting = $state(false)
	async function handle_delete() {
		if (!active_site_group) return
		deleting = true
		await actions.delete_site_group(active_site_group.id)
		invalidate_all()
		deleting = false
	}
</script>

<Dialog.Root bind:open={is_rename_open}>
	<Dialog.Content class="sm:max-w-[425px] pt-12 gap-0">
		<h2 class="text-lg font-semibold leading-none tracking-tight">Rename group</h2>
		<p class="text-muted-foreground text-sm">Enter a new name for your group</p>
		<form onsubmit={handle_rename}>
			<Input bind:value={new_name} placeholder="Enter new group name" class="my-4" />
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (is_rename_open = false)}>Cancel</Button>
				<Button type="submit">Rename</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={is_delete_open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete <strong>{active_site_group?.name}</strong>
				and
				<strong>all</strong>
				its sites.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handle_delete} class="bg-red-600 hover:bg-red-700">
				{#if deleting}
					<div class="animate-spin absolute">
						<Loader />
					</div>
				{:else}
					Delete {active_site_group?.name}
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<header class="flex h-14 shrink-0 items-center gap-2">
	<div class="flex flex-1 items-center gap-2 px-3">
		<Sidebar.Trigger />
		<Separator orientation="vertical" class="mr-2 h-4" />
		<div class="text-sm">{active_site_group?.name}</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<button {...props}>
						<ChevronDown class="h-4" />
						<span class="sr-only">More</span>
					</button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56 rounded-lg" side="bottom" align={sidebar.isMobile ? 'end' : 'start'}>
				<DropdownMenu.Item onclick={() => (is_rename_open = true)}>
					<SquarePen class="text-muted-foreground" />
					<span>Rename</span>
				</DropdownMenu.Item>
				{#if $site_groups.length > 1}
					<DropdownMenu.Item onclick={() => (is_delete_open = true)}>
						<Trash2 class="text-muted-foreground" />
						<span>Delete</span>
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="ml-auto mr-4">
		<Button size="sm" variant="outline" onclick={() => (creating_site = true)}>
			<CirclePlus class="h-4 w-4" />
			Create Site
		</Button>
		<Dialog.Root bind:open={creating_site}>
			<Dialog.Content class="max-w-[1600px] h-full max-h-[100vh] flex flex-col p-4">
				<CreateSite onclose={() => (creating_site = false)} onsubmit={create_site} />
			</Dialog.Content>
		</Dialog.Root>
	</div>
</header>
<div class="flex flex-1 flex-col gap-4 px-4 pb-4">
	{#if active_site_group?.sites.length > 0}
		<div class="sites-container">
			<ul class="sites">
				{#each active_site_group?.sites as site (site.id)}
					<li>
						<SiteThumbnail {site} />
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<EmptyState icon={Globe} title="No Sites to display" description="It looks like you haven't created any websites yet." />
	{/if}
</div>

<style lang="postcss">
	.sites-container {
		display: grid;
		gap: 1rem;

		ul.sites {
			display: grid;
			gap: 1rem;
			row-gap: 1.5rem;
		}
	}

	@media (min-width: 600px) {
		ul.sites {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 900px) {
		ul.sites {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}

	@media (min-width: 1200px) {
		ul.sites {
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}
	}
</style>
