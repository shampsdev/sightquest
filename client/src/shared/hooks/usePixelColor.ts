import { useEffect, useState } from "react";
import { useImage, Skia, SkImage } from "@shopify/react-native-skia";
import { ImageRequireSource } from "react-native";

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface UsePixelColorProps {
  imageUri: string;
  x?: number;
  y?: number;
}

export const usePixelColor = ({
  imageUri,
  x,
  y,
}: UsePixelColorProps): RGBA | null => {
  const [pixelColor, setPixelColor] = useState<RGBA | null>(null);
  const image: SkImage | null = useImage(imageUri);
  useEffect(() => {
    if (image) {
      try {
        const width: number = image.width();
        const height: number = image.height();

        if (!y) {
          y = Math.floor(height / 2);
        }
        if (!x) {
          x = 0;
        }

        if (y >= 0 && y < height) {
          const pixelData: Uint8Array | Float32Array | null =
            image.readPixels();
          if (pixelData) {
            let r: number, g: number, b: number, a: number;
            if (pixelData instanceof Uint8Array) {
              const pixelIndex: number = (y * width + x) * 4;
              if (pixelIndex + 3 < pixelData.length) {
                r = pixelData[pixelIndex];
                g = pixelData[pixelIndex + 1];
                b = pixelData[pixelIndex + 2];
                a = pixelData[pixelIndex + 3];
              } else {
                setPixelColor(null);
                return;
              }
            } else if (pixelData instanceof Float32Array) {
              const uint8Data = new Uint8Array(pixelData.buffer);
              const pixelIndex: number = (y * width + x) * 4;
              if (pixelIndex + 3 < uint8Data.length) {
                r = uint8Data[pixelIndex];
                g = uint8Data[pixelIndex + 1];
                b = uint8Data[pixelIndex + 2];
                a = uint8Data[pixelIndex + 3];
              } else {
                setPixelColor(null);
                return;
              }
            } else {
              setPixelColor(null);
              return;
            }

            const alpha: number = a / 255;
            setPixelColor({ r: r, g: g, b: b, a: alpha });
          } else {
            setPixelColor(null);
          }
        } else {
          setPixelColor(null);
        }
      } catch (error) {
        console.error("Error reading pixel:", error);
        setPixelColor(null);
      }
    }
  }, [image, imageUri]);

  return pixelColor;
};
