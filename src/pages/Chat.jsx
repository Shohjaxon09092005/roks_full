import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "../styles/chat.css";
import translations from "../translate/Chat"; // Таржима матнларини импорт қилиш
import { useLanguage } from "../translate/LanguageContext"; // Фаол тилни олиш

const socket = io("https://clinic-web-back.onrender.com", {
  transports: ["websocket", "polling"]
});

function Chat() {
  const { language } = useLanguage(); // Фаол тилни олиш
  const t = translations[language]; // Фаол тилга мос таржималар
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // SessionStorage’dan ism va familiyani olish
    const storedName = sessionStorage.getItem("name");
    const storedSurname = sessionStorage.getItem("surname");
    if (storedName && storedSurname) {
      setName(storedName);
      setSurname(storedSurname);
    } else {
      setShowModal(true);
    }
  }, []);

  // 🟢 API orqali eski xabarlarni olish
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://clinic-web-back.onrender.com/api/chat");
        const data = await response.json();
        console.log("📩 API dan kelgan xabarlar:", data);
        setMessages(Array.isArray(data.chats) ? data.chats : []);
      } catch (error) {
        console.error("❌ API dan xabarlarni olishda xato:", error);
      }
    };

    fetchMessages();
  }, []);

  // 🟢 WebSocket orqali yangi xabarlarni olish
  useEffect(() => {
    socket.on("chats", (chats) => {
      console.log("📩 WebSocket orqali eski xabarlar:", chats);
      setMessages(Array.isArray(chats) ? chats : []);
    });

    socket.on("message", (message) => {
      console.log("📩 WebSocket orqali yangi xabar:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("chats");
      socket.off("message");
    };
  }, []);

  const saveUserName = (e) => {
    e.preventDefault();
    if (name.trim() === "" || surname.trim() === "") return;

    sessionStorage.setItem("name", name);
    sessionStorage.setItem("surname", surname);
    setShowModal(false);
  };

  // 🟢 Xabar yuborish funksiyasi
  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const fullName = `${name} ${surname}`;
    const newMessage = {
      message: input.trim(), // API to‘g‘ri formatda qabul qiladi
      sender: fullName || "Anonymous",
      timestamp: new Date().toISOString(),
    };

    try {
      // 1️⃣ WebSocket orqali xabar yuborish
      socket.emit("sendMessage", newMessage);
      console.log("📤 WebSocket orqali yuborildi:", newMessage);

      // 2️⃣ API orqali xabar yuborish
      const response = await fetch("https://clinic-web-back.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
      const data = await response.json();
      console.log("📤 API orqali yuborildi:", data);

      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("❌ Xabar yuborishda xato:", error);
    }

    setInput("");
  };

  return (
    <div className="personal">
      <div className="container">
        <div className="profile-page">
          <main className="main-content">
            <div className="chat-container">
              <div className="chat-header">{t.title}</div>
              <div className="chat-body">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-message ${
                      message.sender === `${name} ${surname}`
                        ? "chat-sender"
                        : "chat-receiver"
                    }`}
                  >
                    <span className="message-sender">{message.sender}</span>
                    <span className="message-text">{message.message}</span>
                    <span className="message-timestamp">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="chat-footer">
                <form onSubmit={sendMessage}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.placeholder}
                  />
                  <button type="submit">{t.send}</button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal oyna */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{t.modal.fullName}</h2>
            <form onSubmit={saveUserName}>
              <input
                type="text"
                placeholder={t.modal.firstName}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder={t.modal.lastName}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              /> <br />
              <button type="submit">{t.modal.save}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
