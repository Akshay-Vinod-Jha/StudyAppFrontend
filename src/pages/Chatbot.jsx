import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { chatbotAPI } from "../services/api";
import "../styles/Chatbot.css";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Chatbot() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! 👋 I'm your Study Buddy AI Assistant. I'm here to help you with your studies, answer questions, and provide tips to help you learn better. What would you like to know about?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue("");
    setError("");

    // Add user message to chat
    const userMsg = {
      id: messages.length + 1,
      type: "user",
      text: userMessage,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Convert message history to the format expected by API
      const history = messages
        .filter((msg) => msg.type !== "error")
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      const data = await chatbotAPI.chat(userMessage, history);

      // Add bot response to chat
      const botMsg = {
        id: messages.length + 2,
        type: "bot",
        text: data.data.response,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      let errorText = `Sorry, I encountered an error. Please try again.`;

      // Get detailed error from API response
      if (err.response?.data?.error) {
        errorText = err.response.data.error;
        if (err.response.data.details) {
          console.error("Backend error details:", err.response.data.details);
        }
      } else if (err.message) {
        errorText = err.message;
      }

      const errorMsg = {
        id: messages.length + 2,
        type: "bot",
        text: `Sorry, I encountered an error: ${errorText}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setError(errorText);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        text: "Hello! 👋 I'm your Study Buddy AI Assistant. I'm here to help you with your studies, answer questions, and provide tips to help you learn better. What would you like to know about?",
      },
    ]);
    setError("");
  };

  return (
    <div>
      <Navbar />
      <div className="chatbot-page">
        <div className="chatbot-header">
          <h1>Study Buddy AI Assistant</h1>
          <p>
            Ask me anything about your studies, homework, or study techniques!
          </p>
        </div>

        <div className="chatbot-container">
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type === "user" ? "user-message" : "bot-message"}`}
              >
                <div className="message-content">
                  {message.type === "bot" && (
                    <span className="bot-avatar">🤖</span>
                  )}
                  <div className="message-text">{message.text}</div>
                  {message.type === "user" && (
                    <span className="user-avatar">👤</span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot-message">
                <div className="message-content">
                  <span className="bot-avatar">🤖</span>
                  <div className="message-text typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-footer">
            {error && <div className="error-message">⚠️ {error}</div>}
            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question here..."
                disabled={loading}
                className="message-input"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="send-button"
              >
                {loading ? "..." : "Send"}
              </button>
            </form>
            <button onClick={clearChat} className="clear-button">
              Clear Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
