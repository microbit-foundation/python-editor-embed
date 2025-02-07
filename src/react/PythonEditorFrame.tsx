import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  PythonEditorWorkspaceRequest,
  PythonProject,
} from '../vanilla/common.js';
import {
  createPythonEditorURL,
  Options,
  PythonEditorFrameDriver,
} from '../vanilla/python-editor-frame-driver.js';

const testSelector = 'python-editor-frame';

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
  initialProjects: () => Promise<PythonProject[]>;
  controllerId?: string;

  onWorkspaceLoaded?(event: PythonEditorWorkspaceRequest): void;
  onWorkspaceSync?(event: PythonEditorWorkspaceRequest): void;
  onWorkspaceSave?(event: PythonEditorWorkspaceRequest): void;
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
    initialProjects,
    onWorkspaceLoaded,
    onWorkspaceSave,
    onWorkspaceSync,
  } = props;
  const src = createPythonEditorURL(version, lang, controller, queryParams);
  const options = useMemo(
    () => ({
      initialProjects,
      controllerId,
      onWorkspaceLoaded,
      onWorkspaceSave,
      onWorkspaceSync,
    }),
    [
      controllerId,
      initialProjects,
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
