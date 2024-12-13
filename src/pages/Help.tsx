import React, { useState } from "react";
import { sendHelpMessage } from "../api/helpApi"; 

const Help: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      const data = {
        question_text: message,
        user_email: email,
      };
      await sendHelpMessage(data);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-purple-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700"></div>
      <div className="absolute w-[150%] h-[150%] bg-white rounded-full opacity-10 transform rotate-45 -top-1/4 -left-1/4"></div>
      <div className="absolute w-[120%] h-[120%] bg-white rounded-full opacity-10 transform rotate-45 -top-1/3 -right-1/3"></div>

      <div className="z-10 max-w-md w-full p-6 bg-gray-100 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Help</h1>
        <p className="text-gray-600 mb-6">
          We're here to help you out whenever you run into a problem.
        </p>
        {success && (
          <div className="mb-4 text-green-500">Message sent successfully!</div>
        )}
        {error && <div className="mb-4 text-red-500">{error}</div>}
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
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Help;
