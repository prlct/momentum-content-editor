<script lang="ts">
  export let placeholder: string;
  export let buttonText: string;
</script>

<form on:submit>
  <input type="url" {placeholder} />
  <button type="submit">
    {buttonText}
  </button>
</form>
