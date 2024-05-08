<script lang="ts">
	import { type EditorType, Editor } from '$lib/index.js';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let saveStatus = 'Saved';
	let isLoaded = false;
	
	let editor: EditorType;

	let defaultValue: String;
	
	let lastUpdatedOn = new Date();

	let sectionId = $page.url.searchParams.get('sectionId');

	if (browser) {
		let htmlEl = document.getElementsByTagName('html')[0];
		

		window.parent.postMessage({ name: 'editor:onPageLoaded', data: { pageLoaded: true, sectionId } }, '*');

		window.addEventListener('message', ({ data: { name, data } }) => {
			if (name === 'editor:setValue') {
				let { json } = data;

				defaultValue = json || {};
				lastUpdatedOn = new Date();
				isLoaded = true;

				htmlEl.style.setProperty("--font-title", data.theme?.titleFont);
				htmlEl.style.setProperty("--font-default", data.theme?.textFont);

				window.parent.postMessage({ name: 'editor:onResized', data: { height: htmlEl.scrollHeight, sectionId } }, '*');
	

				setTimeout(() => {
					
					window.parent.postMessage({ name: 'editor:onResized', data: { height: htmlEl.scrollHeight, sectionId } }, '*');
				}, 0);
			}
		});
	}

</script>

<main class="flex justify-center pt-8">
	{#if isLoaded}
		{#key lastUpdatedOn}
			<Editor
				bind:editor
				disableLocalStorage={true}
				onUpdate={() => {
					saveStatus = 'Unsaved';

					window.parent.postMessage({ name: 'editor:onResized', data: { sectionId, height: document.getElementsByTagName('html')[0].scrollHeight }}, '*')

				}}
				onDebouncedUpdate={(editor) => {
					if (window.parent) {
						let json = editor?.getJSON();

						window.parent.postMessage({
							name: 'editor.value:updated',
							data: {
								sectionId,
								json
							}
						}, '*')
					}
					saveStatus = 'Saving...';
					// Simulate a delay in saving.
					setTimeout(() => {
						saveStatus = 'Saved';
					}, 500);
				}}
				defaultValue={defaultValue}
			>
			
			</Editor>
		{/key}
	{/if}
</main>
