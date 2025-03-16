<script>
  import { goto } from "$app/navigation";
  import { deleteArticle, setArticle } from "$lib/article/article";

  /**
   * @type {import("$lib/article/article").Article}
   */
  export let article;
</script>

<button
  class="btn btn-sm btn-outline-secondary"
  on:click|preventDefault={() => {
    setArticle(article);
    goto(`/article/${article.slug}/edit`);
  }}
>
  <i class="ion-edit"></i> Edit Article
</button>
<button
  class="btn btn-sm btn-outline-danger"
  on:click|preventDefault={async () => {
    await deleteArticle(article.slug);
    goto("/");
  }}
>
  <i class="ion-trash-a"></i> Delete Article
</button>
