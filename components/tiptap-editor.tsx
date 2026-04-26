"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "আপনার অভিজ্ঞতা লিখুন...",
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Subscript,
      Superscript,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-content min-h-[160px] px-4 py-3 outline-none focus:outline-none text-sm leading-relaxed",
      },
    },
  });

  if (!editor) return null;

  function setLink() {
    const prev = editor!.getAttributes("link").href;
    const url = window.prompt("লিংক URL দিন:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-input focus-within:border-ring transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-px border-b border-border/50 bg-muted/20 px-1.5 py-1">
        {/* Text style group */}
        <div className="flex items-center">
          <ToolbarBtn
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="বোল্ড"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="ইটালিক"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="আন্ডারলাইন"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="স্ট্রাইকথ্রু"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><path d="M17.5 7.5C17 5.5 15 4 12 4c-3.5 0-5.5 2-5.5 4 0 1.5.5 2.5 2 3.5"/><path d="M8.5 16.5C9 18.5 11 20 14 20c3.5 0 5.5-2 5.5-4 0-1.5-.5-2.5-2-3.5"/></svg>
          </ToolbarBtn>
        </div>

        <Divider />

        {/* Highlight & Color */}
        <div className="flex items-center">
          <ToolbarBtn
            active={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}
            title="হাইলাইট"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.7"><rect x="3" y="14" width="18" height="6" rx="1" fill="#fef08a"/><path d="M12 3l-4 8h8l-4-8z" fill="currentColor" opacity="0.5"/></svg>
          </ToolbarBtn>
        </div>

        <Divider />

        {/* Heading group */}
        <div className="flex items-center">
          <ToolbarBtn
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="শিরোনাম ১"
          >
            <span className="text-[11px] font-bold">H1</span>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="শিরোনাম ২"
          >
            <span className="text-[11px] font-bold">H2</span>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="শিরোনাম ৩"
          >
            <span className="text-[11px] font-bold">H3</span>
          </ToolbarBtn>
        </div>

        <Divider />

        {/* List & Block group */}
        <div className="flex items-center">
          <ToolbarBtn
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="বুলেট লিস্ট"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="নম্বর লিস্ট"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><text x="2" y="8" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">1</text><text x="2" y="14.5" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">2</text><text x="2" y="21" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">3</text><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="উদ্ধৃতি"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.7"><path d="M10 8H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2l-2 4h2.5l2-4V8zM20 8h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2l-2 4h2.5l2-4V8z"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="কোড ব্লক"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="ইনলাইন কোড"
          >
            <span className="font-mono text-[10px]">{`</>`}</span>
          </ToolbarBtn>
        </div>

        <Divider />

        {/* Alignment */}
        <div className="flex items-center">
          <ToolbarBtn
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="বামে"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="মাঝে"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="ডানে"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
          </ToolbarBtn>
        </div>

        <Divider />

        {/* Link & extras */}
        <div className="flex items-center">
          <ToolbarBtn
            active={editor.isActive("link")}
            onClick={setLink}
            title="লিংক"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("subscript")}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            title="সাবস্ক্রিপ্ট"
          >
            <span className="text-[10px]">X<sub className="text-[8px]">₂</sub></span>
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("superscript")}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            title="সুপারস্ক্রিপ্ট"
          >
            <span className="text-[10px]">X<sup className="text-[8px]">²</sup></span>
          </ToolbarBtn>
        </div>

        <Divider />

        {/* Horizontal rule & clear */}
        <div className="flex items-center">
          <ToolbarBtn
            active={false}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="হরাইজন্টাল লাইন"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={false}
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            title="ফরম্যাটিং মুছুন"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16"/><path d="M10 7l-2 13"/><path d="M17 4l-7 7"/><path d="M14 17l6-6"/><path d="m17 14 3 3"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={false}
            onClick={() => editor.chain().focus().undo().run()}
            title="আনডু"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          </ToolbarBtn>
          <ToolbarBtn
            active={false}
            onClick={() => editor.chain().focus().redo().run()}
            title="রিডু"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/></svg>
          </ToolbarBtn>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-border/50" />;
}

function ToolbarBtn({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {children}
    </button>
  );
}
