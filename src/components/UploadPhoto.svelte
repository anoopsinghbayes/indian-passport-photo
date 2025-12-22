<script lang="ts">
</script>

<section class="main">
    <h1>Make Passport Size Photo</h1>
    <div class="explain">
        <ul>
            <li>Click on the "Choose File" button to upload your photo.</li>
            <li>Adjust the cropping area as needed.</li>
            <li>
                Click on the "Crop Image" button to generate the passport size
                photo.
            </li>
            <li>
                Download the cropped image by clicking the "Download Cropped Image"
                button.
            </li>
        </ul>
    </div>

    <div class="drop-zone">Drag and drop them here to upload.</div>
</section>

<style>
    section {
        display: grid;
        row-gap: 2rem;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }
    .main{
        padding:1rem
    }
    .explain{
        padding:.5rem;
        display: flex;
        gap:.5rem;
        flex-direction: column;
    }
    h1{
        text-align: center;
         margin: 0;
    }
    .drop-zone {
        border: 2px dashed #ccc;
        border-radius: 4px;
        padding: 20px;
        text-align: center;
    }
</style>
