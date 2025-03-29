import { WorkflowStep, WorkflowEdge, Workflow } from '../redux/workflow/workflowSlice';
import { workflowApi } from '../redux/api/workflowApi';

export interface AppState {
  workflow: {
    workflows: Workflow[];
    currentWorkflow: Workflow | null;
    loading: boolean;
    error: string | null;
  };
  [workflowApi.reducerPath]: ReturnType<typeof workflowApi.reducer>;
}

export type { WorkflowStep, WorkflowEdge, Workflow }; 