import React, { Ref } from 'react';
import { Subject, Subscription } from 'rxjs';
import { PythonProject } from './common';

export interface EditorProps {
  editorRef: Ref<HTMLIFrameElement>;
  url?: string;
  lang?: string;
  version?: string;
  controller?: 1 | 2;
  style?: React.CSSProperties;
  queryParams?: Record<string, string>;
  baseUrl?: string;
}

type EditorConfig = {
  host: string;
  editor: string;
};

export enum PythonEditorMessageAction {
  workspacesync = 'workspacesync',
  workspacesave = 'workspacesave',
  workspaceloaded = 'workspaceloaded',
  importproject = 'importproject',
}

export interface EditorMessageEvent extends MessageEvent {
  data: IframeEditorMessageData;
  source: MessageEventSource | null;
}

export type IframeEditorMessageData = {
  type: string;
  action: PythonEditorMessageAction;
  response?: boolean;
  resp?: object;
  project?: PythonProject;
  projects?: PythonProject[];
  hexData?: string;
  id?: string;
  // tslint:disable-next-line: no-any
  error?: unknown;
};

export type ActionListenerSubject = {
  action: string;
  response?: boolean;
  // startactivity - we should change the typing approach here
  path?: string;
  activityType?: 'tutorial' | 'example' | 'recipe';
  title?: string;
};

export type ResponseEmitterSubject = {
  data:
    | {
        resp: object;
      }
    | IframeEditorMessageData;
};

export type Props = {
  url?: string;
  /**
   * A unique ID that may be reflected in the underlying editor's analytics.
   * Micro:bit Educational Foundation usage should use the form
   * MicrobitXYZ where XYZ is the product/feature.
   */
  controllerId: string;
  onCodeChange?: (code: PythonProject) => void;
  initialCode: PythonProject;
  getWriter?: (writeFn: (code: PythonProject) => void) => void;
  actionListener?: Subject<ActionListenerSubject>;
  responseEmitter?: Subject<ResponseEmitterSubject>;
  style?: React.CSSProperties;
  // Editor config
  version?: string;
  controller?: 1 | 2;
  lang?: string;
  queryParams?: Record<string, string>;
  baseUrl?: string;
};

const withEditorInterface =
  (config: EditorConfig) => (Component: React.ComponentType<EditorProps>) =>
    class extends React.Component<Props> {
      createEditorRef = React.createRef<HTMLIFrameElement>();
      actionSubscription: Subscription | null = null;

      get editorRef(): null | Window {
        if (
          this.createEditorRef &&
          this.createEditorRef.current &&
          this.createEditorRef.current.contentWindow
        ) {
          return this.createEditorRef.current.contentWindow;
        }
        return null;
      }

      componentDidMount() {
        const { getWriter, actionListener } = this.props;
        getWriter && getWriter(this.sendCodeToEditor);
        window.addEventListener('message', this.receiveMessage);
        if (actionListener) {
          this.actionSubscription = actionListener.subscribe((data) => {
            this.triggerEditorAction(data);
          });
        }
      }

      componentWillUnmount() {
        window.removeEventListener('message', this.receiveMessage);
        this.actionSubscription && this.actionSubscription.unsubscribe();
      }

      triggerEditorAction = (data: ActionListenerSubject): void => {
        const msg = {
          id: Math.random().toString(),
          type: config.editor,
          ...data,
        };
        this.editorRef && this.editorRef.postMessage(msg, '*');
      };

      sendCodeToEditor = (code: PythonProject): void => {
        this.editorRef &&
          this.editorRef.postMessage(
            {
              type: config.editor,
              action: PythonEditorMessageAction.importproject,
              project: code,
            },
            '*'
          );
      };

      receiveMessage = (event: EditorMessageEvent): void | never => {
        if (!event.source || event.source !== this.editorRef) {
          return;
        }
        const { data } = event;

        if ('action' in data) {
          if (data.type !== config.host) {
            return;
          }
          switch (data.action) {
            case PythonEditorMessageAction.workspaceloaded:
              // Handle editor loaded
              break;

            case PythonEditorMessageAction.workspacesave:
              if (typeof data.project === 'undefined') {
                throw new Error('Missing project');
              }
              this.props.onCodeChange && this.props.onCodeChange(data.project);
              break;

            case PythonEditorMessageAction.workspacesync:
              this.editorRef &&
                this.editorRef.postMessage(
                  {
                    ...data,
                    projects: [this.props.initialCode],
                    controllerId: this.props.controllerId,
                  },
                  '*'
                );
              break;

            default:
            // Handle unsupported actions
          }

          if (data.type === config.host || data.type === config.editor) {
            this.props.responseEmitter &&
              this.props.responseEmitter.next({
                data,
              });
          }
        }
      };

      render(): JSX.Element {
        return (
          <Component
            controller={this.props.controller}
            lang={this.props.lang}
            version={this.props.version}
            style={this.props.style}
            url={this.props.url}
            editorRef={this.createEditorRef}
            queryParams={this.props.queryParams}
            baseUrl={this.props.baseUrl}
          />
        );
      }
    };

export default withEditorInterface;
