import React from "react";
import { NodeProps, Handle, Position } from "@xyflow/react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styles } from "../../../styles/WorkflowNodes.styles";

// Define proper interface for node data
export interface WorkflowNodeData {
  label: string;
  onDelete?: (event: React.MouseEvent) => void;
}

// Custom Circle Node for Start (green)
export const StartNode = (props: NodeProps) => {
  const { data } = props;
  return (
    <div style={styles.startNode}>
      <Handle type="source" position={Position.Bottom} />
      {(data as any)?.label || 'Start'}
    </div>
  );
};

// Custom Circle Node for End (red)
export const EndNode = (props: NodeProps) => {
  const { data } = props;
  return (
    <div style={styles.endNode}>
      <Handle type="target" position={Position.Top} />
      {(data as any)?.label || 'End'}
    </div>
  );
};

// Custom API Call Node
export const ApiCallNode = (props: NodeProps) => {
  const { data } = props;
  return (
    <div style={styles.genericNode}>
      <Handle type="target" position={Position.Top} />
      <div style={styles.nodeContent}>
        <div>API Call</div>
        {(data as any)?.onDelete && (
          <IconButton
            onClick={(e) => (data as any).onDelete(e)}
            size="small"
            sx={styles.deleteButton}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Custom Email Node
export const EmailNode = (props: NodeProps) => {
  const { data } = props;
  return (
    <div style={styles.genericNode}>
      <Handle type="target" position={Position.Top} />
      <div style={styles.nodeContent}>
        <div>Email</div>
        {(data as any)?.onDelete && (
          <IconButton
            onClick={(e) => (data as any).onDelete(e)}
            size="small"
            sx={styles.deleteButton}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Custom Text Box Node
export const TextBoxNode = (props: NodeProps) => {
  const { data } = props;
  return (
    <div style={styles.genericNode}>
      <Handle type="target" position={Position.Top} />
      <div style={styles.nodeContent}>
        <div>Text Box</div>
        {(data as any)?.onDelete && (
          <IconButton
            onClick={(e) => (data as any).onDelete(e)}
            size="small"
            sx={styles.deleteButton}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Export the node types mapping
export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  apicall: ApiCallNode,
  email: EmailNode,
  textbox: TextBoxNode,
}; 