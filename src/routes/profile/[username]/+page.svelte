<script>
  import ArticlePreview from "$lib/articlePreview.svelte";
  import { isAuthenticated, subscribeUsername } from "$lib/auth";
  import { fallbackUserImage, listArticlesPageLimit } from "$lib/constants";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let isLoggedIn = false;

  /**
   * @type {string}
   */
  let clientUsername;

  subscribeUsername((value) => {
    clientUsername = value;
  });

  $: currentPage = Number($page.url.searchParams.get("page") || 1);

  export let data;
  onMount(() => {
    isLoggedIn = isAuthenticated();
  });
</script>

<div class="profile-page">
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img
            src={data.profile.image ?? fallbackUserImage}
            class="user-img"
            alt="This is me"
          />
          <h4>{data.profile.username}</h4>
          <p>{data.profile.bio ?? ""}</p>
          {#if isLoggedIn && data.profile.username !== clientUsername && !data.profile.following}
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp; Follow {data.profile.username}
            </button>
          {/if}
          <button class="btn btn-sm btn-outline-secondary action-btn">
            <a class="nav-link" href="/settings">
              <i class="ion-gear-a"></i>
              &nbsp; Edit Profile Settings
            </a>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <a class="nav-link active" href="">My Articles</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">Favorited Articles</a>
            </li>
          </ul>
        </div>

        {#each data.articles as article (article.slug)}
          <ArticlePreview {article} />
        {/each}

        <ul class="pagination">
          {#if currentPage > 1}
            <li class="page-item">
              <a class="page-link" href="?page={currentPage - 1}"
                >{currentPage - 1}</a
              >
            </li>
          {/if}
          <li class="page-item active">
            <a class="page-link" href="?page={currentPage}">{currentPage}</a>
          </li>
          {#if data.articles.length === listArticlesPageLimit}
            <li class="page-item">
              <a class="page-link" href="?page={currentPage + 1}"
                >{currentPage + 1}</a
              >
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </div>
</div>
