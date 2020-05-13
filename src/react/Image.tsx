import React, { ComponentProps } from "react";

export function Image(
  props: ComponentProps<"img"> & { src: string }
) {
  const src = useImgSuspense(props.src);

  return <img {...props} src={src} />;
}

function useImgSuspense(src: string) {
  if (!imgCache[src]) {
    imgCache[src] = {
      promise: new Promise(resolve => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          canvas.getContext("2d")!.drawImage(img, 0, 0);

          const newSrc = canvas.toDataURL("image/png");
          imgCache[src].dataUri = newSrc;
          // setTimeout(() => {
          resolve(newSrc);
          // }, 2000);
        };
        img.src = src;
      }),
      dataUri: undefined
    };
  }

  const cacheValue = imgCache[src];

  if (!cacheValue.dataUri) {
    throw cacheValue.promise;
  }

  return cacheValue.dataUri;
}

const imgCache: Record<
  string,
  { promise: Promise<string>; dataUri: string | undefined }
> = {};
