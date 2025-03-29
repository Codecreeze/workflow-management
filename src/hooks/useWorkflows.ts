import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { RootState } from '../redux/store';

export function useWorkflows() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Get static workflows from Redux store as fallback
  const staticWorkflows = useSelector((state: RootState) => state.workflow.workflows);
  
  // Get all workflows
  const { 
    data: workflowsData, 
    isLoading: isLoadingWorkflows, 
    isError: isWorkflowsError,
    error: workflowsError,
    refetch: refetchWorkflows 
  } = useGetWorkflowsQuery();

  // Set API error when fetch fails
  useEffect(() => {
    if (isWorkflowsError && workflowsError) {
      setApiError(handleApiError(workflowsError));
    } else {
      setApiError(null);
    }
  }, [isWorkflowsError, workflowsError]);

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

  // Use static data from Redux if API fails, otherwise use API data
  const effectiveWorkflows = isWorkflowsError ? staticWorkflows : (workflowsData?.workflows || []);

  return {
    // Data
    workflows: effectiveWorkflows,
    totalWorkflows: effectiveWorkflows.length,
    selectedWorkflow: isSelectedError ? null : selectedWorkflow,
    selectedWorkflowId,
    
    // Loading states
    isLoading: isLoadingWorkflows || isLoadingSelected,
    isCreating,
    isUpdating,
    isDeleting,
    isPatching,
    
    // Error states
    isError: isWorkflowsError || isSelectedError,
    error: apiError || selectedError,
    
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