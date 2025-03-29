import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkflowStep {
  id: string;
  type: 'start' | 'end' | 'api' | 'email' | 'condition';
  position: { x: number; y: number };
  data?: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  lastEdited: string;
  editor: string;
  status: 'passed' | 'failed' | 'pending';
  nodes: WorkflowStep[];
  edges: WorkflowEdge[];
}

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  loading: boolean;
  error: string | null;
}

// Mock data
const initialState: WorkflowState = {
  workflows: [
    {
      id: '494',
      name: 'Customer Onboarding Process',
      description: 'Handles new customer registration and account setup',
      lastEdited: 'Zubin Khanna | 22:43 IST - 28/05',
      editor: 'Zubin Khanna',
      status: 'passed',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
    {
      id: '495',
      name: 'Payment Processing Workflow',
      description: 'Handles transaction processing and payment verification',
      lastEdited: 'Amita Patel | 14:22 IST - 27/05',
      editor: 'Amita Patel',
      status: 'failed',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
    {
      id: '496',
      name: 'Data Synchronization Flow',
      description: 'Synchronizes data between multiple system databases',
      lastEdited: 'Rahul Sharma | 09:15 IST - 28/05',
      editor: 'Rahul Sharma',
      status: 'pending',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
    {
      id: '497',
      name: 'Document Approval System',
      description: 'Manages approval chains for important documents',
      lastEdited: 'Neha Gupta | 17:30 IST - 25/05',
      editor: 'Neha Gupta',
      status: 'passed',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
    {
      id: '498',
      name: 'Inventory Management Process',
      description: 'Tracks inventory levels and triggers reorder alerts',
      lastEdited: 'Vijay Mehta | 11:45 IST - 26/05',
      editor: 'Vijay Mehta',
      status: 'failed',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
    {
      id: '499',
      name: 'Customer Support Ticketing',
      description: 'Manages support ticket assignment and resolution',
      lastEdited: 'Priya Singh | 08:20 IST - 29/05',
      editor: 'Priya Singh',
      status: 'pending',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
    {
      id: '500',
      name: 'Email Campaign Automation',
      description: 'Schedules and triggers marketing email campaigns',
      lastEdited: 'Arjun Kapoor | 16:10 IST - 29/05',
      editor: 'Arjun Kapoor',
      status: 'passed',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
    {
      id: '501',
      name: 'New User Verification Flow',
      description: 'Handles identity verification for new users',
      lastEdited: 'Kiran Rao | 10:05 IST - 24/05',
      editor: 'Kiran Rao',
      status: 'failed',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
    {
      id: '502',
      name: 'Subscription Renewal Process',
      description: 'Manages subscription expiry and renewal notifications',
      lastEdited: 'Deepak Kumar | 13:40 IST - 27/05',
      editor: 'Deepak Kumar',
      status: 'pending',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
    {
      id: '503',
      name: 'Order Fulfillment Workflow',
      description: 'Tracks order processing from start to delivery',
      lastEdited: 'Ananya Das | 18:15 IST - 28/05',
      editor: 'Ananya Das',
      status: 'passed',
      nodes: [
        { id: '1', type: 'start', position: { x: 250, y: 5 } },
        { id: '2', type: 'end', position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ]
    },
  ],
  currentWorkflow: null,
  loading: false,
  error: null,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setCurrentWorkflow: (state, action: PayloadAction<string>) => {
      state.currentWorkflow = state.workflows.find(
        (workflow) => workflow.id === action.payload
      ) || null;
    },
    setActiveWorkflow: (state, action: PayloadAction<Workflow>) => {
      state.currentWorkflow = action.payload;
    },
    addWorkflow: (state, action: PayloadAction<Workflow>) => {
      state.workflows.push(action.payload);
    },
    updateWorkflow: (state, action: PayloadAction<Workflow>) => {
      const index = state.workflows.findIndex(
        (workflow) => workflow.id === action.payload.id
      );
      if (index !== -1) {
        state.workflows[index] = action.payload;
        if (state.currentWorkflow?.id === action.payload.id) {
          state.currentWorkflow = action.payload;
        }
      }
    },
    addNode: (state, action: PayloadAction<{ workflowId: string; node: WorkflowStep }>) => {
      const { workflowId, node } = action.payload;
      const workflow = state.workflows.find((w) => w.id === workflowId);
      if (workflow) {
        workflow.nodes.push(node);
        if (state.currentWorkflow?.id === workflowId) {
          state.currentWorkflow.nodes.push(node);
        }
      }
    },
    updateNode: (state, action: PayloadAction<{ workflowId: string; nodeId: string; updates: Partial<WorkflowStep> }>) => {
      const { workflowId, nodeId, updates } = action.payload;
      const workflow = state.workflows.find((w) => w.id === workflowId);
      if (workflow) {
        const nodeIndex = workflow.nodes.findIndex((n) => n.id === nodeId);
        if (nodeIndex !== -1) {
          workflow.nodes[nodeIndex] = { ...workflow.nodes[nodeIndex], ...updates };
          if (state.currentWorkflow?.id === workflowId) {
            const currentNodeIndex = state.currentWorkflow.nodes.findIndex(
              (n) => n.id === nodeId
            );
            if (currentNodeIndex !== -1) {
              state.currentWorkflow.nodes[currentNodeIndex] = {
                ...state.currentWorkflow.nodes[currentNodeIndex],
                ...updates,
              };
            }
          }
        }
      }
    },
    deleteNode: (state, action: PayloadAction<{ workflowId: string; nodeId: string }>) => {
      const { workflowId, nodeId } = action.payload;
      const workflow = state.workflows.find((w) => w.id === workflowId);
      if (workflow) {
        workflow.nodes = workflow.nodes.filter((n) => n.id !== nodeId);
        workflow.edges = workflow.edges.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        );
        if (state.currentWorkflow?.id === workflowId) {
          state.currentWorkflow.nodes = state.currentWorkflow.nodes.filter(
            (n) => n.id !== nodeId
          );
          state.currentWorkflow.edges = state.currentWorkflow.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          );
        }
      }
    },
    addEdge: (state, action: PayloadAction<{ workflowId: string; edge: WorkflowEdge }>) => {
      const { workflowId, edge } = action.payload;
      const workflow = state.workflows.find((w) => w.id === workflowId);
      if (workflow) {
        workflow.edges.push(edge);
        if (state.currentWorkflow?.id === workflowId) {
          state.currentWorkflow.edges.push(edge);
        }
      }
    },
    deleteEdge: (state, action: PayloadAction<{ workflowId: string; edgeId: string }>) => {
      const { workflowId, edgeId } = action.payload;
      const workflow = state.workflows.find((w) => w.id === workflowId);
      if (workflow) {
        workflow.edges = workflow.edges.filter((e) => e.id !== edgeId);
        if (state.currentWorkflow?.id === workflowId) {
          state.currentWorkflow.edges = state.currentWorkflow.edges.filter(
            (e) => e.id !== edgeId
          );
        }
      }
    },
  },
});

export const {
  setCurrentWorkflow,
  setActiveWorkflow,
  addWorkflow,
  updateWorkflow,
  addNode,
  updateNode,
  deleteNode,
  addEdge,
  deleteEdge,
} = workflowSlice.actions;

export default workflowSlice.reducer; 