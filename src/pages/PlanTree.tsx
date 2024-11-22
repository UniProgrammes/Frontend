
import React, { useState, useCallback, useEffect } from "react";

import ELK from "elkjs/lib/elk.bundled.js";
import ReactFlow, { ReactFlowProvider,MiniMap,Background, Controls, Node, Edge} from "reactflow";

import "reactflow/dist/style.css";

// Initial data
const initialCourseList = [
    { id: "2", name: "Data Structures", prerequisites: ["1"], year: 1, hasMissingPrerequisites: false },
    { id: "3", name: "Algorithms", prerequisites: ["1"], year: 1, hasMissingPrerequisites: false },
    { id: "4", name: "Databases", prerequisites: ["2"], year: 2, hasMissingPrerequisites: false },
    { id: "5", name: "Operating Systems", prerequisites: ["2"], year: 2, hasMissingPrerequisites: false },
    { id: "7", name: "Operating Systems 2", prerequisites: ["5"], year: 3, hasMissingPrerequisites: false },
    { id: "6", name: "Databases 2", prerequisites: ["4"], year: 3, hasMissingPrerequisites: false },
    { id: "9", name: "Distributed Systems", prerequisites: ["5"], year: 3, hasMissingPrerequisites: false },
    { id: "10", name: "Coding", prerequisites: ["1"], year: 1, hasMissingPrerequisites: false },
    { id: "8", name: "Parallel Programming", prerequisites: ["10"], year: 3, hasMissingPrerequisites: false },
];

const undeletableNodes = ["1"];

const initialNodes = [
    {
        id: "1",
        type: "input",
        data: { label: "Program" },
        position: { x: 250, y: 5 }
    },
];

const initialEdges: Edge[] | (() => Edge[]) = [];

// ELK instance
const elk = new ELK();

// Helper function to layout the nodes using ELK
const getLayoutedElements = async (nodes: Node[], edges: Edge[]) => {
    const elkNodes = nodes.map((node: { id: string; }) => ({
        id: node.id,
        width: 150,
        height: 50,
    }));

    const elkEdges = edges.map((edge: { id: string; source: string; target: string; }) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
    }));

    const layoutOptions = {
        "elk.algorithm": "layered", // Layered algorithm for hierarchical layouts
        "elk.direction": "DOWN", // Layout direction: top to bottom
        "elk.layered.spacing.nodeNodeBetweenLayers": "50", // Spacing between layers
        "elk.spacing.nodeNode": "25", // Spacing between nodes in the same layer
        "elk.layered.spacing.nodeNodeBetweenConnectedNodes": "25", // Spacing between connected nodes
        "elk.layered.considerModelOrder": "true", // Consider the model order
        "elk.layered.crossingMinimization.semiInteractive": "true", // Minimize crossings
        "elk.layered.thoroughness": "5", // Thoroughness level
    };

    const graph = {
        id: "root",
        layoutOptions: layoutOptions,
        children: elkNodes,
        edges: elkEdges,
    };

    const layout = await elk.layout(graph);

    const layoutedNodes: Node[] = nodes.map((node: Node) => {
        const layoutNode = layout.children?.find((n) => n.id === node.id);

        if (!layoutNode) return node;

        return {
            ...node,
            position: {
                x: layoutNode.x || 0,
                y: layoutNode.y || 0,
            },
            draggable: false, // Prevent manual dragging since we're using automatic layout
        };
    });

    const treeNodes: Node[] = layoutedNodes;

    return { nodes: treeNodes, edges };
};

function App() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [courseList] = useState(initialCourseList);

    // Function to check if a course is already in the tree
    const isCourseInTree = useCallback(
        (courseId: string) => nodes.some((node) => node.id === courseId),
        [nodes]
    );

    // Function to update node styles based on prerequisites
    const updateNodeStyles = useCallback(
        (nodesToUpdate: Node[]) => {
            return nodesToUpdate.map((node: { id: string; }) => {
                const course = courseList.find((c) => c.id === node.id);
                if (course) {
                    const hasMissingPrerequisites = course.prerequisites.some(
                        (preId) => !isCourseInTree(preId) || course.hasMissingPrerequisites
                    );
                    return {
                        ...node,
                        style: hasMissingPrerequisites
                            ? { backgroundColor: "red", color: "white" }
                            : { backgroundColor: "#fff", color: "#000" },
                    };
                }
                return node;
            });
        },
        [courseList, isCourseInTree]
    );

    // Function to handle drop event
    const onDrop = useCallback(
        async (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const courseId = event.dataTransfer?.getData("application/courseId");
            const course = courseList.find((c) => c.id === courseId);

            if (!course) return;

            if (isCourseInTree(course.id)) {
                alert("Course already in tree");
                return;
            }

            const newNode = {
                id: course.id,
                data: { label: course.name },
                position: { x: 0, y: 0 }, // Position will be updated by ELK
            };

            const newEdges = [...edges];

            // Add edges to prerequisites if they exist
            course.prerequisites.forEach((preId) => {
                if (isCourseInTree(preId)) {
                    newEdges.push({
                        id: `e${preId}-${course.id}`,
                        source: preId,
                        target: course.id,
                        animated: false,
                        type: "smoothstep",
                        style: { stroke: "black", strokeDasharray: 0, strokeWidth: 2 }
                    });
                }
            });

            // Add edges from the course to its dependent nodes
            nodes.forEach((node) => {
                const nodeCourse = courseList.find((c) => c.id === node.id);
                if (nodeCourse && nodeCourse.prerequisites.includes(course.id)) {
                    newEdges.push({
                        id: `e${course.id}-${node.id}`,
                        source: course.id,
                        target: node.id,
                        animated: false,
                        type: "smoothstep",
                        style: { stroke: "black", strokeDasharray: 0, strokeWidth: 2 }
                    });
                }
            });

            // Update nodes and edges
            const newNodes = [...nodes, newNode];

            // Re-layout the graph
            const layoutedElements = await getLayoutedElements(newNodes, newEdges);

            // Update node styles
            const styledNodes = updateNodeStyles(layoutedElements.nodes);

            //@ts-expect-error - setNodes expect the parsed type of the styledNodes
            setNodes(styledNodes);
            setEdges(layoutedElements.edges);
        },
        [nodes, edges, courseList, isCourseInTree, updateNodeStyles]
    );

    // Function to handle drag over event
    const onDragOver = (event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    // Function to handle node deletion
    const onNodeClick = useCallback(
        async (event: React.MouseEvent, node: { id: string; }) => {
            const nodeId = node.id;

            if (undeletableNodes.includes(nodeId)) return;
            // Remove node and connected edges
            const newNodes = nodes.filter((n) => n.id !== nodeId);
            const newEdges = edges.filter(
                (e) => e.source !== nodeId && e.target !== nodeId
            );
            // Re-layout the graph
            const layoutedElements = await getLayoutedElements(newNodes, newEdges);
            // Update node styles
            const styledNodes = updateNodeStyles(layoutedElements.nodes);
            
            //@ts-expect-error - setNodes expect the parsed type of the styledNodes
            setNodes(styledNodes);
            setEdges(layoutedElements.edges);
        },
        [nodes, edges, updateNodeStyles]
    );
    // Update node styles when nodes or edges change
    useEffect(() => {
        const updateStyles = async () => {
            // Re-layout the graph
            const layoutedElements = await getLayoutedElements(nodes, edges);
            const styledNodes = updateNodeStyles(layoutedElements.nodes);
            
            //@ts-expect-error - setNodes expect the parsed type of the styledNodes
            setNodes(styledNodes);
            setEdges(layoutedElements.edges);
        };
        updateStyles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edges]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* React Flow Canvas */}
            <div style={{ flexGrow: 1 }}>
                <ReactFlowProvider>
                    <div
                        style={{ width: "100%", height: "100%" }}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                    >
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodeClick={onNodeClick}
                            nodesDraggable={true} // Ensure this is set to true
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            fitView
                        >
                            <MiniMap position="top-right" />
                            <Controls position="top-left"
                                showInteractive={false} />
                            <Background />
                        </ReactFlow>
                    </div>
                </ReactFlowProvider>
            </div>
            {/* Sidebar */}
            <div style={{ width: "200px", padding: "10px", borderLeft: "1px solid #ccc" }}>
                <h3>Available Courses</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {courseList.map((course) => (
                        <li key={course.id} style={{ marginBottom: "8px" }}>
                            <div
                                draggable={!isCourseInTree(course.id)}
                                onDragStart={(e) => {
                                    e.dataTransfer.setData("application/courseId", course.id);
                                    e.dataTransfer.effectAllowed = "move";
                                }}
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: isCourseInTree(course.id) ? "#ddd" : "#4CAF50",
                                    color: isCourseInTree(course.id) ? "#666" : "white",
                                    cursor: isCourseInTree(course.id) ? "not-allowed" : "grab",
                                    border: "none",
                                    borderRadius: "4px",
                                    userSelect: "none",
                                }}
                            >
                                <p>
                                    {course.name}
                                </p>
                                <p> {isCourseInTree(course.id) && "(In Tree)"} </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>


        </div>
    );
}

export default App;
