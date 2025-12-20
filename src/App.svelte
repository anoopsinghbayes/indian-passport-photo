<script lang="ts">
  import Cropper from "svelte-easy-crop";
  import { getCroppedImg } from "./crop";
  import GridPhoto from "./GridPhoto.svelte";
  // let isLoading=$state(false);
  let image = $state("src/assets/630x810.svg");
  let isLoading = $state(false);
  // Define your desired final dimensions
  const DESIRED_WIDTH = 630;
  const DESIRED_HEIGHT = 810;
  const ASPECT_RATIO = DESIRED_WIDTH / DESIRED_HEIGHT;
  const image_ratio=4/5;
  const items = Array(10).fill(0); // Array to render multiple images for printing
  console.log("Items for print:", items);
  let crop = $state({ x: 0, y: 0 });
  const imageWidth= DESIRED_WIDTH * image_ratio;
  const imageHeight= DESIRED_HEIGHT *image_ratio;
  let cropSize = { width:imageWidth / 3, height: imageHeight / 3 };
  let zoom = $state(1);
  let pixelCrop; // This will store the pixel details from the on:cropcomplete event
  let croppedImage = "src/assets/630x810.svg";

  /**
   * Updates the pixelCrop data whenever the user finishes a crop interaction
   * @param {CustomEvent} e - The cropcomplete event
   */
  function onCropComplete(e) {
    pixelCrop = e.pixels;
    console.log("Cropped area in pixels:", pixelCrop);
  }

  /**
   * Generates the final cropped image data URL
   */
  async function cropImage() {  
    isLoading=true;
    croppedImage = await getCroppedImg(
      image,
      pixelCrop,
      DESIRED_WIDTH,
      DESIRED_HEIGHT,
    );
    
    isLoading=false;
  }
  /**
   * Handles file input change and sets the image property
   * @param {Event} event
   */
  /**
   * Handles file input change and sets the image property
   * @param {Event} event
   */
  function onFileChange(event) {
    const input = event.target;
    if (
      input &&
      input instanceof HTMLInputElement &&
      input.files &&
      input.files[0]
    ) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target && e.target.result;
        if (typeof result === "string") {
          image = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
</script>


{#if isLoading}
  <div class="loading-overlay">
    <div class="spinner"></div>
  </div>

{:else}
  <main>
  <section class="main-container dont-print">
    <article>
      <header>Original</header>
      <div
        class="cropper-wrapper"
        style="width: {imageWidth / 2}px; height: {imageHeight / 2}px;"
      >
        <Cropper
          aspect={ASPECT_RATIO}
          {cropSize}
          {image}
          bind:crop
          bind:zoom
          oncropcomplete={onCropComplete}
        ></Cropper>
        <span class="guide-box"></span>
      </div>
      <footer>
        <input type="file" accept="image/*" on:change={onFileChange} />
      </footer>
    </article>
    <article>
      <header>Cropped</header>
      <img
        class="cropped-image"
        src={croppedImage}
        alt="Cropped profile"
        style="width: {imageWidth / 2}px; height: {imageHeight / 2}px;"
      />
      <footer><button on:click={cropImage}>Get Cropped Image</button></footer>
    </article>
  </section>
  <section class="only-print">
    <GridPhoto {croppedImage} {items} />
  </section>
</main>
{/if}


<style>
  .main-container {
    /* transform: scale(.65); */
    display: grid;
    gap: 5rem;
    grid-template-columns: 1fr 1fr;
  }
  /* Style for the Cropper wrapper */
  .cropper-wrapper {
    margin: 0 auto;
    /* transform: scale(.5); */
    position: relative;

    /* border: 1px solid red; */
  }
  .guide-box {
    --ratio: 2/3;
    --padding: calc(1 / 3 * 0.5);
    position: absolute;
    border: 1px dashed blue;
    width: calc(100% * var(--ratio));
    /* guide height 34.5mm from top for 45mm thus 10% of 270px */
    /* calc  */
    height: calc(76.6% * var(--ratio));
    /* guide top 4.5mm from top for 45mm thus 10% of 270px */
    top: calc((100% * var(--padding)) + calc(10% * var(--ratio)));
    left: calc(100% * var(--padding));
    pointer-events: none; /* Allow interactions to pass through */
  }
  .print-grid {
    display: grid;
    grid-template-columns: repeat(5, 35mm);
    gap: 2mm;
    margin-top: 2rem;
  }
  .print-grid-item {
    position: relative;
  }
</style>
