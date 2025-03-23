<script>
  import ArticlePreview from "$lib/article/articlePreview.svelte";
  import { isAuthenticated, logOut, subscribeUsername } from "$lib/auth";
  import {
    fallbackUserImage,
    httpStatus,
    listArticlesPageLimit,
  } from "$lib/constants";
  import { page } from "$app/stores";
  import { afterNavigate } from "$app/navigation";
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";

  const username = $page.params.username;

  $: currentPage = Number($page.url.searchParams.get("page") || 1);

  let isLoggedIn = false;

  /**
   * @type {string}
   */
  let clientUsername;

  subscribeUsername((value) => {
    clientUsername = value;
  });

  /**
   * @type {{ image?: string; username?: string; bio?: string; following?: string; }}
   */
  let profile = {};

  /**
   * @type {any[]}
   */
  let articles = [];

  onMount(async () => {
    isLoggedIn = isAuthenticated();
    await Promise.all([
      loadProfileData(username),
      loadUserArticles(username, currentPage),
    ]);
  });

  afterNavigate(async () => {
    await loadUserArticles(username, currentPage);
  });

  /**
   * @param {string} username
   */
  async function loadProfileData(username) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profiles/${username}`,
      {
        credentials: "include",
        headers,
      },
    );
    const data = await response.json();
    if (!response.ok) {
      if (response.status === httpStatus.notFound)
        return error(404, `Profile ${username} Not Found`);
      if (response.status === httpStatus.unauthorized) await logOut();
      // @ts-expect-error Dont know the type yet
      return error(response.status, data.message);
    }
    profile = data.profile;
  }

  /**
   * @param {string} author
   */
  async function loadUserArticles(author, page = 1) {
    const offset = listArticlesPageLimit * (page - 1);
    const query = new URLSearchParams({
      author,
      limit: listArticlesPageLimit.toString(),
      offset: offset.toString(),
    });
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/articles?${query.toString()}`,
      {
        credentials: "include",
      },
    );
    const data = await response.json();
    if (!response.ok) {
      if (response.status === httpStatus.notFound)
        return error(404, `Profile ${username} Not Found`);
      if (response.status === httpStatus.unauthorized) await logOut();
      // @ts-expect-error Dont know the type yet
      return error(response.status, data.message);
    }
    articles = data.articles;
  }

  async function followUser() {
    if (!isAuthenticated()) return await logOut();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profiles/${username}/follow`,
      {
        credentials: "include",
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      if (response.status === httpStatus.notFound)
        return error(404, `Profile ${username} Not Found`);
      if (response.status === httpStatus.unauthorized) await logOut();
      // @ts-expect-error Dont know the type yet
      return error(response.status, data.message);
    }
    if (data.profile) profile = data.profile;
  }

  async function unfollowUser() {
    if (!isAuthenticated()) return await logOut();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profiles/${username}/follow`,
      {
        credentials: "include",
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      if (response.status === httpStatus.notFound)
        return error(404, `Profile ${username} Not Found`);
      if (response.status === httpStatus.unauthorized) await logOut();
      // @ts-expect-error Dont know the type yet
      return error(response.status, data.message);
    }
    if (data.profile) profile = data.profile;
  }
</script>

<!-- TODO: Implementar tela com a função load do +page.js -->

<div class="profile-page">
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img
            src={profile?.image ?? fallbackUserImage}
            class="user-img"
            alt="This is me"
          />
          <h4>{profile?.username ?? ""}</h4>
          <p>{profile?.bio ?? ""}</p>
          {#if isLoggedIn && profile?.username !== clientUsername}
            {#if !profile?.following}
              <button
                class="btn btn-sm btn-outline-secondary action-btn"
                on:click|preventDefault={followUser}
              >
                <i class="ion-plus-round"></i>
                &nbsp; Follow {profile?.username}
              </button>
            {:else}
              <button
                class="btn btn-sm btn-outline-secondary action-btn"
                on:click|preventDefault={unfollowUser}
              >
                <i class="ion-minus-round"></i>
                &nbsp; Unfollow {profile?.username}
              </button>
            {/if}
          {/if}

          {#if isLoggedIn && profile?.username === clientUsername}
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <a class="nav-link" href="/settings">
                <i class="ion-gear-a"></i>
                &nbsp; Edit Profile Settings
              </a>
            </button>
          {/if}
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
              <a class="nav-link active" href="/">My Articles</a>
            </li>
            <!-- TODO: Implement favorited articles before -->
            <!--   <li class="nav-item"> -->
            <!--     <a class="nav-link" href="">Favorited Articles</a> -->
            <!--   </li> -->
            <!-- </ul> -->
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
      </div>
    </div>
  </div>
</div>
