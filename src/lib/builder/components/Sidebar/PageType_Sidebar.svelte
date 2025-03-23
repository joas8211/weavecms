<script>
	import _ from 'lodash-es'
	import fileSaver from 'file-saver'
	import { userRole } from '../../stores/app/misc.js'
	import modal from '../../stores/app/modal.js'
	import site from '../../stores/data/site.js'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { browser } from '$app/environment'
	import { dynamic_field_types } from '$lib/builder/field-types'
	import page_type from '../../stores/data/page_type.js'
	import symbols from '../../stores/data/symbols.js'
	import UI from '../../ui/index.js'
	import Icon from '@iconify/svelte'
	import { debounce } from '$lib/builder/utils'
	import { site_design_css } from '../../code_generators.js'
	import Sidebar_Symbol from './Sidebar_Symbol.svelte'
	import Content from '$lib/builder/components/Content.svelte'
	import { v4 as uuidv4 } from 'uuid'
	import { validate_symbol } from '../../converter.js'
	import { flip } from 'svelte/animate'
	import { dropTargetForElements } from '../../libraries/pragmatic-drag-and-drop/entry-point/element/adapter.js'
	import { attachClosestEdge, extractClosestEdge } from '../../libraries/pragmatic-drag-and-drop-hitbox/closest-edge.js'
	import { site_html } from '$lib/builder/stores/app/page'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Button } from '$lib/components/ui/button'
	import DropZone from '$lib/components/DropZone.svelte'
	import { Input } from '$lib/components/ui/input'
	import { Loader } from 'lucide-svelte'
	import * as Tabs from '$lib/components/ui/tabs'
	import { Cuboid, SquarePen } from 'lucide-svelte'

	// get the query param to set the tab when navigating from page (i.e. 'Edit Fields')
	let active_tab = $state($page.url.searchParams.get('t') === 'p' ? 'CONTENT' : 'BLOCKS')
	if (browser) {
		const url = new URL($page.url)
		url.searchParams.delete('t')
		goto(url, { replaceState: true })
	}

	async function create_block() {
		modal.show(
			'BLOCK_EDITOR',
			{
				header: {
					title: `Create Block'}`,
					icon: 'fas fa-check',
					button: {
						label: `Save Block`,
						icon: 'fas fa-check',
						onclick: (new_block, changes) => {
							// TODO: Implement
							modal.hide()
						}
					}
				},
				tab: 'code'
			},
			{
				showSwitch: true,
				disabledBgClose: true
			}
		)
	}

	function edit_block(block) {
		modal.show(
			'BLOCK_EDITOR',
			{
				block,
				header: {
					title: `Edit ${block.title || 'Block'}`,
					icon: 'fas fa-check',
					button: {
						label: `Save Block`,
						icon: 'fas fa-check',
						onclick: (updated_data) => {
							modal.hide()
							// TODO: Implement
						}
					}
				},
				tab: 'code'
			},
			{
				showSwitch: true,
				disabledBgClose: true
			}
		)
	}

	async function show_block_picker() {
		modal.show(
			'BLOCK_PICKER',
			{
				site: $site,
				append: site_design_css($site.design),
				onsave: (symbols) => {
					// TODO: Implement
					modal.hide()
				}
			},
			{
				hideLocaleSelector: true
			}
		)
	}

	async function delete_block(block) {
		// TODO: Implement
	}

	async function duplicate_block(block_id, index) {
		// TODO: Implement
	}

	async function upload_block({ target }) {
		// TODO: Implement
	}

	async function download_block(block_id) {
		// TODO: Implement
	}

	let dragging = $state(null)

	function drag_target(element, block) {
		dropTargetForElements({
			element,
			getData({ input, element }) {
				return attachClosestEdge(
					{ block },
					{
						element,
						input,
						allowedEdges: ['top', 'bottom']
					}
				)
			},
			onDrag({ self, source }) {
				// if (dragging.id !== self.data.block.id) {
				// 	// dragging = {
				// 	// 	id: self.data.block.id,
				// 	// 	position: extractClosestEdge(self.data)
				// 	// }
				// }
			},
			onDragLeave() {
				// reset_drag()
			},
			onDrop({ self, source }) {
				// TODO: Implement
			}
		})
	}
</script>

<div class="sidebar primo-reset">
	<Tabs.Root value="blocks" class="p-2">
		<Tabs.List class="w-full mb-2">
			<Tabs.Trigger value="blocks" class="flex-1 flex gap-1">
				<Cuboid class="w-3" />
				<!-- <span class="text-xs">Page Blocks</span> -->
			</Tabs.Trigger>
			<Tabs.Trigger value="content" class="flex-1 flex gap-1">
				<SquarePen class="w-3" />
				<!-- <span class="text-xs">Page Content</span> -->
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="blocks" class="px-1">
			{#if $symbols.length > 0}
				<div class="primo-buttons">
					<button class="primo-button" onclick={show_block_picker}>
						<Icon icon="mdi:plus" />
						<span>Add</span>
					</button>
					{#if $userRole === 'DEV'}
						<button class="primo-button" onclick={create_block}>
							<Icon icon="mdi:code" />
							<span>Create</span>
						</button>

						<!-- <UI.Dropdown>
							<button class="primo-button" slot="trigger">
								<Icon icon="mdi:code" />
								<span>Create</span>
							</button>
							<div class="dropdown-content">
								<button class="dropdown-item" onclick={create_block}>
									<Icon icon="mdi:code" />
									<span>From Scratch</span>
								</button>
								<button class="dropdown-item" onclick={create_block_from_prompt}>
									<Icon icon="mdi:robot" />
									<span>From Prompt</span>
								</button>
							</div>
						</UI.Dropdown> -->
					{/if}
					<label class="primo-button">
						<input onchange={upload_block} type="file" accept=".json" />
						<Icon icon="mdi:upload" />
						<span>Upload</span>
					</label>
				</div>
				<!-- svelte-ignore missing_declaration -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				{#if $site_html !== null}
					<div class="block-list">
						{#each $symbols.sort((a, b) => a.index - b.index) as symbol, i (symbol.id)}
							{@const toggled = symbol.page_types?.includes($page_type.id)}
							<div class="block" animate:flip={{ duration: 200 }} use:drag_target={symbol}>
								<Sidebar_Symbol
									{symbol}
									head={$site_html}
									append={site_design_css($site.design)}
									show_toggle={true}
									{toggled}
									on:toggle={({ detail }) => {
										if (detail === toggled) return // dispatches on creation for some reason
										// TODO: Implement
									}}
									onmousedown={() => (dragging = symbol._drag_id)}
									onmouseup={() => (dragging = null)}
									on:edit={() => edit_block(symbol)}
									on:rename={({ detail: name }) => {
										// TODO: Implement
									}}
									on:download={() => download_block(symbol.id)}
									on:delete={() => delete_block(symbol)}
									on:duplicate={() => duplicate_block(symbol.id, i + 1)}
								/>
							</div>
						{/each}
					</div>
				{:else}
					<div style="display: flex;justify-content: center;font-size: 2rem;color:var(--color-gray-6)">
						<UI.Spinner variant="loop" />
					</div>
				{/if}
			{:else}
				<div class="empty">Add a Block to your site to use it on your pages.</div>
				<div class="primo-buttons">
					<button class="primo-button" onclick={show_block_picker}>
						<Icon icon="mdi:plus" />
						<span>Add</span>
					</button>
					<button class="primo-button" onclick={create_block}>
						<Icon icon="mdi:code" />
						<span>Create</span>
					</button>
					<label class="primo-button">
						<input onchange={upload_block} type="file" accept=".json" />
						<Icon icon="mdi:upload" />
						<span>Upload</span>
					</label>
				</div>
			{/if}
		</Tabs.Content>
		<Tabs.Content value="content" class="px-1">
			<div class="page-type-fields">
				{#if $userRole === 'DEV'}
					<button class="primo--link" style="margin-bottom: 1rem" onclick={() => modal.show('PAGE_EDITOR')}>
						<Icon icon="mdi:code" />
						<span>Edit Page Type</span>
					</button>
				{/if}
				<Content
					fields={$page_type.fields}
					entries={$page_type.entries}
					on:input={debounce({
						instant: ({ detail }) => {
							// TODO: Implement
						},
						delay: ({ detail }) => {
							// TODO: Implement
						}
					})}
					minimal={true}
				/>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>

<style lang="postcss">
	.sidebar {
		width: 100%;
		background: #111;
		z-index: 9;
		display: flex;
		flex-direction: column;
		height: calc(100vh - 59px);
		/* height: 100%; */
		/* gap: 0.5rem; */
		z-index: 9;
		position: relative;
		overflow: auto;
		/* overflow: hidden; */
		/* padding-top: 0.5rem; */
	}

	.empty {
		font-size: 0.75rem;
		color: var(--color-gray-2);
		padding-bottom: 0.25rem;
	}

	.primo-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.primo-button {
		padding: 0.25rem 0.5rem;
		/* color: #b6b6b6;
			background: #292929; */
		color: var(--color-gray-2);
		background: var(--color-gray-8);
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		gap: 0.25rem;
		align-items: center;
		font-size: 0.75rem;

		input {
			display: none;
		}
	}

	.container {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		padding: 1rem;
		gap: 0.75rem;
	}

	.block-list {
		/* gap: 1rem; */
		flex: 1;
		display: flex;
		flex-direction: column;

		.block {
			padding-block: 0.5rem;
		}

		.block:first-child {
			padding-top: 0;
		}
	}
</style>
