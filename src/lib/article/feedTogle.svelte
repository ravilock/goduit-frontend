<script>
  /** @type {import('$lib/article/feed').FeedOption} */
  export let activeFeed;
</script>

<div class="feed-toggle">
  <ul class="nav nav-pills outline-active">
    <li class="nav-item">
      <a
        class="nav-link {activeFeed == 'personal' ? 'active' : ''}"
        href="?currentFeed=personal">Your Feed</a
      >
    </li>
    <li class="nav-item">
      <a
        class="nav-link {activeFeed == 'global' ? 'active' : ''}"
        href="?currentFeed=global">Global Feed</a
      >
    </li>
  </ul>
</div>
