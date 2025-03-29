"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "Ask me anything — I'm ready when you are! 👋",
      },
    ]);
  }, []);
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (
      chatContainerRef.current &&
      messages.length > lastMessageCount &&
      lastMessage?.sender === "bot"
    ) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      setLastMessageCount(messages.length);
    }
  }, [messages]);

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
  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN"; // Set to Indian English accent

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Set recognized speech as input
        sendMessage(); // Auto-send message after recognition
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event);
      };

      recognition.start();
    } else {
      console.log("Speech recognition is not supported in this browser.");
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
      {/* Main Header (Centered at the Top) */}
      <header className="w-full text-center mt-10 flex flex-col items-center">
        {/* Small Circular Profile Image */}
        <img
          src="/profile.jpeg"
          alt="Vignesh Kumar Karthikeyan"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-md mb-5"
        />

        {/* Name & Title */}
        <h1 className="text-5xl font-extrabold text-blue-400">
          Vignesh Kumar Karthikeyan
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          AI Engineer | Machine Learning Enthusiast | Software Developer
        </p>
      </header>

      {/* Main Content Wrapper */}
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mt-10 gap-10">
        {/* Introduction (Centered at the Top) */}
        <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-lg text-gray-300">
            Hi, I'm Vignesh Kumar Karthikeyan, a passionate AI Engineer and
            Machine Learning enthusiast with expertise in building intelligent
            systems, predictive models, and chatbots. I specialize in NLP, deep
            learning, and cloud-based AI solutions. My goal is to create
            cutting-edge AI applications that make a meaningful impact. 🚀
          </p>
        </div>
        {/* Resume Section at Top */}
        <section id="resume" className="w-full max-w-4xl mt-10 text-center">
          <h2 className="text-3xl font-semibold text-blue-400">📄 Resume</h2>
          <p className="text-gray-300 mt-2">
            Preview or download my resume below.
          </p>

          {/* Embedded PDF viewer */}
          <div className="mt-6">
            <iframe
              src="/VIgneshKumarCV.pdf"
              width="100%"
              height="500px"
              className="rounded-lg border border-gray-700 shadow-md"
            ></iframe>
          </div>

          {/* Buttons */}
          <div className="mt-4">
            <a
              href="/VIgneshKumarCV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-blue-500 hover:scale-105 transition-all duration-300"
            >
              View Fullscreen
            </a>
            <a
              href="/VIgneshKumarCV.pdf"
              download
              className="inline-block px-6 py-3 ml-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Download Resume
            </a>
          </div>
        </section>
      </div>
      {/* Chatbot Section – Just below Resume */}
      {/* Chatbot Section – Centered above Contact */}
      <div
        id="chatbot"
        className="w-full max-w-5xl mt-20 bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 hover:shadow-xl"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-300 mb-4 flex items-center justify-center">
          <ChatBubbleLeftEllipsisIcon className="h-6 w-6 mr-2 text-blue-400" />
          Chat with VickAI 🤖
        </h2>
        <p className="text-base md:text-lg text-gray-300 mb-4 text-center leading-relaxed">
          Hey there! I’m <strong>VickAI 🤖</strong> — Vignesh’s personal AI
          assistant! <br />
          <strong>Skip the scrolling</strong> — just ask me what you're looking
          for. (Literally Anything!)
        </p>

        {/* Chat History */}
        <div
          ref={chatContainerRef}
          className="h-64 md:h-[500px] overflow-y-auto border border-gray-600 rounded-lg p-3 md:p-4 bg-gray-900"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-2 md:mb-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } animate-slide-up`}
            >
              <div
                className={`px-3 py-2 md:px-4 md:py-2 max-w-[80%] rounded-lg ${
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

        {/* Input Section */}
        <div className="flex mt-3 md:mt-4">
          <button
            className="bg-gray-600 px-3 md:px-4 py-2 md:py-3 rounded-l-lg hover:bg-gray-700 flex items-center transition-all duration-300"
            onClick={startListening}
          >
            <MicrophoneIcon className="h-5 w-5 text-white" />
          </button>
          <input
            type="text"
            className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gray-700 text-white border border-gray-600 focus:outline-none rounded-r-none"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 px-3 md:px-4 py-2 md:py-3 rounded-r-lg hover:bg-blue-600 disabled:bg-gray-500 flex items-center transition-all duration-300"
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

        {/* Control Buttons */}
        <div className="mt-2 md:mt-3 flex gap-2 md:gap-4 justify-center">
          <button
            className="bg-red-500 px-3 md:px-4 py-2 rounded-lg hover:bg-red-600 flex items-center transition-all duration-300"
            onClick={stopSpeaking}
            disabled={!isSpeaking}
          >
            <StopIcon className="h-5 w-5 text-white inline-block mr-1 md:mr-2" />
            Stop Speaking
          </button>
          <button
            className="bg-gray-500 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center transition-all duration-300"
            onClick={toggleSpeech}
          >
            {speechEnabled ? "🔊 Disable Speech" : "🔈 Enable Speech"}
          </button>
        </div>
      </div>

      {/* Education Section */}
      <div id="education" className="w-full max-w-3xl mt-10">
        <h2 className="text-3xl font-semibold text-blue-400 text-center">
          🎓 Education
        </h2>
        <div className="border-l-4 border-blue-400 pl-4 mt-4 text-left animate-fade-in">
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
      <div id="experience" className="w-full max-w-3xl mt-10">
        <h2 className="text-3xl font-semibold text-blue-400 text-center">
          💼 Work Experience
        </h2>
        <div className="border-l-4 border-blue-400 pl-4 mt-4 text-left animate-fade-in">
          <p>
            <strong>AI/ML Engineer</strong> - Alliant National Title Insurance
            Co. (Capstone project) (Sep 2024 – Present)
          </p>
          <p className="text-gray-400">
            Implementing an Azure based AI-driven Named Entity Recognition (NER)
            system, automating data extraction from legal documents within a
            structured SDLC framework. Collaborating in a cross-functional team,
            contributing to weekly sprint meetings, resolving technical
            blockers, and designing a responsive query interface to improve
            document retrieval efficiency.
          </p>
          <br />
          <p>
            <strong>MSCS Course Facilitator</strong> - University of Colorado
            Boulder (Apr 2024 – Present)
          </p>
          <p className="text-gray-400">
            Served as the primary point of contact for 120 students, conducting
            regular online office hours to resolve course-related questions and
            manage course support by ensuring timely responses via Salesforce.
            Facilitating courses covering Data Mining, Machine Learning, and
            Deep Learning, providing guidance on key concepts and technical
            problem-solving.
          </p>
          <br />
          <p>
            <strong>Data Automation and Entry Technician</strong> - University
            of Colorado Boulder (Oct 2023 – Apr 2024)
          </p>
          <p className="text-gray-400">
            Built a Python-based automation solution to extract data from HVAC
            related documents, reducing manual data entry. Integrated Selenium
            for web-based automation, reducing processing time by 95% and saving
            approx. $1,000 weekly.
          </p>
          <br />
          <p>
            <strong>Intern</strong> - Intel Corporation (Jan 2023 – Jun 2023)
          </p>
          <p className="text-gray-400">
            Developed a Python-based automation system to extract JSON data from
            70,000 devices via REST APIs, reducing processing time by 90% and
            enhancing pipeline efficiency, stability, and reliability. Currently
            in use with Intel Employee devices in the United States, Israel,
            Malaysia, and India. Collaborated in an Agile Scrum team,
            participating in sprint planning, daily stand-ups, and
            retrospectives while developing automation and data extraction
            pipelines, ensuring smooth integration and continuous improvements.
          </p>
        </div>
      </div>
      {/* Projects Section */}
      <div id="projects" className="w-full max-w-3xl mt-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-blue-400">🚀 Projects</h2>
          <ul className="mt-4 space-y-4 text-left">
            <li>
              <strong>
                🔹 AI Debate Agent: FastAPI, Gemini API, Streamlit, Render
              </strong>{" "}
              <p className="text-gray-300 mt-1">
                Developed a dynamic LLM-powered application that debates any
                topic with structured arguments for and against, using Google
                Gemini 2.0 Flash API. The backend is built with FastAPI and
                hosted on Render, while the frontend is developed in Streamlit
                and deployed on Streamlit Cloud. The system intelligently
                generates reasoned viewpoints by leveraging prompt engineering
                and fine-tuned Gemini models.
              </p>
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
              <strong>
                🔹 ResumeGPT: FastAPI, Streamlit, Google Gemini, Embeddings
              </strong>
              <p className="text-gray-300 mt-1">
                Built an end-to-end AI-powered career assistant that parses
                resumes (PDF), matches them to suitable job roles using semantic
                embeddings (SentenceTransformers), and provides Gemini-powered
                feedback on resume quality and direction. It also generates
                personalized skill gap analysis with curated learning paths. The
                backend is built with FastAPI, and the Streamlit frontend is
                hosted on Streamlit Cloud.
              </p>
              <a
                href="https://github.com/ivky03/ai-resume-analyzer"
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>

            <li>
              <strong>
                🔹 AI-Powered Financial Research Chatbot: Python, RAG, FastAPI,
                Next.js, Google Cloud
              </strong>{" "}
              <p className="text-gray-300 mt-1">
                Developed and deployed an AI-driven financial research chatbot
                using FastAPI (Python) and Google Gemini API with
                Retrieval-Augmented Generation (RAG) to provide intelligent
                answers from financial reports and market data. Built a Next.js
                (TypeScript) frontend hosted on Vercel, and deployed the backend
                on Google Cloud Run with Docker & Artifact Registry. Integrated
                PostgreSQL (Cloud SQL) to store chat history, optimized
                retrieval using FAISS/Pinecone, and implemented Google Cloud
                Build CI/CD for automated deployment.
              </p>
              <a
                href="https://github.com/ivky03/AI-financial-chatbot"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <strong>
                🔹 Customer Churn Prediction: Python, Machine Learning, IBM
                Cloud
              </strong>{" "}
              <p className="text-gray-300 mt-1">
                Built an ML pipeline to predict customer churn (96.1% accuracy)
                and estimate revenue, using Logistic Regression, Random Forest,
                XGBoost (classification) and Linear Regression, Random Forest
                Regressor, XGBoost Regressor (regression). Optimized performance
                via feature engineering, hyperparameter tuning (GridSearchCV,
                RandomizedSearchCV), and deployed a Flask API on IBM Cloud,
                integrating IBM WatsonX for training and IBM COS for model
                storage, enabling real-time predictions
              </p>
            </li>
            <li>
              <strong>
                🔹 Wind Power Forecasting with Ensemble
                Model(LSTM,Transformers,GBDT): Python, Deep Learning
              </strong>{" "}
              <p className="text-gray-300 mt-1">
                Developed an Ensemble Model (Transformer, LSTM, GBDT) for
                time-series wind power forecasting, improving accuracy by 60%
                over traditional models and reducing MAE by 58% and RMSE by 56%,
                significantly enhancing prediction reliability
              </p>
              <a
                href="https://github.com/ivky03/Wind-Power-Forecasting-using-Ensemble-Learning"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <strong>🔹 Movie Revenue and Recommendation System</strong>
              <p className="text-gray-300 mt-1">
                Enhanced a linear regression model for predicting movie revenues
                with 70.34% accuracy and developed a hybrid recommendation
                system using collaborative and content filtering with movie
                genre weightages
              </p>

              <a
                href="https://github.com/ivky03/Movie-Recommendation-System"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div id="contact" className="text-center mt-10">
          <h2 className="text-3xl font-semibold text-blue-400">📩 Contact</h2>
          <p className="mt-4 text-gray-300">Feel free to connect with me:</p>
          {/* ✅ Added description */}
          {/* School Email */}
          <p className="mt-4">
            🎓 School Email:{" "}
            <a
              href="mailto:vika2375@colorado.edu"
              className="text-blue-400 hover:underline"
            >
              vika2375@colorado.edu
            </a>
          </p>
          {/* Personal Email */}
          <p className="mt-4">
            ✉️ Personal Email:{" "}
            <a
              href="mailto:kvk1011@gmail.com"
              className="text-blue-400 hover:underline"
            >
              kvk1011@gmail.com
            </a>
          </p>
          <p className="mt-4">
            LinkedIn:{" "}
            <a
              href="https://www.linkedin.com/in/k-vignesh-kumar"
              className="text-blue-400 hover:underline"
            >
              Profile
            </a>
          </p>
          {/* GitHub (Newly Added) */}
          <p className="mt-4">
            💻 GitHub:{" "}
            <a
              href="https://github.com/ivky03"
              className="text-blue-400 hover:underline"
            >
              github.com/ivky03
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
