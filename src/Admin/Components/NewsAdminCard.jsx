import React, { useEffect, useReducer, useRef, useState } from 'react';
import axios from 'axios';
import { URL } from '../Utils/url';
import '../AdminStyles/newsAdmin.css';

function NewsAdminCard() {
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [id, setId] = useState('');
    const [update, forceUpdate] = useReducer(x => x + 1, 0);

    // Ref'lar formalar uchun
    let create_title = useRef();
    let create_content = useRef();
    let create_category = useRef();
    let create_image = useRef(); // Rasm uchun ref
    let update_title = useRef();
    let update_content = useRef();
    let update_category = useRef();
    let update_image = useRef(); // Tahrirlash uchun rasm ref
    let update_form = useRef();

    useEffect(() => {
        getNews();
        getCategories();
    }, [update]);

    // Yangiliklarni olish (GET)
    async function getNews() {
        try {
            const response = await axios.get(`${URL}/news`);
            setNews(response.data.data);
        } catch (error) {
            console.error('Yangiliklarni olishda xatolik yuz berdi:', error);
        }
    }

    // Kategoriyalarni olish (GET)
    async function getCategories() {
        try {
            const response = await axios.get(`${URL}/categories`);
            setCategories(response.data.data);
        } catch (error) {
            console.error('Kategoriyalarni olishda xatolik yuz berdi:', error);
        }
    }

    // Yangilik yaratish (POST)
    async function createNews(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', create_title.current.value);
        formData.append('content', create_content.current.value);
        formData.append('category', create_category.current.value);
        if (create_image.current.files[0]) {
            formData.append('image', create_image.current.files[0]);
        }

        try {
            await axios.post(`${URL}/news`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            forceUpdate();
            create_title.current.value = '';
            create_content.current.value = '';
            create_category.current.value = '';
            create_image.current.value = '';
            alert('Yangilik muvaffaqiyatli qo‘shildi!');
        } catch (error) {
            console.error('Yangilikni yaratishda xatolik yuz berdi:', error);
        }
    }

    // Yangilikni tahrirlash (PUT)
    async function updateNews(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', update_title.current.value);
        formData.append('content', update_content.current.value);
        formData.append('category', update_category.current.value);
        if (update_image.current.files[0]) {
            formData.append('image', update_image.current.files[0]);
        }

        try {
            await axios.put(`${URL}/news/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            forceUpdate();
            update_title.current.value = '';
            update_content.current.value = '';
            update_category.current.value = '';
            update_image.current.value = '';
            update_form.current.classList.remove('open');
        } catch (error) {
            console.error('Yangilikni tahrirlashda xatolik yuz berdi:', error);
        }
    }

    // Tahrirlash formasini ochish
    function openEditForm(e) {
        update_form.current.classList.add('open');
        setId(e.target.id);
        const selectedNews = news.find(item => item._id === e.target.id);
        if (selectedNews) {
            update_title.current.value = selectedNews.title;
            update_content.current.value = selectedNews.content;
            update_category.current.value = selectedNews.category;
        }
    }

    // Yangilikni o'chirish (DELETE)
    async function deleteNews(e) {
        try {
            await axios.delete(`${URL}/news/${e.target.id}`);
            forceUpdate();
        } catch (error) {
            console.error('Yangilikni o‘chirishda xatolik yuz berdi:', error);
        }
    }

    return (
        <div className='newsAdmin_card'>
            <div className="adminNewsWrapper">
                {/* Yaratish formasi */}
                <h2>Yangiliklar</h2>
                <form onSubmit={(e) => createNews(e)}>
                    <input ref={create_title} type="text" placeholder='Yangilik sarlavhasi' required />
                    <textarea ref={create_content} placeholder='Yangilik matni' required></textarea>
                    <select ref={create_category} required>
                        <option value="">Kategoriya tanlang</option>
                        {categories?.map(category => (
                            <option key={category._id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                    <input ref={create_image} type="file" accept="image/*" />
                    <button type="submit">Yangilik qo'shish</button>
                </form>

                {/* Yangilash formasi */}
                <div>
                    <form ref={update_form} className='updateForm' onSubmit={(e) => updateNews(e)}>
                        <input ref={update_title} type="text" placeholder='Yangilik sarlavhasi' required />
                        <textarea ref={update_content} placeholder='Yangilik matni' required></textarea>
                        <select ref={update_category} required>
                            <option value="">Kategoriya tanlang</option>
                            {categories?.map(category => (
                                <option key={category._id} value={category.name}>{category.name}</option>
                            ))}
                        </select>
                        <input ref={update_image} type="file" accept="image/*" />
                        <button type="submit">Yangilikni yangilash</button>
                    </form>
                </div>

                {/* Yangiliklar ro'yxati */}
                <div className="grid">
                    {news?.map((item) => (
                        <div className="card" key={item._id}>
                            <h4>{item?.title}</h4>
                            <p>{item?.content}</p>
                            <p><strong>Kategoriya:</strong> {item?.category || 'Noma’lum'}</p>
                            {item.image && <img src={`${URL}/uploads/${item.image}`} alt={item.title} />}
                            <button id={item._id} onClick={(e) => deleteNews(e)}>O'chirish</button>
                            <button id={item._id} onClick={(e) => openEditForm(e)}>Tahrirlash</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NewsAdminCard;
