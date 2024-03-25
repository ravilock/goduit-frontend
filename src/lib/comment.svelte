<script>
  import { fallbackUserImage } from "./constants";
  import { subscribeUsername } from "$lib/auth";
  import { page } from "$app/stores";

  /**
   * @type {string}
   */
  let clientUsername;

  /**
   * @type {() => Promise<void>}
   */
  export let deleteComment;

  subscribeUsername((value) => {
    clientUsername = value;
  });

  /**
   * @type {{ author: { username: string; image: string; }; id: string; createdAt: string, updatedAt?: string, body: string }}
   */
  export let comment;
  const createAt = new Date(Date.parse(comment.createdAt));
</script>

<div class="card">
  <div class="card-block">
    <p class="card-text">{comment.body}</p>
  </div>
  <div class="card-footer">
    <a href={`/profile/${comment.author.username}`} class="comment-author">
      <img
        src={comment.author.image || fallbackUserImage}
        class="comment-author-img"
      />
    </a>
    &nbsp;
    <a href={`/profile/${comment.author.username}`} class="comment-author">
      {comment.author.username}
    </a>
    <span class="date-posted"><b>{createAt.toLocaleDateString()}</b></span>
    {#if comment.author.username === clientUsername}
      <span class="mod-options" on:click|preventDefault={deleteComment}>
        <i class="ion-trash-a"></i>
      </span>
    {/if}
  </div>
</div>
