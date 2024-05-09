<script>
  import ArticlePreview from "$lib/articlePreview.svelte";
  import { subscribeUsername } from "$lib/auth";

  /** @type {import('./$types').PageData} */
  export let data;

  let isLoggedIn = false;

  /**
   * @type {string}
   */
  let clientUsername;

  subscribeUsername((value) => {
    clientUsername = value;
  });

  $: currentPage = Number($page.url.searchParams.get("page") || 1);

  /**
   * @type {{ author: { username: string; image: string; following: boolean; }; favoritesCount: number; slug: string; title: string; description: string; body: string; tagList: string[]; createdAt: string, updatedAt?: string }[]}
   */
  let articles = data.articles;
</script>

<div class="home-page">
  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">
      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <a class="nav-link" href="">Your Feed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="">Global Feed</a>
            </li>
          </ul>
        </div>

        {#each articles as article (article.slug)}
          <ArticlePreview {article} />
        {/each}

        <ul class="pagination">
          {#if currentPage > 1}
            <li class="page-item">
              <a class="page-link" href="?page={currentPage - 1}">
                {currentPage - 1}
              </a>
            </li>
          {/if}
          <li class="page-item active">
            <a class="page-link" href="?page={currentPage}">
              {currentPage}
            </a>
          </li>
          {#if articles.length === listArticlesPageLimit}
            <li class="page-item">
              <a class="page-link" href="?page={currentPage + 1}">
                {currentPage + 1}
              </a>
            </li>
          {/if}
        </ul>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <a href="" class="tag-pill tag-default">programming</a>
              <a href="" class="tag-pill tag-default">javascript</a>
              <a href="" class="tag-pill tag-default">emberjs</a>
              <a href="" class="tag-pill tag-default">angularjs</a>
              <a href="" class="tag-pill tag-default">react</a>
              <a href="" class="tag-pill tag-default">mean</a>
              <a href="" class="tag-pill tag-default">node</a>
              <a href="" class="tag-pill tag-default">rails</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
