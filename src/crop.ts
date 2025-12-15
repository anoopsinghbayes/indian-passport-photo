/**
 * This function is widely available online in examples for both react-easy-crop and svelte-easy-crop.
 */
export const getCroppedImg = (imageSrc, pixelCrop, targetWidth, targetHeight) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set canvas size to the exact desired output dimensions
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Draw the cropped area of the source image onto the canvas
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                targetWidth,
                targetHeight
            );

            // Get the resulting image as a data URL (or blob)
            canvas.toBlob(
                (blob) => {
                    resolve(URL.createObjectURL(blob));
                },
                "image/jpeg", // Choose format and quality
            );
        };
        image.onerror = (error) => reject(error);
    });
};
