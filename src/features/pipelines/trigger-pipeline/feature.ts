import { WebApi } from 'azure-devops-node-api';
import {
  AzureDevOpsError,
  AzureDevOpsAuthenticationError,
  AzureDevOpsResourceNotFoundError,
} from '../../../shared/errors';
import { defaultProject } from '../../../utils/environment';
import { Run, TriggerPipelineOptions } from '../types';

/**
 * Trigger a pipeline run
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for triggering a pipeline
 * @returns The run details
 */
export async function triggerPipeline(
  connection: WebApi,
  options: TriggerPipelineOptions,
): Promise<Run> {
  try {
    const pipelinesApi = await connection.getPipelinesApi();
    const {
      projectId = defaultProject,
      pipelineId,
      branch,
      variables,
      templateParameters,
      stagesToSkip,
      yamlOverride,
      previewRun,
      resources: customResources,
    } = options;

    // Prepare run parameters
    const runParameters: any = {};

    // Add variables
    if (variables) {
      runParameters.variables = variables;
    }

    // Add template parameters
    if (templateParameters) {
      runParameters.templateParameters = templateParameters;
    }

    // Add stages to skip
    if (stagesToSkip && stagesToSkip.length > 0) {
      runParameters.stagesToSkip = stagesToSkip;
    }

    // Add YAML override
    if (yamlOverride) {
      runParameters.yamlOverride = yamlOverride;
    }

    // Set preview mode
    if (previewRun) {
      runParameters.previewRun = true;
    }

    // Prepare resources (including branch)
    const resources: any = customResources || {};

    // If branch is provided and no custom repository resource exists, use 'self' repository
    if (branch && (!resources.repositories || !resources.repositories.self)) {
      resources.repositories = resources.repositories || {};
      resources.repositories.self = {
        refName: `refs/heads/${branch}`,
      };
    }

    // Only add resources to run parameters if not empty
    if (Object.keys(resources).length > 0) {
      runParameters.resources = resources;
    }

    // Call pipeline API to run pipeline
    let result;
    if (previewRun) {
      result = await pipelinesApi.preview(runParameters, projectId, pipelineId);
    } else {
      result = await pipelinesApi.runPipeline(
        runParameters,
        projectId,
        pipelineId,
      );
    }

    return result;
  } catch (error) {
    // Handle specific error types
    if (error instanceof AzureDevOpsError) {
      throw error;
    }

    // Check for specific error types and convert to appropriate Azure DevOps errors
    if (error instanceof Error) {
      if (
        error.message.includes('Authentication') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('401')
      ) {
        throw new AzureDevOpsAuthenticationError(
          `Failed to authenticate: ${error.message}`,
        );
      }

      if (
        error.message.includes('not found') ||
        error.message.includes('does not exist') ||
        error.message.includes('404')
      ) {
        throw new AzureDevOpsResourceNotFoundError(
          `Pipeline or project not found: ${error.message}`,
        );
      }
    }

    // Otherwise, wrap it in a generic error
    throw new AzureDevOpsError(
      `Failed to trigger pipeline: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
