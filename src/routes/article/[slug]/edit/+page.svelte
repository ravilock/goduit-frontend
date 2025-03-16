<script>
  import { subscribeArticle } from "$lib/article/article";
  import Editor from "$lib/article/editor.svelte";

  /**
   * @type {import("$lib/article/article").Article}
   */
  let article;
  subscribeArticle((value) => {
    article = value;
  });
</script>

<Editor {article}></Editor>
