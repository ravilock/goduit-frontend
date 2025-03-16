<script>
  import { fallbackUserImage } from "$lib/constants";
  import { subscribeUsername } from "$lib/auth";
  import { deleteComment } from "$lib/comment/comment";

  /**
   * @type {string}
   */
  export let articleSlug;

  /**
   * @type {string}
   */
  let clientUsername;

  subscribeUsername((value) => {
    clientUsername = value;
  });

  /**
   * @type {import("$lib/comment/comment").Comment}
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
        alt="Comment Profile"
      />
    </a>
    &nbsp;
    <a href={`/profile/${comment.author.username}`} class="comment-author">
      {comment.author.username}
    </a>
    <span class="date-posted"><b>{createAt.toLocaleDateString()}</b></span>
    {#if comment.author.username === clientUsername}
      <button
        class="mod-options"
        on:click|preventDefault={() => deleteComment(articleSlug, comment.id)}
      >
        <i class="ion-trash-a"></i>
      </button>
    {/if}
  </div>
</div>
