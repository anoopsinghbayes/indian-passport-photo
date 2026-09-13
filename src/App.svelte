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
  const PRINT_PHOTO_SIZE_IN = 2;
  const sheetOptions = [
    { id: "4x6", label: "4 x 6 in", widthIn: 6, heightIn: 4, columns: 3, rows: 2 },
    { id: "5x7", label: "5 x 7 in", widthIn: 7, heightIn: 5, columns: 3, rows: 2 },
    { id: "8x10", label: "8 x 10 in", widthIn: 10, heightIn: 8, columns: 5, rows: 4 },
    { id: "letter", label: "Letter", widthIn: 8.5, heightIn: 11, columns: 4, rows: 5 },
    { id: "a4", label: "A4", widthIn: 8.27, heightIn: 11.69, columns: 4, rows: 5 },
  ];
  let selectedSheetId = $state("4x6");
  let printColumns = $state(3);
  let printRows = $state(2);
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
  let selectedSheet = $derived(
    sheetOptions.find((sheet) => sheet.id === selectedSheetId) ?? sheetOptions[0],
  );
  let maxPrintColumns = $derived(Math.floor(selectedSheet.widthIn / PRINT_PHOTO_SIZE_IN));
  let maxPrintRows = $derived(Math.floor(selectedSheet.heightIn / PRINT_PHOTO_SIZE_IN));
  let printPageCss = $derived(`
    @page {
      size: ${selectedSheet.widthIn}in ${selectedSheet.heightIn}in;
      margin: 0;
    }

    @media print {
      html,
      body,
      #app,
      .only-print {
        width: ${selectedSheet.widthIn}in;
        height: ${selectedSheet.heightIn}in;
      }
    }
  `);

  $effect(() => {
    const styleId = "dynamic-print-page-size";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = printPageCss;
  });

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
    await rebuildPrintableSheet(croppedImage);
    appState = "cropped";
  }

  async function rebuildPrintableSheet(imageSrc = croppedImage) {
    printableSheet = await createPrintableSheet(imageSrc, {
      rows: Math.min(printRows, maxPrintRows),
      columns: Math.min(printColumns, maxPrintColumns),
      photoWidthIn: PRINT_PHOTO_SIZE_IN,
      photoHeightIn: PRINT_PHOTO_SIZE_IN,
      sheetWidthIn: selectedSheet.widthIn,
      sheetHeightIn: selectedSheet.heightIn,
    });
  }

  function onSheetChange(event: Event) {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement)) return;

    const nextSheet = sheetOptions.find((sheet) => sheet.id === select.value);
    if (!nextSheet) return;

    selectedSheetId = nextSheet.id;
    printColumns = nextSheet.columns;
    printRows = nextSheet.rows;
    if (appState === "cropped") rebuildPrintableSheet();
  }

  function onGridChange(event: Event, direction: "columns" | "rows") {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;

    const max = direction === "columns" ? maxPrintColumns : maxPrintRows;
    const value = Math.min(max, Math.max(1, Number(input.value)));
    if (direction === "columns") {
      printColumns = value;
    } else {
      printRows = value;
    }

    if (appState === "cropped") rebuildPrintableSheet();
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
    <section class="print-settings" aria-label="Print settings">
      <label>
        Sheet
        <select value={selectedSheetId} onchange={onSheetChange}>
          {#each sheetOptions as sheet}
            <option value={sheet.id}>{sheet.label}</option>
          {/each}
        </select>
      </label>
      <label>
        Across
        <input
          type="number"
          min="1"
          max={maxPrintColumns}
          value={printColumns}
          oninput={(event) => onGridChange(event, "columns")}
        />
      </label>
      <label>
        Down
        <input
          type="number"
          min="1"
          max={maxPrintRows}
          value={printRows}
          oninput={(event) => onGridChange(event, "rows")}
        />
      </label>
      <p>
        Each printed photo stays 2 x 2 in. This sheet fits up to
        {maxPrintColumns} across and {maxPrintRows} down.
      </p>
    </section>

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
    <GridPhoto
      printableSheet={printableSheet}
      sheetWidthIn={selectedSheet.widthIn}
      sheetHeightIn={selectedSheet.heightIn}
    />
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
  .print-settings {
    width: min(100%, 740px);
    display: grid;
    grid-template-columns: minmax(180px, 1fr) repeat(2, minmax(92px, 120px));
    gap: 0.75rem;
    align-items: end;
  }
  .print-settings label {
    margin: 0;
  }
  .print-settings p {
    grid-column: 1 / -1;
    margin: 0;
    color: var(--pico-muted-color);
    font-size: 0.9rem;
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
  @media (max-width: 720px) {
    .print-settings {
      grid-template-columns: 1fr;
    }
    input[type="file"] {
      max-width: 100%;
    }
  }
</style>
