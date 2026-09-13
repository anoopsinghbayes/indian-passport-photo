<script lang="ts">
  import Cropper from "svelte-easy-crop";
  import {
    createPrintableSheet,
    downloadBlobImage,
    getCroppedImg,
  } from "./crop";
  import GridPhoto from "./components/GridPhoto.svelte";
  import HowToUse from "./components/HowToUse.svelte";
  // Define the app state
  type AppState = "initial" | "cropping" | "cropped";
  let appState = $state<AppState>("initial");

  //ImageTitle is "Original" till initial to cropping
  let init_image = $state("./630x810.svg");
  // Define your desired final dimensions
  const DESIRED_WIDTH = 630;
  const DESIRED_HEIGHT = 810;
  const ASPECT_RATIO = 7 / 9;
  const image_ratio = 4 / 5;
  const PRINT_SHEET_ROWS = 2;
  const PRINT_SHEET_COLUMNS = 3;
  const PRINT_PHOTO_SIZE_MM = 50.8;
  let crop = $state({ x: 0, y: 0 });
  const imageWidth = DESIRED_WIDTH * image_ratio;
  const imageHeight = DESIRED_HEIGHT * image_ratio;
  let cropSize = { width: imageWidth / 3, height: imageHeight / 3 };
  let zoom = $state(1);
  let pixelCrop = { width: 0, height: 0, x: 0, y: 0 }; // This will store the pixel details from the on:cropcomplete event
  let croppedImage=$state<string>(
    "./630x810.svg"
  );
  let printableSheet = $state<string>("./630x810.svg");

  function onCropComplete(e: {
    percent: { width: number; height: number; x: number; y: number };
    pixels: { width: number; height: number; x: number; y: number };
  }) {
    pixelCrop = e.pixels;
  }

  async function downloadCroppedImage(
    imgName: string = "passport_photo",
    type: "jpg" | "png" = "jpg",
  ) {
    fetch(croppedImage)
      .then((res) => res.blob())
      .then((blob) => {
        downloadBlobImage(blob, `${imgName}.${type}`);
      });
  }

  async function cropImage() {
    croppedImage = await getCroppedImg(
      init_image,
      pixelCrop,
      DESIRED_WIDTH,
      DESIRED_HEIGHT,
    );
    printableSheet = await createPrintableSheet(croppedImage, {
      rows: PRINT_SHEET_ROWS,
      columns: PRINT_SHEET_COLUMNS,
      photoWidthMm: PRINT_PHOTO_SIZE_MM,
      photoHeightMm: PRINT_PHOTO_SIZE_MM,
    });
    appState = "cropped";
  }
  function onFileChange(event: Event) {
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
          init_image = result;
        }
      };
      reader.readAsDataURL(file);
    }
    appState = "cropping";
    croppedImage = "./630x810.svg";
    printableSheet = "./630x810.svg";
  }

  function back() {
    if (appState === "cropped") {
      appState = "cropping";
      croppedImage = "./630x810.svg";
      printableSheet = "./630x810.svg";
    } else if (appState === "cropping") {
      appState = "initial";
      init_image = "./630x810.svg";
    }
  }
</script>

<!-- <UploadPhoto /> -->
<section class="main-container">
  <div class="sub-container dont-print">
    <h2>Make Passport Size Photo </h2>
    <header role="group">
      <input placeholder="Choose File" type="file"  accept="image/*" onchange={onFileChange} />
<!-- <button disabled={appState === "initial"} onclick={back}>Back</button> -->
      <button disabled={appState !== "cropping" && appState !== "cropped"} onclick={cropImage}>Crop</button>
      <button
        disabled={appState !== "cropped"}
        onclick={() => downloadCroppedImage()}>Download</button
      >
      <button disabled={appState !== "cropped"} onclick={() => window.print()}
        >Printable</button
      >
    </header>

    <div class="img-holder">
      <div class="cropper-wrapper image-placeholder">
        <Cropper
          aspect={ASPECT_RATIO}
          {cropSize}
          image={init_image}
          bind:crop
          bind:zoom
          oncropcomplete={onCropComplete}
        ></Cropper>
        <span class="guide-box"></span>
      </div>
      <img
        class="cropped-image image-placeholder"
        src={croppedImage || "./630x810.svg"}
        alt="Cropped profile"
      />
    </div>
    <footer role="group">
      
    </footer>
  </div>
  <HowToUse />
  <section class="only-print">
    <GridPhoto printableSheet={printableSheet} />
  </section>
</section>

<style>
  header{
    font-size: 1.5rem;
    font-weight: bold;
  }
  .img-holder{
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  .sub-container {
    max-width: 740px;
    margin: 0 auto;
    display: grid;
    padding: 1rem;
    gap: 1rem;

    place-items: center;
    /* grid-template-columns: 1fr 1fr; */
  }
  /* Style for the Cropper wrapper */
  .cropper-wrapper {
    margin: 0 auto;
    /* transform: scale(.5); */
    position: relative;

    /* border: 1px solid red; */
  }
  .guide-box {
    --border:3px dashed var(--pico-primary-border);
    --ratio: 2/3;
    --padding: calc(1 / 3 * 0.5);
    position: absolute;
    border-top: var(--border);
     border-bottom: var(--border);
    width: calc(100% * var(--ratio));
    /* guide height 34.5mm from top for 45mm thus 10% of 270px */
    /* calc  */
    height: calc(76.6% * var(--ratio));
    /* guide top 4.5mm from top for 45mm thus 10% of 270px */
    top: calc((100% * var(--padding)) + calc(10% * var(--ratio)));
    left: calc(100% * var(--padding));
    pointer-events: none; /* Allow interactions to pass through */
  }
  .image-placeholder {
    width: 252px;
    aspect-ratio: 7/9;
  }
  input[type="file"] {

  max-width: 30% ;
  }
</style>
