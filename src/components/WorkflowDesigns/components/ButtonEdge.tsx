import React, { useState, MouseEvent, useCallback, useContext, useRef, useEffect } from "react";
import {
  EdgeProps,
  getSmoothStepPath,
  BaseEdge,
  EdgeLabelRenderer,
  useReactFlow,
} from "@xyflow/react";
import {
  Paper,
  Box,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

// Node types available for adding
const NODE_TYPES = [
  { type: "apicall", label: "API Call" },
  { type: "email", label: "Email" },
  { type: "textbox", label: "Text Box" },
];

// Common Chip styles
const chipStyles = {
  height: 34,
  width: "auto", // Adjust width based on content
  borderRadius: "8px",
  borderWidth: "1px",
  padding: "8px 12px",
  gap: "8px",
  border: "1px solid #E0E0E0",
  background: "#FFFFFF",
  color: "black",
  "& .MuiChip-label": {
    fontFamily: "Poppins, sans-serif",
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "100%",
    letterSpacing: "0%",
    padding: 0,
    color: "black",
  }
};

// Disabled chip styles
const disabledChipStyles = {
  ...chipStyles,
  opacity: 0.5,
  background: "#F5F5F5",
  cursor: "not-allowed",
  pointerEvents: "none" as const,
  border: "1px solid #E0E0E0",
};

export function ButtonEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [showOptions, setShowOptions] = useState(false);
  const { getNodes } = useReactFlow();
  
  // Force rerender when menu is opened to get fresh node data
  const getNodesRef = useRef(getNodes);
  
  // Update ref when getNodes changes
  useEffect(() => {
    getNodesRef.current = getNodes;
  }, [getNodes]);

  // Calculate path and center position for the + button
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine which node types are already in the workflow
  const existingNodeTypes = React.useMemo(() => {
    // Use the ref to ensure we get the latest nodes data
    const nodes = getNodesRef.current();
    const types: Record<string, boolean> = {};
    
    nodes.forEach(node => {
      if (node.type && node.type !== 'start' && node.type !== 'end') {
        types[node.type] = true;
      }
    });
    
    return types;
  }, [showOptions]); // Re-calculate only when menu opens

  // Handle opening the menu
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowOptions((prev) => !prev);
  }, []);

  // Close the menu
  const handleCloseMenu = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowOptions(false);
  }, []);

  // Handle selecting a node type
  const handleNodeTypeSelect = useCallback(
    (nodeType: string) => {
      // Close the menu first to avoid React state update conflicts
      setShowOptions(false);

      // Use setTimeout to ensure the menu closing is processed before adding the node
      setTimeout(() => {
        // Get the parent element that has the addNodeBetween function
        const reactFlowInstance = document.querySelector(".react-flow");
        if (reactFlowInstance) {
          // Create a unique identifier to ensure different events don't conflict
          const eventDetail = { 
            source, 
            target, 
            nodeType, 
            edgeId: id,
            timestamp: Date.now() // Add timestamp to make each event unique
          };
          
          // Try direct function call first
          const addNodeBetweenFn = (reactFlowInstance as any).__reactFlowInstance?.addNodeBetween;
          if (typeof addNodeBetweenFn === "function") {
            addNodeBetweenFn(source, target, nodeType, id);
          } else {
            // Fallback to dispatching a custom event
            const event = new CustomEvent("add-node-between", {
              detail: eventDetail,
            });
            reactFlowInstance.dispatchEvent(event);
          }
        }
      }, 50); // Short delay to ensure UI updates first
    },
    [source, target, id]
  );

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <Box
          sx={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
            zIndex: 100,
          }}
        >
          <IconButton
            sx={{
              background: showOptions ? "#FDEBE9" : "#fff",
              borderRadius: "50%",
              border: showOptions ? "1px solid #EE3425" : "1px solid #4F4F4F",
              width: "24px",
              height: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              // add hover bg color
              "&:hover": {
                background: showOptions ? "#FDEBE9" : "#fff",
                borderRadius: "50%",
                border: showOptions ? "1px solid #EE3425" : "1px solid #4F4F4F",
              },
            }}
            className="no-pan"
            onClick={handleClick}
          >
            <AddIcon
              style={{ fontSize: 14, color: showOptions ? "#e35b5b" : "#666" }}
            />
          </IconButton>

          {showOptions && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: "10px",
                left: "30px",
                width: "180px",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                zIndex: 100,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "12px",
                  left: "-12px", // Position the arrow on the left side
                  width: "12px", // Arrow width
                  height: "6px", // Arrow height
                  borderRight: "12px solid #fff",
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                },
                // Add shadow for the arrow
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "11px",
                  left: "-13px", // Shadow is slightly larger
                  width: "13px",
                  height: "8px",
                  borderRight: "13px solid rgba(0,0,0,0.1)",
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  zIndex: -1,
                },
              }}
              onClick={(e) => e.stopPropagation()} // Prevent click from closing menu
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <span style={{ fontWeight: 500, fontSize: '14px' }}>Add Node</span>
                  <IconButton size="small" onClick={handleCloseMenu}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {NODE_TYPES.map((nodeType) => {
                    const isDisabled = existingNodeTypes[nodeType.type];
                    
                    return (
                      <Box 
                        key={nodeType.type} 
                        sx={{ 
                          width: nodeType.type === "textbox" ? '100%' : 'calc(50% - 4px)',
                          mt: nodeType.type === "textbox" ? 1 : 0
                        }}
                      >
                        <Tooltip 
                          title={isDisabled ? "Already added to workflow" : ""}
                          placement="top"
                        >
                          <div>
                            <Chip
                              label={nodeType.label}
                              variant="outlined"
                              onClick={isDisabled ? undefined : () => handleNodeTypeSelect(nodeType.type)}
                              sx={isDisabled ? disabledChipStyles : chipStyles}
                              disabled={isDisabled}
                            />
                          </div>
                        </Tooltip>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      </EdgeLabelRenderer>
    </>
  );
}
