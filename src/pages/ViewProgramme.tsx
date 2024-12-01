import React, { useState } from "react";
import { ProgrammeDetail } from '../components/ProgrammeDetail';

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
    year: number;
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
    const [displayFilter, setDisplayFilter] = useState<"all" | "programmes" | "courses">("all");
    const [yearFilter, setYearFilter] = useState<number | "all">("all");
    const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

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
            const coursesWithYear = courseResponse.data.results.map(course => ({
                ...course,
                year: Math.floor(Math.random() * 5) + 1
            }));
            setCourses(coursesWithYear);
        } catch (_) {
            setError("Failed to fetch results. Please try again.");
            setProgrammes([]);
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProgrammeSelect = (programme: Programme) => {
        setSelectedProgramme(programme);
    };

    const renderFilters = () => {
        return (
            <div className="flex justify-end items-center gap-4 mb-4 p-6">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-neutral-700 mb-1">Display</label>
                    <select
                        value={displayFilter}
                        onChange={(e) => setDisplayFilter(e.target.value as "all" | "programmes" | "courses")}
                        className="rounded-md border-0 p-2 text-neutral-600 focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All</option>
                        <option value="programmes">Programmes Only</option>
                        <option value="courses">Courses Only</option>
                    </select>
                </div>

                {
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-neutral-700 mb-1">Year</label>
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                            className="disabled:bg-slate-200 rounded-md border-0 p-2 text-neutral-600 focus:ring-2 focus:ring-purple-500"
                            disabled={displayFilter === "programmes"}
                        >
                            <option value="all">All Years</option>
                            <option value="1">Year 1</option>
                            <option value="2">Year 2</option>
                            <option value="3">Year 3</option>
                            <option value="4">Year 4</option>
                            <option value="5">Year 5</option>
                        </select>
                    </div>
                }
            </div>
        );
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

        const filteredProgrammes = displayFilter === "courses" ? [] : programmes;
        const filteredCourses = displayFilter === "programmes"
            ? []
            : yearFilter === "all"
                ? courses
                : courses.filter(course => course.year === yearFilter);

        if (filteredProgrammes.length === 0 && filteredCourses.length === 0) {
            return <div className="text-lg text-neutral-500">No results found matching your search and filters.</div>;
        }

        return (
            <div className="space-y-4 w-full">
                {filteredProgrammes.map((programme) => (
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
                        <button
                            onClick={() => handleProgrammeSelect(programme)}
                            className="absolute bottom-4 right-4 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-md p-2"
                        >
                            View Details
                        </button>
                    </div>
                ))}

                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg p-4 shadow-md relative">
                        <div className="absolute top-4 right-4 flex items-center justify-center gap-2">
                            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                Year: {course.year}
                            </div>
                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                Course
                            </div>
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
        <div className="flex flex-row max-h-[calc(100%-63px)] max-w-full">
            <div id="main-content" className="w-full flex flex-col max-h-full overflow-y-auto">
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
                    {hasSearched && renderFilters()}
                    <div id="content" className="flex flex-col items-center justify-center min-h-[20rem] p-4">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {selectedProgramme && (
                <ProgrammeDetail programme={selectedProgramme} setSelectedProgramme={setSelectedProgramme} />
            )}
        </div>
    );
}

export default ViewProgramme;
