<script lang="ts">
    let { printableSheet } = $props();
</script>
<div class="print-sheet">
    <img src={printableSheet} class="print-sheet-image" alt="6x4 photo sheet" />
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
    width: 6in;
    height: 4in;
    display: block;
  }
</style>
