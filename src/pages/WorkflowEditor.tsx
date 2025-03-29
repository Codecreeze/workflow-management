import React, { useCallback, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  Viewport,
  ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  Tooltip,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SaveIcon from "@mui/icons-material/Save";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/Remove";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import SaveWorkflowModal from "../components/Modals/SaveWorkflowModal";
import { styles } from "../styles/WorkflowEditor.styles";
import ErrorBoundary from "../components/ErrorBoundary";
import { useActiveWorkflow } from "../hooks/useActiveWorkflow";

// Import custom components from @WorkflowDesigns
import { nodeTypes } from "../components/WorkflowDesigns/components/WorkflowNodes";
import { ButtonEdge } from "../components/WorkflowDesigns/components/ButtonEdge";
import { useWorkflowEditor } from "../components/WorkflowDesigns/hooks/useWorkflowEditor";

// Define edge types mapping
const edgeTypes = {
  buttonedge: ButtonEdge,
};

// Node types for the pre-defined sequence
const SEQUENTIAL_NODE_TYPES = [
  { type: "apicall", label: "API Call" },
  { type: "email", label: "Email" },
  { type: "textbox", label: "Text Box" },
];

const WorkflowEditorContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { activeWorkflow } = useActiveWorkflow();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [viewport, setViewportState] = useState<Viewport>({ x: 0, y: 0, zoom: 0.25 });
  const [currentSequentialNodeIndex, setCurrentSequentialNodeIndex] = useState(0);
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  
  // Use ReactFlow's built-in hooks
  const { fitView, zoomIn, zoomOut, setViewport, getViewport } = useReactFlow();
  
  // Use our custom hook for workflow editor state
  const {
    workflowName,
    workflowDescription,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodeBetween,
    saveWorkflow,
    zoom,
    onZoomChange,
    existingNodeTypes,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
    errorMessage,
  } = useWorkflowEditor();

  // Check if we have an active workflow from global state
  useEffect(() => {
    if (activeWorkflow && activeWorkflow.id === id) {
      console.log("Using active workflow from global state:", activeWorkflow.name);
    }
  }, [activeWorkflow, id]);

  // Format zoom value for tooltip
  const formatZoomPercent = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  // Handle when ReactFlow is loaded
  const onInit = useCallback((instance: ReactFlowInstance) => {
    // Store the instance for later use
    reactFlowInstanceRef.current = instance;
    
    // Properly center the workflow on load
    setTimeout(() => {
      instance.fitView({ 
        padding: 0.5,
        includeHiddenNodes: true,
        minZoom: 0.25,
        maxZoom: 1
      });
      
      // Update the viewport state after centering
      const newViewport = instance.getViewport();
      setViewportState(newViewport);
      onZoomChange(newViewport.zoom);
    }, 100);
  }, [onZoomChange]);

  // Setup event listener for node addition
  useEffect(() => {
    const reactFlowElem = document.querySelector('.react-flow');
    if (reactFlowElem) {
      const handleAddNodeBetween = (event: CustomEvent) => {
        const { source, target, nodeType, edgeId } = event.detail;
        addNodeBetween(source, target, nodeType, edgeId);
        
        // Update the sequential node index based on the node type that was added
        const nodeTypeIndex = SEQUENTIAL_NODE_TYPES.findIndex(
          item => item.type === nodeType
        );
        
        if (nodeTypeIndex !== -1) {
          // If it's the current index, increment it
          if (nodeTypeIndex === currentSequentialNodeIndex) {
            setCurrentSequentialNodeIndex(prev => 
              Math.min(prev + 1, SEQUENTIAL_NODE_TYPES.length)
            );
          } 
          // If it's an earlier index that wasn't used yet, we keep the current index
        }
        
        // Recenter flow after adding a node
        setTimeout(() => {
          if (reactFlowInstanceRef.current) {
            reactFlowInstanceRef.current.fitView({ 
              padding: 0.5,
              includeHiddenNodes: true,
              minZoom: 0.25,
              maxZoom: 1 
            });
            setViewportState(reactFlowInstanceRef.current.getViewport());
          }
        }, 150);
      };
      
      reactFlowElem.addEventListener('add-node-between', handleAddNodeBetween as EventListener);
      
      // Attach the addNodeBetween function to the instance for direct access
      (reactFlowElem as any).__reactFlowInstance = { addNodeBetween };
      
      return () => {
        reactFlowElem.removeEventListener('add-node-between', handleAddNodeBetween as EventListener);
      };
    }
  }, [addNodeBetween, currentSequentialNodeIndex]);

  // Reset sequential node index when nodes change due to undo/redo
  useEffect(() => {
    // Calculate what sequential node types are present in the workflow
    const nodeTypes = new Set(nodes.map(node => node.type));
    let newIndex = 0;
    
    // Count how many sequential nodes are already in the workflow
    SEQUENTIAL_NODE_TYPES.forEach((sequentialType, index) => {
      if (nodeTypes.has(sequentialType.type)) {
        newIndex = Math.max(newIndex, index + 1);
      }
    });
    
    // Update the index if it's different from current
    if (newIndex !== currentSequentialNodeIndex) {
      setCurrentSequentialNodeIndex(Math.min(newIndex, SEQUENTIAL_NODE_TYPES.length));
    }
  }, [nodes, currentSequentialNodeIndex]);

  // Handle zoom changes from slider
  const handleZoomChange = useCallback((_: Event, newValue: number | number[]) => {
    const newZoom = newValue as number;
    onZoomChange(newZoom);
    
    // Get current viewport center coordinates
    const currentViewport = getViewport();
    
    // Update the viewport with new zoom level while keeping the same center
    const updatedViewport = { ...currentViewport, zoom: newZoom };
    setViewport(updatedViewport);
    setViewportState(updatedViewport);
  }, [onZoomChange, setViewport, getViewport]);

  // Handle zoom in button
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(2, zoom + 0.1);
    onZoomChange(newZoom);
    zoomIn();
    
    // Update viewport state after zoom
    setTimeout(() => {
      setViewportState(getViewport());
    }, 50);
  }, [zoom, zoomIn, onZoomChange, getViewport]);

  // Handle zoom out button
  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(0.1, zoom - 0.1);
    onZoomChange(newZoom);
    zoomOut();
    
    // Update viewport state after zoom
    setTimeout(() => {
      setViewportState(getViewport());
    }, 50);
  }, [zoom, zoomOut, onZoomChange, getViewport]);

  // Update zoom state when viewport changes from ReactFlow
  useEffect(() => {
    const currentZoom = getViewport().zoom;
    if (Math.abs(currentZoom - zoom) > 0.001) {
      onZoomChange(currentZoom);
    }
  }, [getViewport, zoom, onZoomChange]);

  // Center the workflow content
  const centerContent = useCallback(() => {
    fitView({ 
      padding: 0.5,
      includeHiddenNodes: true,
      minZoom: 0.25,
      maxZoom: 1
    });
    
    // Update the viewport state after centering
    setTimeout(() => {
      setViewportState(getViewport());
    }, 50);
  }, [fitView, getViewport]);

  // Recenter on window resize
  useEffect(() => {
    const handleResize = () => {
      centerContent();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [centerContent]);

  // Recenter when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0) {
      // Don't immediately center - wait a bit to let animations complete
      const timer = setTimeout(() => {
        centerContent();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [nodes.length, edges.length, centerContent]);

  // Handle undo with recentering
  const handleUndo = useCallback(() => {
    undo();
    // Recenter after a short delay to allow state updates to complete
    setTimeout(() => {
      centerContent();
    }, 150);
  }, [undo, centerContent]);

  // Handle redo with recentering
  const handleRedo = useCallback(() => {
    redo();
    // Recenter after a short delay to allow state updates to complete
    setTimeout(() => {
      centerContent();
    }, 150);
  }, [redo, centerContent]);

  const handleSave = (name: string, description: string) => {
    // Save workflow with name and description
    saveWorkflow(name, description);
  };

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Paper sx={styles.titleContainer}>
          <Box sx={styles.backText} onClick={() => navigate("/dashboard")}>
            <ArrowBackIcon sx={styles.arrowIcon} />
            Go Back
          </Box>
          <Box sx={styles.divider} />
          <Typography sx={styles.title}>
            {(activeWorkflow?.name || workflowName) && (activeWorkflow?.name || workflowName) !== "Untitled"
              ? (activeWorkflow?.name || workflowName)
              : "Untitled"}
          </Typography>
        
          
          <Box
            sx={{ ...styles.saveIcon, cursor: "pointer" }}
            onClick={() => setSaveModalOpen(true)}
          >
            <SaveIcon fontSize="small" sx={{ color: "#000" }} />
          </Box>
        </Paper>
      </Box>

      {/* ReactFlow Container */}
      <Box sx={styles.flowContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          viewport={viewport}
          minZoom={0.1}
          maxZoom={2}
          zoomOnScroll={true}
          fitViewOptions={{ 
            padding: 0.5,
            includeHiddenNodes: true,
            minZoom: 0.25,
            maxZoom: 1
          }}
          onInit={onInit}
          onViewportChange={setViewportState}
          proOptions={{ hideAttribution: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <Background
            color="#ccc"
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
          />
        </ReactFlow>

        {/* Controls Panel with Undo/Redo */}
        <Box sx={styles.controlsPanel}>
          <IconButton 
            size="small" 
            sx={{
              ...styles.iconButton,
              opacity: canUndo ? 1 : 0.5,
              cursor: canUndo ? 'pointer' : 'not-allowed',
            }}
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <UndoIcon />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{
              ...styles.iconButton,
              opacity: canRedo ? 1 : 0.5,
              cursor: canRedo ? 'pointer' : 'not-allowed',
            }}
            onClick={handleRedo}
            disabled={!canRedo}
          >
            <RedoIcon />
          </IconButton>
        </Box>

        {/* Indicator for Nodes Left to Add */}
        <Box
          sx={{
            position: 'absolute',
            top: 15,
            right: 15,
            backgroundColor: 'white',
            padding: '8px 16px',
            borderRadius: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#333' }}>
            Nodes left: {Math.max(0, SEQUENTIAL_NODE_TYPES.length - currentSequentialNodeIndex)}/3
          </Typography>
        </Box>

        {/* Zoom Controls */}
        <Box sx={styles.zoomContainer}>
          <IconButton 
            size="small" 
            sx={styles.iconButton}
            onClick={handleZoomOut}
          >
            <ZoomOutIcon />
          </IconButton>
          <Slider
            value={zoom}
            onChange={handleZoomChange}
            min={0.1}
            max={2}
            step={0.01}
            sx={{
              ...styles.slider,
              '& .MuiSlider-track': {
                transition: 'none',
              },
              '& .MuiSlider-thumb': {
                transition: 'none',
              },
            }}
            valueLabelDisplay="auto"
            valueLabelFormat={formatZoomPercent}
          />
          <IconButton 
            size="small" 
            sx={styles.iconButton}
            onClick={handleZoomIn}
          >
            <ZoomInIcon />
          </IconButton>
        </Box>
      </Box>

      <SaveWorkflowModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSave}
        initialName={activeWorkflow?.name || workflowName}
        initialDescription={activeWorkflow?.description || workflowDescription}
        status={saveStatus}
        error={errorMessage}
      />
    </Box>
  );
};

const WorkflowEditor = () => (
  <ReactFlowProvider>
    <ErrorBoundary>
      <WorkflowEditorContent />
    </ErrorBoundary>
  </ReactFlowProvider>
);

export default WorkflowEditor;
