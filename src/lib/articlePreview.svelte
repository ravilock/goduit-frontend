<script>
  import { fallbackUserImage } from "./constants";

  /**
   * @type {{ author: { username: any; image: any; }; favoritesCount: any; slug: any; title: any; description: any; tagList: any; }}
   */
  export let article;
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
      <span class="date">January 20th</span>
    </div>
    <button class="btn btn-outline-primary btn-sm pull-xs-right">
      <i class="ion-heart"></i>&nbsp;{article.favoritesCount}
    </button>
  </div>
  <a href={`/article/${article.slug}`} class="preview-link">
    <h1>{article.title}</h1>
    <p>{article.description}</p>
    <span>Read more...</span>
    <ul class="tag-list">
      {#each article.tagList as tag (tag)}
        <li class="tag-default tag-pill tag-outline">{tag}</li>
      {/each}
    </ul>
  </a>
</div>
