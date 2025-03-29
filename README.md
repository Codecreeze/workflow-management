# Workflow Management System

A modern workflow management system that allows users to create, edit, and execute workflows with various components like API calls and email notifications.

## Features

### Workflow List View
- Display list of workflows with status
- Search functionality by name or ID
- Status indicators (passed/failed)
- Single-click execution with warning modal
- Edit existing workflows
- Create new workflows

### Workflow Creator
- Clear starting point for new workflows
- Define start and end points
- Add multiple step types (API calls, emails, etc.)
- Connect steps in logical sequence
- Delete workflow steps
- Save progress functionality
- Flowchart visualization
- Zoom in/out capability
- Canvas movement/panning

## Technologies Used

- React (v19)
- TypeScript
- Material UI (v7)
- Redux Toolkit
- React Router DOM (v7)
- @xyflow/react for workflow visualization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/workflow-management.git
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Login**: Use any email/password to log in (authentication is simulated)
2. **Dashboard**: View, search, and manage your workflows
3. **Create Workflow**: Click "Create New Process" to build a new workflow
4. **Edit Workflow**: Click "Edit" on any workflow to modify its structure
5. **Execute Workflow**: Click "Execute" to run a workflow (simulated functionality)

## Project Structure

```
workflow-management/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   └── store.ts
│   ├── components/
│   │   ├── CustomNodes.tsx
│   │   └── Layout.tsx
│   ├── features/
│   │   └── workflow/
│   │       └── workflowSlice.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── WorkflowEditor.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as part of an interview test.
- UI design inspired by modern workflow management tools.
