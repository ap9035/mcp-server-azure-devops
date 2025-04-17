# Pipeline Tools

This document describes the tools available for working with Azure DevOps pipelines.

## Table of Contents

- [`list_pipelines`](#list_pipelines) - List pipelines in a project
- [`get_pipeline`](#get_pipeline) - Get details of a specific pipeline
- [`trigger_pipeline`](#trigger_pipeline) - Trigger a pipeline run

## list_pipelines

Lists pipelines in a project.

### Parameters

| Parameter   | Type   | Required | Description                                               |
| ----------- | ------ | -------- | --------------------------------------------------------- |
| `projectId` | string | No       | The ID or name of the project (Default: from environment) |
| `orderBy`   | string | No       | Order by field and direction (e.g., "createdDate desc")   |
| `top`       | number | No       | Maximum number of pipelines to return                     |

### Response

Returns an array of pipeline objects:

```json
{
  "count": 2,
  "value": [
    {
      "id": 4,
      "revision": 2,
      "name": "Node.js build pipeline",
      "folder": "\\",
      "url": "https://dev.azure.com/organization/project/_apis/pipelines/4"
    },
    {
      "id": 1,
      "revision": 1,
      "name": "Sample Pipeline",
      "folder": "\\",
      "url": "https://dev.azure.com/organization/project/_apis/pipelines/1"
    }
  ]
}
```

### Error Handling

- Returns `AzureDevOpsResourceNotFoundError` if the project does not exist
- Returns `AzureDevOpsAuthenticationError` if authentication fails
- Returns generic error messages for other failures

### Example Usage

```javascript
// Using default project from environment
const result = await callTool('list_pipelines', {});

// Specifying project and limiting results
const limitedResult = await callTool('list_pipelines', {
  projectId: 'my-project',
  top: 10,
  orderBy: 'name asc',
});
```

## get_pipeline

Gets details of a specific pipeline.

### Parameters

| Parameter         | Type   | Required | Description                                                       |
| ----------------- | ------ | -------- | ----------------------------------------------------------------- |
| `projectId`       | string | No       | The ID or name of the project (Default: from environment)         |
| `pipelineId`      | number | Yes      | The numeric ID of the pipeline to retrieve                        |
| `pipelineVersion` | number | No       | The version of the pipeline to retrieve (latest if not specified) |

### Response

Returns a pipeline object with the following structure:

```json
{
  "id": 4,
  "revision": 2,
  "name": "Node.js build pipeline",
  "folder": "\\",
  "url": "https://dev.azure.com/organization/project/_apis/pipelines/4",
  "_links": {
    "self": {
      "href": "https://dev.azure.com/organization/project/_apis/pipelines/4"
    },
    "web": {
      "href": "https://dev.azure.com/organization/project/_build/definition?definitionId=4"
    }
  },
  "configuration": {
    "path": "azure-pipelines.yml",
    "repository": {
      "id": "bd0e8130-7fba-4f3b-8559-54760b6e7248",
      "type": "azureReposGit"
    },
    "type": "yaml"
  }
}
```

### Error Handling

- Returns `AzureDevOpsResourceNotFoundError` if the pipeline or project does not exist
- Returns `AzureDevOpsAuthenticationError` if authentication fails
- Returns generic error messages for other failures

### Example Usage

```javascript
// Get latest version of a pipeline
const result = await callTool('get_pipeline', {
  pipelineId: 4,
});

// Get specific version of a pipeline
const versionResult = await callTool('get_pipeline', {
  projectId: 'my-project',
  pipelineId: 4,
  pipelineVersion: 2,
});
```

## trigger_pipeline

Triggers a run of a specific pipeline.

### Parameters

| Parameter            | Type                  | Required | Description                                                          |
| -------------------- | --------------------- | -------- | -------------------------------------------------------------------- |
| `projectId`          | string                | No       | The ID or name of the project (Default: from environment)            |
| `pipelineId`         | number                | Yes      | The numeric ID of the pipeline to trigger                            |
| `branch`             | string                | No       | The branch to run the pipeline on (e.g., "main", "feature/my-branch")|
| `variables`          | object                | No       | Variables to pass to the pipeline run                                |
| `templateParameters` | object                | No       | Parameters for template-based pipelines                              |
| `stagesToSkip`       | array                 | No       | Stages to skip in the pipeline run                                   |
| `yamlOverride`       | string                | No       | YAML override to use for this run (for preview runs only)            |
| `previewRun`         | boolean               | No       | If true, only preview the run without actually running the pipeline  |
| `resources`          | object                | No       | Custom resources configuration for repositories and pipelines        |

#### Variables Format

```json
{
  "myVariable": {
    "value": "my-value",
    "isSecret": false
  },
  "secretVariable": {
    "value": "secret-value",
    "isSecret": true
  }
}
```

#### Resources Format

```json
{
  "repositories": {
    "self": {
      "refName": "refs/heads/main"
    },
    "myRepo": {
      "repository": {
        "id": "repo-guid",
        "name": "my-repository",
        "type": "azureReposGit"
      },
      "refName": "refs/heads/feature/my-branch",
      "version": "main"
    }
  },
  "pipelines": {
    "myPipeline": {
      "pipeline": {
        "id": 5,
        "name": "Dependency Pipeline"
      },
      "version": "20220101.1"
    }
  }
}
```

### Response

Returns a run object with details about the triggered pipeline run:

```json
{
  "id": 12345,
  "name": "20230215.1",
  "createdDate": "2023-02-15T10:30:00Z",
  "url": "https://dev.azure.com/organization/project/_apis/pipelines/runs/12345",
  "_links": {
    "self": {
      "href": "https://dev.azure.com/organization/project/_apis/pipelines/runs/12345"
    },
    "web": {
      "href": "https://dev.azure.com/organization/project/_build/results?buildId=12345"
    }
  },
  "state": "inProgress",
  "result": null,
  "variables": {
    "myVariable": {
      "value": "my-value",
      "isSecret": false
    }
  }
}
```

### Error Handling

- Returns `AzureDevOpsResourceNotFoundError` if the pipeline or project does not exist
- Returns `AzureDevOpsAuthenticationError` if authentication fails
- Returns generic error messages for other failures

### Example Usage

```javascript
// Trigger a pipeline on the default branch
const result = await callTool('trigger_pipeline', {
  pipelineId: 4
});

// Trigger a pipeline on a specific branch with variables
const runWithOptions = await callTool('trigger_pipeline', {
  projectId: 'my-project',
  pipelineId: 4,
  branch: 'feature/my-branch',
  variables: {
    'deployEnvironment': {
      value: 'staging',
      isSecret: false
    }
  }
});

// Preview a pipeline run with specific stages to skip
const previewResult = await callTool('trigger_pipeline', {
  projectId: 'my-project',
  pipelineId: 4,
  previewRun: true,
  stagesToSkip: ['test', 'deploy']
});
```

