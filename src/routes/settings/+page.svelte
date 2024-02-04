<script>
  import * as yup from "yup";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {
    isAuthenticated,
    subscribeUsername,
    setUsername,
    subscribeUserEmail,
    setUserEmail,
    subscribeUserImage,
    setUserImage,
    subscribeUserBio,
    setUserBio,
    getToken,
    logOut,
  } from "$lib/auth";
  import Footer from "$lib/footer.svelte";
  import Header from "$lib/header.svelte";
  import ErrorMessages from "$lib/errorMessages.svelte";

  /**
   * @type {string[]}
   */
  let errorMessages = [];

  /**
   * @type {string}
   */
  let userImage;

  subscribeUserImage((value) => {
    if (value) userImage = value;
    else userImage = "";
  });

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
  let userBio;

  subscribeUserBio((value) => {
    if (value) userBio = value;
    else userBio = "";
  });

  /**
   * @type {string}
   */
  let userEmail;

  subscribeUserEmail((value) => {
    userEmail = value;
  });

  /**
   * @type {string}
   */
  let password;

  let buttonDisabled = false;

  onMount(() => {
    if (!isAuthenticated()) goto("/");
  });

  const updateProfileSchema = yup
    .object({
      username: yup.string().min(5).max(255).required(),
      email: yup.string().email().required(),
      bio: yup.string().max(255),
      image: yup.string().url().max(65000),
      password: yup.string().optional().min(8).max(72),
    })
    .required();

  async function handleClick() {
    buttonDisabled = true;
    try {
      const updateProfilePayload = assembleUpdateProfilePayload();
      await updateProfileSchema.validate(updateProfilePayload);
      errorMessages = (await updateProfile(updateProfilePayload)) ?? [];
    } catch (error) {
      console.error({ error });
      if (error.errors) errorMessages = error.errors;
      else errorMessages = ["Internal Error"];
    }
    buttonDisabled = false;
  }

  function assembleUpdateProfilePayload() {
    return {
      username,
      email: userEmail,
      bio: userBio === "" ? undefined : userBio,
      image: userImage === "" ? undefined : userImage,
      password: password === "" ? undefined : password,
    };
  }

  /**
   * @param {{ username: string; email: string; bio?: string; image?: string; password?: string; }} updateProfilePayload
   * @returns Promise<string[] | void>
   */
  async function updateProfile(updateProfilePayload) {
    const token = getToken();
    if (!token) return logOut();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
      method: "PUT",
      body: JSON.stringify({
        user: updateProfilePayload,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.message) return [data.message];
      else return ["Internal Error"];
    }
    if (!data.user) return;
    const { username, email, bio, image } = data.user;
    sessionStorage.setItem("username", username);
    setUsername(username);
    sessionStorage.setItem("userEmail", email);
    setUserEmail(email);
    if (bio) {
      sessionStorage.setItem("userBio", bio);
      setUserBio(bio);
    }
    if (image) {
      sessionStorage.setItem("userImage", image);
      setUserImage(image);
    }
    password = "";
    return [];
  }
</script>

<Header />
<div class="settings-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>

        <ErrorMessages {errorMessages} />

        <form>
          <fieldset>
            <fieldset class="form-group">
              <input
                class="form-control"
                type="text"
                placeholder="URL of profile picture"
                bind:value={userImage}
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Username"
                bind:value={username}
              />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                class="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
                bind:value={userBio}
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
                bind:value={userEmail}
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="New Password"
                bind:value={password}
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
              on:click|preventDefault={handleClick}
              disabled={buttonDisabled}>Update Settings</button
            >
          </fieldset>
        </form>
        <hr />
        <button class="btn btn-outline-danger" on:click|preventDefault={logOut}>
          Or click here to logout.
        </button>
      </div>
    </div>
  </div>
</div>
<Footer />
