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
import { getAllProgrammes, getProgrammeStructure } from "~/api";

interface Programme {
    id: string;
    name: string;
 }
 
 interface Course {
    id: string;
    name: string;
    prerequisites: string[];
 }

 function PlanTree() {
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null);
    const [programmeStructure, setProgrammeStructure] = useState<Course[]>([]);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
 
    useEffect(() => {
        const fetchProgrammes = async () => {
            try {
                const programmesData = await getAllProgrammes();
                setProgrammes(programmesData);
            } catch (error) {
                console.error("Error fetching programmes:", error);
            }
        };
        fetchProgrammes();
    }, []);
 
    useEffect(() => {
        if (!selectedProgramme) return;
 
        const fetchProgrammeStructure = async () => {
            try {
                const structure = await getProgrammeStructure(selectedProgramme);
                setProgrammeStructure(structure.courses);
            } catch (error) {
                console.error("Error fetching programme structure:", error);
            }
        };
        fetchProgrammeStructure();
    }, [selectedProgramme]);
 
    useEffect(() => {
        const createNodesAndEdges = () => {
            const newNodes = programmeStructure.map((course, index) => ({
                id: course.id,
                data: { label: course.name },
                position: { x: index * 150, y: index * 100 },
            }));
 
            const newEdges = programmeStructure.flatMap((course) =>
                course.prerequisites.map((prereqId) => ({
                    id: `e${prereqId}-${course.id}`,
                    source: prereqId,
                    target: course.id,
                }))
            );
 
            setNodes(newNodes);
            setEdges(newEdges);
        };
 
        if (programmeStructure.length > 0) createNodesAndEdges();
    }, [programmeStructure]);
 
    return (
        <div>
            <select value={selectedProgramme ?? ""} onChange={(e) => setSelectedProgramme(e.target.value)}>
                <option value="">Select a Program</option>
                {programmes.map((programme) => (
                    <option key={programme.id} value={programme.id}>
                        {programme.name}
                    </option>
                ))}
            </select>
 
            <div style={{ height: 600, width: "100%" }}>
                <ReactFlowProvider>
                    <ReactFlow nodes={nodes} edges={edges} fitView>
                        <MiniMap />
                        <Controls />
                        <Background />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </div>
    );
 }
 
 export default PlanTree;