<script>
  import { page } from "$app/stores";
</script>

<h1>{$page.status}: {$page?.error?.message ?? "Unexpected Error"}</h1>
