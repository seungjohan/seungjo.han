import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Post } from '../../data/posts';

// ─── Anchor headings ───────────────────────────────────────────────────────────
export function copyAnchorLink(id: string) {
  const hashUrl = `${window.location.origin}${window.location.pathname}#${id}`;
  navigator.clipboard.writeText(hashUrl)
    .then(() => {
      toast.success('Copied link to clipboard', { position: 'bottom-left' });
    })
    .catch(() => {});
}

export function AnchorHeading({
  level,
  id,
  children,
}: {
  level: 2 | 3 | 4;
  id: string;
  children: React.ReactNode;
}) {
  const Tag = `h${level}` as const;

  return (
    <Tag id={id} className="anchor-heading" style={{ scrollMarginTop: '100px' }}>
      <span className="anchor-heading-row">
        <button
          type="button"
          className="anchor-link-chip"
          aria-label="Copy link to section"
          onClick={() => copyAnchorLink(id)}
        >
          <Link2 size={15} strokeWidth={2} />
        </button>
        <a
          href={`#${id}`}
          className="anchor-heading-text"
          onClick={e => {
            e.preventDefault();
            copyAnchorLink(id);
          }}
        >
          {children}
        </a>
      </span>
    </Tag>
  );
}

export function AnchorH2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <AnchorHeading level={2} id={id}>
      {children}
    </AnchorHeading>
  );
}

function formatIndexLinkLabel(title: string) {
  const dotIndex = title.indexOf('.');
  if (dotIndex < 0) {
    return { lead: title, rest: '' };
  }
  return {
    lead: title.slice(0, dotIndex + 1),
    rest: title.slice(dotIndex + 1),
  };
}

// ─── Text helpers ──────────────────────────────────────────────────────────────
export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function stripMarkdownHeader(markdown: string) {
  const lines = markdown.split('\n');
  const dividerIndex = lines.findIndex(line => line.trim() === '---');
  return dividerIndex >= 0 ? lines.slice(dividerIndex + 1).join('\n').trim() : markdown.trim();
}

function stripDuplicatePageHeader(markdown: string, post: Post) {
  const lines = markdown.split('\n');
  const title = post.title.trim().replace(/\.$/, '');
  const first = lines[0]?.trim().replace(/\.$/, '');
  const second = lines[1]?.trim();

  if (first === title && second === post.subtitle.trim()) {
    return lines.slice(2).join('\n').trim();
  }

  return markdown;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\\_/g, '_')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(?<![\w*])_([^_\n]+?)_(?![\w*])/g, '<em>$1</em>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

type BlogImageSize = 'small' | 'medium' | 'wide';
type TextSize = 'small' | 'regular' | 'large' | 'xlarge';
type QuoteStyle = 'normal' | 'line' | 'box' | 'marks';

function parseImageLabel(value: string, fallback: string): { alt: string; size: BlogImageSize } {
  const parts = value.split('|').map(part => part.trim()).filter(Boolean);
  const sizePart = parts.find(part => /^size=(small|medium|wide)$/i.test(part));
  const size = sizePart?.split('=')[1]?.toLowerCase() as BlogImageSize | undefined;
  const alt = parts.filter(part => !/^size=/i.test(part)).join(' | ') || fallback;

  return { alt, size: size || 'medium' };
}

function isRemoteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function parseImageBlock(block: string, post: Post, imageIndex: number) {
  const imageMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  const textImageMatch = block.match(/^📷\s+\[Image:\s*([^\]]+)\]$/);
  const brunchImageMatch = block.match(/^.*Image(?::\s*([^†]+))?.*brunch\.co\.kr.*$/);

  if (!imageMatch && !textImageMatch && !brunchImageMatch) return null;

  const fileName = `${slugify(post.title)}_${imageIndex}.jpg`;
  const { alt, size } = parseImageLabel(
    imageMatch?.[1] || textImageMatch?.[1] || brunchImageMatch?.[1] || '',
    post.title
  );
  const rawSrc = imageMatch?.[2]?.trim();
  const src = rawSrc
    ? isRemoteUrl(rawSrc)
      ? rawSrc
      : rawSrc.startsWith('/')
        ? rawSrc
        : `/blog-images/${fileName}`
    : `/blog-images/${fileName}`;

  return { src, alt, fileName, size };
}

function parseCaptionBlock(block: string) {
  const trimmed = block.trim();
  const captionMatch = trimmed.match(/^\*([^*]+)\*$/s);
  if (!captionMatch) return null;

  return captionMatch[1].trim();
}

function parseTextSizeBlock(block: string): { size: TextSize; content: string } {
  const match = block.match(/^\{size=(small|regular|large|xlarge)\}\s*([\s\S]*)$/i);
  if (!match) return { size: 'regular', content: block };

  return {
    size: match[1].toLowerCase() as TextSize,
    content: match[2].trim(),
  };
}

function parseQuoteStyleBlock(block: string): QuoteStyle | null {
  const match = block.match(/^\{quote=(normal|line|box|marks)\}$/i);
  return match ? match[1].toLowerCase() as QuoteStyle : null;
}

function normalizeBrunchHeading(value: string) {
  const heading = value.trim().replace(/\\([<>])/g, '$1');
  return heading === '<index>' ? 'index' : heading.replace(/^<(.+)>$/, '$1');
}

// ─── Image components ──────────────────────────────────────────────────────────
function MarkdownImage({
  src,
  alt,
  fileName,
  size,
  onOpen,
}: {
  src: string;
  alt: string;
  fileName: string;
  size: BlogImageSize;
  onOpen: (src: string, alt: string) => void;
}) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <figure className={`blog-image blog-image-${size} missing-image`}>
        <div>
          <span>{fileName}</span>
          <small>Place this image in public/blog-images</small>
        </div>
      </figure>
    );
  }

  return (
    <figure className={`blog-image blog-image-${size}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setMissing(true)}
        onClick={() => onOpen(src, alt)}
        className="cursor-zoom-in"
      />
    </figure>
  );
}

function MarkdownImageGroup({
  images,
  caption,
  onOpen,
}: {
  images: Array<{ src: string; alt: string; fileName: string; size: BlogImageSize }>;
  caption?: string;
  onOpen: (src: string, alt: string) => void;
}) {
  const rowSize = images.some(image => image.size === 'wide') ? 'wide' : images.some(image => image.size === 'small') ? 'small' : 'medium';

  if (images.length === 1) {
    const image = images[0];
    return (
      <figure className={`blog-image-group blog-image-group-${rowSize}`}>
        <MarkdownImage
          src={image.src}
          alt={image.alt}
          fileName={image.fileName}
          size={image.size}
          onOpen={onOpen}
        />
        {caption && (
          <figcaption dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(caption) }} />
        )}
      </figure>
    );
  }

  return (
    <figure className={`blog-image-group blog-image-group-${rowSize}`}>
      <div className="blog-image-row" style={{ ['--image-count' as string]: images.length }}>
        {images.map((image, index) => (
          <MarkdownImage
            key={`${image.fileName}-${index}`}
            src={image.src}
            alt={image.alt}
            fileName={image.fileName}
            size={image.size}
            onOpen={onOpen}
          />
        ))}
      </div>
      {caption && (
        <figcaption dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(caption) }} />
      )}
    </figure>
  );
}

// ─── Markdown renderer ─────────────────────────────────────────────────────────
export function MarkdownContent({
  markdown,
  post,
  onOpenImage,
}: {
  markdown: string;
  post: Post;
  onOpenImage: (src: string, alt: string) => void;
}) {
  const content = stripDuplicatePageHeader(stripMarkdownHeader(markdown), post);
  const blocks = (content.includes('\n\n') ? content.split(/\n{2,}/) : content.split('\n'))
    .map(block => block.trim())
    .filter(Boolean);
  let imageIndex = 0;
  const rendered: React.ReactNode[] = [];
  let isIndexSection = false;
  let pendingQuoteStyle: QuoteStyle = 'normal';

  for (let i = 0; i < blocks.length; i += 1) {
    let block = blocks[i];

    if (block === '---' || block === '* * *') {
      continue;
    }

    const sameBlockQuoteStyle = block.match(/^\{quote=(normal|line|box|marks)\}\s*\n([\s\S]+)$/i);
    if (sameBlockQuoteStyle) {
      pendingQuoteStyle = sameBlockQuoteStyle[1].toLowerCase() as QuoteStyle;
      block = sameBlockQuoteStyle[2].trim();
    } else {
      const quoteStyle = parseQuoteStyleBlock(block);
      if (quoteStyle) {
        pendingQuoteStyle = quoteStyle;
        continue;
      }
    }

    const images: Array<{ src: string; alt: string; fileName: string; size: BlogImageSize }> = [];
    let cursor = i;
    while (cursor < blocks.length) {
      const nextImage = parseImageBlock(blocks[cursor], post, imageIndex + 1);
      if (!nextImage) break;
      imageIndex += 1;
      images.push(nextImage);
      cursor += 1;
    }

    if (images.length > 0) {
      const caption = cursor < blocks.length ? parseCaptionBlock(blocks[cursor]) : null;
      if (caption) cursor += 1;
      rendered.push(
        <MarkdownImageGroup
          key={i}
          images={images}
          caption={caption || undefined}
          onOpen={onOpenImage}
        />
      );
      i = cursor - 1;
      continue;
    }

    if (block.startsWith('## ')) {
      const title = block.replace(/^##\s+/, '');
      isIndexSection = false;
      rendered.push(
        <AnchorHeading key={i} level={2} id={slugify(title.replace(/\\</g, '').replace(/\\>/g, ''))}>
          <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(title) }} />
        </AnchorHeading>
      );
      continue;
    }

    if (block.startsWith('### ')) {
      const title = normalizeBrunchHeading(block.replace(/^###\s+/, ''));
      isIndexSection = title.trim().toLowerCase() === 'index';
      rendered.push(
        <AnchorHeading key={i} level={3} id={slugify(title)}>
          <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(title) }} />
        </AnchorHeading>
      );
      continue;
    }

    if (block.startsWith('#### ')) {
      const title = normalizeBrunchHeading(block.replace(/^####\s+/, ''));
      isIndexSection = false;
      rendered.push(
        <AnchorHeading key={i} level={4} id={slugify(title)}>
          <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(title) }} />
        </AnchorHeading>
      );
      continue;
    }

    if (/^cite/.test(block) || /^keyword$/i.test(block)) continue;

    if (block.startsWith('>')) {
      const quoteStyle = pendingQuoteStyle;
      pendingQuoteStyle = 'normal';
      const lines = block.split('\n').map(line => line.replace(/^>\s?/, '')).filter(Boolean);
      rendered.push(
        <blockquote key={i} className={`blog-quote blog-quote-${quoteStyle}`}>
          {lines.map((line, lineIndex) => (
            <p key={lineIndex} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line) }} />
          ))}
        </blockquote>
      );
      continue;
    }

    if (/^- /.test(block)) {
      if (isIndexSection) {
        rendered.push(
          <ul key={i} className="blog-index-list">
            {block.split('\n').map((line, lineIndex) => {
              const title = line.replace(/^- /, '').trim();
              const { lead, rest } = formatIndexLinkLabel(title);
              return (
                <li key={lineIndex}>
                  <a href={`#${slugify(title)}`} className="blog-index-link">
                    <span className="blog-index-marker" aria-hidden="true">
                      ·{' '}
                    </span>
                    <strong>{lead}</strong>
                    {rest}
                  </a>
                </li>
              );
            })}
          </ul>
        );
        continue;
      }
      rendered.push(
        <ul key={i}>
          {block.split('\n').map((line, lineIndex) => (
            <li
              key={lineIndex}
              dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line.replace(/^- /, '')) }}
            />
          ))}
        </ul>
      );
      continue;
    }

    const sizedBlock = parseTextSizeBlock(block);
    rendered.push(
      <p
        key={i}
        className={`blog-text-${sizedBlock.size}`}
        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(sizedBlock.content).replace(/\n/g, '<br />') }}
      />
    );
  }

  return <div className="prose-content">{rendered}</div>;
}
