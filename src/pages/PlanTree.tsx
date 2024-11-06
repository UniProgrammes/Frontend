import React, { useState, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    MiniMap,
    Controls,
    Background,
    NodeChange,
    EdgeChange,
    Connection,
    Edge,
    Node
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
    { id: '1', type: 'input', data: { label: 'Program' }, position: { x: 250, y: 5 } },
    { id: '2', data: { label: 'Course 1' }, position: { x: 100, y: 100 } },
    { id: '3', data: { label: 'Course 2' }, position: { x: 400, y: 100 } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
];

function PlanTree() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => nds.map((node) => {
            const change = changes.find((c) => c.id === node.id);
            return change ? { ...node, ...change } : node;
        }));
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => eds.map((edge) => {
            const change = changes.find((c) => c.id === edge.id);
            return change ? { ...edge, ...change } : edge;
        }));
    }, []);

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge(connection, eds));
    }, []);

    return (
        <div className="flex flex-row max-h-full max-w-full">
            <nav id="side-bar" className="bg-purple-500 w-1/5">
                <h1 className="p-8 pl-4 text-3xl text-white font-bold">UniProgrammes</h1>
                <div>
                    <h2 className="m-4 text-white">MENU</h2>
                    <ul>
                        <button className="block text-xl w-11/12 m-4 h-10 text-left p-2 rounded-lg text-white bg-purple-600">Dashboard</button>
                        <button className="block text-xl w-11/12 m-4 h-10 text-left p-2 rounded-lg text-white bg-purple-800">Create Plan</button>
                        <button className="block text-xl w-11/12 m-4 h-auto text-left p-2 rounded-lg text-white bg-purple-600">View Programme & Courses</button>
                        <button className="block text-xl w-11/12 m-4 h-10 text-left p-2 rounded-lg text-white bg-purple-600">Profile</button>
                        <button className="block text-xl w-11/12 m-4 h-10 text-left p-2 rounded-lg text-white bg-purple-600">Help</button>
                    </ul>
                </div>
                <button className="absolute bottom-4 left-4 bg-neutral-800 text-white rounded-lg w-24 h-12">EN</button>
            </nav>
            <div id="main-content" className="w-full flex flex-col">
                <header id="top-buttons" className="m-8 flex items-center justify-between">
                    <button id="user-identifier" className="bg-neutral-300 rounded-2xl text-2xl p-4">User</button>
                    <button id="notifications-button" className="bg-neutral-300 rounded-2xl text-2xl p-4">Notifications</button>
                </header>
                <main id="plan-tree" className="bg-neutral-300 rounded-3xl p-4 m-8">
                    <ReactFlowProvider>
                        <div style={{ width: '100%', height: '500px' }}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                fitView
                            >
                                <MiniMap />
                                <Controls />
                                <Background />
                            </ReactFlow>
                        </div>
                    </ReactFlowProvider>
                </main>
            </div>
        </div>
    );
}

export default PlanTree;
