import { RefObject } from 'react';
import { PythonEditorFrameDriver } from '../python-editor-frame-driver';
import React from 'react';
import { defaultPythonProject } from './fixtures';

const toolbarRowStyle = {
  fontFamily: 'sans-serif',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
  margin: '10px 0',
} as const;

const PythonEditorToolbar = ({
  driver,
}: {
  driver: RefObject<PythonEditorFrameDriver>;
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={toolbarRowStyle}>
        <button
          onClick={() =>
            driver.current!.importProject({
              project: defaultPythonProject,
            })
          }
        >
          Import project
        </button>
      </div>
    </div>
  );
};

export default PythonEditorToolbar;
