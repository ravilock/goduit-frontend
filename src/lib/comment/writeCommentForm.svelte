<script>
  import { writeComment } from "$lib/comment/comment";
  import { fallbackUserImage } from "$lib/constants";

  /**
   * @type {string}
   */
  export let articleSlug;

  /**
   * @type {boolean}
   */
  export let isLoggedIn;

  /**
   * @type {string}
   */
  export let userImage;

  /**
   * @type string
   */
  let comment = "";

  async function writeCommentHandler() {
    await writeComment(articleSlug, comment);
    comment = "";
  }
</script>

<form class="card comment-form">
  <div class="card-block">
    <textarea
      bind:value={comment}
      disabled={!isLoggedIn}
      class="form-control"
      placeholder="Write a comment..."
      rows="3"
    ></textarea>
  </div>
  <div class="card-footer">
    <img
      src={userImage || fallbackUserImage}
      class="comment-author-img"
      alt="User Profile"
    />
    {#if isLoggedIn}
      <button
        class="btn btn-sm btn-primary"
        on:click|preventDefault={writeCommentHandler}>Post Comment</button
      >
    {:else}
      <button class="btn btn-sm btn-primary disabled" disabled
        >Sign In To Comment</button
      >
    {/if}
  </div>
</form>
