"use client"; // ✅ Ensures this file is a client component

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown"; // Import markdown rendering
import {
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid"; // Icons

export default function Home() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "**Hey there! I am VickAI 🤖, Vignesh's personal AI assistant.**\n\n" +
        "Think of me as your AI-powered Vignesh—I&apos;ll answer questions just like he would in an interview! 🎤\n\n" +
        "⚡ Fun fact: Unlike real interviews, I don&apos;t need coffee breaks!☕😆\n\n" +
        "Go ahead, ask me about Vignesh's skills, experience, projects, or even some fun facts! 🚀",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text:
          "**Hey there! I am VickAI 🤖, Vignesh's personal AI assistant.**\n\n" +
          "Think of me as your AI-powered Vignesh—I will answer questions just like he would in an interview! 🎤\n\n" +
          "⚡ Fun fact: Unlike real interviews, I do not need coffee breaks! ☕😆\n\n" +
          "Go ahead, ask me about Vignesh's skills, experience, projects, or even some fun facts! 🚀",
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
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
      {/* Header */}
      <header className="w-full max-w-4xl text-center mt-10">
        <h1 className="text-5xl font-extrabold text-blue-400">
          Vignesh Kumar Karthikeyan
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          AI Engineer | Machine Learning Enthusiast | Software Developer
        </p>
      </header>

      {/* Chatbot Section */}
      <div className="w-full max-w-3xl mt-10 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
          <ChatBubbleLeftEllipsisIcon className="h-6 w-6 mr-2 text-blue-400" />
          Chat with VickAI 🤖
        </h2>

        <div className="h-96 overflow-y-auto border border-gray-600 rounded-lg p-4 bg-gray-900">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-xs rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex mt-4">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-l-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 px-4 py-3 rounded-r-lg hover:bg-blue-600 disabled:bg-gray-500 flex items-center"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? (
              "..."
            ) : (
              <PaperAirplaneIcon className="h-5 w-5 text-white rotate-45" />
            )}
          </button>
        </div>
      </div>

      {/* Resume, Projects, Contact Section */}
      <div className="w-full max-w-3xl mt-10">
        {/* Resume */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-blue-400">📜 Resume</h2>
          <p className="text-gray-300 mt-2">
            Check out my resume for more details.
          </p>
          <a
            href="/VigneshCV.pdf"
            download
            className="inline-block mt-4 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Download Resume
          </a>
        </div>

        {/* Projects */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-blue-400">🚀 Projects</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href="https://ai-debate-agent-rby4ux2agtw4yxkrlgmkp8.streamlit.app/"
                className="text-blue-400 hover:underline"
              >
                AI Debate Agent
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400 hover:underline">
                AI-Powered Financial Research Chatbot
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400 hover:underline">
                Customer Churn Prediction
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-blue-400">📩 Contact</h2>
          <p className="text-gray-300 mt-2">Let's connect!</p>
          <p className="mt-2">
            📧{" "}
            <a
              href="mailto:vika2375@colorado.edu"
              className="text-blue-400 hover:underline"
            >
              vika2375@colorado.edu
            </a>
          </p>
          <p className="mt-2">
            🔗{" "}
            <a
              href="https://www.linkedin.com/in/k-vignesh-kumar"
              className="text-blue-400 hover:underline"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
