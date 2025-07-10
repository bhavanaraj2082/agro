<script>
  import { createEventDispatcher } from 'svelte';

  export let size // adding width classes ex:size="w-full sm:w-2/4 md:w-1/4"
  export let variant;
  export let buttonType
  export let eventFunction
  export let rounded = false;
  export let icon = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function handleClick(e) {
     if(eventFunction !== undefined) eventFunction()
    if (!disabled) {
      dispatch('onButton', e.detail);
    }
  }
</script>

<button type={buttonType}
  class={`font-roboto font-medium ${size} py-2 px-2 text-xs sm:text-sm
          ${rounded ? 'rounded-full' : 'rounded'}
          ${variant === 'hover' ? 'hover:bg-primary-700 bg-primary-600 border border-primary-600 text-white' : 'border-1 border-primary-600 text-primary-600'}
          ${!disabled ? 'hover:bg-primary-600 hover:text-white' : 'opacity-50 -z-10 cursor-not-allowed'}`}
  on:click={handleClick}
  disabled={disabled}
>
  <slot>Upload Now</slot>
  {#if icon}
  <span class="ml-1">
    <i class={`fa-solid fa-arrow-up-from-bracket transition-colors 
      ${variant === 'hover' ? 'text-white' : 'text-primary-600'}
      ${!disabled ? 'hover:text-white' : ''}`}></i>
  </span>
{/if}
</button>