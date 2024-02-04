<script>
  import { isAuthenticated, usernameStore, userEmailStore } from "$lib/auth";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let isLoggedIn = false;

  /**
   * @type {string}
   */
  let username;

  /**
   * @type {string}
   */
  let userEmail;

  usernameStore.subscribe((value) => {
    username = value;
  });

  userEmailStore.subscribe((value) => {
    userEmail = value;
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
      <!-- Auth nav links -->
      <li class="nav-item">
        <a
          class={`nav-link ${$page.url.pathname === "/login" ? "active" : ""}`}
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
      <!-- Feature nav links -->
      {#if isLoggedIn}
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
          <a class="nav-link" href="/profile/eric-simons">
            <!-- TODO: add image rendering -->
            <!-- <img src="" class="user-pic" /> -->
            Eric Simons
          </a>
        </li>
      {/if}
      <!-- Feature nav links -->
    </ul>
  </div>
</nav>
