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

function ViewProgramme() {
    const [searchTerm, setSearchTerm] = useState("");
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const response = await client.get<ProgrammeResponse>(`/v1/programmes/?name=${encodeURIComponent(searchTerm)}`);
            setProgrammes(response.data.results);
        } catch (err) {
            setError("Failed to fetch programmes. Please try again.");
            setProgrammes([]);
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
            return <span className="text-lg text-neutral-500">Execute a search to view programmes and courses.</span>;
        }

        if (programmes.length === 0) {
            return <div className="text-lg text-neutral-500">No programmes found matching your search.</div>;
        }

        return (
            <div className="space-y-4 w-full">
                {programmes.map((programme) => (
                    <div key={programme.id} className="bg-white rounded-lg p-4 shadow-md">
                        <h2 className="text-xl font-semibold text-purple-700">{programme.name}</h2>
                        <div className="mt-2 text-neutral-600">
                            <p>Degree Type: {programme.degree_type}</p>
                            <p>Credits: {programme.credits}</p>
                            <p>Courses: {programme.courses.length}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-row max-h-full max-w-full">
            <div id="main-content" className="w-full flex flex-col">
                <header id="top-buttons" className="m-8 mb-0 flex items-center justify-between">
                    <button id="user-identifier" className="bg-neutral-300 w-auto h-auto rounded-2xl text-2xl p-4">
                        User
                    </button>
                    <button id="notifications-button" className="bg-neutral-300 w-auto h-auto rounded-2xl text-2xl p-4">
                        Notifications
                    </button>
                </header>
                <main className="bg-neutral-300 rounded-3xl p-4 m-8">
                    <h1 className="ml-8 text-2xl font-bold mb-4 text-neutral-700">Search Programmes & Courses</h1>
                    <div id="search-bar" className="flex space-y-4 flex-col items-start bg-[#C3AAEA] rounded-xl p-4">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="w-full rounded-md p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
