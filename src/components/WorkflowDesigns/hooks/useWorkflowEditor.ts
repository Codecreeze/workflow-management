import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { 
  Connection, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Node,
  Edge,
  XYPosition,
  NodeTypes,
  NodeChange,
  EdgeChange
} from "@xyflow/react";
import { useParams } from "react-router-dom";
import { useUpdateWorkflowMutation, useGetWorkflowByIdQuery, useCreateWorkflowMutation } from "../../../redux/api/workflowApi";
import { handleApiError } from "../../../utils/apiUtils";
import { Workflow } from "../../../types";
import { useActiveWorkflow } from "../../../hooks/useActiveWorkflow";

// Define the node data type
export interface WorkflowNodeData {
  label: string;
  onDelete?: (event: React.MouseEvent) => void;
  [key: string]: any; // Allow additional properties
}

// Define history state interface
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

// Initial nodes setup
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'start',
    position: { x: 0, y: 0 },
    data: { label: 'Start' },
  },
  {
    id: 'end',
    type: 'end',
    position: { x: 0, y: 200 }, // Shorter distance
    data: { label: 'End' },
  },
];

// Initial edges setup
const initialEdges: Edge[] = [
  {
    id: 'start-end',
    source: 'start',
    target: 'end',
    type: 'buttonedge',
  },
];

// Node dimensions
const NODE_DIMENSIONS = {
  width: 300,
  height: 64,
};

export const useWorkflowEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { activeWorkflow } = useActiveWorkflow();
  
  // Initialize with active workflow data if available, otherwise use defaults
  const [workflowName, setWorkflowName] = useState(activeWorkflow?.name || "Untitled");
  const [workflowDescription, setWorkflowDescription] = useState(activeWorkflow?.description || "");
  
  // Initialize with active workflow nodes/edges if available
  const initialNodesValue = activeWorkflow?.nodes?.length 
    ? activeWorkflow.nodes.map(node => ({
        ...node,
        data: node.data || { label: node.type }, // Ensure data property exists
      })) as Node[] 
    : initialNodes;
    
  const initialEdgesValue = activeWorkflow?.edges?.length 
    ? activeWorkflow.edges.map(edge => ({
        ...edge,
        // Add buttonedge type for ReactFlow
        type: 'buttonedge' 
      })) as Edge[] 
    : initialEdges;
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesValue);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesValue);
  const [zoom, setZoom] = useState<number>(0.25); // Initial zoom set to 25%
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // State for history management
  const [history, setHistory] = useState<HistoryState[]>([{ 
    nodes: initialNodesValue as Node[], 
    edges: initialEdgesValue as Edge[] 
  }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isHistoryChanging = useRef(false);

  // RTK Query hooks
  const [updateWorkflow, { isLoading: isUpdating }] = useUpdateWorkflowMutation();
  const [createWorkflow, { isLoading: isCreating }] = useCreateWorkflowMutation();

  // Fetch workflow data if editing an existing workflow
  const { 
    data: existingWorkflow, 
    isLoading: isLoadingWorkflow,
    isError: isWorkflowError,
    error: workflowError
  } = useGetWorkflowByIdQuery(id || '', { 
    skip: !id,
  });

  // Initialize editor with existing workflow data if available
  useEffect(() => {
    if (existingWorkflow) {
      setWorkflowName(existingWorkflow.name);
      setWorkflowDescription(existingWorkflow.description);
      
      // Update nodes and edges if they exist
      if (existingWorkflow.nodes && existingWorkflow.nodes.length > 0) {
        // Convert workflow nodes to ReactFlow nodes
        const reactFlowNodes = existingWorkflow.nodes.map(node => ({
          ...node,
          data: node.data || { label: node.type },
        })) as Node[];
        
        setNodes(reactFlowNodes);
        
        // Convert workflow edges to ReactFlow edges
        const reactFlowEdges = existingWorkflow.edges.map(edge => ({
          ...edge,
          type: 'buttonedge',
        })) as Edge[];
        
        setEdges(reactFlowEdges);
        
        // Reset history with converted nodes and edges
        setHistory([{ 
          nodes: reactFlowNodes, 
          edges: reactFlowEdges 
        }]);
        setHistoryIndex(0);
      }
    }
  }, [existingWorkflow, setNodes, setEdges]);

  // Track which node types are already in the workflow
  const existingNodeTypes = useMemo(() => {
    const types: Record<string, boolean> = {};
    nodes.forEach(node => {
      if (node.type && node.type !== 'start' && node.type !== 'end') {
        types[node.type] = true;
      }
    });
    return types;
  }, [nodes]);

  // Add current state to history
  const addToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    if (isHistoryChanging.current) return;
    
    // Create deep copies to avoid reference issues
    const nodesCopy = JSON.parse(JSON.stringify(newNodes));
    const edgesCopy = JSON.parse(JSON.stringify(newEdges));
    
    setHistory(prev => {
      // Remove any forward history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      // Only add if state is different from the last history entry
      if (newHistory.length === 0 || 
          JSON.stringify(newHistory[newHistory.length - 1].nodes) !== JSON.stringify(nodesCopy) || 
          JSON.stringify(newHistory[newHistory.length - 1].edges) !== JSON.stringify(edgesCopy)) {
        return [...newHistory, { nodes: nodesCopy, edges: edgesCopy }];
      }
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Custom nodes change handler with history
  const onNodesChangeWithHistory = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    // Don't use nested callback as it can cause issues with timing
    const updatedNodes = [...nodes];
    // Only add to history for meaningful changes
    if (changes.some((change: NodeChange) => change.type !== 'select' && change.type !== 'position')) {
      addToHistory(updatedNodes, edges);
    }
  }, [onNodesChange, nodes, edges, addToHistory]);

  // Custom edges change handler with history
  const onEdgesChangeWithHistory = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    // Don't use nested callback as it can cause issues with timing
    const updatedEdges = [...edges];
    // Only add to history for meaningful changes
    if (changes.some((change: EdgeChange) => change.type === 'remove')) {
      addToHistory(nodes, updatedEdges);
    }
  }, [onEdgesChange, nodes, edges, addToHistory]);

  // Handler for connections with history
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge({ ...connection, type: 'buttonedge' }, eds);
        // Update history after connection is made
        setTimeout(() => {
          addToHistory(nodes, newEdges);
        }, 50);
        return newEdges;
      });
    },
    [setEdges, nodes, addToHistory]
  );

  // Add a node between two existing nodes with history
  const addNodeBetween = useCallback(
    (sourceNodeId: string, targetNodeId: string, nodeType: string, edgeId: string) => {
      // Get the source and target node positions
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      const targetNode = nodes.find((n) => n.id === targetNodeId);

      if (!sourceNode || !targetNode) return;

      // Calculate the position for the new node
      const newPosition: XYPosition = {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      };

      // Create a unique ID for the new node
      const newNodeId = `${nodeType}-${Date.now()}`;

      // Add the new node
      const newNode: Node = {
        id: newNodeId,
        type: nodeType,
        position: newPosition,
        style: {
          width: NODE_DIMENSIONS.width,
          height: NODE_DIMENSIONS.height,
          background: '#FFFFFF',
          border: '1px solid #849E4C',
          borderRadius: '8px',
          borderWidth: '1px',
        },
        data: { 
          label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
          onDelete: (event: React.MouseEvent) => {
            event.stopPropagation();
            // Remove this node and reconnect source and target
            setNodes((nds) => {
              const filteredNodes = nds.filter((n) => n.id !== newNodeId);
              setEdges((eds) => {
                // Get the edges connected to this node
                const incomingEdge = eds.find((e) => e.target === newNodeId);
                const outgoingEdge = eds.find((e) => e.source === newNodeId);
                
                if (incomingEdge && outgoingEdge) {
                  // Create a new edge connecting source and target
                  const newEdge: Edge = {
                    id: `${incomingEdge.source}-${outgoingEdge.target}`,
                    source: incomingEdge.source,
                    target: outgoingEdge.target,
                    type: 'buttonedge',
                  };
                  
                  const updatedEdges = [...eds.filter((e) => e.source !== newNodeId && e.target !== newNodeId), newEdge];
                  // Schedule history update after state changes are applied
                  setTimeout(() => {
                    addToHistory(filteredNodes, updatedEdges);
                  }, 50);
                  return updatedEdges;
                }
                
                const updatedEdges = eds.filter((e) => e.source !== newNodeId && e.target !== newNodeId);
                // Schedule history update after state changes are applied
                setTimeout(() => {
                  addToHistory(filteredNodes, updatedEdges);
                }, 50);
                return updatedEdges;
              });
              return filteredNodes;
            });
          }
        },
      };

      // Add space between nodes for better visualization
      // Create a copy of nodes with adjusted positions
      const adjustedNodes = nodes.map(node => {
        // Move target node and any nodes below it down to make room
        if (node.id === targetNodeId || 
           (node.position.y >= targetNode.position.y && node.id !== sourceNodeId)) {
          return {
            ...node,
            position: {
              ...node.position,
              y: node.position.y + 100 // Move down by 100 pixels
            }
          };
        }
        return node;
      });

      // Update nodes with the adjusted positions first
      setNodes(adjustedNodes);
      
      // Remove the existing edge and add two new edges
      setEdges((eds) => {
        const updatedEdges = eds.filter((e) => e.id !== edgeId);
        
        const sourceToNew: Edge = {
          id: `${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          type: 'buttonedge',
        };
        
        const newToTarget: Edge = {
          id: `${newNodeId}-${targetNodeId}`,
          source: newNodeId,
          target: targetNodeId,
          type: 'buttonedge',
        };
        
        const newEdges = [...updatedEdges, sourceToNew, newToTarget];
        
        // Add the new node after edges are updated
        setTimeout(() => {
          setNodes((nds) => {
            const newNodes = [...nds, newNode];
            
            // Update history with both new nodes and edges
            addToHistory(newNodes, newEdges);
            
            return newNodes;
          });
        }, 50);
        
        return newEdges;
      });
    },
    [nodes, setNodes, setEdges, addToHistory]
  );

  // Undo/redo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isHistoryChanging.current = true;
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
      // Reset the flag after the state update
      setTimeout(() => {
        isHistoryChanging.current = false;
      }, 50);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isHistoryChanging.current = true;
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
      // Reset the flag after the state update
      setTimeout(() => {
        isHistoryChanging.current = false;
      }, 50);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Save workflow to API
  const saveWorkflow = useCallback(async (name?: string, description?: string) => {
    setSaveStatus('saving');
    setErrorMessage(null);
    
    try {
      // Convert ReactFlow nodes to workflow nodes
      const workflowNodes = nodes.map(node => ({
        id: node.id,
        type: node.type as 'start' | 'end' | 'api' | 'email' | 'condition',
        position: node.position,
        data: node.data,
      }));
      
      // Convert ReactFlow edges to workflow edges
      const workflowEdges = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      }));
      
      const workflowData: Partial<Workflow> = {
        name: name || workflowName,
        description: description || workflowDescription,
        nodes: workflowNodes as any,
        edges: workflowEdges as any,
        lastEdited: new Date().toISOString(),
        editor: "Current User", // This should come from auth context in a real app
        status: 'pending',
      };
      
      let result;
      
      if (id) {
        // Update existing workflow
        result = await updateWorkflow({
          ...workflowData,
          id,
        } as Workflow).unwrap();
      } else {
        // Create new workflow
        result = await createWorkflow({
          ...workflowData,
          id: `workflow-${Date.now()}`, // Generate a temporary ID for new workflows
        }).unwrap();
      }
      
      setSaveStatus('success');
      return result;
    } catch (error) {
      console.error('Error saving workflow:', error);
      setSaveStatus('error');
      setErrorMessage(handleApiError(error as any));
      return null;
    }
  }, [
    workflowName, 
    workflowDescription, 
    nodes, 
    edges, 
    id, 
    updateWorkflow, 
    createWorkflow
  ]);

  // Handle zoom change
  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  return {
    // State
    workflowName,
    workflowDescription,
    nodes,
    edges,
    saveModalOpen,
    zoom,
    saveStatus,
    errorMessage,
    isLoading: isLoadingWorkflow || isUpdating || isCreating,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    existingNodeTypes,
    
    // Setters
    setWorkflowName,
    setWorkflowDescription,
    setSaveModalOpen,
    onZoomChange,
    
    // Actions
    onNodesChange: onNodesChangeWithHistory,
    onEdgesChange: onEdgesChangeWithHistory,
    onConnect,
    addNodeBetween,
    undo,
    redo,
    saveWorkflow,
  };
}; 