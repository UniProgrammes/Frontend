import React, { useState }  from "react";


function Profile() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string); 
            };
            reader.readAsDataURL(file); 
        }
    };
    return (
        <div className="flex flex-row max-h-full max-w-full">

            <div id="main-content" className="w-full flex flex-col">
                <header id="top-buttons" className="m-8 flex items-center justify-between">
                    <button id="user-identifier" className="bg-neutral-300 rounded-2xl text-2xl p-4">User</button>
                    <button id="notifications-button" className="bg-neutral-300 rounded-2xl text-2xl p-4">Notifications</button>
                </header>

                <main className="bg-neutral-200 rounded-3xl p-8 m-8">
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-4">Change your profile settings</h2>
                        <div className="relative mb-6">
                        <img
                                className="w-52 h-52 rounded-full border-4 border-white object-cover"
                                src={selectedImage || "https://via.placeholder.com/150"}
                                alt="Profile"
                            />
                            <button
                                className="absolute bottom-0 right-9 bg-purple-600 text-white rounded-full p-2"
                                onClick={() => document.getElementById("file-input")?.click()}
                            >
                                Change photo
                            </button>
                            <input
                                type="file"
                                id="file-input"
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <form className="w-full max-w-lg space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="username"
                                    type="text"
                                    placeholder="e.g. Jane Smith"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="janesmith@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    New Password
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="New Password"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeat-password">
                                    Repeat Password
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="repeat-password"
                                    type="password"
                                    placeholder="Repeat Password"
                                />
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Apply changes
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
