import React, { useState, useEffect } from 'react';
import '../styles/commentService.css';

function CommentService({title,placeholder,btn_submit,success,success_desc,fullName,name_plc,surname_plc,save_full,del_full}) {
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  // SessionStorage dan ma'lumotni olish
  useEffect(() => {
    const savedName = sessionStorage.getItem('name');
    const savedSurname = sessionStorage.getItem('surname');

    if (savedName) setName(savedName);
    if (savedSurname) setSurname(savedSurname);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !surname) {
      setIsModalOpen(true); // Ism va familiya yo'q bo'lsa, modalni ochish
    } else {
      submitComment();
    }
  };

  const submitComment = () => {
    setSubmitted(true); // Formani yuborilgan holatga o‘tkazish

    // Jo‘natilgandan keyin 3 soniyada formani qayta ochish
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
    }, 3000);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();

    // SessionStorage-ga ism va familiyani saqlash
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('surname', surname);

    setIsModalOpen(false); // Modalni yopish
    submitComment(); // Fikrni jo'natish
  };

  return (
    <div className="comment-box">
      {!submitted ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <h3 className="comment-title">{title}</h3>
          <textarea
            className="comment-textarea"
            placeholder={placeholder}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button type="submit" className="comment-button">{btn_submit}</button>
        </form>
      ) : (
        <div className="comment-success">
          <h3 className="success-title">{success}</h3>
          <p>{success_desc}</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">{fullName}</h3>
            <form onSubmit={handleModalSubmit}>
              <input
                type="text"
                className="modal-input"
                placeholder={name_plc}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                className="modal-input"
                placeholder={surname_plc}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="modal-button">{save_full}</button>
                <button
                  type="button"
                  className="modal-button modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  {del_full}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentService;
