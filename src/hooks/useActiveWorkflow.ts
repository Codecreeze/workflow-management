import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveWorkflow } from '../redux/workflow/workflowSlice';
import { Workflow } from '../types';
import { RootState } from '../redux/store';

/**
 * Custom hook to access and update the current active workflow
 * This provides a shared workflow state between components like Dashboard and WorkflowEditor
 */
export function useActiveWorkflow() {
  const dispatch = useDispatch();
  const activeWorkflow = useSelector((state: RootState) => state.workflow.currentWorkflow);

  // Set the active workflow for sharing between components
  const setWorkflow = useCallback((workflow: Workflow) => {
    dispatch(setActiveWorkflow(workflow));
  }, [dispatch]);

  // Clear the active workflow
  const clearWorkflow = useCallback(() => {
    dispatch(setActiveWorkflow(null as any));
  }, [dispatch]);

  return {
    activeWorkflow,
    setWorkflow,
    clearWorkflow
  };
} 