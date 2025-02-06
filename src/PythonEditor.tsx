import React from 'react';
import withEditorInterface, { EditorProps } from './withEditorInterface';
import { generateUrlWithQueryParams } from './common';

const testSelector = 'python-editor-frame';

const pythonEditorUrl = (version: string) => {
  const parts = version.split('.');
  if (parts[0] === '0' || parts[0] === '1' || parts[0] === '2') {
    // Legacy version requiring the per version deployment.
    const versionPart = encodeURIComponent(version.replace(/[.]/g, '-'));
    return `https://python-editor-${versionPart}.microbit.org`;
  }
  return `https://python.microbit.org/v/${version}`;
};

const styles: Record<string, React.CSSProperties> = {
  editor: {
    display: 'flex',
    flexDirection: 'column',
  },
  iframe: {
    width: '100%',
    flexGrow: 1,
    border: 'none',
  },
};

const PythonEditor = ({
  url,
  editorRef,
  lang,
  version = '3',
  controller = true,
  style,
  queryParams,
}: EditorProps) => (
  <div style={{ ...styles.editor, ...style }}>
    <iframe
      ref={editorRef}
      data-testid={testSelector}
      title="Python editor"
      src={
        url ||
        generateUrlWithQueryParams(pythonEditorUrl(version), {
          l: lang,
          controller,
          ...queryParams,
        })
      }
      style={styles.iframe}
      allow="usb; clipboard-read; clipboard-write"
    />
  </div>
);

export default withEditorInterface({
  host: 'pyeditor',
  editor: 'pyeditor',
})(PythonEditor);
