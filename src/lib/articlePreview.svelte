<script>
  import { fallbackUserImage } from "./constants";

  /**
   * @type {{ author: { username: string; image: string; }; favoritesCount: number; slug: string; title: string; description: string; tagList: string[]; createdAt: string, updatedAt?: string }}
   */
  export let article;
  const createAt = new Date(Date.parse(article.createdAt));
  /**
   * @type Date | undefined
   */
  let updatedAt = article.updatedAt
    ? new Date(Date.parse(article.updatedAt))
    : undefined;
</script>

<div class="article-preview">
  <div class="article-meta">
    <a href={`/profile/${article.author.username}`}>
      <img
        src={article.author.image ?? fallbackUserImage}
        alt="author profile pic"
      />
    </a>
    <div class="info">
      <a href={`/profile/${article.author.username}`} class="author">
        {article.author.username}
      </a>
      <span class="date"
        ><b>Written At: {createAt.toLocaleDateString()}</b></span
      >
      {#if updatedAt}
        <span class="date"
          ><b>Updated At: {updatedAt.toLocaleDateString()}</b></span
        >
      {/if}
    </div>
    <!-- TODO: Add favorite article -->
    <button class="btn btn-outline-primary btn-sm pull-xs-right">
      <i class="ion-heart"></i>&nbsp;{article.favoritesCount}
    </button>
  </div>
  <a href={`/article/${article.slug}`} class="preview-link">
    <h1>{article.title}</h1>
    <p><b>{article.description}</b></p>
    <span>Read more...</span>
    <ul class="tag-list">
      {#each article.tagList as tag (tag)}
        <li class="tag-default tag-pill tag-outline">{tag}</li>
      {/each}
    </ul>
  </a>
</div>
