import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
const apiKey: string = import.meta.env.VITE_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const ChatBot2 = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<
    {
      message: any;
      type: string;
      sender: "user" | "bot";
      text: string;
    }[]
  >([
    {
      type: "bot",
      message: "Hello! How can I help you today?",
      sender: "bot",
      text: "Hello! How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setMessages((prev) => [
      ...prev,
      { message: prompt, type: "user", sender: "user", text: prompt },
    ]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      setMessages((prev) => [
        ...prev,
        { message: text, type: "bot", sender: "bot", text: text },
      ]);
    } catch (err) {
      console.error("Error generating response:", err);
      setMessages((prev) => [
        ...prev,
        {
          message: "Failed to generate response",
          type: "bot",
          sender: "bot",
          text: "Failed to generate response",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" ">
      <button
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {isOpen && (
        <div className="max-w-lg mx-auto p-4 border rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">Chat with AI</h2>
          <div className="h-80 overflow-y-auto p-2 border rounded bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-2 rounded ${
                  msg.type === "user"
                    ? "bg-blue-200 text-right"
                    : "bg-green-200 text-left"
                }`}
              >
                <strong>{msg.type === "user" ? "You" : "AI"}:</strong>
                {msg.message}
              </div>
            ))}
            {loading && <div className="text-gray-500">AI is thinking...</div>}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
            />
            <button
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot2;
