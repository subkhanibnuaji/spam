// ============================================================
// SimpleMarkdown — lightweight inline markdown renderer
// No external dependency. Handles: h1-h4, bold, italic,
// inline code, code block, unordered list, ordered list,
// blockquote, horizontal rule, paragraph.
// ============================================================

interface Props {
  children: string;
  className?: string;
}

export function SimpleMarkdown({ children, className = '' }: Props) {
  const lines = children.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  function parseInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    // Process: bold, italic, inline code
    const regex = /(\*\*(.+?)\*\*|__(.+?)__|`(.+?)`|\*(.+?)\*|_(.+?)_)/g;
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) {
        parts.push(text.slice(last, match.index));
      }
      if (match[2] !== undefined) {
        parts.push(<strong key={match.index}>{match[2]}</strong>);
      } else if (match[3] !== undefined) {
        parts.push(<strong key={match.index}>{match[3]}</strong>);
      } else if (match[4] !== undefined) {
        parts.push(
          <code key={match.index} className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            {match[4]}
          </code>,
        );
      } else if (match[5] !== undefined) {
        parts.push(<em key={match.index}>{match[5]}</em>);
      } else if (match[6] !== undefined) {
        parts.push(<em key={match.index}>{match[6]}</em>);
      }
      last = match.index + match[0].length;
    }

    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    const hMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = parseInline(hMatch[2]);
      const sizes = ['', 'text-xl font-bold mt-6 mb-2', 'text-lg font-bold mt-5 mb-2', 'text-base font-semibold mt-4 mb-1.5', 'text-sm font-semibold mt-3 mb-1'];
      elements.push(
        <div key={i} className={sizes[level] || sizes[4]}>
          {text}
        </div>,
      );
      i++;
      continue;
    }

    // Code block
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="my-3 overflow-x-auto rounded-lg bg-muted p-4">
          <code className="font-mono text-xs leading-relaxed">{codeLines.join('\n')}</code>
        </pre>,
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={i}
          className="my-2 border-l-4 border-primary/30 pl-4 text-sm italic text-muted-foreground"
        >
          {parseInline(line.slice(2))}
        </blockquote>,
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(line.trim())) {
      elements.push(<hr key={i} className="my-4 border-border" />);
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(
          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
            <span className="mt-1 shrink-0 text-primary">•</span>
            <span>{parseInline(lines[i].replace(/^[-*+]\s/, ''))}</span>
          </li>,
        );
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="my-2 space-y-1">{items}</ul>);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = [];
      let num = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
            <span className="shrink-0 font-medium text-primary">{num}.</span>
            <span>{parseInline(lines[i].replace(/^\d+\.\s/, ''))}</span>
          </li>,
        );
        i++;
        num++;
      }
      elements.push(<ol key={`ol-${i}`} className="my-2 space-y-1">{items}</ol>);
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-sm leading-relaxed text-muted-foreground">
        {parseInline(line)}
      </p>,
    );
    i++;
  }

  return (
    <div className={`prose-custom space-y-1 ${className}`}>
      {elements}
    </div>
  );
}
