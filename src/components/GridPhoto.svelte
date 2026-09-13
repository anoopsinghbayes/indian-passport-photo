<script lang="ts">
    let { printableSheet, sheetWidthIn, sheetHeightIn } = $props();
</script>
<div
    class="print-sheet"
    style={`width: ${sheetWidthIn}in; height: ${sheetHeightIn}in;`}
>
    <img src={printableSheet} class="print-sheet-image" alt="Printable layout" />
</div>
<style>
  .print-sheet {
    width: 6in;
    height: 4in;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .print-sheet-image {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
