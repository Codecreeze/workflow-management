import React from "react";
import { NodeProps, Handle, Position } from "@xyflow/react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Define proper interface for node data
export interface WorkflowNodeData {
  label: string;
  onDelete?: (event: React.MouseEvent) => void;
}

// Custom Circle Node for Start (green)
export const StartNode = (props: NodeProps) => {
  const { data } = props;
  return (
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: "50%",
        backgroundColor: "#8ab86e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        border: "2px solid #8ab86e",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Handle type="source" position={Position.Bottom} />
      {(data as any)?.label || 'Start'}
    </div>
  );
};

// Custom Circle Node for End (red)
export const EndNode = (props: NodeProps) => {
  const { data } = props;
  return (
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: "50%",
        backgroundColor: "#e35b5b",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        border: "2px solid #e35b5b",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Handle type="target" position={Position.Top} />
      {(data as any)?.label || 'End'}
    </div>
  );
};

// Custom API Call Node
export const ApiCallNode = (props: NodeProps) => {
  const { data } = props;
  return (
    <div
      style={{
        width: 300,
        height: 64,
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #849E4C",
        borderWidth: "1px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 15px",
        }}
      >
        <div>API Call</div>
        {(data as any)?.onDelete && (
          <IconButton
            onClick={(e) => (data as any).onDelete(e)}
            size="small"
            sx={{
              color: "#ff4d4f",
              padding: "2px",
            }}
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
    <div
      style={{
        width: 300,
        height: 64,
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #849E4C",
        borderWidth: "1px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 15px",
        }}
      >
        <div>Email</div>
        {(data as any)?.onDelete && (
          <IconButton
            onClick={(e) => (data as any).onDelete(e)}
            size="small"
            sx={{
              color: "#ff4d4f",
              padding: "2px",
            }}
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
    <div
      style={{
        width: 300,
        height: 64,
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #849E4C",
        borderWidth: "1px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 15px",
        }}
      >
        <div>Text Box</div>
        {(data as any)?.onDelete && (
          <IconButton
            onClick={(e) => (data as any).onDelete(e)}
            size="small"
            sx={{
              color: "#ff4d4f",
              padding: "2px",
            }}
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