import React, { useState } from "react";

import { client } from "~/api";

interface Programme {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    degree_type: string;
    credits: string;
    courses: string[];
}

interface ProgrammeResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Programme[];
}

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
}

interface CourseResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Course[];
}

function ViewProgramme() {
    const [searchTerm, setSearchTerm] = useState("");
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const [programmeResponse, courseResponse] = await Promise.all([
                client.get<ProgrammeResponse>(`/v1/programmes/?name=${encodeURIComponent(searchTerm)}`),
                client.get<CourseResponse>(`/v1/courses/?name=${encodeURIComponent(searchTerm)}`)
            ]);
            
            setProgrammes(programmeResponse.data.results);
            setCourses(courseResponse.data.results);
        } catch (_) {
            setError("Failed to fetch results. Please try again.");
            setProgrammes([]);
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-lg text-neutral-500">Loading...</div>;
        }

        if (error) {
            return <div className="text-lg text-red-500">{error}</div>;
        }

        if (!hasSearched) {
            return <span className="text-lg text-neutral-500">Start typing to search for programmes and courses...</span>;
        }

        if (programmes.length === 0 && courses.length === 0) {
            return <div className="text-lg text-neutral-500">No results found matching your search.</div>;
        }

        return (
            <div className="space-y-4 w-full">
                {programmes.map((programme) => (
                    <div key={programme.id} className="bg-white rounded-lg p-4 shadow-md relative">
                        <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            Programme
                        </div>
                        <h2 className="text-xl font-semibold text-purple-700 pr-24">{programme.name}</h2>
                        <div className="mt-2 text-neutral-600">
                            <p>Degree Type: {programme.degree_type}</p>
                            <p>Credits: {programme.credits}</p>
                            <p>Courses: {programme.courses.length}</p>
                        </div>
                    </div>
                ))}
                
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg p-4 shadow-md relative">
                        <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            Course
                        </div>
                        <h2 className="text-xl font-semibold text-purple-700 pr-24">{course.name}</h2>
                        <div className="mt-2 text-neutral-600">
                            <p>Code: {course.code}</p>
                            <p>Credits: {course.credits}</p>
                            <p>Level: {course.educational_level}</p>
                            <p className="text-sm mt-2 text-neutral-500">{course.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-row max-h-full max-w-full">
            <div id="main-content" className="w-full flex flex-col">
                <main className="bg-neutral-300 rounded-3xl p-4 m-8">
                    <h1 className="ml-8 text-2xl font-bold mb-4 text-neutral-700">Search Programmes & Courses</h1>
                    <div id="search-bar" className="flex space-y-4 flex-col items-start bg-[#C3AAEA] rounded-xl p-4">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="w-full rounded-md p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={async (e) => e.key === "Enter" && handleSearch()}
                        />
                        <button 
                            onClick={handleSearch}
                            className="bg-purple-500 hover:bg-purple-600 w-[200px] text-white rounded-md p-2"
                        >
                            Search
                        </button>
                    </div>
                    <hr className="my-4 border-neutral-400" />
                    <div id="content" className="flex flex-col items-center justify-center min-h-[20rem] p-4">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ViewProgramme;
