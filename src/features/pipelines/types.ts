/**
 * Pipeline interface representing a pipeline in Azure DevOps
 */
export interface Pipeline {
  id: number;
  name: string;
  folder: string;
  revision: number;
  url: string;
}

/**
 * Options for listing pipelines
 */
export interface ListPipelinesOptions {
  projectId: string;
  orderBy?: string;
  top?: number;
  continuationToken?: string;
}
