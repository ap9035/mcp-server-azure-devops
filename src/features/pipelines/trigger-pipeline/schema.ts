import { z } from 'zod';
import { defaultProject } from '../../../utils/environment';

/**
 * Schema for the triggerPipeline function
 */
export const TriggerPipelineSchema = z.object({
  // The project containing the pipeline
  projectId: z
    .string()
    .optional()
    .describe(`The ID or name of the project (Default: ${defaultProject})`),
  // The ID of the pipeline to trigger
  pipelineId: z
    .number()
    .int()
    .positive()
    .describe('The numeric ID of the pipeline to trigger'),
  // The branch to run the pipeline on
  branch: z
    .string()
    .optional()
    .describe(
      'The branch to run the pipeline on (e.g., "main", "feature/my-branch")',
    ),
  // Variables to pass to the pipeline run
  variables: z
    .record(
      z.object({
        value: z.string(),
        isSecret: z.boolean().optional().default(false),
      }),
    )
    .optional()
    .describe('Variables to pass to the pipeline run'),
  // Parameters for template-based pipelines
  templateParameters: z
    .record(z.string())
    .optional()
    .describe('Parameters for template-based pipelines'),
  // Stages to skip in the pipeline run
  stagesToSkip: z
    .array(z.string())
    .optional()
    .describe('Stages to skip in the pipeline run'),
  // YAML override for preview runs
  yamlOverride: z
    .string()
    .optional()
    .describe('YAML override to use for this run (for preview runs only)'),
  // Whether to preview the run without actually running it
  previewRun: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'If true, only preview the run without actually running the pipeline',
    ),
});
