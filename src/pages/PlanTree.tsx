import React, { useState, useCallback, useEffect } from "react";

import { TrashIcon } from "@radix-ui/react-icons";
import ELK from "elkjs/lib/elk.bundled.js";
import { useSearchParams } from "react-router-dom";
import ReactFlow, { ReactFlowProvider, MiniMap, Background, Controls, ControlButton, NodeMouseHandler, Node, Edge} from "reactflow";

import { getAllProgrammes, getAllCourses } from "~/api";

import "reactflow/dist/style.css";

interface Course {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    code: string;
    credits: string;
    educational_level: string;
    description: string;
    main_area: string;
    learning_outcomes: string[];
    prerequisites: string[];
    year: number;
  }
  
  interface ProgrammeStructure {
    program_id: string;
    name: string;
    courses: Course[];
  }

const pastelColors = [
    "hsl(210, 60%, 50%)", // Light Blue
    "hsl(180, 60%, 55%)", // Aqua Green
    "hsl(150, 60%, 50%)", // Soft Mint
    "hsl(120, 60%, 55%)", // Light Green
    "hsl(60, 60%, 55%)",  // Pale Yellow
    "hsl(30, 60%, 50%)",  // Peach
    "hsl(0, 60%, 55%)",   // Soft Coral
    "hsl(300, 60%, 50%)"  // Lavender
];

const years = [1, 2, 3, 4, 5, 6, 7, 8];

const colorMapping: Map<number, string> = new Map(
    years.map((year, index) => [year, pastelColors[index % pastelColors.length]])
);

interface PopupInfo {
    courseInfo: CourseInfo;
    x: number;
    y: number;
}

interface CourseInfo {
    label: string;
    year: string;
    description: string;
    ects: string;
}

const undeletableNodes = ["1"];

// ELK instance
const elk = new ELK();

// Helper function to layout the nodes using ELK
const getLayoutedElements = async (nodes: Node[], edges: Edge[], direction = "DOWN") => {
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
        "elk.layered.spacing.nodeNodeBetweenLayers": "50", // Spacing between layers
        "elk.spacing.nodeNode": "25", // Spacing between nodes in the same layer
        "elk.layered.spacing.nodeNodeBetweenConnectedNodes": "25", // Spacing between connected nodes
        "elk.layered.considerModelOrder": "true", // Consider the model order
        "elk.layered.crossingMinimization.semiInteractive": "true", // Minimize crossings
        "elk.layered.thoroughness": "5", // Thoroughness level,
        "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
        "elk.layered.nodePlacement.bk.fixedAlignment": "CENTER",
        "elk.alignment": "CENTER",
        "elk.direction": direction,
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
            draggable: false, // Prevent manual dragging since we"re using automatic layout
        };
    });

    const treeNodes: Node[] = layoutedNodes;

    return { nodes: treeNodes, edges };
};

function App() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [courseList, setCourses] = useState<Course[]>([]);
    const [totalCredits,setTotalCredits] = useState<number>(0);
    const [searchParams] = useSearchParams();
    const [structure, setStructure] = useState<ProgrammeStructure | null>(null);
    const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

    const programmeId = searchParams.get("programmeId");

      
    useEffect(() => {
        const fetchStructure = async () => {
            if (!programmeId) {
                return;
            }
            const programmes = await getAllProgrammes();
            const courses = await getAllCourses().then((courses: Course[]) => {
                const sortedCourses = courses.sort(
                    (a, b) => a.prerequisites.length - b.prerequisites.length
                );
                return sortedCourses;
            })

            const programmeSelected = programmes.find((p) => p.id === programmeId);

            if(!programmeSelected){
                return;
            }

            const programmeCourses = courses.filter((course) =>
                programmeSelected.courses.includes(course.id))
                .map((course) => {
                if (course.prerequisites.length === 0) {
                    course.prerequisites.push("1");
                }
                if (course.year === undefined) {
                    //Just to handle the course year for the moment
                    if (course.prerequisites.includes("1")){
                        course.year = 1;
                    }else{
                        const prerequisiteCourse = courses.find((c) => c.id === course.prerequisites[0]);
                        if (prerequisiteCourse) {
                            course.year = (prerequisiteCourse?.year || 0) + 1;
                        }
                    }
                }

                return course;
                }); 
            setCourses(programmeCourses);

            const programmeStructure: ProgrammeStructure = {
                program_id: programmeSelected.id,
                name: programmeSelected.name,
                courses: programmeCourses,
              };            
          setStructure(programmeStructure);
        };
        fetchStructure();
      }, [programmeId]);

    useEffect(() => {
        if (!structure) return;
        const newNodes: Node[] = [
            { id: "1", type: "input", data: { label: structure.name, credits: "0"}, position: { x: 250, y: 5 } },
        ];

        const newEdges: Edge[] = [];

        getLayoutedElements(newNodes, newEdges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        });
    }, [structure]);

    useEffect(() => {
        if (!structure) return;
        const newTotalCredits = nodes.reduce((total, node) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const credits = node.data?.credits;
        
            if (credits && !isNaN(credits)) {
              return total + parseFloat(credits); 
            }
            return total;
          }, 0);
        setTotalCredits(newTotalCredits);
    }, [structure, nodes]);

    // Handle mouse enter to show the popup
    const onNodeMouseEnter: NodeMouseHandler = useCallback((event, node: Node) => {
        event.preventDefault();
        const nodePosition = (event.target as Element).getBoundingClientRect(); // Get node's position

        if (node.id === "1") {
            setPopupInfo(null);
            return;
        } 
        
        //TO-DO: Fix the node.data creating a new typed object
        const courseInfo: CourseInfo = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            label: node.data.label,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            year: node.data.year?.toString(),
            description: "",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ects: node.data?.credits || "7.5",
        };

        const popupInfo: PopupInfo = {
            courseInfo: courseInfo,
            x: nodePosition.right + window.scrollX, // Position to the right of the node
            y: nodePosition.top + window.scrollY + nodePosition.height / 2, // Center vertically
        };

        setPopupInfo(popupInfo);
    }, []);

    // Handle mouse leave to hide the popup
    const onNodeMouseLeave = useCallback(() => {
        setPopupInfo(null); // Hide popup
    }, []);
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
                        (preId) => !isCourseInTree(preId) || false
                    );

                    const filteredByYear = false;
                    let yearColor = "white";
                    if(filteredByYear)
                        yearColor = colorMapping.get(course.year) || "white";

                    return {
                        ...node,
                        style: {
                            backgroundColor: hasMissingPrerequisites
                                ? "red"
                                : yearColor, // Use the color for the year
                            color: hasMissingPrerequisites ? "white" : "#000",
                        },
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
            const courseId = event.dataTransfer.getData("application/courseId");
            const course = courseList.find((c) => c.id === courseId);

            if (!course) return;

            if (isCourseInTree(course.id)) {
                alert("Course already in tree");
                return;  
            }

            const newNode = {
                id: course.id,
                data: { label: course.name , credits: course.credits, year: course.year },
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
    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    // Function to handle node deletion
    const onNodeClick = useCallback(
        async (event: React.MouseEvent, node: { id: string; }) => {
            event.preventDefault();
            const nodeId = node.id;
            if (undeletableNodes.includes(nodeId)) return;
            // Remove node and connected edges
            setPopupInfo(null); // Hide popup
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

    const importAllCourses = useCallback(async () => {
        // Create a set of existing node ids
        const existingNodeIds = new Set(nodes.map(node => node.id));

        // Initialize newNodes and newEdges with existing ones
        const newNodes: Node[] = [...nodes];
        const newEdges: Edge[] = [...edges];

        // For each course in courseList
        courseList.forEach(course => {
            // If the course is not already in the nodes
            if (!existingNodeIds.has(course.id)) {
                // Create a node for the course
                const newNode = {
                    id: course.id,
                    data: {
                        label: course.name,
                        year: course.year,
                        description: "",
                        ects: "7.5"
                    },
                    position: { x: 0, y: 0 }, // Position will be updated by ELK
                };
                newNodes.push(newNode);
                existingNodeIds.add(course.id);
            }

            // For each prerequisite
            course.prerequisites.forEach(preId => {
                // If the edge doesn't already exist
                const edgeId = `e${preId}-${course.id}`;
                if (!newEdges.some(e => e.id === edgeId)) {
                    newEdges.push({
                        id: edgeId,
                        source: preId,
                        target: course.id,
                        animated: false,
                        type: "smoothstep",
                        style: { stroke: "black", strokeDasharray: 0, strokeWidth: 2 }
                    });
                }
            });

            // If the course has no prerequisites and is not the root node, connect it to the root
            if (course.prerequisites.length === 0 && course.id !== "1") {
                const edgeId = `e1-${course.id}`;
                if (!newEdges.some(e => e.id === edgeId)) {
                    newEdges.push({
                        id: edgeId,
                        source: "1",
                        target: course.id,
                        animated: false,
                        type: "smoothstep",
                        style: { stroke: "black", strokeDasharray: 0, strokeWidth: 2 }
                    });
                }
            }
        });

        // Re-layout the graph
        const layoutedElements = await getLayoutedElements(newNodes, newEdges);

        // Update node styles
        const styledNodes = updateNodeStyles(layoutedElements.nodes);

        //@ts-expect-error - setNodes expect the parsed type of the styledNodes
        setNodes(styledNodes);
        setEdges(layoutedElements.edges);

    }, [courseList, nodes, edges, updateNodeStyles]);

    const removeAllCourses = useCallback(async () => {
        // Keep only the root node
        const initialNodes: Node[] = nodes.filter(s => s.id == "1");
        setNodes(initialNodes);
        setEdges([]);

    }, [nodes]);

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
                            onNodeMouseEnter={onNodeMouseEnter}
                            onNodeMouseLeave={onNodeMouseLeave}
                            fitView
                        >
                            <MiniMap position="top-right" />
                            <Controls position="top-left"
                                showInteractive={false}>
                                <ControlButton onClick={(removeAllCourses)}>
                                    <TrashIcon />
                                </ControlButton>
                            </Controls>
                            <Background />
                        </ReactFlow>
                    </div>
                </ReactFlowProvider>

                {/* Popup */}
                {popupInfo && (
                    <div
                        style={{
                            position: "absolute",
                            top: popupInfo.y + 10,
                            left: popupInfo.x + 10,
                            backgroundColor: "white",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            padding: "10px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            zIndex: 1000,
                        }}
                    >
                        <h4 style={{ margin: 0, fontSize: "16px" }}>{popupInfo.courseInfo.label}</h4>
                        <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                            {popupInfo.courseInfo.description}
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                            YEAR: {popupInfo.courseInfo.year}
                            <br />
                            ECTS: {popupInfo.courseInfo.ects}
                        </p>
                    </div>
                )}

            </div>
            {/* Sidebar */}
            <div className="bg-grey-300 h-screen flex flex-col border-l border-gray-300 w-[250px]">
                <div className="block w-full p-4 mb-4 text-center uppercase" style={{ borderBottom: "1px solid black " }}>
                    <h2 className="block w-full font-bold p-1 text-center uppercase" style={{ borderBottom: "1px solid gray " }}>
                        Available Courses
                    </h2>
                    <h4 className="block w-full pt-2">Total Credits in the tree:</h4>
                    <h5 className="font-bold">{totalCredits}</h5>
                </div>


                {/* Scrollable List */}
                <ul className="list-none p-0 flex-1 overflow-y-auto m-0">
                    {courseList
                        .sort((a, b) => a.year - b.year)
                        .map((course) => (
                            <li key={course.id} className="mb-2">
                                <div
                                    style={{
                                        padding: "6px 12px",
                                        margin: "0 10px",
                                        backgroundColor: isCourseInTree(course.id)
                                            ? "#ddd"
                                            : colorMapping.get(course.year),
                                        color: isCourseInTree(course.id) ? "#666" : "white",
                                        cursor: isCourseInTree(course.id) ? "not-allowed" : "grab",
                                        border: "none",
                                        borderRadius: "4px",
                                        userSelect: "none"
                                    }}
                                    draggable={!isCourseInTree(course.id)}
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData("application/courseId", course.id);
                                        e.dataTransfer.effectAllowed = "move";
                                    }}
                                    className="p-3 rounded cursor-pointer"
                                >
                                    <p>
                                        {course.name} ({course.year})</p>
                                </div>
                            </li>
                        ))}
                </ul>

                {/* Fixed Button at the Bottom */}
                <button
                    onClick={importAllCourses}
                    className="uppercase w-full p-4 text-white border-t cursor-pointer text-center bg-purple-600 hover:bg-purple-700"
                >
                    Import All Courses
                </button>
            </div>




        </div>
    );
}

export default App;