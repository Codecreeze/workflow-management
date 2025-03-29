import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Workflow } from '../workflow/workflowSlice';

// Define API base URL from Beeceptor
const API_BASE_URL = 'https://workflow-management.free.beeceptor.com';

// Define response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface WorkflowListResponse {
  workflows: Workflow[];
  total: number;
}

// Create the API service with RTK Query
export const workflowApi = createApi({
  reducerPath: 'workflowApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Workflow'],
  endpoints: (builder) => ({
    // Get all workflows
    getWorkflows: builder.query<WorkflowListResponse, void>({
      query: () => '/workflows',
      transformResponse: (response: Workflow[]): WorkflowListResponse => {
        return {
          workflows: response,
          total: response.length,
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.workflows.map(({ id }) => ({ type: 'Workflow' as const, id })),
              { type: 'Workflow', id: 'LIST' },
            ]
          : [{ type: 'Workflow', id: 'LIST' }],
    }),
    
    // Get a single workflow by ID
    getWorkflowById: builder.query<Workflow, string>({
      query: (id) => `/workflows/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workflow', id }],
    }),
    
    // Create a new workflow
    createWorkflow: builder.mutation<Workflow, Partial<Workflow>>({
      query: (workflow) => ({
        url: '/workflows',
        method: 'POST',
        body: workflow,
      }),
      invalidatesTags: [{ type: 'Workflow', id: 'LIST' }],
    }),
    
    // Update an existing workflow
    updateWorkflow: builder.mutation<Workflow, Workflow>({
      query: (workflow) => ({
        url: `/workflows/${workflow.id}`,
        method: 'PUT',
        body: workflow,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Workflow', id },
        { type: 'Workflow', id: 'LIST' },
      ],
    }),
    
    // Delete a workflow
    deleteWorkflow: builder.mutation<void, string>({
      query: (id) => ({
        url: `/workflows/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Workflow', id },
        { type: 'Workflow', id: 'LIST' },
      ],
    }),
    
    // Partial update of a workflow
    patchWorkflow: builder.mutation<Workflow, { id: string, changes: Partial<Workflow> }>({
      query: ({ id, changes }) => ({
        url: `/workflows/${id}`,
        method: 'PATCH',
        body: changes,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Workflow', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetWorkflowsQuery,
  useGetWorkflowByIdQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  usePatchWorkflowMutation,
} = workflowApi; 