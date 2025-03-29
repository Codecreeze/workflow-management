import { useState, useCallback } from 'react';
import { 
  useGetWorkflowsQuery,
  useGetWorkflowByIdQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  usePatchWorkflowMutation
} from '../redux/api/workflowApi';
import { Workflow } from '../types';
import { handleApiError } from '../utils/apiUtils';

export function useWorkflows() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  
  // Get all workflows
  const { 
    data: workflowsData, 
    isLoading: isLoadingWorkflows, 
    isError: isWorkflowsError,
    error: workflowsError,
    refetch: refetchWorkflows 
  } = useGetWorkflowsQuery();

  // Get a specific workflow by ID
  const {
    data: selectedWorkflow,
    isLoading: isLoadingSelected,
    isError: isSelectedError,
    error: selectedError,
    refetch: refetchSelected
  } = useGetWorkflowByIdQuery(selectedWorkflowId || '', { 
    skip: !selectedWorkflowId,
  });

  // Mutations
  const [createWorkflow, { isLoading: isCreating }] = useCreateWorkflowMutation();
  const [updateWorkflow, { isLoading: isUpdating }] = useUpdateWorkflowMutation();
  const [deleteWorkflow, { isLoading: isDeleting }] = useDeleteWorkflowMutation();
  const [patchWorkflow, { isLoading: isPatching }] = usePatchWorkflowMutation();

  // Select a workflow by ID
  const selectWorkflow = useCallback((id: string) => {
    setSelectedWorkflowId(id);
  }, []);

  // Clear selected workflow
  const clearSelectedWorkflow = useCallback(() => {
    setSelectedWorkflowId(null);
  }, []);

  // Handle creating a new workflow
  const handleCreateWorkflow = useCallback(async (newWorkflow: Partial<Workflow>) => {
    try {
      const result = await createWorkflow(newWorkflow).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: handleApiError(error as any) 
      };
    }
  }, [createWorkflow]);

  // Handle updating a workflow
  const handleUpdateWorkflow = useCallback(async (workflow: Workflow) => {
    try {
      const result = await updateWorkflow(workflow).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: handleApiError(error as any) 
      };
    }
  }, [updateWorkflow]);

  // Handle deleting a workflow
  const handleDeleteWorkflow = useCallback(async (id: string) => {
    try {
      await deleteWorkflow(id).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: handleApiError(error as any) 
      };
    }
  }, [deleteWorkflow]);

  // Handle patching a workflow (partial update)
  const handlePatchWorkflow = useCallback(async (id: string, changes: Partial<Workflow>) => {
    try {
      const result = await patchWorkflow({ id, changes }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: handleApiError(error as any) 
      };
    }
  }, [patchWorkflow]);

  // Utility function to refresh data
  const refreshData = useCallback(() => {
    refetchWorkflows();
    if (selectedWorkflowId) {
      refetchSelected();
    }
  }, [refetchWorkflows, refetchSelected, selectedWorkflowId]);

  return {
    // Data
    workflows: workflowsData?.workflows || [],
    totalWorkflows: workflowsData?.total || 0,
    selectedWorkflow,
    selectedWorkflowId,
    
    // Loading states
    isLoading: isLoadingWorkflows || isLoadingSelected,
    isCreating,
    isUpdating,
    isDeleting,
    isPatching,
    
    // Error states
    isError: isWorkflowsError || isSelectedError,
    error: workflowsError || selectedError,
    
    // Actions
    selectWorkflow,
    clearSelectedWorkflow,
    createWorkflow: handleCreateWorkflow,
    updateWorkflow: handleUpdateWorkflow,
    deleteWorkflow: handleDeleteWorkflow,
    patchWorkflow: handlePatchWorkflow,
    refreshData,
  };
} 