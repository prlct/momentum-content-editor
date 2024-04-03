<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { YOUTUBE_REGEX, getEmbedUrlFromYoutubeUrl } from "./utils.js";
  import { X } from "lucide-svelte";

  export let iframeAttributes: HTMLAttributes<HTMLIFrameElement>;
  export let remove: () => void;
  export let updateSrc: (src: string) => void;

  let src = iframeAttributes.src;
  let popup: HTMLFormElement;
  let playerWrapper: HTMLDivElement;

  let inputEl: HTMLInputElement;

  function submit() {
    if (YOUTUBE_REGEX.test(inputEl.value)) {
      src = inputEl.value;
      updateSrc(src);
    } else {
      alert("Invalid url");
    }
  }
  onMount(() => {
    inputEl?.focus();
  });
</script>

{#if src}
  <div data-youtube-video class="playerWrapper" bind:this={playerWrapper}>
    <iframe
      title="Youtube Player"
      {...iframeAttributes}
      src={getEmbedUrlFromYoutubeUrl({ url: src })}
    />
    <button class="destroyButton" on:click={remove}>
      <X />
    </button>
  </div>
{:else}
  <form data-youtube-video bind:this={popup} on:submit={submit}>
    <input
      class="preview_input"
      bind:this={inputEl}
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
    /* background-color: rgba(0, 0, 0, 0.5); */
    /* color: white; */
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    z-index: 10;
    color: #ccc;
  }

  .destroyButton:hover {
    color: white;
  }
</style>
