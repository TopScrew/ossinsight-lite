export const Widget = () => import('./Markdown');
export const ConfigureComponent = () => import('./MarkdownEditor');
export const NewButton = () => import('./NewButton');

export const duplicable = true;
export const styleConfigurable = true;

export const defaultProps = {
  markdown: '# Hello OSSInsight Lite!',
};

// defaultRect?: Rect;
// defaultProps?: Partial<P>,

// export const category = '';
export const displayName = 'Markdown';
