import React, { useState } from "react";

const Help: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="pt-20 flex items-center justify-center relative bg-white-500">
      <div className="z-10 max-w-md w-full p-1 bg-purple-500 rounded-lg shadow-lg text-center">
        <div className="z-10 max-w-md w-full p-6 bg-gray-100 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Help</h1>

          <p className="text-gray-600 mb-6">
            We're here to help you out whenever you run into a problem.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="mb-4">
              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={4}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Help;
