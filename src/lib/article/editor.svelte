<script>
  import * as yup from "yup";
  import ErrorMessages from "$lib/errorMessages.svelte";
  import { updateArticle, writeArticle } from "$lib/article/article";

  /**
   * @type {import("$lib/article/article").Article | undefined}
   */
  export let article;

  /**
   * @type {string[]}
   */
  let errorMessages = [];

  let buttonDisabled = false;

  const articleSchema = yup.object({
    title: yup.string().required().min(5).max(255),
    description: yup.string().required().min(5).max(255),
    body: yup.string().required(),
    tagList: yup.array().of(yup.string().min(1).max(10)).min(3).max(30),
  });

  /**
   * @type {{ title: string; description: string; body: string; tagList: string[]; tagListString: string; }}
   */
  const articleForm = {
    title: article?.title || "",
    description: article?.description || "",
    body: article?.body || "",
    tagList: article?.tagList || [],
    tagListString: article?.tagList.join(",") || "",
  };

  async function handleClick() {
    buttonDisabled = true;
    try {
      articleForm.tagList = articleForm.tagListString.split(",");
      await articleSchema.validate(articleForm);
      if (article) {
        errorMessages = await updateArticle(articleForm, article.slug);
      } else {
        errorMessages = await writeArticle(articleForm);
      }
    } catch (error) {
      console.error({ error });
      if (error.errors) errorMessages = error.errors;
      else errorMessages = ["Internal Error"];
    }
    buttonDisabled = false;
  }
</script>

<div class="editor-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-10 offset-md-1 col-xs-12">
        <ErrorMessages {errorMessages} />

        <form>
          <fieldset>
            <fieldset class="form-group">
              <input
                type="text"
                class="form-control form-control-lg"
                placeholder="Article Title"
                maxlength="255"
                bind:value={articleForm.title}
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="What's this article about?"
                maxlength="255"
                bind:value={articleForm.description}
              />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                class="form-control"
                rows="8"
                placeholder="Write your article (in markdown)"
                bind:value={articleForm.body}
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="Enter tags"
                maxlength="255"
                bind:value={articleForm.tagListString}
              />
              <div class="tag-list">
                <span class="tag-default tag-pill">
                  <i class="ion-close-round"></i> tag
                </span>
              </div>
            </fieldset>
            <button
              class="btn btn-lg pull-xs-right btn-primary"
              type="button"
              on:click|preventDefault={handleClick}
              disabled={buttonDisabled}
            >
              Publish Article
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
