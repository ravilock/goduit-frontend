<script>
  import ArticlePreview from "$lib/articlePreview.svelte";
  import { isAuthenticated, subscribeUsername } from "$lib/auth";
  import { fallbackUserImage } from "$lib/constants";
  import { onMount } from "svelte";

  let isLoggedIn = false;

  /**
   * @type {string}
   */
  let clientUsername;

  subscribeUsername((value) => {
    clientUsername = value;
  });

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
          <li class="page-item active">
            <a class="page-link" href="">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="">2</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
