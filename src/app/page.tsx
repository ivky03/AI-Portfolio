"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
  MicrophoneIcon,
  StopIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text:
          "**Hey there! I am VickAI 🤖, Vignesh's personal AI assistant.**\n\n" +
          "I will answer your questions like Vignesh himself. 🎤\n\n" +
          "🔊 **I will also speak my answers, but you can stop my voice anytime.** Click the **Stop Speaking** button if you prefer reading only. ✅\n\n" +
          "Go ahead, ask me about Vignesh's skills, experience, projects, or even some fun facts! 🚀",
      },
    ]);
  }, []);

  let speechInstance: SpeechSynthesisUtterance | null = null;

  const speak = (text: string) => {
    if ("speechSynthesis" in window && speechEnabled) {
      if (speechInstance) {
        speechSynthesis.cancel();
      }

      speechInstance = new SpeechSynthesisUtterance(text);
      speechInstance.lang = "en-IN";
      speechInstance.rate = 1;
      setIsSpeaking(true);

      const voices = speechSynthesis.getVoices();
      speechInstance.voice =
        voices.find((voice) =>
          voice.name.includes("Google India English Male")
        ) ||
        voices.find((voice) => voice.lang === "en-IN") ||
        voices[0];

      speechInstance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(speechInstance);
    } else {
      console.log("Text-to-Speech not supported.");
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled((prev) => !prev);
  };

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

        if (speechEnabled) speak(data.reply);
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
      {/* Introduction */}
      <div className="w-full max-w-3xl mt-6 text-center bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-lg text-gray-300">
          Hi, I'm Vignesh Kumar Karthikeyan, a passionate AI Engineer and
          Machine Learning enthusiast with expertise in building intelligent
          systems, predictive models, and chatbots. I specialize in NLP, deep
          learning, and cloud-based AI solutions. My goal is to create
          cutting-edge AI applications that make a meaningful impact. 🚀
        </p>
      </div>

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
      </div>
      {/* Education Section */}
      <div className="w-full max-w-3xl mt-10">
        <h2 className="text-3xl font-semibold text-blue-400 text-center">
          🎓 Education
        </h2>
        <div className="border-l-4 border-blue-400 pl-4 mt-4 text-left">
          <p>
            <strong>Master’s in Computer Science (AI Specialization)</strong> -
            University of Colorado Boulder (2023 - 2025)
          </p>
          <br />
          <p>
            <strong>B.E. in Computer Science & Engineering</strong> - College of
            Engineering, Guindy, Anna University (2019 - 2023)
          </p>
        </div>
      </div>
      {/* Work Experience Section */}
      <div className="w-full max-w-3xl mt-10">
        <h2 className="text-3xl font-semibold text-blue-400 text-center">
          💼 Work Experience
        </h2>
        <div className="border-l-4 border-blue-400 pl-4 mt-4 text-left">
          <p>
            <strong>AI/ML Engineer</strong> - Alliant National Title Insurance
            Co. (Sep 2024 – Present)
          </p>
          <p className="text-gray-400">
            Developed an Azure-based AI-driven NER system for legal document
            processing.
          </p>
          <br />
          <p>
            <strong>MSCS Course Facilitator</strong> - University of Colorado
            Boulder (Apr 2024 – Present)
          </p>
          <p className="text-gray-400">
            Assisting students in Data Mining, Machine Learning, and AI courses.
          </p>
          <br />
          <p>
            <strong>Data Automation and Entry Technician</strong> - University
            of Colorado Boulder (Oct 2023 – Apr 2024)
          </p>
          <p className="text-gray-400">
            Developed a Selenium based solution to automate data entry and cost
            savings upto $1000/week
          </p>
          <br />
          <p>
            <strong>Intern</strong> - Intel Corporation (Jan 2023 – Jun 2023)
          </p>
          <p className="text-gray-400">
            Automated data processing for 70,000 devices via REST API.
          </p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="w-full max-w-3xl mt-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-blue-400">🚀 Projects</h2>
          <ul className="mt-4 space-y-4 text-left">
            <li>
              <strong>🔹 AI Debate Agent</strong> - AI-powered system that
              debates topics dynamically.
              <br />
              <a
                href="https://ai-debate-agent-rby4ux2agtw4yxkrlgmkp8.streamlit.app/"
                className="text-blue-400 hover:underline"
              >
                Live Demo
              </a>{" "}
              |{" "}
              <a
                href="https://github.com/ivky03/ai-debate-agent"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <strong>🔹 AI-Powered Financial Research Chatbot</strong> - NLP
              chatbot providing insights from financial data.
              <br />
              <a
                href="https://github.com/ivky03/financial-chatbot"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <strong>🔹 Customer Churn Prediction</strong> - ML model
              predicting customer retention rates.
              <br />
              <a
                href="https://github.com/ivky03/customer-churn"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <strong>
                🔹 Wind Power Forecasting with Ensemble
                Model(LSTM,Transformers,GBDT)
              </strong>{" "}
              - ML model predicting wind power forecasting.
              <br />
              <a
                href="https://github.com/ivky03/Wind-Power-Forecasting-using-Ensemble-Learning"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <strong>🔹 Movie Recommendation System</strong> - ML model
              predicting movie titles based on Collaborative and Content
              Filtering methods.
              <br />
              <a
                href="https://github.com/ivky03/Movie-Recommendation-System"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
        {/* Resume Section */}
        <div className="w-full max-w-3xl mt-10 text-center">
          <h2 className="text-3xl font-semibold text-blue-400">📜 Resume</h2>
          <p className="text-gray-300 mt-2">
            Download my resume for more details on my experience and skills.
          </p>
          <a
            href="/VigneshCV.pdf"
            download
            className="inline-block mt-4 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Download Resume
          </a>
        </div>
        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-blue-400">📩 Contact</h2>
          <p>Email: vika2375@colorado.edu</p>
          <p>
            LinkedIn:{" "}
            <a
              href="https://www.linkedin.com/in/k-vignesh-kumar"
              className="text-blue-400 hover:underline"
            >
              Profile
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
