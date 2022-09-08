<script lang="ts">
  import { postApi, postLocal } from "$lib/api";

  let error = "";

  async function externalRequest() {
    try {
      const body = await postApi<{ token: string }>(
        fetch,
        "/auth/exchange-magic-token",
        { token: "abc" }
      );
      console.log("Success!");
    } catch (err) {
      error = err.body.message;
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
      error = err.body.message;
    }
  }
</script>

<button on:click={externalRequest}>Make external request</button>

<button on:click={internalRequest}>Make request via internal endpoint</button>

<p>{error}</p>
