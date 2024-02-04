<script>
  /**
   * @type {string[]}
   */
  export let errorMessages = [];
</script>

<ul class="error-messages">
  {#each errorMessages as errorMessage (errorMessage)}
    <li>{errorMessage}</li>
  {/each}
  <!-- <li>That email is already taken</li> -->
</ul>
