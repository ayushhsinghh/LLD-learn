import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import { imageVariants } from "@/lib/image-variants.generated";

export type StaticImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  eager?: boolean;
};

/** Local, build-time variants; never invokes the runtime image optimizer. */
export function StaticImage({ src, alt, width, height, className, sizes = "(max-width: 639px) calc(100vw - 40px), (max-width: 779px) calc(100vw - 64px), (max-width: 1023px) 716px, 700px", eager = false }: StaticImageProps) {
  const definition = imageVariants[src];
  const candidates = definition?.candidates;
  const fallback = candidates?.[candidates.length - 1]?.src ?? src;

  return (
    // No layout box: the image retains its parent's bounded flex/contain sizing.
    <picture style={{ display: "contents" }}>
      {candidates && (
        <source
          type="image/webp"
          srcSet={candidates.map((candidate) => `${withBasePath(candidate.src)} ${candidate.width}w`).join(", ")}
          sizes={sizes}
        />
      )}
      <Image
        src={withBasePath(fallback)}
        alt={alt}
        width={definition?.width ?? width}
        height={definition?.height ?? height}
        className={className}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        unoptimized
      />
    </picture>
  );
}
