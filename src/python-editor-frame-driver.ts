import { PythonProject } from './common';

export interface Options {
  /**
   * A function that provides the initial set of projects to be used when initialising MakeCode.
   *
   * This will also be used if the iframe reloads itself.
   *
   */
  initialProject: () => Promise<PythonProject[]>;

  /**
   * Set this to a value representing your app.
   */
  controllerId?: string;

  /**
   * Called when the workspace is ready to sync.
   */
  onWorkspaceSync?(event: EditorWorkspaceRequest): void;

  /**
   * Called when the workspace sync is complete.
   */
  onWorkspaceLoaded?(event: EditorWorkspaceRequest): void;

  /**
   * Implement this to update the data store that `initialProjects` reads from.
   */
  onWorkspaceSave?(event: EditorWorkspaceRequest): void;
}

export interface EditorWorkspaceRequest {
  action: 'workspacesync' | 'workspacesave' | 'workspaceloaded';
  project: PythonProject;
  type: 'pyeditor';
}

export interface ImportProjectOptions {
  // project to load
  project: PythonProject;
}

export interface EditorMessageImportProjectRequest
  extends ImportProjectOptions {
  type: 'pyeditor';
  action: 'importproject';
  response?: boolean;
  id?: string;
}

export class PythonEditorFrameDriver {
  private ready = false;
  private messageQueue: Array<unknown> = [];
  private nextId = 0;
  private pendingResponses = new Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (value: unknown) => void;
      message: unknown;
    }
  >();

  constructor(
    private options: Options,
    private iframe: () => HTMLIFrameElement | undefined
  ) {}

  initialize() {
    window.addEventListener('message', this.listener);
    // If the iframe is already loaded this will ensure we still initialize correctly
    this.iframe()?.contentWindow?.postMessage(
      {
        type: 'iframeclientready',
      },
      '*'
    );
  }

  dispose() {
    window.removeEventListener('message', this.listener);
  }

  setOptions(options: Options) {
    this.options = options;
  }

  private _expectedOrigin: string | undefined;
  private expectedOrigin = () => {
    if (this._expectedOrigin) {
      return this._expectedOrigin;
    }
    const src = this.iframe()?.src;
    if (src) {
      this._expectedOrigin = new URL(src).origin;
      return this._expectedOrigin;
    }
    return undefined;
  };

  private listener = (event: MessageEvent) => {
    const expectedOrigin = this.expectedOrigin();
    if (!expectedOrigin || event.origin !== expectedOrigin) {
      return;
    }
    const { data } = event;
    if (typeof data !== 'object') {
      return;
    }

    if (data.type === 'iframeclientready' || data.type === 'pyeditor') {
      this.ready = true;
      this.messageQueue.forEach((m) => this.sendMessageNoReadyCheck(m));
      this.messageQueue.length = 0;
    }

    if (data.type !== 'pyeditor') {
      return;
    }

    this.handleWorkspaceSync(data);
    switch (data.action) {
      case 'workspacesave': {
        return this.options.onWorkspaceSave?.(data as EditorWorkspaceRequest);
      }
      case 'workspacesync': {
        return this.options.onWorkspaceSync?.(data as EditorWorkspaceRequest);
      }
      case 'workspaceloaded': {
        return this.options.onWorkspaceLoaded?.(data as EditorWorkspaceRequest);
      }
    }
  };

  /**
   * Import a project.
   */
  async importProject(options: ImportProjectOptions): Promise<void> {
    await this.sendRequest({
      type: 'pyeditor',
      action: 'importproject',
      ...options,
    });
  }

  private sendRequest = (
    message: EditorMessageImportProjectRequest
  ): Promise<unknown> => {
    message.response = true;
    if (!message.id) {
      message.id = (this.nextId++).toString();
    }
    const id = message.id;
    const p = new Promise((resolve, reject) => {
      this.pendingResponses.set(id, { resolve, reject, message });
    });
    this.sendMessage(message);
    return p;
  };

  private sendMessage = (message: unknown) => {
    if (this.ready) {
      this.sendMessageNoReadyCheck(message);
    } else {
      this.messageQueue.push(message);
    }
  };

  private sendMessageNoReadyCheck = (message: unknown) => {
    this.iframe()?.contentWindow?.postMessage(message, '*');
  };

  private async handleWorkspaceSync(event: EditorWorkspaceRequest) {
    try {
      if (event.action === 'workspacesync') {
        const projects = await this.options.initialProject();
        this.sendMessageNoReadyCheck({
          ...event,
          success: true,
          projects,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}
