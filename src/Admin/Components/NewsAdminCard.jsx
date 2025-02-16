import React, { useEffect, useReducer, useRef, useState } from "react";
import '../AdminStyles/newsAdmin.css';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { URL } from "../Utils/url";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "../Utils/authRefreshToken";
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function NewsAdminCard() {
    const [fileName, setFileName] = useState("");
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Tanlangan fayl
        if (file) {
            setFileName(file.name); // Fayl nomini o'rnatish
        } else {
            setFileName(""); // Agar fayl tanlanmasa, nomni tozalash
        }
    };
    // Update
    const [update, forceUpdate] = useReducer(x => x + 1, 0);

    // Yaratish uchun
    let news_image = useRef();
    let name_uz = useRef();
    let name_ru = useRef();
    let name_eng = useRef();
    let news_description_uz = useRef();
    let news_description_ru = useRef();
    let news_description_eng = useRef();
    let date = useRef();

    //Yangilash uchun
    let upd_news_image = useRef();
    let upd_name_uz = useRef();
    let upd_name_ru = useRef();
    let upd_name_eng = useRef();
    let upd_news_description_uz = useRef();
    let upd_news_description_ru = useRef();
    let upd_news_description_eng = useRef();
    let upd_date = useRef();

    //navigate
    let navigate = useNavigate()

    // Shifrlangan ma'lumotni cookie'dan olish
    const encryptedAccessToken = Cookies.get('access_token');
    const encryptedStoredTime = Cookies.get('stored_time');

    // Ma'lumotni dekodlash
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
    const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);

    //GET
    const [news, setNews] = useState(null);
    useEffect(() => {
        getNews()
    }, [update])
    async function getNews() {
        let fetchNews = await fetch(`${URL}/news`);
        let json = await fetchNews.json();
        let sortedNews = json?.news.sort((a, b) => a.id - b.id);
        setNews(sortedNews)
    }
    // POST
    async function CreateNews(e) {
        e.preventDefault();
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        const formDataNews = new FormData();
        formDataNews.append("image", news_image.current.files[0]);
        formDataNews.append("name_uz", name_uz.current.value.trim());
        formDataNews.append("name_ru", name_ru.current.value.trim());
        formDataNews.append("name_eng", name_eng.current.value.trim());
        formDataNews.append("description_uz", news_description_uz.current.value.trim());
        formDataNews.append("description_ru", news_description_ru.current.value.trim());
        formDataNews.append("description_eng", news_description_eng.current.value.trim());
        formDataNews.append("date", date.current.value);

        if (timeDiff < 9.5) {
            try {
                const responceNews = await fetch(`${URL}/news`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                    body: formDataNews,
                });
                if (responceNews.ok) {
                    const result = await responceNews.json();
                    forceUpdate()
                    console.log('employe created sccff:', result);
                    alert("Muvaffaqiyatli qo'shildi")
                    setFileName("");
                    name_uz.current.value = ""
                    name_ru.current.value = ""
                    name_eng.current.value = ""
                    news_description_uz.current.value = ""
                    news_description_ru.current.value = ""
                    news_description_eng.current.value = ""
                    date.current.value = ""

                } else if (responceNews.status === 401) {
                    console.log('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...')
                    Cookies.remove("role")
                    navigate('/admin-panel');
                } else {
                    console.log('xatolik yuz berdi:', `${responceNews.statusText} errors, or phone number may be valid.`);
                    alert("xatolik yuz berdi")

                }

            } catch (error) {
                console.log('Serverga ulanishda xatolik:', error.message);
                alert("Serverga ulanishda xatolik")
            }
        } else {
            // Tokenni yangilash
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                CreateNews(e); // Yangi token bilan qayta chaqirish
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }
        }


    }
    //PUT
    let modalValue = useRef()
    const [valueId, setValueId] = useState('')

    function removeModal_value() {
        modalValue.current.classList.remove("open_modal_value")
    }
    function updateValue1(e, id) {
        e.preventDefault()
        setValueId(id)
        modalValue.current.classList.add("open_modal_value")
        console.log(id);

    }
    const filteredValue = news?.find((a) => a?.id === valueId)


    async function updateValue(e) {
        e.preventDefault()

        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        const formData_upd = new FormData();
        formData_upd.append("image", upd_news_image.current.files[0]); // Faylni qo'shish
        formData_upd.append("name_uz", upd_name_uz.current.value.trim());
        formData_upd.append("name_ru", upd_name_ru.current.value.trim());
        formData_upd.append("name_eng", upd_name_eng.current.value.trim());
        formData_upd.append("description_uz", upd_news_description_uz.current.value.trim());
        formData_upd.append("description_ru", upd_news_description_ru.current.value.trim());
        formData_upd.append("description_eng", upd_news_description_eng.current.value.trim());
        formData_upd.append("date", upd_date.current.value.trim());

        if (timeDiff < 9.5) {
            try {
                const responce = await fetch(`${URL}/news/${valueId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                    body: formData_upd,
                });
                if (responce.ok) {
                    const result = await responce.json();
                    forceUpdate()
                    console.log('employe created sccff:', result);

                    alert("muvaffaqiyatli yangilandi")
                    modalValue.current.classList.remove("open_modal_value")
                    window.location.reload()


                } else if (responce.status === 401) {
                    console.error('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    Cookies.remove('role')
                    navigate('/admin');
                }
                else {
                    console.log('xatolik yuz berdi:', `${responce.statusText} errors, or phone number may be valid.`);
                    alert("muvaffaqiyatsiz yangilandi")


                }
            } catch (error) {
                console.error('Serverga ulanishda xatolik (refresh):', error.message);
                alert('Serverga ulanishda xatolik (refresh):', error.message);
            }
        } else {
            // Tokenni yangilash
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                updateValue(e); // Yangi token bilan qayta chaqirish
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }

        }
    }
    // delete
    async function DeleteId(e, id) {
        e.preventDefault();
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 9.5) {
            try {
                const responceDel = await fetch(`${URL}/news/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${decryptedAccessToken}`, // Tokenni headerda yuborish
                    },
                });
                if (responceDel.ok) {
                    const resultDel = await responceDel.json();
                    forceUpdate();
                    console.log('employe created sccff:', resultDel);
                    alert("Muvaffaqiyatli o'chirildi")

                } else if (responceDel.status === 401) {
                    console.error('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    Cookies.remove('role')
                    navigate('/admin');
                    alert('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...')
                } else {
                    console.log('xatolik yuz berdi:', `${responceDel.statusText} errors, or phone number may be valid.`);
                    alert('xatolik yuz berdi:', `${responceDel.statusText} errors, or phone number may be valid.`)


                }

            } catch (error) {
                alert('Serverga ulanishda xatolik (refresh):', error.message);
            }
        } else {
            // Tokenni yangilash
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                DeleteId(e, id); // Yangi token bilan qayta chaqirish
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }
        }
    }

    return (
        <div className='newsAdmin_card'>
            <div className="adminNewsWrapper">
                {/* Yaratish formasi */}
                <h2>Yangiliklar</h2>
                <form onSubmit={CreateNews} >
                    <input
                        type="text"
                        placeholder="name_uz"
                        ref={name_uz}
                    />
                    <input
                        type="text"
                        placeholder="name_ru"
                        ref={name_ru}
                    />
                    <input
                        type="text"
                        placeholder="name_eng"
                        ref={name_eng}
                    />

                    <textarea
                        placeholder="description_uz"
                        ref={news_description_uz}
                    />
                    <textarea
                        placeholder="description_ru"
                        ref={news_description_ru}
                    />
                    <textarea
                        placeholder="description_eng"
                        ref={news_description_eng}
                    />
                    <input
                        type="text"
                        placeholder="date"
                        ref={date}
                    />
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Rasmni yuklash
                    </label>
                    <input
                        ref={news_image}
                        id="file-upload" type="file" onChange={handleFileChange} />
                    <p>{fileName ? `Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}</p>
                    <button type="submit">Qo'shish</button>
                </form>

                <h2>Tahrirlash va o'chirish</h2>
                <div className="value_table">
                    <div className="value_table_container">
                        <table>
                            <thead className='value_theadAdmin'>
                                <tr>
                                    <th>Name_uz</th>
                                    <th>Name_ru</th>
                                    <th>Name_eng</th>
                                    <th>Tahrirlash</th>
                                </tr>
                            </thead>
                            <tbody>
                                {news?.map((item) => {
                                    return (
                                        <tr key={item?.id}>
                                            <td>{item?.name_uz}</td>
                                            <td>{item?.name_ru}</td>
                                            <td>{item?.name_eng}</td>
                                            <td className="icon_del-upd">
                                                <div className="font_icon">
                                                    <FontAwesomeIcon className="icon_values" icon={faPen} onClick={(e) => updateValue1(e, item?.id)} />
                                                    <FontAwesomeIcon onClick={(e) => DeleteId(e, item?.id)} className="icon_values" icon={faTrashCan} />
                                                </div>


                                            </td>
                                        </tr>
                                    )

                                })}

                            </tbody>
                        </table>

                    </div>
                </div>
                <div ref={modalValue} className="modal_overlay_value">
                    <div className="modal_value">
                        <div onClick={removeModal_value} className="modal_close_value">X</div>
                        <form onSubmit={(e) => updateValue(e)} >

                            <input ref={upd_name_uz} defaultValue={filteredValue?.name_uz} />
                            <input ref={upd_name_ru} defaultValue={filteredValue?.name_ru} />
                            <input ref={upd_name_eng} defaultValue={filteredValue?.name_eng} />
                            <textarea ref={upd_news_description_uz} defaultValue={filteredValue?.description_uz} />
                            <textarea ref={upd_news_description_ru} defaultValue={filteredValue?.description_ru} />
                            <textarea ref={upd_news_description_eng} defaultValue={filteredValue?.description_eng} />
                            <input ref={upd_date} defaultValue={filteredValue?.date} />
                            <label htmlFor="file-upload1" className="custom-file-upload">
                                Rasmni almashtirish
                            </label>
                            <p>{fileName ? `Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}</p>

                            <input
                                ref={upd_news_image}
                                id="file-upload1" type="file" onChange={handleFileChange} />
                            <button type="submit">Yangilash</button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default NewsAdminCard;
