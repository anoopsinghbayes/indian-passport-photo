<script lang="ts">
    let {croppedImage,items}=$props();
</script>
<div class="print-grid">
    {#each items as _, index}
        <div class="print-grid-item">
        <img src="{croppedImage}" alt="Cropped Image {index + 1}" style="width:35mm; height:45mm;" />
        </div>
    {/each}
</div>
<style>
    .print-grid {
    display: grid;
    place-content: center;
    grid-template-columns: repeat(5, max-content);
    /* gap: 2mm; */
    margin-top: 2rem;
    /* border-left: 1px dashed #000; */
    /* border-top: 1px dashed #000; */
  }
  .print-grid-item{
    position: relative;
    padding: .5rem;
    border: 1px dashed #000;
    /* make the border like border-collapse */
    margin-top: -1px;
    margin-left: -1px;
  }
</style>