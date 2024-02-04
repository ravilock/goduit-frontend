<script>
  import {
    isAuthenticated,
    subscribeUsername,
    subscribeUserImage,
  } from "$lib/auth";
  import { fallbackUserImage } from "$lib/constants";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let isLoggedIn = false;

  /**
   * @type {string}
   */
  let username;

  subscribeUsername((value) => {
    username = value;
  });

  /**
   * @type {string}
   */
  let userImage;

  subscribeUserImage((value) => {
    if (value) userImage = value;
    else userImage = fallbackUserImage;
  });

  onMount(() => {
    isLoggedIn = isAuthenticated();
  });
</script>

<nav class="navbar navbar-light">
  <div class="container">
    <a class="navbar-brand" href="/">conduit</a>
    <ul class="nav navbar-nav pull-xs-right">
      <li class="nav-item">
        <!-- Add "active" class when you're on that page" -->
        <a
          class={`nav-link ${$page.url.pathname === "/" ? "active" : ""}`}
          href="/">Home</a
        >
      </li>
      {#if isLoggedIn}
        <!-- Feature nav links -->
        <li class="nav-item">
          <a class="nav-link" href="/editor">
            <i class="ion-compose"></i>&nbsp;New Article
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/settings">
            <i class="ion-gear-a"></i>&nbsp;Settings
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href={`/profile/${username}`}>
            <!-- TODO: add image rendering -->
            <img src={userImage} class="user-pic" alt="Profile Image" />
            {username}
          </a>
        </li>
        <!-- Feature nav links -->
      {:else}
        <!-- Auth nav links -->
        <li class="nav-item">
          <a
            class={`nav-link ${
              $page.url.pathname === "/login" ? "active" : ""
            }`}
            href="/login">Sign in</a
          >
        </li>
        <li class="nav-item">
          <a
            class={`nav-link ${
              $page.url.pathname === "/register" ? "active" : ""
            }`}
            href="/register">Sign up</a
          >
        </li>
        <!-- Auth nav links -->
      {/if}
    </ul>
  </div>
</nav>
