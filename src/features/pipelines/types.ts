// Re-export the Pipeline interface from the Azure DevOps API
import {
  Pipeline,
  Run,
} from 'azure-devops-node-api/interfaces/PipelinesInterfaces';

/**
 * Options for listing pipelines
 */
export interface ListPipelinesOptions {
  projectId: string;
  orderBy?: string;
  top?: number;
  continuationToken?: string;
}

/**
 * Options for getting a pipeline
 */
export interface GetPipelineOptions {
  projectId: string;
  organizationId?: string;
  pipelineId: number;
  pipelineVersion?: number;
}

/**
 * Options for triggering a pipeline
 */
export interface TriggerPipelineOptions {
  projectId: string;
  pipelineId: number;
  branch?: string;
  variables?: Record<string, { value: string; isSecret?: boolean }>;
  templateParameters?: Record<string, string>;
  stagesToSkip?: string[];
  yamlOverride?: string;
  previewRun?: boolean;
  resources?: {
    repositories?: Record<
      string,
      {
        refName?: string;
        version?: string;
        repository?: {
          id?: string;
          name?: string;
          type?: string;
        };
      }
    >;
    pipelines?: Record<
      string,
      {
        version?: string;
        pipeline?: {
          id?: number;
          name?: string;
        };
      }
    >;
  };
}

export { Pipeline, Run };
