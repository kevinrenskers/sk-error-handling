<script lang="ts">
  import { postApi, postLocal } from "$lib/api";

  let error = "";
  let errorObj = {};

  async function externalRequest() {
    try {
      const body = await postApi<{ token: string }>(
        fetch,
        "/auth/exchange-magic-token",
        { token: "abc" }
      );
      console.log("Success!");
    } catch (err) {
      console.log(err);
      error = err.body.message;
      errorObj = err.body.errors;
    }
  }

  async function internalRequest() {
    try {
      const body = await postLocal<{ token: string }>(
        fetch,
        "/auth/exchange-magic-token",
        { token: "abc" }
      );
      console.log("Success!");
    } catch (err) {
      console.log(err);
      error = err.body.message;
      errorObj = err.body.errors;
    }
  }
</script>

<button on:click={externalRequest}>Make external request</button>

<button on:click={internalRequest}>Make request via internal endpoint</button>

<p>{error}</p>

<pre>{JSON.stringify(errorObj)}</pre>
