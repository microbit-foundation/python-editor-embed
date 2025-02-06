import React from 'react';
import withEditorInterface, { EditorProps } from './withEditorInterface';

const testSelector = 'python-editor-frame';

const getPythonEditorBaseUrl = (version: string) => {
  const parts = version.split('.');
  if (parts[0] === '0' || parts[0] === '1' || parts[0] === '2') {
    // Legacy version requiring the per version deployment.
    const versionPart = encodeURIComponent(version.replace(/[.]/g, '-'));
    return `https://python-editor-${versionPart}.microbit.org`;
  }
  return `https://python.microbit.org/v/${version}`;
};

const createPythonEditorURL = (
  version: string,
  lang: string | undefined,
  controller: number | undefined,
  queryParams: Record<string, string> | undefined
) => {
  const url = new URL(getPythonEditorBaseUrl(version));
  if (lang) {
    url.searchParams.set('l', lang);
  }
  if (controller) {
    url.searchParams.set('controller', controller.toString());
  }
  if (queryParams) {
    for (const [k, v] of Object.entries(queryParams)) {
      url.searchParams.set(k, v);
    }
  }
  return url.toString();
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
  controller = 1,
  style,
  queryParams,
}: EditorProps) => (
  <div style={{ ...styles.editor, ...style }}>
    <iframe
      ref={editorRef}
      data-testid={testSelector}
      title="Python editor"
      src={url || createPythonEditorURL(version, lang, controller, queryParams)}
      style={styles.iframe}
      allow="usb; clipboard-read; clipboard-write"
    />
  </div>
);

export default withEditorInterface({
  host: 'pyeditor',
  editor: 'pyeditor',
})(PythonEditor);
