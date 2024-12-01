import { useEffect, useState } from 'react';
import { client } from '../api/index';
import { CrossCircledIcon } from "@radix-ui/react-icons";

interface Programme {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    degree_type: string;
    credits: string;
    courses: string[];
}

interface Course {
    id: string;
    name: string;
    code: string;
    credits: string;
}

interface ProgrammeDetailProps {
    programme: Programme;
    setSelectedProgramme: Function
}

export function ProgrammeDetail({ programme, setSelectedProgramme }: ProgrammeDetailProps) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch all courses concurrently
                const coursePromises = programme.courses.map(courseId =>
                    client.get<Course>(`/v1/courses/${courseId}`)
                );

                // Wait for all promises to resolve
                const responses = await Promise.all(coursePromises);

                // Extract course data from responses
                const programmesCourses = responses.map((response: { data: Course }) => response.data);
                setCourses(programmesCourses);
            } catch (err) {
                setError('Failed to fetch courses');
                console.error('Error fetching courses:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [programme.id]);

    const removeSelection = () => {
        setSelectedProgramme(null);
    }

    if (error) {
        return (
            <div className="w-1/3 h-full bg-white p-6 border-l border-neutral-200">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="w-1/3 max-h-full bg-white border-l border-neutral-200 overflow-y-auto relative">
            <div className="space-y-6">
                {/* Programme Header */}
                <div className="border-b p-6 border-neutral-200 pb-4 sticky top-0 left-0 bg-white shadow-sm">
                    <button onClick={removeSelection} className="bg-white text-slate-700 w-auto h-auto rounded-2xl text-2xl p-2 shadow-md absolute right-4 top-4">
                        <CrossCircledIcon />
                    </button>
                    <h1 className="text-2xl font-bold text-purple-700">{programme.name}</h1>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            {programme.degree_type}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {programme.credits} Credits
                        </span>
                    </div>
                </div>

                {/* Courses Section */}
                <div className='px-6'>
                    <h2 className="text-xl font-semibold text-neutral-700 mb-4">
                        Courses ({courses.length})
                    </h2>

                    {isLoading ? (
                        <div className="text-neutral-500">Loading courses...</div>
                    ) : (
                        <div className="space-y-3">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                                >
                                    <h3 className="font-medium text-neutral-700">{course.name}</h3>
                                    <div className="flex gap-2 mt-1 text-sm text-neutral-500">
                                        <span>{course.code}</span>
                                        <span>•</span>
                                        <span>{course.credits} Credits</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
