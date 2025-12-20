import {removeBackground} from "@imgly/background-removal"

/**
 * This function is widely available online in examples for both react-easy-crop and svelte-easy-crop.
 */
export const getCroppedImg = async (imageSrc, pixelCrop, targetWidth, targetHeight) => {
    // const imageWithoutBg = await removeBackground(imageSrc);
    // const url = URL.createObjectURL(imageWithoutBg);
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set canvas size to the exact desired output dimensions
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            if (ctx) {
                // Fill the canvas with white background first
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            }

            // Get the resulting image as a data URL (or blob)
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(URL.createObjectURL(blob));
                    } else {
                        reject(new Error("Failed to create blob from canvas"));
                    }
                },
                "image/jpeg", // Choose format and quality
            );
        };
        image.onerror = (error) => reject(error);
    });
};

// const  removeBackground=async (imageSrc) => {
//     //ts-ignore
//    const blob=await imglyRemoveBackground(imageSrc);
//    return URL.createObjectURL(blob);
// }