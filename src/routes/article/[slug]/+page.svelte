<script>
  import {
    getToken,
    isAuthenticated,
    subscribeUsername,
    subscribeUserImage,
  } from "$lib/auth";
  import { page } from "$app/stores";
  import { fallbackUserImage } from "$lib/constants";
  import Comment from "$lib/comment.svelte";
  import { error } from "@sveltejs/kit";
  import { onMount } from "svelte";

  const statusNotFound = 404;

  const slug = $page.params.slug;

  let isLoggedIn = false;

  /**
   * @type {string}
   */
  let clientUsername;

  subscribeUsername((value) => {
    clientUsername = value;
  });

  /**
   * @type {string}
   */
  let userImage;

  subscribeUserImage((value) => {
    if (value) userImage = value;
    else userImage = "";
  });

  onMount(async () => {
    isLoggedIn = isAuthenticated();
    await Promise.all([loadArticle(slug), loadComments(slug)]);
  });

  /**
   * @type {{ author: { username: string; image: string; following: boolean; }; favoritesCount: number; slug: string; title: string; description: string; body: string; tagList: string[]; createdAt: string, updatedAt?: string }}
   */
  let article;

  /**
   * @type Date
   */
  let createAt;
  /**
   * @type Date | undefined
   */
  let updatedAt;

  /**
   * @param {string} slug
   */
  async function loadArticle(slug) {
    const token = getToken();
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/article/${slug}`,
      {
        headers,
      },
    );
    const data = await response.json();
    if (!response.ok) {
      if (response.status === statusNotFound)
        return error(statusNotFound, `Article ${slug} Not Found`);
      // @ts-ignore
      return error(response.status, data.message);
    }
    article = data.article;
    createAt = new Date(Date.parse(article.createdAt));
    updatedAt = article.updatedAt
      ? new Date(Date.parse(article.updatedAt))
      : undefined;
  }

  /**
   * @type {any[]}
   */
  let comments = [];

  /**
   * @param {string} slug
   */
  async function loadComments(slug) {
    const token = getToken();
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/article/${slug}/comments`,
      {
        headers,
      },
    );
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      if (response.status === statusNotFound)
        return error(statusNotFound, `Article ${slug} Not Found`);
      // @ts-ignore
      return error(response.status, data.message);
    }
    comments = data.comments;
  }
</script>

{#if article}
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{article.title}</h1>

        <div class="article-meta">
          <a href={`/profile/${article.author.username}`}
            ><img src={article.author.image || fallbackUserImage} /></a
          >
          <div class="info">
            <a href={`/profile/${article.author.username}`} class="author"
              >{article.author.username}</a
            >
            <span class="date"
              ><b>Written At: {createAt.toLocaleDateString()}</b></span
            >
            {#if updatedAt}
              <span class="date"
                ><b>Updated At: {updatedAt.toLocaleDateString()}</b></span
              >
            {/if}
          </div>

          {#if isLoggedIn && article.author.username !== clientUsername}
            {#if !article.author.following}
              <button class="btn btn-sm btn-outline-secondary">
                <i class="ion-plus-round"></i>
                &nbsp; Follow {article.author.username}
                <!-- TODO: Implement follower counter -->
                <!-- <span class="counter">(10)</span> -->
              </button>
            {:else}
              <button class="btn btn-sm btn-outline-secondary">
                <i class="ion-minus-round"></i>
                &nbsp; Unfollow {article.author.username}
                <!-- TODO: Implement follower counter -->
                <!-- <span class="counter">(10)</span> -->
              </button>
            {/if}
          {/if}
          &nbsp;&nbsp;
          <!-- TODO: Implement favorite article -->
          <!-- <button class="btn btn-sm btn-outline-primary"> -->
          <!--   <i class="ion-heart"></i> -->
          <!--   &nbsp; Favorite Post -->
          <!--   <span class="counter">({article.favoritesCount})</span> -->
          <!-- </button> -->
          {#if article.author.username === clientUsername}
            <button class="btn btn-sm btn-outline-secondary">
              <i class="ion-edit"></i> Edit Article
            </button>
            <button class="btn btn-sm btn-outline-danger">
              <i class="ion-trash-a"></i> Delete Article
            </button>
          {/if}
        </div>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <p>
            {article.description}
          </p>
          <p>
            {article.body}
          </p>
          <ul class="tag-list">
            {#each article.tagList as tag (tag)}
              <li class="tag-default tag-pill tag-outline">{tag}</li>
            {/each}
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <div class="article-meta">
          <a href={`/profile/${article.author.username}`}
            ><img src={article.author.image || fallbackUserImage} /></a
          >
          <div class="info">
            <a href={`/profile/${article.author.username}`} class="author"
              >{article.author.username}</a
            >
            <span class="date"
              ><b>Written At: {createAt.toLocaleDateString()}</b></span
            >
            {#if updatedAt}
              <span class="date"
                ><b>Updated At: {updatedAt.toLocaleDateString()}</b></span
              >
            {/if}
          </div>

          {#if isLoggedIn && article.author.username !== clientUsername}
            {#if !article.author.following}
              <button class="btn btn-sm btn-outline-secondary">
                <i class="ion-plus-round"></i>
                &nbsp; Follow {article.author.username}
                <!-- TODO: Implement follower counter -->
                <!-- <span class="counter">(10)</span> -->
              </button>
            {:else}
              <button class="btn btn-sm btn-outline-secondary">
                <i class="ion-minus-round"></i>
                &nbsp; Unfollow {article.author.username}
                <!-- TODO: Implement follower counter -->
                <!-- <span class="counter">(10)</span> -->
              </button>
            {/if}
          {/if}
          &nbsp;&nbsp;
          <!-- TODO: Implement favorite article -->
          <!-- <button class="btn btn-sm btn-outline-primary"> -->
          <!--   <i class="ion-heart"></i> -->
          <!--   &nbsp; Favorite Post -->
          <!--   <span class="counter">({article.favoritesCount})</span> -->
          <!-- </button> -->
          {#if article.author.username === clientUsername}
            <button class="btn btn-sm btn-outline-secondary">
              <i class="ion-edit"></i> Edit Article
            </button>
            <button class="btn btn-sm btn-outline-danger">
              <i class="ion-trash-a"></i> Delete Article
            </button>
          {/if}
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form class="card comment-form">
            <div class="card-block">
              <textarea
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
              />
              <!-- TODO: Add comment article -->
              {#if isLoggedIn}
                <button class="btn btn-sm btn-primary">Post Comment</button>
              {:else}
                <button class="btn btn-sm btn-primary disabled" disabled
                  >Sign In To Comment</button
                >
              {/if}
            </div>
          </form>
          {#each comments as comment (comment)}
            <Comment {comment} />
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}
