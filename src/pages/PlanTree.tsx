import React, { useState, useCallback, useEffect } from 'react';
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
    Node,
    useNodesState,
    useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

// Testing set for the courses awaiting for the link to the backend

const initialProgramList = [
    { id: '1', name: 'Computer Science' },
    { id: '2', name: 'Data Science' },
];

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
    const [treeNodes, setTreeNodes, onNodesChange] = useNodesState(initialNodes);
    const [treeEdges, setTreeEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [courseList, setCourseList] = useState(initialCourseList); 
    const [selectedProgramme, setSelectedProgramme] = useState(null);

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

    const updatePrerequisiteStatus = useCallback(() => {
        // First update all nodes
        setTreeNodes((currentNodes) => 
            currentNodes.map((node) => {
                const course = courseList.find((c) => c.id === node.id);
                if (!course) return node;

                const hasMissingPrerequisites = course.prerequisites.some(
                    (prereqId) => !currentNodes.some((n) => n.id === prereqId)
                );

                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: course.name,
                        hasMissingPrerequisites,
                    },
                    style: hasMissingPrerequisites 
                        ? { backgroundColor: 'red', color: 'white' } 
                        : { backgroundColor: '#fff', color: '#000' },
                };
            })
        );

        // Then rebuild all edges
        setTreeEdges(() => {
            const newEdges = [];
                
            // Loop through all nodes in the tree
            treeNodes.forEach((node) => {
                const course = courseList.find((c) => c.id === node.id);
                if (course) {
                    // Add edges for each prerequisite that exists in the tree
                    course.prerequisites.forEach((prereqId) => {
                        if (treeNodes.some(n => n.id === prereqId)) {
                            newEdges.push({
                                id: `e${prereqId}-${course.id}`,
                                source: prereqId,
                                target: course.id,
                                animated: true,
                                type: 'smoothstep',
                            });
                        }
                    });
                }
            });

            return newEdges;
        });
    }, [courseList, treeNodes]);

    // Add this new effect to handle edge updates
    useEffect(() => {
        updatePrerequisiteStatus();
    }, [treeNodes, updatePrerequisiteStatus]);

    const removeCourseFromTree = useCallback((courseId) => {
        setTreeNodes((nodes) => nodes.filter((node) => node.id !== courseId));
    }, []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();
        const courseId = event.dataTransfer.getData('application/courseId');
        const course = courseList.find((c) => c.id === courseId);
        
        if (course) {
            // Get the drop position relative to the ReactFlow container
            const reactFlowBounds = event.currentTarget.getBoundingClientRect();
            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top
            };

            const hasMissingPrerequisites = course.prerequisites.some(
                (prereqId) => !isCourseInTree(prereqId)
            );

            const newNode = {
                id: course.id,
                data: { 
                    label: course.name, 
                    hasMissingPrerequisites, 
                },
                position: position,
                style: hasMissingPrerequisites 
                    ? { backgroundColor: 'red', color: 'white' } 
                    : { backgroundColor: '#fff', color: '#000' },
                draggable: true,
            };

            setTreeNodes((nodes) => [...nodes, newNode]);
        }
    }, [courseList, isCourseInTree]);

    const filteredCourses = selectedProgramme
        ? courseList.filter((course) => course.id == selectedProgramme)
        : courseList;

    return (
        <div className="flex flex-row max-h-full max-w-full">
            <div id="main-content" className="w-full flex flex-col">
                <header id="top-buttons" className="m-8 flex items-center justify-between">
                    <button id="user-identifier" className="bg-neutral-300 rounded-2xl text-2xl p-4">User</button>
                    <button id="notifications-button" className="bg-neutral-300 rounded-2xl text-2xl p-4">Notifications</button>
                </header>
                <main id="plan-tree" className="bg-neutral-300 rounded-3xl p-4 m-8">
                <div style={{ display: 'flex', height: '100vh' }}>
                    <div style={{ flex: 3, borderRight: '1px solid #ccc', padding: '10px' }}>
                        <h3>Programme Tree</h3>
                        <ReactFlowProvider>
                            <ReactFlow
                                nodes={treeNodes}
                                edges={treeEdges}
                                fitView
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onNodeClick={(_, node) => removeCourseFromTree(node.id)}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
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
                                    <div
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('application/courseId', course.id);
                                            e.dataTransfer.effectAllowed = 'move';
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: isCourseInTree(course.id) ? '#ddd' : '#4CAF50',
                                            color: isCourseInTree(course.id) ? '#666' : 'white',
                                            cursor: isCourseInTree(course.id) ? 'not-allowed' : 'grab',
                                            border: 'none',
                                            borderRadius: '4px',
                                            userSelect: 'none',
                                        }}
                                    >
                                        {course.name} {isCourseInTree(course.id) && '(In Tree)'}
                                    </div>
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
