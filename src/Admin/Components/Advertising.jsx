import React, { useEffect, useReducer, useRef, useState } from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { URL } from "../Utils/url";
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { refreshToken } from "../Utils/authRefreshToken";
function Advertising() {
    const [icon, setIcon] = useState(true);
    function toggleAccordion() {
        setIcon(!icon);
    }
    // update
    const [update, forceUpdate] = useReducer(x => x + 1, 0);

    //Yaratish
    let new_name_uz = useRef();
    let new_name_ru = useRef();
    let new_name_eng = useRef();
    let new_desc_uz = useRef();
    let new_desc_ru = useRef();
    let new_desc_eng = useRef();

    //Yangilash
    let upd_new_name_uz = useRef();
    let upd_new_name_ru = useRef();
    let upd_new_name_eng = useRef();
    let upd_new_desc_uz = useRef();
    let upd_new_desc_ru = useRef();
    let upd_new_desc_eng = useRef();

    // navigate
    let navigate = useNavigate()

    // Shifrlangan ma'lumotni cookie'dan olish
    const encryptedAccessToken = Cookies.get('access_token');
    const encryptedStoredTime = Cookies.get('stored_time');

    // Ma'lumotni dekodlash
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
    const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);

  
  
    useEffect(() => {
        fullNewData()
    }, [update])
    //GET
    const [fullData, setFullData] = useState(null)
    async function fullNewData() {
        let fetchFull = await fetch(`${URL}/useful-news`);
        let json = await fetchFull.json();
        let sortedJson = json?.useful_news?.sort((a, b) => a.id - b.id);
        setFullData(sortedJson)
    }
    //POST
    async function CreateNew(e) {
        e.preventDefault();
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        const newData = {
            name_uz: new_name_uz.current.value.trim(),
            name_ru: new_name_ru.current.value.trim(),
            name_eng: new_name_eng.current.value.trim(),
            description_uz: new_desc_uz.current.value.trim(),
            description_ru: new_desc_ru.current.value.trim(),
            description_eng: new_desc_eng.current.value.trim(),

        }
        if (timeDiff < 9.5) {
            try {
                const responceNew = await fetch(`${URL}/useful-news`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                    body: JSON.stringify(newData)
                });
                if (responceNew.ok) {
                    const resultNew = await responceNew.json();
                    forceUpdate();
                    console.log('employe created sccff:', resultNew);
                    alert("Muvaffaqqiyatli qo'shildi");
                    new_name_uz.current.value = ""
                    new_name_ru.current.value = ""
                    new_name_eng.current.value = ""
                    new_desc_uz.current.value = ""
                    new_desc_ru.current.value = ""
                    new_desc_eng.current.value = ""
                } else if (responceNew.status === 401) {
                    console.log('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...')
                    alert('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...')
                    Cookies.remove("role")
                    navigate('/admin');

                } else {
                    console.log('xatolik yuz berdi:', `${responceNew.statusText} errors, or phone number may be valid.`);
                    alert('xatolik yuz berdi:', `${responceNew.statusText} errors, or phone number may be valid.`)
                    const resultNew = await responceNew.json();
                    console.log(resultNew);


                }

            } catch (error) {
                alert('Serverga ulanishda xatolik:', error.message)
            }
        } else {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                CreateNew(e);
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }
        }

    }

    //PUT
    let modalNew = useRef()
    const [newId, setNewId] = useState("")
    function removeModal_New() {
        modalNew.current.classList.remove("open_modal_value")
    }
    async function SaveId(e, id) {
        e.preventDefault()
        setNewId(id)
        modalNew.current.classList.add("open_modal_value")
        console.log(id);

    }
    const filteredValue = fullData?.find((a) => a?.id === newId)

    async function updateNew(e) {
        e.preventDefault()
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        const readyUpd = {
            name_uz: upd_new_name_uz.current.value.trim() || filteredValue?.name_uz,
            name_ru: upd_new_name_ru.current.value.trim() || filteredValue?.name_ru,
            name_eng: upd_new_name_eng.current.value.trim() || filteredValue?.name_eng,
            description_uz: upd_new_desc_uz.current.value.trim() || filteredValue?.description_uz,
            description_ru: upd_new_desc_ru.current.value.trim() || filteredValue?.description_ru,
            description_eng: upd_new_desc_eng.current.value.trim() || filteredValue?.description_eng,
        };

        if (timeDiff < 9.5) {
            try {
                const responce = await fetch(`${URL}/useful-news/${newId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                    body: JSON.stringify(readyUpd)
                });
                if (responce.ok) {
                    const result = await responce.json();
                    forceUpdate()
                    console.log('employe created sccff:', result);
                    alert("muvaffaqiyatli yangilandi")
                    modalNew.current.classList.remove("open_modal_value")
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
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                updateNew(e);
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }

        }
    }
    //DELETE
    async function DelNewFull(e, id) {
        e.preventDefault()
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 9.5) {
            try {
                const responceDel = await fetch(`${URL}/useful-news/${id}`, {
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
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                DelNewFull(e, id);
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }
        }

    }
    return (
        <div className='ad_home banner_admin'>
            <h2 onClick={toggleAccordion}>Reklama banneri {icon ? <FiArrowDown /> : <FiArrowUp />}</h2>
            {icon ? null : (
                <>
                    <h3>Yaratish</h3>

                    <form onSubmit={(e) => CreateNew(e)} className='banner_create' >
                        <input ref={new_name_uz} placeholder='name_uz' type="text" />
                        <input ref={new_name_ru} placeholder='name_ru' type="text" />
                        <input ref={new_name_eng} placeholder='name_eng' type="text" />
                        <textarea ref={new_desc_uz} placeholder='description_uz' />
                        <textarea ref={new_desc_ru} placeholder='description_ru' />
                        <textarea ref={new_desc_eng} placeholder='description_eng' />
                        <button type="submit">Qo'shish</button>
                    </form>
                    <div className="value_table">
                        <h3>Tahrirlash va o'chirish</h3>
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
                                    {fullData?.map((item) => {
                                        return (
                                            <tr key={item?.id}>
                                                <td>{item?.name_uz}</td>
                                                <td>{item?.name_ru}</td>
                                                <td>{item?.name_eng}</td>
                                                <td className="icon_del-upd">
                                                    <div className="font_icon">
                                                        <FontAwesomeIcon className="icon_values" icon={faPen} onClick={(e) => SaveId(e, item?.id)} />
                                                        <FontAwesomeIcon className="icon_values" icon={faTrashCan} onClick={(e) => DelNewFull(e, item?.id)} />
                                                    </div>


                                                </td>
                                            </tr>
                                        )

                                    })}

                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div ref={modalNew} className="modal_overlay_value">
                        <div className="modal_value">
                            <div onClick={removeModal_New} className="modal_close_value">X</div>
                            <form onSubmit={(e) => updateNew(e)} >
                                <input ref={upd_new_name_uz} defaultValue={filteredValue?.name_uz} />
                                <input ref={upd_new_name_ru} defaultValue={filteredValue?.name_ru} />
                                <input ref={upd_new_name_eng} defaultValue={filteredValue?.name_eng} />
                                <textarea ref={upd_new_desc_uz} defaultValue={filteredValue?.description_uz} />
                                <textarea ref={upd_new_desc_ru} defaultValue={filteredValue?.description_ru} />
                                <textarea ref={upd_new_desc_eng} defaultValue={filteredValue?.description_eng} />
                                <button type="submit">Yangilash</button>
                            </form>
                        </div>
                    </div>

                </>
            )}

        </div>
    )
}

export default Advertising
