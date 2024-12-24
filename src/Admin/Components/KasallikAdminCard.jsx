import '../AdminStyles/kasallikAdmin.css'
import React, { useEffect, useReducer, useRef, useState } from 'react';
import axios from 'axios';
import { URL } from '../Utils/url';
function KasallikAdminCard() {
    const [diseases, setDiseases] = useState([]);
    const [id, setId] = useState('');
    const [update, forceUpdate] = useReducer((x) => x + 1, 0);
    const create_name = useRef();
    const create_description = useRef();
    const create_image = useRef(); // Rasm uchun ref
    const update_name = useRef();
    const update_description = useRef();
    const update_image = useRef();
    const update_form = useRef();

    useEffect(() => {
        getDiseases();
    }, [update]);

    // Kasalliklarni olish (GET)
    async function getDiseases() {
        try {
            const response = await axios.get(`${URL}/diseases`);
            setDiseases(response.data.data);
        } catch (error) {
            console.error('Kasalliklarni olishda xatolik:', error);
        }
    }

    // Kasallik yaratish (POST)
    async function createDisease(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', create_name.current.value);
        formData.append('description', create_description.current.value);
        if (create_image.current.files[0]) {
            formData.append('image', create_image.current.files[0]);
        }

        try {
            await axios.post(`${URL}/diseases`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            forceUpdate();
            create_name.current.value = '';
            create_description.current.value = '';
            create_image.current.value = null;
            alert('Kasallik muvaffaqiyatli qo‘shildi!');
        } catch (error) {
            console.error('Kasallik yaratishda xatolik:', error);
        }
    }

    // Kasallikni tahrirlash (PUT)
    async function updateDisease(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', update_name.current.value);
        formData.append('description', update_description.current.value);
        if (update_image.current.files[0]) {
            formData.append('image', update_image.current.files[0]);
        }

        try {
            await axios.put(`${URL}/diseases/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            forceUpdate();
            update_name.current.value = '';
            update_description.current.value = '';
            update_image.current.value = null;
            update_form.current.classList.remove('open');
        } catch (error) {
            console.error('Kasallikni tahrirlashda xatolik:', error);
        }
    }

    // Tahrirlash formasini ochish
    function openEditForm(e) {
        update_form.current.classList.add('open');
        setId(e.target.id);
        const selectedDisease = diseases.find((item) => item._id === e.target.id);
        if (selectedDisease) {
            update_name.current.value = selectedDisease.name;
            update_description.current.value = selectedDisease.description;
        }
    }

    // Kasallikni o'chirish (DELETE)
    async function deleteDisease(e) {
        try {
            await axios.delete(`${URL}/diseases/${e.target.id}`);
            forceUpdate();
        } catch (error) {
            console.error('Kasallikni o‘chirishda xatolik:', error);
        }
    }

  return (
    <div className="diseasesAdmin_card">
    <div className="adminDiseasesWrapper">
        {/* Yaratish formasi */}
        <h2>Kasalliklar</h2>
        <form onSubmit={(e) => createDisease(e)}>
            <input ref={create_name} type="text" placeholder="Kasallik nomi" required />
            <textarea ref={create_description} placeholder="Kasallik haqida" required></textarea>
            <input ref={create_image} type="file" accept="image/*" />
            <button type="submit">Kasallik qo'shish</button>
        </form>

        {/* Tahrirlash formasi */}
        <div>
            <form ref={update_form} className="updateForm" onSubmit={(e) => updateDisease(e)}>
                <input ref={update_name} type="text" placeholder="Kasallik nomi" required />
                <textarea ref={update_description} placeholder="Kasallik haqida" required></textarea>
                <input ref={update_image} type="file" accept="image/*" />
                <button type="submit">Kasallikni yangilash</button>
            </form>
        </div>

        {/* Kasalliklar ro'yxati */}
        <div className="grid">
            {diseases?.map((item) => (
                <div className="card" key={item._id}>
                    <h4>{item?.name}</h4>
                    <p>{item?.description}</p>
                    {item?.image && <img src={item.image} alt={item.name} />}
                    <button id={item._id} onClick={(e) => deleteDisease(e)}>
                        O'chirish
                    </button>
                    <button id={item._id} onClick={(e) => openEditForm(e)}>
                        Tahrirlash
                    </button>
                </div>
            ))}
        </div>
    </div>
</div>
  )
}

export default KasallikAdminCard
