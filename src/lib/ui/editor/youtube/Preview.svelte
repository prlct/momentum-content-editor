<script lang="ts">
  import { isValidUrl } from "$lib/utils.js";
  import { X } from "lucide-svelte";
  import { onMount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { getEmbedUrl } from "./utils.js";

  export let iframeAttributes: HTMLAttributes<HTMLIFrameElement>;
  export let remove: () => void;
  export let updateSrc: (src: string) => void;

  let src = iframeAttributes.src;
  let popup: HTMLFormElement;
  let playerWrapper: HTMLDivElement;

  let inputEl: HTMLInputElement;

  function submit() {
    if (isValidUrl(inputEl.value)) {
      src = inputEl.value;
      updateSrc(src);
    } else {
      alert("Invalid url");
    }
  }

  let isMounted = false;
  
  onMount(() => {
    setTimeout(() => {
      isMounted = true;
      inputEl?.focus();
    }, 0);

  });

  let embedEl;
  
  if (src && (src.includes('twitter.com') || src.includes('x.com'))) {
		setTimeout(() => {
      if (embedEl.getAttribute('data-loaded')) {
				return;
			}
      console.log('loading tweet...');

			embedEl.setAttribute('data-loaded', true);

      if (embedEl.innerHTML.includes('twitter-tweet-rendered')) {
        return;
      }

			window.twttr.widgets.createTweet(
				src.split('status/')[1],
				embedEl, // parent element where tweet will go
				{
					conversation: 'none',
					theme: 'dark' // tweet theme
				}
			);
		}, 500);
	}
</script>

{#if src}
  <div class="playerWrapper" bind:this={playerWrapper}>
    {#if isMounted}
      {#if src?.includes('twitter.com') || src?.includes('x.com')}
        <div bind:this={embedEl} class="w-full flex justify-center" data-url={src}>
          <blockquote class="twitter-tweet" data-conversation="none" data-theme="dark">
            <a href={src} />
          </blockquote>
        </div>
      {:else}
        <iframe
        title="Embedded content"
        src={getEmbedUrl({ url: src })}
        {...iframeAttributes}
        style="aspect-ratio: 536 / 300; height: auto;"
      />
      {/if}
    {/if}
   
    <button class="destroyButton" on:click={remove}>
      <X />
    </button>
  </div>
{:else}
  <form bind:this={popup} on:submit={submit}>
    <input
      class="preview_input"
      bind:this={inputEl}
      autofocus
      type="text"
      placeholder="Enter link..."
    />
    <button type="submit">Add</button>
  </form>
{/if}

<style>
  form {
    width: "100%";
    background-color: rgb(242, 241, 238);
    transition: background-color 50ms ease-in;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: space-between;
    justify-items: center;
    gap: 2rem;
    border-radius: 0.5rem;
  }

  form:hover {
    background-color: rgb(228, 228, 228);
  }

  input {
    background-color: transparent;
    padding: 0.25rem 0.7rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    flex-grow: 1;
  }

  button[type="submit"] {
    background-color: rgb(43, 40, 40);
    color: white;
    padding: 0.25rem 0.7rem;
    font: bold 1.2rem;
    border-radius: 0.5rem;
  }

  button[type="submit"]:hover {
    background-color: black;
    transition: background-color 50ms ease-in;
  }

  .playerWrapper {
    position: relative;
  }

  .playerWrapper iframe {
    width: 100%;
  }

  .destroyButton {
    position: absolute;
    top: 6%;
    right: 6%;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    z-index: 10;
    background-color: #ccc;
    color: white;
  }

  .destroyButton:hover {
    background-color: white;
  }
</style>
