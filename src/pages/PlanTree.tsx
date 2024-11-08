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
import SideBar from '~/components/SideBar';

// Testing set for the courses awaiting for the link to the backend
const initialCourseList = [
    { id: '2', name: 'Data Structures', prerequisites: ['1'] },
    { id: '3', name: 'Algorithms', prerequisites: ['1'] },
    { id: '4', name: 'Databases', prerequisites: ['2'] },
    { id: '5', name: 'Operating Systems', prerequisites: ['2'] },
];

const initialNodes = [
    { id: '1', type: 'input', data: { label: 'Program' }, position: { x: 250, y: 5 } },
];

const initialEdges = [];


function PlanTree() {
    const [treeNodes, setTreeNodes] = useState<Node[]>(initialNodes);
    const [treeEdges, setTreeEdges] = useState<Edge[]>(initialEdges);
    const [courseList, setCourseList] = useState(initialCourseList); 

    const calculateDepth = (courseId, depthMap = {}) => {
        if (depthMap[courseId] !== undefined) return depthMap[courseId];
    
        const course = courseList.find((c) => c.id === courseId);
        if (!course) return 1;
    
        const depth = course.prerequisites.length
            ? Math.max(...course.prerequisites.map((prereqId) => calculateDepth(prereqId, depthMap))) + 1
            : 1;
    
        depthMap[courseId] = depth;
        return depth;
    };

    const calculatePosition = (course, depthCount) => {
        const depth = calculateDepth(course.id); 

        const yOffset = 100; 
        const yPos = (depth - 1) * yOffset;  
    
        const xOffset = 200; 
        const xPos = (depthCount[depth] || 0) * xOffset; 
        
        depthCount[depth] = (depthCount[depth] || 0) + 1;
    
        return { x: xPos, y: yPos }; 
    };
    
    
    const isCourseInTree = (courseId) => treeNodes.some((node) => node.id === courseId);

    const addCourseToTree = (course) => {
        if (isCourseInTree(course.id)) return;

        const depthCount = {}; 
        treeNodes.forEach((node) => {
            const nodeDepth = calculateDepth(node.id);
            depthCount[nodeDepth] = (depthCount[nodeDepth] || 0) + 1;
        });

        const newPosition = calculatePosition(course, depthCount);
        
        const hasMissingPrerequisites = course.prerequisites.some((prereqId) => !isCourseInTree(prereqId));

        const newNode = {
            id: course.id,
            data: { 
                label: course.name, 
                hasMissingPrerequisites, 
            },
            position: newPosition,
            style: hasMissingPrerequisites ? { backgroundColor: 'red', color: 'white' } : {},
        };

        const newEdges = course.prerequisites
            .filter((prereqId) => isCourseInTree(prereqId))
            .map((prereqId) => ({
                id: `e${prereqId}-${course.id}`,
                source: prereqId,
                target: course.id,
                animated: true,
            }));

        setTreeNodes((nodes) => nodes.concat(newNode));
        setTreeEdges((edges) => edges.concat(newEdges));
    };
    
    

    const removeCourseFromTree = (courseId) => {
        setTreeNodes((nodes) => nodes.filter((node) => node.id !== courseId));
        setTreeEdges((edges) => edges.filter((edge) => edge.source !== courseId && edge.target !== courseId));
    };

    return (
        <div className="flex flex-row max-h-full max-w-full">
            <SideBar />
            <div id="main-content" className="w-full flex flex-col">
                <header id="top-buttons" className="m-8 flex items-center justify-between">
                    <button id="user-identifier" className="bg-neutral-300 rounded-2xl text-2xl p-4">User</button>
                    <button id="notifications-button" className="bg-neutral-300 rounded-2xl text-2xl p-4">Notifications</button>
                </header>
                <main id="plan-tree" className="bg-neutral-300 rounded-3xl p-4 m-8">
                <div style={{ display: 'flex', height: '100vh' }}>
                    <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '10px' }}>
                        <h3>Programme Tree</h3>
                        <ReactFlowProvider>
                            <ReactFlow
                                nodes={treeNodes}
                                edges={treeEdges}
                                fitView
                                onNodeClick={(_, node) => removeCourseFromTree(node.id)}
                            >
                                <MiniMap />
                                <Controls />
                                <Background />
                            </ReactFlow>
                        </ReactFlowProvider>
                    </div>

                    <div style={{ flex: 1, padding: '10px' }}>
                        <h3>Available Courses</h3>
                        <ul>
                            {courseList.map((course) => (
                                <li key={course.id} style={{ marginBottom: '8px' }}>
                                    <button
                                        onClick={() => addCourseToTree(course)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: isCourseInTree(course.id) ? '#ddd' : '#4CAF50',
                                            color: isCourseInTree(course.id) ? '#666' : 'white',
                                            cursor: isCourseInTree(course.id) ? 'not-allowed' : 'pointer',
                                            border: 'none',
                                            borderRadius: '4px',
                                        }}
                                        disabled={isCourseInTree(course.id)}
                                    >
                                        {course.name} {isCourseInTree(course.id) && '(In Tree)'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                </main>
            </div>
        </div>
    );
}

export default PlanTree;
