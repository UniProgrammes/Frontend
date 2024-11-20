
import React, { useState, useCallback, useEffect } from "react";

/* Open issue:
https://github.com/xyflow/xyflow/issues/4825
related to edge not showing up in the tree
import {
    ReactFlow,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    Controls,
    ControlButton,
    MiniMap,
    Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css"
import { MagicWandIcon } from "@radix-ui/react-icons"
*/
import { Controls } from "@xyflow/react";
import ELK, { LayoutOptions } from "elkjs/lib/elk.bundled.js";
import ReactFlow, {
    ReactFlowProvider,
    MiniMap,
    Background,
    useNodesState,
    useEdgesState,
    Edge,
    Node
} from "reactflow";
import "reactflow/dist/style.css";



const elk = new ELK();

// Testing set for the courses awaiting for the link to the backend
const initialCourseList = [
    { id: "2", name: "Data Structures", prerequisites: ["1"], year: 1 },
    { id: "3", name: "Algorithms", prerequisites: ["1"], year: 1 },
    { id: "4", name: "Databases", prerequisites: ["2"], year: 2 },
    { id: "5", name: "Operating Systems", prerequisites: ["2"], year: 2 },
    { id: "7", name: "Operating Systems 2", prerequisites: ["5"], year: 3 },
    { id: "6", name: "Databases 2", prerequisites: ["4"], year: 3 },
    { id: "9", name: "Distributed Systems", prerequisites: ["5"], year: 3 },
    { id: "10", name: "Coding", prerequisites: ["1"], year: 1 },
    { id: "8", name: "Parallel Programming", prerequisites: ["10"], year: 3 }
];

const initialNodes = [
    { id: "1", type: "input", data: { label: "Program" }, position: { x: 250, y: 5 } },
];

const initialEdges: Edge[] = [];

const getLayoutedElements = async (nodes: Node[], edges: Edge[], options: LayoutOptions) => {
    const elkGraph = {
        id: "root",
        layoutOptions: options,
        children: nodes.map((node) => ({
            id: node.id,
            width: 150,
            height: 50,
        })),
        edges: edges.map((edge) => ({
            id: edge.id,
            sources: [edge.source],
            targets: [edge.target],
        })),
    };

    const layoutedGraph = await elk.layout(elkGraph);

    const updatedNodes = nodes.map((node) => {
        const layoutedNode = layoutedGraph.children?.find((n) => n.id === node.id);
        return {
            ...node,
            position: {
                x: layoutedNode?.x ?? 0,
                y: layoutedNode?.y ?? 0,
            },
            draggable: true,
        };
    });

    return { nodes: updatedNodes, edges };
};


function PlanTree() {
    const [treeNodes, setTreeNodes, onNodesChange] = useNodesState(initialNodes);
    const [treeEdges, setTreeEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [courseList, _] = useState(initialCourseList);


    const updateLayout = useCallback(async () => {

        const layoutOptions = {
            "elk.algorithm": "layered", // Layered algorithm for hierarchical layouts
            "elk.direction": "DOWN", // Layout direction: top to bottom
            "elk.layered.spacing.nodeNodeBetweenLayers": "100", // Spacing between layers
            "elk.spacing.nodeNode": "50", // Spacing between nodes in the same layer
            "elk.layered.spacing.nodeNodeBetweenConnectedNodes": "50", // Spacing between connected nodes
            "elk.layered.considerModelOrder": "true", // Consider the model order
            "elk.layered.crossingMinimization.semiInteractive": "true", // Minimize crossings
            "elk.layered.thoroughness": "5", // Thoroughness level
        };

        const layouted = await getLayoutedElements(treeNodes, treeEdges, layoutOptions);
        setTreeNodes(layouted.nodes);
        setTreeEdges(layouted.edges);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [treeNodes, treeEdges]);

    const isCourseInTree = (courseId: string) => treeNodes.some((node) => node.id === courseId);

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
                        ? { backgroundColor: "red", color: "white" }
                        : { backgroundColor: "#fff", color: "#000" },
                };
            })
        );

        // Then rebuild all edges
        setTreeEdges(() => {
            const newEdges: Edge[] = [];

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
                                animated: false,
                                type: "smoothstep",
                                style: { stroke: "black", strokeDasharray: 0, strokeWidth: 2 }
                            });
                        }
                    });
                }
            });

            return newEdges;
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseList, treeNodes]);


    // Add this new effect to handle edge updates
    useEffect(() => {
        updatePrerequisiteStatus();
    }, [treeNodes, updatePrerequisiteStatus]);

    const removeCourseFromTree = useCallback((courseId: string) => {
        setTreeNodes(function (nodes) {
            // Remove the node, if and only if it's not root node(s)
            const rootNodes = initialNodes.map(node => node.id);
            // If the courseId is the on roots nodes, don't remove it
            if (rootNodes.includes(courseId))
                return nodes;
            return nodes.filter((node) => node.id !== courseId);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const courseId = event.dataTransfer.getData("application/courseId");
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
                    ? { backgroundColor: "red", color: "white" }
                    : { backgroundColor: "#fff", color: "#000" },
                draggable: true,
            };

            setTreeNodes((nodes) => [...nodes, newNode]);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseList, isCourseInTree]);

    const fitViewOptions = {
        padding: 0.3,
        includeHiddenNodes: false,
        maxZoom: 2,
        minZoom: 0.5
    };


    return (
        <div className="flex flex-row max-h-full max-w-full">
            <div id="main-content" className="w-full flex flex-col">
                <header id="top-buttons" className="m-8 flex items-center justify-between">
                    <button id="user-identifier" className="bg-neutral-300 rounded-2xl text-2xl p-4">User</button>
                    <button id="notifications-button" className="bg-neutral-300 rounded-2xl text-2xl p-4">Notifications</button>
                </header>
                <main id="plan-tree" className="bg-neutral-300 rounded-3xl p-4 m-8">
                    <div style={{ display: "flex", height: "100vh" }}>
                        <div style={{ flex: 3, borderRight: "1px solid #ccc", padding: "10px" }}>
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
                                    <MiniMap position="top-right" />
                                    <Controls position="top-left">
                                    </Controls>
                                    <Background />
                                </ReactFlow>
                            </ReactFlowProvider>
                        </div>

                        <div style={{ flex: 1, padding: "10px" }}>
                            <h3>Available Courses</h3>
                            <ul>
                                {courseList.map((course) => (
                                    <li key={course.id} style={{ marginBottom: "8px" }}>
                                        <div
                                            draggable={(!isCourseInTree(course.id))}
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
                                            {course.name} {isCourseInTree(course.id) && "(In Tree)"}
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
