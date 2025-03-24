<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Sidebar from '$lib/components/ui/sidebar'
	import SiteThumbnail from '$lib/components/SiteThumbnail.svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Input } from '$lib/components/ui/input'
	import EmptyState from '$lib/components/EmptyState.svelte'
	import { Separator } from '$lib/components/ui/separator'
	import { Button } from '$lib/components/ui/button'
	import { CirclePlus, Globe, Loader, ChevronDown, SquarePen, Trash2 } from 'lucide-svelte'
	import CreateSite from '$lib/components/CreateSite.svelte'
	import { useSidebar } from '$lib/components/ui/sidebar'
	import { SiteGroups, Sites } from '$lib/pocketbase/collections'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { SiteGroup } from '$lib/common/models/SiteGroup'
	import type { Site } from '$lib/common/models/Site'

	const sidebar = useSidebar()

	let siteGroup: SiteGroup | undefined = $state()
	$effect(() => {
		const groupId = $page.url.searchParams.get('group')
		if (!groupId) {
			SiteGroups.getList(0, 1).then(async (siteGroups) => {
				if (siteGroups.length === 0) {
					throw new Error('No site groups')
				} else {
					await goto('?group=' + siteGroups[0].id, {})
				}
			})
		} else {
			SiteGroups.getOne(groupId).then((value) => {
				siteGroup = value
				return fetchSites()
			})
		}
	})

	let sites: Site[] = $state([])
	const fetchSites = async () => {
		if (!siteGroup) {
			return
		}

		sites = await Sites.getFullList({ filter: `group = "${siteGroup.id}"` })
	}

	let creating = $state(false)
	async function handleCreate({ starter_id, details, duplication_source, preview }) {
		const starter = await Sites.getOne(starter_id)
		await Sites.create({
			...starter,
			id: undefined,
			name: details.name,
			group: siteGroup!.id!,
			design: details.design,
			isStarter: false
		})
		await fetchSites()
		creating = false
	}

	let renaming = $state(false)
	let newName = $state('')
	$effect(() => {
		if (siteGroup) {
			newName = siteGroup.name
		}
	})
	async function handleRename(e) {
		e.preventDefault()
		// TODO: Implement
		renaming = false
	}

	let isDeleteOpen = $state(false)
	let deleting = $state(false)
	async function handleDelete() {
		if (!siteGroup?.id) {
			return
		}

		deleting = true
		await SiteGroups.delete(siteGroup.id)
		deleting = false
	}
</script>

{#if siteGroup}
	<Dialog.Root bind:open={renaming}>
		<Dialog.Content class="sm:max-w-[425px] pt-12 gap-0">
			<h2 class="text-lg font-semibold leading-none tracking-tight">Rename group</h2>
			<p class="text-muted-foreground text-sm">Enter a new name for your group</p>
			<form onsubmit={handleRename}>
				<Input bind:value={newName} placeholder="Enter new group name" class="my-4" />
				<Dialog.Footer>
					<Button type="button" variant="outline" onclick={() => (renaming = false)}>Cancel</Button>
					<Button type="submit">Rename</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>

	<AlertDialog.Root bind:open={isDeleteOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Are you sure?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will permanently delete <strong>{siteGroup.name}</strong>
					and
					<strong>all</strong>
					its sites.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action onclick={handleDelete} class="bg-red-600 hover:bg-red-700">
					{#if deleting}
						<div class="animate-spin absolute">
							<Loader />
						</div>
					{:else}
						Delete {siteGroup.name}
					{/if}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<header class="flex h-14 shrink-0 items-center gap-2">
		<div class="flex flex-1 items-center gap-2 px-3">
			<Sidebar.Trigger />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<div class="text-sm">{siteGroup.name}</div>
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
					<DropdownMenu.Item onclick={() => (renaming = true)}>
						<SquarePen class="text-muted-foreground" />
						<span>Rename</span>
					</DropdownMenu.Item>
					{#if false}
						<DropdownMenu.Item onclick={() => (isDeleteOpen = true)}>
							<Trash2 class="text-muted-foreground" />
							<span>Delete</span>
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<div class="ml-auto mr-4">
			<Button size="sm" variant="outline" onclick={() => (creating = true)}>
				<CirclePlus class="h-4 w-4" />
				Create Site
			</Button>
			<Dialog.Root bind:open={creating}>
				<Dialog.Content class="max-w-[1600px] h-full max-h-[100vh] flex flex-col p-4">
					<CreateSite onclose={() => (creating = false)} onsubmit={handleCreate} />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</header>
	<div class="flex flex-1 flex-col gap-4 px-4 pb-4">
		{#if sites.length > 0}
			<div class="sites-container">
				<ul class="sites">
					{#each sites as site (site.id)}
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
{/if}

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
