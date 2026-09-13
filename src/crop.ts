
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

export const createPrintableSheet = async (
    imageSrc: string,
    options: {
        columns?: number;
        rows?: number;
        photoWidthMm?: number;
        photoHeightMm?: number;
        sheetWidthIn?: number;
        sheetHeightIn?: number;
        dpi?: number;
        paddingIn?: number;
    } = {},
): Promise<string> => {
    const {
        columns = 2,
        rows = 3,
        photoWidthMm = 35,
        photoHeightMm = 45,
        sheetWidthIn = 6,
        sheetHeightIn = 4,
        dpi = 300,
        paddingIn = 0.1,
    } = options;

    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = Math.round(sheetWidthIn * dpi);
            canvas.height = Math.round(sheetHeightIn * dpi);

            if (!ctx) {
                reject(new Error("Failed to create canvas context"));
                return;
            }

            const mmToPx = (mm: number) => Math.round((mm / 25.4) * dpi);
            const photoWidthPx = mmToPx(photoWidthMm);
            const photoHeightPx = mmToPx(photoHeightMm);
            const paddingPx = Math.round(paddingIn * dpi);

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const usableWidth = canvas.width - (paddingPx * 2);
            const usableHeight = canvas.height - (paddingPx * 2);
            const totalPhotosWidth = columns * photoWidthPx;
            const totalPhotosHeight = rows * photoHeightPx;
            const gapX = Math.max(
                0,
                Math.floor((usableWidth - totalPhotosWidth) / Math.max(columns - 1, 1)),
            );
            const gapY = Math.max(
                0,
                Math.floor((usableHeight - totalPhotosHeight) / Math.max(rows - 1, 1)),
            );
            const startX = Math.floor((canvas.width - (totalPhotosWidth + gapX * (columns - 1))) / 2);
            const startY = Math.floor((canvas.height - (totalPhotosHeight + gapY * (rows - 1))) / 2);
            const gridWidth = totalPhotosWidth + gapX * (columns - 1);
            const gridHeight = totalPhotosHeight + gapY * (rows - 1);

            for (let row = 0; row < rows; row += 1) {
                for (let col = 0; col < columns; col += 1) {
                    const x = startX + col * (photoWidthPx + gapX);
                    const y = startY + row * (photoHeightPx + gapY);
                    const scale = Math.min(
                        photoWidthPx / image.width,
                        photoHeightPx / image.height,
                    );
                    const drawWidth = Math.round(image.width * scale);
                    const drawHeight = Math.round(image.height * scale);
                    const drawX = x + Math.floor((photoWidthPx - drawWidth) / 2);
                    const drawY = y;

                    // Fit the full cropped portrait into the 2x2 square without re-cropping it.
                    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
                }
            }

            ctx.strokeStyle = "#999";
            ctx.lineWidth = 1;
            ctx.strokeRect(startX, startY, gridWidth, gridHeight);

            for (let col = 1; col < columns; col += 1) {
                const x = startX + col * photoWidthPx + (col - 1) * gapX + Math.floor(gapX / 2);
                ctx.beginPath();
                ctx.moveTo(x, startY);
                ctx.lineTo(x, startY + gridHeight);
                ctx.stroke();
            }

            for (let row = 1; row < rows; row += 1) {
                const y = startY + row * photoHeightPx + (row - 1) * gapY + Math.floor(gapY / 2);
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.lineTo(startX + gridWidth, y);
                ctx.stroke();
            }

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(URL.createObjectURL(blob));
                } else {
                    reject(new Error("Failed to create printable sheet"));
                }
            }, "image/jpeg", 0.95);
        };
        image.onerror = (error) => reject(error);
    });
};

// const  removeBackground=async (imageSrc) => {
//     //ts-ignore
//    const blob=await imglyRemoveBackground(imageSrc);
//    return URL.createObjectURL(blob);
// }
