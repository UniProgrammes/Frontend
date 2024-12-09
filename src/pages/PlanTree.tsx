import React, { useState, useCallback, useEffect } from "react";

import { TrashIcon, CardStackPlusIcon } from "@radix-ui/react-icons";
import { ReactFlow, ReactFlowProvider, MiniMap, Background, Controls, ControlButton, NodeMouseHandler, Node, Edge } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import "@xyflow/react/dist/style.css";
import { useSearchParams } from "react-router-dom";

import { getAllProgrammes, getAllCourses, getLearningOutcome } from "~/api";
import { LabeledGroupNode } from "~/components/labeled-group-node";

const nodeTypes = {
    labeledGroupNode: LabeledGroupNode,
};

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

  interface CustomNode extends Node {
    data: {
      label: string;
      year: number;
      description?: string;
      ects: number;
      style?: React.CSSProperties | undefined;
      isGroup: boolean;
      learning_outcomes: string[];
    };
  }

const pastelColors = [
    "rgba(102, 153, 255, 1)", // Light Blue
    "rgba(102, 255, 204, 1)", // Aqua Green
    "rgba(102, 255, 153, 1)", // Soft Mint
    "rgba(102, 255, 102, 1)", // Light Green
    "rgba(255, 255, 102, 1)", // Pale Yellow
    "rgba(255, 204, 102, 1)", // Peach
    "rgba(255, 102, 102, 1)", // Soft Coral
    "rgba(204, 102, 255, 1)"  // Lavender
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
    year: number;
    description: string;
    ects: number;
    isGroup: boolean;
    learning_outcomes: string[];
}

let undeletableNodes: Set<string> = new Set();

// ELK instance
const elk = new ELK();

// Helper function to layout the nodes using ELK
const getLayoutedElements = async (nodes: CustomNode[], edges: Edge[], algorithm: string = "mrtree", nodeNodeBetweenLayers: number = 50) => {
   
    const bookedLayer: Set<number> = new Set();

    const elkNodes = nodes.sort((a, b) => a.data.year - b.data.year).map((node: CustomNode) => {

        const year: number = node.data.year;

        let proposedLayer = year;

        if(!bookedLayer.has(proposedLayer))
        {
            bookedLayer.add(proposedLayer);
        }else{
            proposedLayer = proposedLayer + 1
        }

        return {
            id: node.id,
            width: 150,
            height: 50,
            layoutOptions: {
                "elk.layered.layering.layerId": `${proposedLayer}`,
                "elk.rectpacking.inNewRow": `${(proposedLayer != year)}`
            }
        };
    })

    const elkEdges = edges.map((edge: { id: string; source: string; target: string; }) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
    }));

    const layoutOptions = {
        "elk.algorithm": algorithm,
        "elk.direction": "DOWN", 
        "elk.alignment": "CENTER",
        "elk.layered.mergeHierarchies": "false", 
       
        "elk.layered.allowEmptyLayers": "true",
        "elk.spacing.nodeNode": "100", 
        "elk.layered.spacing.nodeNodeBetweenLayers": nodeNodeBetweenLayers.toString(), 
        "elk.layered.spacing.nodeNodeBetweenConnectedNodes": "200",

        "elk.layered.crossingMinimization.semiInteractive": "true",
        "elk.layered.thoroughness": "5",

        "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",

        "elk.layered.considerModelOrder": "true",

        "elk.interactiveLayout": "true",
    };

    const graph = {
        id: "root",
        layoutOptions: layoutOptions,
        children: elkNodes,
        edges: elkEdges,
    };

    const treeNodes = await elk.layout(graph).then((layout) => {
        const layoutedNodes: CustomNode[] = nodes.map((node: CustomNode) => {
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

        return layoutedNodes;
    }).catch(() => { 
        return new Array<CustomNode>();
    })

    return { nodes: treeNodes, edges };
};



function App() {

    const [nodes, setNodes] = useState<CustomNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const [courseList, setCourses] = useState<Course[]>([]);
    const [totalCredits,setTotalCredits] = useState<number>(0);
    const [searchParams] = useSearchParams();
    const [structure, setStructure] = useState<ProgrammeStructure | null>(null);
    const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    const [workSummary, setWorkSummary] = useState<{ [category: string]: number }>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [topics, setTopics] = useState<Set<string>>(new Set());

    const programmeId = searchParams.get("programmeId");

    useEffect(() => {
        const fetchStructure = async () => {
            if (!programmeId) {
                return;
            }

            //TODO: fetch only the program with the id
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
                            course.year = (prerequisiteCourse.year || 0) + 1;
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

        undeletableNodes.clear();

        const newNodes: CustomNode[] = [
            { 
                id: "1",
                type: "input", 
                data: 
                { 
                    label: structure.name,  
                    ects: 0, 
                    year: 0, 
                    description: "",
                    isGroup: false,
                    learning_outcomes: []
                },
                position: 
                { 
                    x: 250, 
                    y: 5 
                } 
            },
        ];

        undeletableNodes = new Set(newNodes.map((node) => node.id));

        const newEdges: Edge[] = [];

        getLayoutedElements(newNodes, newEdges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        });
    }, [structure]);

    useEffect(() => {
        if (!structure) return;
        const newTotalCredits = nodes.reduce((total, node) => {
            const credits: number = node.data.ects;
            if (credits && !isNaN(credits)) {
              return total + credits; 
            }
            return total;
          }, 0);
        setTotalCredits(newTotalCredits);
    }, [structure, nodes]);


    const calculateSummary = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
        const summary: { [category: string]: number } = {};
        const uniqueTopics: Set<string> = new Set();
    
        for (const node of nodes) {
            if (node.id === "1") continue; 
    
            // Fetch learning outcomes for this node
            const learningOutcomes = await Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/promise-function-async
                node.data.learning_outcomes.map((outcomeId: string) => getLearningOutcome(outcomeId))
            );
    
            for (const outcome of learningOutcomes) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                summary[outcome.category] = (summary[outcome.category] || 0) + 1;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                uniqueTopics.add(outcome.description);
            }
        }
    
        setWorkSummary(summary);
        setTopics(uniqueTopics);
    }, [nodes]);
    
    useEffect(() => {
        void calculateSummary(); 
    }, [nodes, calculateSummary]);

    const onNodeMouseEnter: NodeMouseHandler = useCallback(async (event, node) => {
        const customNode = node as CustomNode;
        event.preventDefault();
        const nodePosition = (event.target as Element).getBoundingClientRect(); // Get node's position
        if (customNode.id === "1") {
            setPopupInfo(null);
            return;
        }
        
        const learningOutcomes = await Promise.all(
            customNode.data.learning_outcomes.map(async (outcomeId: string) => getLearningOutcome(outcomeId))
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        const descriptions = learningOutcomes.map((outcome) => outcome.description);
       
        
        const courseInfo: CourseInfo = {
            label: customNode.data.label,
            year: customNode.data.year,
            description: "",
            ects: customNode.data.ects || 7.5,
            isGroup: customNode.data.isGroup,
            learning_outcomes: descriptions
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
        (nodesToUpdate: CustomNode[]) => {
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

            const newNode: CustomNode = {
                id: course.id,
                data: { 
                    label: course.name, 
                    description: course.description,
                    ects: parseFloat(course.credits), 
                    year: course.year,
                    isGroup: false,
                    learning_outcomes: course.learning_outcomes
                 },
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
            if (undeletableNodes.has(nodeId)) return;
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
        const newNodes: CustomNode[] = [...nodes];
        const newEdges: Edge[] = [...edges];

        // For each course in courseList
        courseList.forEach(course => {
            // If the course is not already in the nodes
            if (!existingNodeIds.has(course.id)) {
                // Create a node for the course
                const newNode: CustomNode = {
                    id: course.id,
                    data: {
                        label: course.name,
                        year: course.year,
                        ects: 7.5,
                        isGroup: false,
                        description: "",
                        learning_outcomes: course.learning_outcomes
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
        const initialNodes: CustomNode[] = nodes.filter(s => s.id == "1");
        setNodes(initialNodes);
        setEdges([]);

    }, [nodes]);

    const handleGroupNodes = useCallback(async () => {
        if (nodes.length === 0) return;

        // Group nodes by their approximate layer (y-position).
        // We'll map each unique y-level to an array of node IDs.
        const layerMap = new Map<number, CustomNode[]>();
        
        // const currentNodes = nodes.filter((node) => node.type == "labeledGroupNode");

        // Make sure nodes are laid out before grouping
        const layoutedElements = await getLayoutedElements(nodes, edges, "layered", 300);

        layoutedElements.nodes.forEach((node) => {
            if (node.id === "1") return; // skip root node if desired

            const year: number = parseInt(node.data.year.toString() || "0");

            const layerNodes = layerMap.get(year) || [];
            layerNodes.push(node);
            layerMap.set(year, layerNodes);
        });

        let updatedNodes = [...nodes];

        const groupNodes: CustomNode[] = [];

        let globalMinX = 0;
        let globalGroupWidth = 0;

        // For each layer with multiple nodes, create a group node
        layerMap.forEach((layerNodes, year) => {

            // Compute bounding box for this layer
            const minX = Math.min(...layerNodes.map((n) => n.position.x));
            const maxX = Math.max(...layerNodes.map((n) => n.position.x));
            const minY = Math.min(...layerNodes.map((n) => n.position.y));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const maxY = Math.max(...layerNodes.map((n) => n.position.y));

            if(minX < globalMinX){
                globalMinX = minX;
            }

            const groupWidth = maxX - minX + 300; // Padding for aesthetics
            // const groupHeight = maxY - minY + 200; // Padding for aesthetics
            const groupHeight = 350; // Padding for aesthetics


            if(groupWidth > globalGroupWidth){
                globalGroupWidth = groupWidth;
            }

            // Create a new group node
            const newGroupNodeId = `group_${Date.now()}_${year}`;
            const groupNode: CustomNode = {
                id: newGroupNodeId,
                type: "labeledGroupNode",
                position: { x: globalMinX - 200 , y: minY - 50 },
                width: globalGroupWidth,
                height: groupHeight,
                data: { 
                    label: `Year ${year}`,
                    description: "",
                    ects: updatedNodes.filter((n) => layerNodes.some((ln) => ln.id === n.id)).reduce((total, node) => {
                        const ects = node.data.ects;
                            if (!isNaN(ects)) {
                                return total + ects;
                            }
                        return total;
                    }, 0),
                    year: year,
                    style: {
                        backgroundColor: colorMapping.get(year),
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: "10px",
                    } as React.CSSProperties,
                    isGroup: true,
                    learning_outcomes: []
                },
                draggable: false,
            };

            undeletableNodes.add(newGroupNodeId);
            groupNodes.push(groupNode);

            // Update each layer node to be a child of the group node
            updatedNodes = updatedNodes.map((n) => {
                if (layerNodes.some((ln) => ln.id === n.id)) {
                    return {
                        ...n,
                        parentId: newGroupNodeId,
                        extent: "parent",
                    };
                }
                return n;
            });
        });

        // setGroups(groupNodes);

        const updatedNodesWithGroups = [...groupNodes, ...updatedNodes]

        // Set the updated nodes
        setNodes(updatedNodesWithGroups);
        setEdges(layoutedElements.edges);
    }, [nodes, edges]);
    
    const handleOpenSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
      };

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
                            defaultNodes={nodes} nodeTypes={nodeTypes}
                        >
                            <MiniMap position="top-right" />
                            <Controls position="top-left"
                                showInteractive={false}>
                                <ControlButton onClick={(removeAllCourses)}>
                                    <TrashIcon />
                                </ControlButton>
                                <ControlButton onClick={handleGroupNodes}>
                                    <CardStackPlusIcon />
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

                        {(!(popupInfo.courseInfo.isGroup)) && (
                            <div>
                                <p style={{ margin: 0, fontSize: "14px", color: "#555" }}> YEAR: {popupInfo.courseInfo.year}</p>
                                <p style={{ margin: 0, fontSize: "14px", color: "#555" }}> ECTS: {popupInfo.courseInfo.ects}</p>
                     
                                {popupInfo.courseInfo.learning_outcomes.length > 0 ? (
                                        <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                            {popupInfo.courseInfo.learning_outcomes.map((outcome, index) => (
                                                <li key={index}>{outcome}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>None available</p>
                                    )}

                            </div>
                                )}
                                    {((popupInfo.courseInfo.isGroup)) && (
                                        <div>
                                            <p style={{ margin: 0, fontSize: "14px", color: "#555" }}> TOTAL ECTS: {popupInfo.courseInfo.ects}</p>
                                        </div>
                                    )}

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
                                        {course.name} ({course.year}) </p>
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
                <div>
                    <div>
                        <button onClick={handleOpenSidebar} className="uppercase w-full p-4 text-white border-t cursor-pointer text-center bg-purple-600 hover:bg-purple-700">
                        {isSidebarOpen ? "Close Work Summary" : "View Work Summary"}
                        </button>
                    </div>
                    {isSidebarOpen && (
                        <div
                        style={{
                            width: "300px",
                            backgroundColor: "#f9f9f9",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                            padding: "20px",
                            position: "fixed",
                            top: 0,
                            right: 0,
                            height: "100%",
                            overflowY: "auto",
                        }}
                        >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ fontWeight: "bold", fontSize: "24px", marginBottom: "20px" }}  >Work Summary</h2>
                            <button
                            onClick={() => setIsSidebarOpen(false)}
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                cursor: "pointer",
                            }}
                            >
                            Close
                            </button>
                        </div>
                        <h3 style={{ fontWeight: "bold", fontSize: "18px", marginTop: "10px" }}>Assignments Types</h3>
                        {Object.keys(workSummary).length === 0 ? (
                        <p>No work assigned yet.</p>
                        ) : (
                        <ul>
                            {Object.entries(workSummary).map(([category, count], index) => (
                            <li key={index}>
                                {category}: {count}
                            </li>
                            ))}
                        </ul>
                        )}

                        <h3 style={{ fontWeight: "bold", fontSize: "18px", marginTop: "20px" }}>Topics Studied</h3>
                        {topics.size === 0 ? (
                        <p>No topics assigned yet.</p>
                        ) : (
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            {[...topics].map((topic, index) => (
                            <li key={index} style={{ marginBottom: "5px" }}>
                                {topic}
                            </li>
                            ))}
                        </ul>
                        )}
                        </div>
                        )}
                    </div>
            </div>  

        </div>
    );
}

export default App;