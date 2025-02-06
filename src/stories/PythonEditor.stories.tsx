import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { defaultPythonProject, multiFilePythonProject } from '..';
import PythonEditor from '../PythonEditor';
import StoryWrapper from './StoryWrapper';
import { controllerId } from './config';

const meta: Meta<typeof PythonEditor> = {
  component: PythonEditor,
  argTypes: {
    version: {
      options: ['2.0.0', '2.2.2', '3', 'beta'],
      defaultValue: '2.0.0',
      name: 'version',
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PythonEditor>;

export const PythonEditorStory: Story = {
  name: 'Python Editor versions',
  args: {
    version: '3',
  },
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper>
        <PythonEditor
          controllerId={controllerId}
          style={{ flexGrow: 1 }}
          initialCode={defaultPythonProject}
          version={version}
        />
      </StoryWrapper>
    );
  },
};

// Broken out separately from the above to test the multiFilePythonProject.
// This should also work with the defaultPythonProject.
export const MultiFileProject: Story = {
  name: 'Python Editor multi-file project',
  render: () => (
    <StoryWrapper>
      <PythonEditor
        controllerId={controllerId}
        style={{ flexGrow: 1 }}
        initialCode={multiFilePythonProject}
        version="3"
      />
    </StoryWrapper>
  ),
};

export const V3French: Story = {
  name: 'Python Editor V3 lang via query string',
  render: () => (
    <StoryWrapper>
      <PythonEditor
        controllerId={controllerId}
        style={{ flexGrow: 1 }}
        initialCode={multiFilePythonProject}
        version="3"
        lang="fr"
      />
    </StoryWrapper>
  ),
};

export const V3NoLangFlag: Story = {
  name: 'Python Editor V3 noLang flag',
  render: () => (
    <StoryWrapper>
      <PythonEditor
        controllerId={controllerId}
        style={{ flexGrow: 1 }}
        initialCode={multiFilePythonProject}
        version="3"
        queryParams={{ flag: 'noLang' }}
      />
    </StoryWrapper>
  ),
};
