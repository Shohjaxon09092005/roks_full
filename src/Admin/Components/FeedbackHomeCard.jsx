import React, { useEffect, useReducer, useRef, useState } from 'react'
import { URL } from '../Utils/url';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { refreshToken } from '../Utils/authRefreshToken';

function FeedbackHomeCard() {
    //navigate

    let navigate = useNavigate()
    // Update
    const [update, forceUpdate] = useReducer(x => x + 1, 0);

    // Shifrlangan ma'lumotni cookie'dan olish
    const encryptedAccessToken = Cookies.get('access_token');
    const encryptedStoredTime = Cookies.get('stored_time');

    // Ma'lumotni dekodlash
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
    const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);

    //yangilash
    let upd_name = useRef();
    let upd_message = useRef();
    let upd_rating = useRef();
    //get
    const [ed, setEd] = useState([]);
    useEffect(() => {
        getEd()
    }, [update])
    async function getEd() {
        let fetchEd = await fetch(`${URL}/feedback`);
        let jsonEd = await fetchEd.json();
        let sortedEd = jsonEd?.feedback.sort((a, b) => b.id - a.id);
        setEd(sortedEd)

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
    const filteredValue = ed?.find((a) => a?.id === valueId)


    async function updateValue(e) {
        e.preventDefault()

        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        let formData = {
            name: upd_name.current.value.trim(),
            message: upd_message.current.value.trim(),
            rating: Number(upd_rating.current.value)

        }

        if (timeDiff < 9.5) {
            try {
                const responce = await fetch(`${URL}/feedback/${valueId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                    body: JSON.stringify(formData),
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
                const responceDel = await fetch(`${URL}/feedback/${id}`, {
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
                    upd_message.current.value = ''

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
    const [value, setValue] = useState("");
    
        const handleChange = (e) => {
            let val = e.target.value;
            if (val === "") {
                setValue("");
                return;
            }
            val = Number(val);
            if (val < 0) val = 0;
            if (val > 5) val = 5;
            setValue(val);
        };
    return (
        <div className='feedback_home'>
            <h2 style={{ marginTop: "20px" }}>Tahrirlash va o'chirish</h2>
            <div className="value_table">
                <div className="value_table_container">
                    <table>
                        <thead className='value_theadAdmin'>
                            <tr>
                                <th>Ism</th>
                                <th>Xabar</th>
                                <th>Tahrirlash</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ed?.map((item) => {
                                return (
                                    <tr key={item?.id}>
                                        <td>{item?.name}</td>
                                        <td>{item?.message}</td>
                                        <td className="icon_del-upd">
                                            <div className="font_icon">
                                                <FontAwesomeIcon className="icon_values" icon={faPen} onClick={(e) => updateValue1(e, item?.id)} />
                                                <FontAwesomeIcon className="icon_values" icon={faTrashCan} onClick={(e) => DeleteId(e, item?.id)} />
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

                        <label htmlFor="name">Ism</label>
                        <input id='name' type="text" ref={upd_name} defaultValue={filteredValue?.name} />
                        <label htmlFor="rating">Reyting</label>
                        <input id='rating' type="text" value={filteredValue?.rating} />
                        <label htmlFor="newRating">Yangi reyting</label>
                        <input id='newRating' type="text" ref={upd_rating}  onChange={handleChange}  value={value} />
                        <label htmlFor="message">Xabar</label>
                        <textarea id='message' ref={upd_message} defaultValue={filteredValue?.message} />

                        <button className='mainButton_modal' type="submit">Yangilash</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FeedbackHomeCard
