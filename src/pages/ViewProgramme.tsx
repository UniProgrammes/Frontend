import React, { useState } from "react";

import { ProgrammeDetail } from "../components/ProgrammeDetail";

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
    semester: number;
}

interface CourseResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Course[];
}

interface OutcomeResponse {
    id: string;
    description: string;
    category: string;
}

interface Outcome {
    id: string;
    description: string;
}

function ViewProgramme() {
    const [searchTerm, setSearchTerm] = useState("");
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [outcomes, setOutcomes] = useState<Outcome[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [areas, setAreas] = useState<string[]>([]);
    const [semesters, setSemesters] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [displayFilter, setDisplayFilter] = useState<"all" | "programmes" | "courses">("all");
    const [yearFilter, setYearFilter] = useState<number | "all">("all");
    const [areaFilter, setAreaFilter] = useState<string | "all">("all");
    const [outcomeFilter, setOutcomeFilter] = useState<string | "all">("all");
    const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
    const [semesterFilter, setSemesterFilter] = useState<number | string>("all");

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

            setAreas(Array.from(new Set(coursesWithYear.map(course => (
                course.main_area
            )))));

            const allLearningOutcomes = Array.from(new Set(courseResponse.data.results.map(course => (
                course.learning_outcomes
            )).flat()));
            // Fetch all the learning outcomes descriptions
            const outcomeRequests = allLearningOutcomes.map(async outcome => (
                client.get<OutcomeResponse>(`/v1/learning-outcomes/${outcome}`)
            ))
            const outcomeResponses = (await Promise.all(outcomeRequests)).map(res => ({
                id: res.data.id,
                description: res.data.description
            }));
            setOutcomes(outcomeResponses);

            //Handle setting semesters
            const allSemesters = Array.from(new Set(courseResponse.data.results.map(course => (
                course.semester
            ))));
            setSemesters(allSemesters);

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
            <div className="flex justify-end items-center gap-4 mb-2 px-6 py-2">
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
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-neutral-700 mb-1">Main Area</label>
                    <select
                        value={areaFilter}
                        onChange={(e) => { setAreaFilter(e.target.value) }}
                        className="disabled:bg-slate-200 rounded-md border-0 p-2 text-neutral-600 focus:ring-2 focus:ring-purple-500"
                        disabled={displayFilter === "programmes"}
                    >
                        <option value="all">All Areas</option>
                        {areas.map(area => (
                            <option value={area}>{area}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-neutral-700 mb-1">Main Area</label>
                    <select
                        value={outcomeFilter}
                        onChange={(e) => { setOutcomeFilter(e.target.value) }}
                        className="w-48 text-ellipsis disabled:bg-slate-200 rounded-md border-0 p-2 text-neutral-600 focus:ring-2 focus:ring-purple-500"
                        disabled={displayFilter === "programmes"}
                    >
                        <option value="all">All Outcomes</option>
                        {outcomes.map(outcome => (
                            <option value={outcome.id}>{outcome.description}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-neutral-700 mb-1">Main Area</label>
                    <select
                        value={semesterFilter}
                        onChange={(e) => { setSemesterFilter(e.target.value) }}
                        className="disabled:bg-slate-200 rounded-md border-0 p-2 text-neutral-600 focus:ring-2 focus:ring-purple-500"
                        disabled={displayFilter === "programmes"}
                    >
                        <option value="all">All Semesters</option>
                        {semesters.map(semester => (
                            <option value={semester}>{semester}</option>
                        ))}
                    </select>
                </div>
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

        const applyCourseFilters = (): Course[] => {
            if (displayFilter === "programmes") {
                return [];
            }

            let coursesArr = courses;

            if (yearFilter !== "all") {
                coursesArr = coursesArr.filter(course => course.year === yearFilter);
            }

            if (areaFilter !== "all") {
                coursesArr = coursesArr.filter(course => course.main_area === areaFilter);
            }

            if (outcomeFilter !== "all") {
                coursesArr = coursesArr.filter(course => course.learning_outcomes.includes(outcomeFilter));
            }

            if (semesterFilter !== "all") {
                coursesArr = coursesArr.filter(course => course.semester === Number(semesterFilter));
            }

            return coursesArr;
        }

        const filteredProgrammes = displayFilter === "courses" ? [] : programmes;
        const filteredCourses = applyCourseFilters();

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
                            <p>Degree Type: <span className="font-bold">{programme.degree_type}</span></p>
                            <p>Credits: <span className="font-bold">{programme.credits}</span></p>
                            <p>Courses: <span className="font-bold">{programme.courses.length}</span></p>
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

                        <h2 className="text-xl font-semibold text-blue-700 pr-24">{course.name}</h2>
                        <div className="mt-2 text-neutral-600 grid grid-cols-2 max-w-[70%]">
                            <p>Code: {course.code}</p>
                            <p>Credits: {course.credits}</p>
                            <p>Level: {course.educational_level}</p>
                            <p>Main Area: {course.main_area}</p>
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
                <main className="bg-gray-200 rounded-3xl p-4 m-8">
                    <h1 className="ml-8 text-2xl font-bold mb-4 text-neutral-700">Search Programmes & Courses</h1>
                    <div id="search-bar" className="flex space-x-4 items-center rounded-xl p-4">
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-grow rounded-md p-2 border border-black"
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
