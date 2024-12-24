import React, { useState, useEffect } from "react";
import "../styles/chat.css";
import translations from "../translate/Chat"; // Таржима матнларини импорт қилиш
import { useLanguage } from "../translate/LanguageContext"; // Фаол тилни олиш
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

  const saveUserName = (e) => {
    e.preventDefault();
    if (name.trim() === "" || surname.trim() === "") return;

    sessionStorage.setItem("name", name);
    sessionStorage.setItem("surname", surname);
    setShowModal(false);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const fullName = `${name} ${surname}`;
    const newMessage = {
      text: input,
      sender: fullName || "Anonymous",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);

    setTimeout(() => {
      const botResponse = {
        text: "Bu boshqa foydalanuvchi javobi!",
        sender: "Other",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1500);

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
                    <span className="message-text">{message.text}</span>
                    <span className="message-timestamp">
                      {message.timestamp}
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
