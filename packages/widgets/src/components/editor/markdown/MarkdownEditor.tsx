import Editor from '@monaco-editor/react';

import theme from 'monaco-themes/themes/Tomorrow.json';

theme.colors['editor.background'] = '#FFFFFF60';

export interface MarkdownEditorProps {
  markdown?: string;
  defaultMarkdown?: string;
  onMarkdownChange?: (markdown: string) => void;
}

export function MarkdownEditor ({ markdown, defaultMarkdown, onMarkdownChange }: MarkdownEditorProps) {
  return (
    <Editor
      className="h-full w-full"
      theme="tomorrow"
      value={markdown}
      defaultLanguage="markdown"
      defaultValue={defaultMarkdown}
      onChange={onMarkdownChange}
      beforeMount={monaco => {
        monaco.editor.defineTheme('tomorrow', theme as any);
      }}
      options={{
        fontFamily: 'CabinSketch',
        fontSize: 16,
        padding: {
          top: 8,
        },
        minimap: {
          enabled: false,
        },
        guides: {
          indentation: false,
        },
        occurrencesHighlight: false,
        selectionHighlight: false,
        renderLineHighlight: 'none',
      }}
    />
  );
}
