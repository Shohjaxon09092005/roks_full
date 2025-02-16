import '../AdminStyles/kasallikAdmin.css'
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { URL } from "../Utils/url";
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { refreshToken } from '../Utils/authRefreshToken';
function KasallikAdminCard() {
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
    let dis_image = useRef();
    let dis_name_uz = useRef();
    let dis_name_ru = useRef();
    let dis_name_eng = useRef();
    let dis_description_uz = useRef();
    let dis_description_ru = useRef();
    let dis_description_eng = useRef();

    //Yangiilash uchun
    let upd_dis_image = useRef()
    let upd_value_name_uz = useRef();
    let upd_value_name_ru = useRef();
    let upd_value_name_eng = useRef();
    let upd_value_description_uz = useRef();
    let upd_value_description_ru = useRef();
    let upd_value_description_eng = useRef();
    //navigate
    let navigate = useNavigate()

    // Shifrlangan ma'lumotni cookie'dan olish
    const encryptedAccessToken = Cookies.get('access_token');
    const encryptedStoredTime = Cookies.get('stored_time');

    // Ma'lumotni dekodlash
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
    const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);

    

    useEffect(() => {
        getDic()
    }, [update])
    // GET
    const [dicData, setDicData] = useState(null)
    async function getDic() {
        let fetchValue = await fetch(`${URL}/encyclopedia-diseases`)
        let json = await fetchValue.json()
        let sortedJson = json?.encyclopedia_diseases?.sort((a, b) => a.id - b.id);
        setDicData(sortedJson)
    }
    // POST
    async function CreateDis(e) {
        e.preventDefault();
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;

        // FormData obyektini yaratamiz
        const formData = new FormData();
        formData.append("image", dis_image.current.files[0]); // Faylni qo'shish
        formData.append("name_uz", dis_name_uz.current.value.trim());
        formData.append("name_ru", dis_name_ru.current.value.trim());
        formData.append("name_eng", dis_name_eng.current.value.trim());
        formData.append("description_uz", dis_description_uz.current.value.trim());
        formData.append("description_ru", dis_description_ru.current.value.trim());
        formData.append("description_eng", dis_description_eng.current.value.trim());

        if (timeDiff < 9.5) {
            try {
                const responceDis = await fetch(`${URL}/encyclopedia-diseases`, {
                    method: "POST",
                    headers: {
                        // "Content-Type" ni o'chiramiz, chunki FormData avtomatik ravishda aniqlaydi
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                    body: formData, // FormData obyektini so'rovga yuboramiz
                });

                if (responceDis.ok) {
                    const result = await responceDis.json();
                    forceUpdate();
                    console.log("Disease created successfully:", result);
                    alert("Muvaffaqiyatli qo'shildi")
                    dis_image.current.value = ""
                    dis_name_uz.current.value = ""
                    dis_name_ru.current.value = ""
                    dis_name_eng.current.value = ""
                    dis_description_uz.current.value = ""
                    dis_description_ru.current.value = ""
                    dis_description_eng.current.value = ""
                } else if (responceDis.status === 401) {
                    console.log("Token yaroqsiz. Login sahifasiga yo'naltirilmoqda...");
                    alert("Token yaroqsiz. Login sahifasiga yo'naltirilmoqda...")
                    Cookies.remove("role");
                    navigate("/admin");
                } else {
                    console.log(
                        "Xatolik yuz berdi:",
                        `${responceDis.statusText} errors, or phone number may be valid.`
                    );
                    alert("Xatolik yuz berdi:",
                        `${responceDis.statusText} errors, or phone number may be valid.`)
                    const result = await responceDis.json();
                    console.log(result);
                }
            } catch (error) {
                console.log("Serverga ulanishda xatolik:", error.message);
                alert("Serverga ulanishda xatolik:", error.message)
            }
        } else {
            // Tokenni yangilash
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                CreateDis(e); // Yangi token bilan qayta chaqirish
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
    const filteredValue = dicData?.find((a) => a?.id === valueId)


    async function updateValue(e) {
        e.preventDefault()

        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        const formData_upd = new FormData();
        formData_upd.append("image", upd_dis_image.current.files[0]); // Faylni qo'shish
        formData_upd.append("name_uz", upd_value_name_uz.current.value.trim());
        formData_upd.append("name_ru", upd_value_name_ru.current.value.trim());
        formData_upd.append("name_eng", upd_value_name_eng.current.value.trim());
        formData_upd.append("description_uz", upd_value_description_uz.current.value.trim());
        formData_upd.append("description_ru", upd_value_description_ru.current.value.trim());
        formData_upd.append("description_eng", upd_value_description_eng.current.value.trim());

        if (timeDiff < 9.5) {
            try {
                const responce = await fetch(`${URL}/encyclopedia-diseases/${valueId}`, {
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
                const responceDel = await fetch(`${URL}/encyclopedia-diseases/${id}`, {
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
        <div className="diseasesAdmin_card">
            <div className="adminDiseasesWrapper">
                {/* Yaratish formasi */}
                <h2>Kasalliklar</h2>
                <form onSubmit={CreateDis}>
                    <input
                        type="text"
                        placeholder="name_uz"
                        ref={dis_name_uz}

                    />
                    <input
                        type="text"
                        placeholder="name_ru"
                        ref={dis_name_ru}

                    />
                    <input
                        type="text"
                        placeholder="name_eng"
                        ref={dis_name_eng}

                    />

                    <textarea
                        placeholder="description_uz"
                        ref={dis_description_uz}
                    />
                    <textarea
                        placeholder="description_ru"
                        ref={dis_description_ru}
                    />
                    <textarea
                        placeholder="description_eng"
                        ref={dis_description_eng}
                    />

                    <label htmlFor="file-upload" className="custom-file-upload">
                        Rasmni yuklash
                    </label>
                    <input
                        ref={dis_image}
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
                                {dicData?.map((item) => {
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

                            <input ref={upd_value_name_uz} defaultValue={filteredValue?.name_uz} />
                            <input ref={upd_value_name_ru} defaultValue={filteredValue?.name_ru} />
                            <input ref={upd_value_name_eng} defaultValue={filteredValue?.name_eng} />
                            <textarea ref={upd_value_description_uz} defaultValue={filteredValue?.description_uz} />
                            <textarea ref={upd_value_description_ru} defaultValue={filteredValue?.description_ru} />
                            <textarea ref={upd_value_description_eng} defaultValue={filteredValue?.description_eng} />
                            <label htmlFor="file-upload1" className="custom-file-upload">
                                Rasmni almashtirish
                            </label>
                            <p>{fileName ? `Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}</p>

                            <input
                                ref={upd_dis_image}
                                id="file-upload1" type="file" onChange={handleFileChange} />
                            <button type="submit">Yangilash</button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default KasallikAdminCard
