import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { PythonProject } from './common';
import {
  EditorWorkspaceRequest,
  Options,
  PythonEditorFrameDriver,
} from './python-editor-frame-driver';

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

export interface PythonEditorFrameProps
  extends React.ComponentPropsWithoutRef<'iframe'> {
  version?: string;
  lang?: string;
  controller?: 1 | 2;
  queryParams?: Record<string, string>;
  initialProject: () => Promise<PythonProject[]>;
  controllerId?: string;

  onWorkspaceLoaded?(event: EditorWorkspaceRequest): void;
  onWorkspaceSync?(event: EditorWorkspaceRequest): void;
  onWorkspaceSave?(event: EditorWorkspaceRequest): void;
}

const PythonEditorFrame = forwardRef<
  PythonEditorFrameDriver,
  PythonEditorFrameProps
>(function PythonEditor(props, ref) {
  const {
    lang,
    version = '3',
    controller = 1,
    controllerId,
    style,
    queryParams,
    initialProject,
    onWorkspaceLoaded,
    onWorkspaceSave,
    onWorkspaceSync,
  } = props;
  const src = createPythonEditorURL(version, lang, controller, queryParams);
  const options = useMemo(
    () => ({
      initialProject,
      controllerId,
      onWorkspaceLoaded,
      onWorkspaceSave,
      onWorkspaceSync,
    }),
    [
      controllerId,
      initialProject,
      onWorkspaceLoaded,
      onWorkspaceSave,
      onWorkspaceSync,
    ]
  );
  return (
    <div style={{ ...styles.editor, ...style }}>
      <PythonEditorFrameInner
        options={options}
        ref={ref}
        data-testid={testSelector}
        title="Python editor"
        src={src}
        style={styles.iframe}
        allow="usb; clipboard-read; clipboard-write"
      />
    </div>
  );
});

interface PythonEditorFrameInnerProps
  extends React.ComponentPropsWithoutRef<'iframe'> {
  options: Options;
}

const PythonEditorFrameInner = forwardRef<
  PythonEditorFrameDriver,
  PythonEditorFrameInnerProps
>(function PythonEditorFrameInner(props, ref) {
  const { options, style, ...rest } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // We keep a fixed driver (which has state for messages) and update its options as needed.
  const driverRef = useRef(
    new PythonEditorFrameDriver(options, () => iframeRef.current ?? undefined)
  );
  useEffect(() => {
    const driver = driverRef.current;
    driver.initialize();
    return () => {
      driver.dispose();
    };
  }, []);
  useEffect(() => {
    driverRef.current.setOptions(options);
  }, [options]);
  useImperativeHandle(ref, () => driverRef.current, []);

  return (
    <iframe
      ref={iframeRef}
      title="PythonEditor"
      style={{ ...styles.iframe, ...style }}
      allow="usb; autoplay; camera; microphone;"
      {...rest}
    />
  );
});

export default PythonEditorFrame;
