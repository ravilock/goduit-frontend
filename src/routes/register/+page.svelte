<script>
  import * as yup from "yup";
  import { signIn } from "$lib/auth";
  import ErrorMessages from "$lib/errorMessages.svelte";

  /**
   * @type {string[]}
   */
  let errorMessages = [];

  let buttonDisabled = false;

  const registerSchema = yup
    .object({
      username: yup.string().min(5).max(255).required(),
      email: yup.string().email().required(),
      password: yup.string().min(8).max(72).required(),
    })
    .required();

  const registerForm = {
    username: "",
    email: "",
    password: "",
  };

  async function handleClick() {
    buttonDisabled = true;
    try {
      await registerSchema.validate(registerForm);
      errorMessages = await signIn(registerForm);
    } catch (error) {
      console.error({ error });
      if (error.errors) errorMessages = error.errors;
      else errorMessages = ["Internal Error"];
    }
    buttonDisabled = false;
  }
</script>

<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center">
          <a href="/login">Already have an account?</a>
        </p>

        <ErrorMessages {errorMessages} />

        <form>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="text"
              placeholder="Username"
              maxlength="255"
              bind:value={registerForm.username}
            />
          </fieldset>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="email"
              placeholder="Email"
              maxlength="255"
              bind:value={registerForm.email}
            />
          </fieldset>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="password"
              placeholder="Password"
              maxlength="72"
              bind:value={registerForm.password}
            />
          </fieldset>
          <button
            class="btn btn-lg btn-primary pull-xs-right"
            on:click|preventDefault={handleClick}
            disabled={buttonDisabled}>Sign up</button
          >
        </form>
      </div>
    </div>
  </div>
</div>
