<script>
  import {
    isAuthenticated,
    subscribeUsername,
    subscribeUserImage,
  } from "$lib/auth";
  import { page } from "$app/stores";
  import { fallbackUserImage } from "$lib/constants";
  import Comment from "$lib/comment/comment.svelte";
  import { onMount } from "svelte";
  import WriteCommentForm from "$lib/comment/writeCommentForm.svelte";
  import { subscribeComments } from "$lib/comment/comment";
  import MangeArticleSection from "$lib/article/mangeArticleSection.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

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
  });

  /**
   * @type {import("$lib/article/article").Article}
   */
  let article = data.article;

  /**
   * @type Date
   */
  let createAt = new Date();
  /**
   * @type Date | undefined
   */
  let updatedAt;

  /**
   * @type {import("$lib/comment/comment").Comment[]}
   */
  let comments = [];
  subscribeComments((newComments) => {
    comments = newComments || [];
  });
</script>

<div class="article-page">
  <div class="banner">
    <div class="container">
      <h1>{article.title}</h1>

      <div class="article-meta">
        <a href={`/profile/${article.author.username}`}
          ><img
            src={article.author.image || fallbackUserImage}
            alt="Author Profile"
          /></a
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
          <MangeArticleSection {article} />
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
          ><img
            src={article.author.image || fallbackUserImage}
            alt="Author Profile"
          /></a
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
          <MangeArticleSection {article} />
        {/if}
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <WriteCommentForm {isLoggedIn} articleSlug={slug} {userImage} />
        {#each comments as comment (comment)}
          <Comment {comment} articleSlug={slug} />
        {/each}
      </div>
    </div>
  </div>
</div>
