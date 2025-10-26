import { AiOutlineStrikethrough } from "@react-icons/all-files/ai/AiOutlineStrikethrough";
import { BiCodeBlock } from "@react-icons/all-files/bi/BiCodeBlock";
import { BiListOl } from "@react-icons/all-files/bi/BiListOl";
import { BiListUl } from "@react-icons/all-files/bi/BiListUl";
import { FaQuoteRight } from "@react-icons/all-files/fa/FaQuoteRight";
import { FiBold } from "@react-icons/all-files/fi/FiBold";
import { FiCode } from "@react-icons/all-files/fi/FiCode";
import { FiItalic } from "@react-icons/all-files/fi/FiItalic";
import { FiLink } from "@react-icons/all-files/fi/FiLink";
import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiRotateCcw } from "@react-icons/all-files/fi/FiRotateCcw";
import { FiRotateCw } from "@react-icons/all-files/fi/FiRotateCw";
import { FiX } from "@react-icons/all-files/fi/FiX";
import Link from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useRef } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import styled from "styled-components";
import { Markdown } from "tiptap-markdown";

import { normaliseToHtml } from "./editorUtils";

type Props = {
  value: string;
  onChange: (content: string) => void;
  height?: string;
  placeholder?: string;
};

const MarkdownEditor = ({
  value = "",
  onChange,
  height = "260px",
  placeholder = "",
}: Props) => {
  const safeValue = value ?? "";
  const ignoreUpdatesRef = useRef(false);
  const lastEmittedValueRef = useRef<string>(normaliseToHtml(safeValue));

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3], // H1도 포함
        },
        bulletList: {
          keepMarks: true,
        },
        orderedList: {
          keepMarks: true,
        },
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        breaks: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({
        placeholder,
        includeChildren: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    [placeholder]
  );

  const editor = useEditor(
    {
      extensions,
      content: lastEmittedValueRef.current,
      editorProps: {
        attributes: {
          class: "general-tiptap-editor",
        },
      },
      onUpdate: ({ editor: instance }) => {
        if (ignoreUpdatesRef.current) {
          return;
        }

        const html = instance.getHTML();

        if (html === lastEmittedValueRef.current) {
          return;
        }

        lastEmittedValueRef.current = html;
        onChange(html);
      },
    },
    [extensions]
  );

  const handleMarkdownShortcuts = (
    event: ReactKeyboardEvent<HTMLDivElement>
  ) => {
    if (!editor) {
      return;
    }

    if (
      event.key !== " " ||
      event.shiftKey ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    ) {
      return;
    }

    const { selection } = editor.state;

    if (!selection.empty) {
      return;
    }

    if (editor.isActive("codeBlock")) {
      return;
    }

    const { $from } = selection;
    const textBefore = $from.parent.textBetween(
      0,
      $from.parentOffset,
      undefined,
      "\ufffc"
    );

    if (!textBefore) {
      return;
    }

    const trimmed = textBefore.trim();

    if (!trimmed || trimmed.length !== textBefore.length) {
      return;
    }

    const from = $from.pos - textBefore.length;
    const to = $from.pos;
    const headingLevelMap: Record<number, 1 | 2 | 3> = {
      1: 1,
      2: 2,
      3: 3,
    };
    const runCommand = (
      command: (
        chain: ReturnType<TiptapEditor["chain"]>
      ) => ReturnType<TiptapEditor["chain"]>
    ) => {
      const executed = command(
        editor.chain().focus().deleteRange({ from, to })
      ).run();

      if (executed) {
        event.preventDefault();
      }

      return executed;
    };

    if (/^#{1,3}$/.test(trimmed)) {
      const level = headingLevelMap[trimmed.length];

      if (!level || editor.isActive("heading", { level })) {
        return;
      }

      if (runCommand((chain) => chain.toggleHeading({ level }))) {
        return;
      }
    }

    if (/^(-|\+|\*)$/.test(trimmed)) {
      if (editor.isActive("bulletList")) {
        return;
      }

      if (runCommand((chain) => chain.toggleBulletList())) {
        return;
      }
    }

    const orderedMatch = trimmed.match(/^(\d+)\.$/);

    if (orderedMatch) {
      if (editor.isActive("orderedList")) {
        return;
      }

      if (runCommand((chain) => chain.toggleOrderedList())) {
        return;
      }
    }

    if (trimmed === ">" && !editor.isActive("blockquote")) {
      runCommand((chain) => chain.toggleBlockquote());
    }
  };

  const handleEditorSurfaceMouseDown = (
    event: ReactMouseEvent<HTMLDivElement>
  ) => {
    const { button, currentTarget, target } = event;

    if (!editor || button !== 0) {
      return;
    }

    if (!(target instanceof Element)) {
      return;
    }

    const isSurface =
      target === currentTarget || target.classList.contains("ProseMirror");

    if (!isSurface) {
      return;
    }

    event.preventDefault();
    editor.commands.focus("end");
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextHtml = normaliseToHtml(safeValue);

    if (nextHtml === editor.getHTML()) {
      lastEmittedValueRef.current = nextHtml;
      return;
    }

    ignoreUpdatesRef.current = true;
    editor.commands.setContent(nextHtml, { emitUpdate: false });
    lastEmittedValueRef.current = nextHtml;

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        ignoreUpdatesRef.current = false;
      });
    } else {
      ignoreUpdatesRef.current = false;
    }
  }, [safeValue, editor]);

  if (!editor) {
    return null;
  }

  const handleSetParagraph = () => {
    editor.chain().focus().setParagraph().run();
  };

  const handleToggleHeading = (level: 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const handleSetLink = () => {
    if (typeof window === "undefined") {
      return;
    }

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 주소를 입력하세요", previousUrl ?? "");

    if (url === null) {
      return;
    }

    const trimmed = url.trim();

    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: trimmed })
      .run();
  };

  const handleUnsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <EditorWrapper className="tiptap-editor-root" $height={height}>
      <Toolbar>
        <ToolbarButton
          type="button"
          aria-label="본문"
          $active={editor.isActive("paragraph")}
          onMouseDown={(event) => {
            event.preventDefault();
            handleSetParagraph();
          }}
        >
          본문
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="제목 2"
          $active={editor.isActive("heading", { level: 2 })}
          onMouseDown={(event) => {
            event.preventDefault();
            handleToggleHeading(2);
          }}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="제목 3"
          $active={editor.isActive("heading", { level: 3 })}
          onMouseDown={(event) => {
            event.preventDefault();
            handleToggleHeading(3);
          }}
        >
          H3
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          type="button"
          aria-label="굵게"
          $active={editor.isActive("bold")}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
        >
          <FiBold />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="기울임"
          $active={editor.isActive("italic")}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
        >
          <FiItalic />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="취소선"
          $active={editor.isActive("strike")}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
        >
          <AiOutlineStrikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="인라인 코드"
          $active={editor.isActive("code")}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleCode().run();
          }}
        >
          <FiCode />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          type="button"
          aria-label="글머리 기호 목록"
          $active={editor.isActive("bulletList")}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          <BiListUl size={18} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="번호 매기기 목록"
          $active={editor.isActive("orderedList")}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <BiListOl size={18} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="인용문"
          $active={editor.isActive("blockquote")}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
        >
          <FaQuoteRight size={14} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          type="button"
          aria-label="링크 추가"
          $active={editor.isActive("link")}
          onMouseDown={(event) => {
            event.preventDefault();
            handleSetLink();
          }}
        >
          <FiLink />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="링크 제거"
          disabled={!editor.isActive("link")}
          onMouseDown={(event) => {
            event.preventDefault();
            handleUnsetLink();
          }}
        >
          <FiX />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="코드 블록"
          $active={editor.isActive("codeBlock")}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          }}
        >
          <BiCodeBlock size={18} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="구분선"
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().setHorizontalRule().run();
          }}
        >
          <FiMinus />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          type="button"
          aria-label="되돌리기"
          disabled={!editor.can().undo()}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().undo().run();
          }}
        >
          <FiRotateCcw />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          aria-label="다시 실행"
          disabled={!editor.can().redo()}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().redo().run();
          }}
        >
          <FiRotateCw />
        </ToolbarButton>
      </Toolbar>

      <StyledEditorContent
        editor={editor}
        $height={height}
        onKeyDown={handleMarkdownShortcuts}
        onMouseDown={handleEditorSurfaceMouseDown}
      />
    </EditorWrapper>
  );
};

export default MarkdownEditor;

const EditorWrapper = styled.div<{ $height: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  overflow: hidden;
  min-height: ${({ $height }) => $height};
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
`;

const ToolbarDivider = styled.span`
  width: 1px;
  height: 18px;
  margin: 0 6px;
  background: ${({ theme }) => theme.app.border};
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 8px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: ${({ theme, $active }) =>
    $active ? theme.app.bg.gray1 : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.app.text.main : theme.app.text.light1};
  cursor: pointer;
  font-size: 12px;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    color: ${({ theme }) => theme.app.text.main};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StyledEditorContent = styled(EditorContent)<{ $height: string }>`
  flex: 1;
  padding: 12px;
  min-height: ${({ $height }) => $height};
  font-size: 14px;
  line-height: 1.6;

  /* ProseMirror 에디터에 직접 스타일 적용 */
  .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    color: ${({ theme }) => theme.app.text.black};
    caret-color: ${({ theme }) => theme.app.text.black};
    min-height: 100%;
  }

  .ProseMirror p {
    margin: 0 0 8px;
    color: ${({ theme }) => theme.app.text.black};
  }

  .ProseMirror h1,
  .ProseMirror h2,
  .ProseMirror h3 {
    font-weight: 700;
    margin: 0 0 10px;
    color: ${({ theme }) => theme.app.text.black};
    line-height: 1.4;
  }

  .ProseMirror h1 {
    font-size: 1.5em;
  }

  .ProseMirror h2 {
    font-size: 1.35em;
  }

  .ProseMirror h3 {
    font-size: 1.2em;
  }

  .ProseMirror p:last-child {
    margin-bottom: 0;
  }

  .ProseMirror ul {
    margin: 0 0 8px;
    padding-left: 22px;
    list-style-position: outside;
  }

  .ProseMirror ol {
    margin: 0 0 8px;
    padding-left: 22px;
    list-style-position: outside;
  }

  .ProseMirror li {
    margin: 0;
    line-height: 1.6;
    list-style: inherit;
  }

  .ProseMirror ul > li {
    list-style-type: disc;
  }

  .ProseMirror ol > li {
    list-style-type: decimal;
  }

  .ProseMirror blockquote {
    margin: 0 0 8px;
    padding-left: 12px;
    border-left: 3px solid ${({ theme }) => theme.app.palette.smokeBlue[200]};
    color: ${({ theme }) => theme.app.text.light1};
  }

  .ProseMirror hr {
    margin: 16px 0;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }

  .ProseMirror code {
    background: ${({ theme }) => theme.app.bg.gray1};
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 13px;
    font-family: "Fira Code", "SFMono-Regular", ui-monospace, SFMono-Regular,
      Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .ProseMirror pre {
    background: ${({ theme }) => theme.app.bg.gray1};
    border-radius: 6px;
    padding: 12px;
    font-size: 13px;
    overflow: auto;
    font-family: "Fira Code", "SFMono-Regular", ui-monospace, SFMono-Regular,
      Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    color: ${({ theme }) => theme.app.text.light2};
    float: left;
    height: 0;
    pointer-events: none;
  }
`;
