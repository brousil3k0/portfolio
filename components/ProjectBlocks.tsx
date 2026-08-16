import type { ProjectBlock } from "@/content/i18n";

export function ProjectBlocks({ blocks, name }: { blocks: readonly ProjectBlock[]; name: string }) {
  return (
    <div className="space-y-10">
      {blocks.map((block, i) => {
        if (block.type === "text") {
          return (
            <p key={i} className="text-justify text-xl leading-relaxed text-bone-dim">
              {block.text}
            </p>
          );
        }

        if (block.type === "textImage") {
          // `fr` units, not `%` — fr shares out the space left over *after*
          // the grid gap is subtracted, so the two columns plus the gap
          // never exceed the container. Percentage columns summing to 100%
          // don't account for the gap at all, which pushed the row past the
          // container's right edge by exactly the gap width.
          const textWidth = 100 - block.imageWidth;
          const columns =
            block.imagePosition === "left"
              ? `${block.imageWidth}fr ${textWidth}fr`
              : `${textWidth}fr ${block.imageWidth}fr`;
          const image = (
            // A plain wrapper div — not the <img> itself — is the grid
            // item. An <img> has an intrinsic aspect ratio that Chrome uses
            // to size the grid's auto row track regardless of h-full/
            // min-h-0 on the img, which was forcing the row (and the text
            // column stretched to match) to the image's own preferred
            // height instead of the text's natural content height. A div
            // has no intrinsic ratio, so it contributes nothing and the row
            // sizes purely off the text; the absolutely-positioned image
            // then fills whatever height that turns out to be.
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-line">
              {/* Plain <img>, not next/image: content is picked at build
                  time from a small fixed placeholder set, not user-uploaded
                  or dynamically sized, so there's nothing for next/image's
                  runtime resizing to do here. loading="lazy" still defers
                  the network fetch until the block scrolls near the
                  viewport — the actual sustainability lever for a page with
                  several of these. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.image}
                alt={name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          );
          const text = <p className="text-justify text-xl leading-relaxed text-bone-dim">{block.text}</p>;
          return (
            <div
              key={i}
              className="grid grid-cols-1 gap-6 md:gap-10 md:[grid-template-columns:var(--cols)]"
              style={{ "--cols": columns } as React.CSSProperties}
            >
              {block.imagePosition === "left" ? (
                <>
                  {image}
                  {text}
                </>
              ) : (
                <>
                  {text}
                  {image}
                </>
              )}
            </div>
          );
        }

        // "images" — a standalone row of one or more images, no text. Uses
        // auto-fit instead of a fixed column count so it naturally wraps to
        // fewer columns on narrow viewports regardless of how many images
        // are in the row.
        return (
          <div
            key={i}
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
          >
            {block.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={block.images.length > 1 ? `${name} — image ${i + 1} of ${block.images.length}` : name}
                loading="lazy"
                decoding="async"
                className="w-full rounded-xl border border-line object-cover"
                style={{ height: block.height }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
