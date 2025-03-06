"use client"; // ✅ Required for React hooks

import { useState } from "react";

export default function Chatbot() {
  // ✅ Ensure this is a valid React component
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to send user input to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6">
      <h1 className="text-4xl font-bold text-blue-400">Chat with My AI 🤖</h1>
      <p className="text-gray-300 mt-2">Ask me anything about Vignesh Kumar!</p>

      <div className="w-full max-w-2xl mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="h-80 overflow-y-auto border-b border-gray-600 pb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <p
                className={`px-4 py-2 rounded-lg ${
                  msg.sender === "user" ? "bg-blue-500" : "bg-gray-700"
                } mt-2`}
              >
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex mt-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
            placeholder="Type a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-gray-500"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}
