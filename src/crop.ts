
/**
 * Triggers a file download in the browser.
 * @param {Blob} blob - The image blob to download.
 * @param {string} fileName - The desired file name for the downloaded image (e.g., 'my-image.png').
 */
export function downloadBlobImage(blob: Blob, fileName: string) {
  // Create a link element
  const link = document.createElement('a');
  // Set the download attribute with the desired file name
  link.download = fileName;

  // Create a URL for the blob object
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;

  // Append link to body, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Free up memory by revoking the object URL
  URL.revokeObjectURL(objectUrl);
}


/**
 * This function is widely available online in examples for both react-easy-crop and svelte-easy-crop.
 */
export const getCroppedImg = async (imageSrc: string, pixelCrop: any, targetWidth: number, targetHeight: number): Promise<string> => {
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