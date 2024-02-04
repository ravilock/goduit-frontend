<script>
  import * as yup from "yup";
  import { logIn } from "$lib/auth";
  import Header from "$lib/header.svelte";
  import Footer from "$lib/footer.svelte";
  import ErrorMessages from "$lib/errorMessages.svelte";

  /**
   * @type {string[]}
   */
  let errorMessages = [];

  let buttonDisabled = false;

  const loginSchema = yup
    .object({
      email: yup.string().email().required(),
      password: yup.string().min(8).max(72).required(),
    })
    .required();

  const loginForm = {
    email: "",
    password: "",
  };

  async function handleClick() {
    buttonDisabled = true;
    try {
      await loginSchema.validate(loginForm);
      errorMessages = await logIn(loginForm);
    } catch (error) {
      console.error({ error });
      if (error.errors) errorMessages = error.errors;
      else errorMessages = ["Internal Error"];
    }
    buttonDisabled = false;
  }
</script>

<Header />
<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign in</h1>
        <p class="text-xs-center">
          <a href="/register">Need an account?</a>
        </p>

        <ErrorMessages {errorMessages} />

        <form>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="email"
              placeholder="Email"
              maxlength="255"
              bind:value={loginForm.email}
            />
          </fieldset>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="password"
              placeholder="Password"
              maxlength="72"
              bind:value={loginForm.password}
            />
          </fieldset>
          <button
            class="btn btn-lg btn-primary pull-xs-right"
            on:click|preventDefault={handleClick}
            disabled={buttonDisabled}>Sign in</button
          >
        </form>
      </div>
    </div>
  </div>
</div>
<Footer />
