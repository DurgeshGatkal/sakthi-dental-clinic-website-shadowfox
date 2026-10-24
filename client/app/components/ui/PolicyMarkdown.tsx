import { Fragment, type ReactNode } from "react";

/*
 * Section 5 — the policy is stored as markdown so the clinic can edit it in
 * one place. Rather than pull in a full parser, this renders the small subset
 * the document actually uses: ## and ### headings, "- " lists, **bold** and
 * [links](...). Everything becomes React nodes, so no HTML is ever injected.
 */

const INLINE_TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function inline(text: string, keyPrefix = "i"): ReactNode[] {
  return text
    .split(INLINE_TOKEN)
    .filter(Boolean)
    .map((token, index) => {
      const key = `${keyPrefix}-${index}`;

      if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
        return (
          <strong key={key} className="font-semibold text-ink-900">
            {inline(token.slice(2, -2), key)}
          </strong>
        );
      }

      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (link) {
        const [, label = "", href = ""] = link;
        const external = /^https?:/i.test(href);
        return (
          <a
            key={key}
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="font-medium text-lavender-700 underline"
          >
            {inline(label, key)}
          </a>
        );
      }

      return <Fragment key={key}>{token}</Fragment>;
    });
}

type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string };

function parse(markdown: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    blocks.push({ kind: "list", items: list });
    list = [];
  };

  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "h3", text: line.slice(4) });
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "h2", text: line.slice(3) });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export function PolicyMarkdown({ markdown }: { markdown: string }) {
  return (
    <div>
      {parse(markdown).map((block, index) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2 key={index} className="mt-10 text-h3 first:mt-0">
                {inline(block.text, `h2-${index}`)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} className="mt-8 text-base font-semibold">
                {inline(block.text, `h3-${index}`)}
              </h3>
            );
          case "list":
            return (
              <ul key={index} className="mt-4 list-disc space-y-2 pl-6 text-body text-ink-600">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{inline(item, `li-${index}-${itemIndex}`)}</li>
                ))}
              </ul>
            );
          case "paragraph":
            return (
              <p key={index} className="mt-4 text-body text-ink-600">
                {inline(block.text, `p-${index}`)}
              </p>
            );
        }
      })}
    </div>
  );
}
