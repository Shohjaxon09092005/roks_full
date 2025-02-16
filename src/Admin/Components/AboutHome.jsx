import React, { useEffect, useReducer, useRef, useState } from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { URL } from "../Utils/url";
import { refreshToken } from "../Utils/authRefreshToken";
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function AboutHome() {
    const [icon, setIcon] = useState(true);
    const toggleAccordion = () => setIcon(!icon);

    // Form state
    const [aboutImage, setAboutImage] = useState(null);
    const [descriptionUz, setDescriptionUz] = useState("");
    const [descriptionRu, setDescriptionRu] = useState("");
    const [descriptionEng, setDescriptionEng] = useState("");
    const [experience, setExperience] = useState();
    const [customer, setCustomer] = useState();
    const [specialist, setSpecialist] = useState();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState("");
    const [fileName, setFileName] = useState(""); // Fayl nomi

    // yangilash uchun
    const upd_image = useRef();
    const upd_descriptionUz = useRef();
    const upd_descriptionRu = useState("");
    const upd_descriptionEng = useRef();
    const upd_experience = useRef();
    const upd_customer = useRef();
    const upd_specialist = useRef();
    const upd_phoneNumber = useRef();
    const upd_email = useRef();
    const upd_address = useRef();
    const upd_location = useRef();


    const [update, forceUpdate] = useReducer(x => x + 1, 0);
    const navigate = useNavigate();

    // Cookie-dan shifrlangan ma'lumotni olish va dekodlash
    const encryptedAccessToken = Cookies.get('access_token');
    const encryptedStoredTime = Cookies.get('stored_time');
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
    const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);
    // GET

    useEffect(() => {
        aboutData()
    }, [update]);
    const [about, setAbout] = useState(null)

    async function aboutData() {
        let fetchAbout = await fetch(`${URL}/about`);
        let json = await fetchAbout.json();
        const sortedAbout = json?.about.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAbout(sortedAbout);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAboutImage(file); // Fayl obyektini saqlash
            setFileName(file.name); // Fayl nomini o'rnatish
        } else {
            setAboutImage(null);
            setFileName(""); // Fayl nomini tozalash
        }
    };

    const CreateAbout = async (e) => {
        e.preventDefault();

        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;

        const formDataAbout = new FormData();
        formDataAbout.append("image", aboutImage);
        formDataAbout.append("description_uz", descriptionUz.trim());
        formDataAbout.append("description_ru", descriptionRu.trim());
        formDataAbout.append("description_eng", descriptionEng.trim());
        formDataAbout.append("experience", Number(experience));
        formDataAbout.append("customer", Number(customer));
        formDataAbout.append("specialist", Number(specialist));
        formDataAbout.append("phone_number", phoneNumber.trim());
        formDataAbout.append("email", email.trim());
        formDataAbout.append("address", address.trim());
        formDataAbout.append("location", location.trim());

        if (timeDiff < 9.5) {
            try {
                const response = await fetch(`${URL}/about`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${decryptedAccessToken}`,
                    },
                    body: formDataAbout,
                });

                if (response.ok) {
                    const result = await response.json();
                    forceUpdate();
                    console.log("Ma'lumot muvaffaqiyatli yaratildi:", result);
                    alert("Ma'lumot muvaffaqiyatli yaratildi")
                    setExperience();
                    setCustomer();
                    setSpecialist();
                    setPhoneNumber("");
                    setEmail("");
                    setAddress("");
                    setLocation("");
                    setDescriptionUz("");
                    setDescriptionRu("");
                    setDescriptionEng("");
                    setAboutImage(null);
                    setFileName("");
                } else if (response.status === 401) {
                    console.log("Token yaroqsiz. Login sahifasiga o'tkazilmoqda...");
                    alert("Token yaroqsiz. Login sahifasiga o'tkazilmoqda...")
                    Cookies.remove("role");
                    navigate('/admin');
                } else {
                    console.log("Xatolik yuz berdi:", `${response.statusText}`);
                    alert("Xatolik yuz berdi:", `${response.statusText}`)
                    const result = await response.json();
                    console.log(result);
                    for (let [key, value] of formDataAbout.entries()) {
                        console.log(`${key}: ${value} (type: ${typeof value})`);
                    }


                }
            } catch (error) {
                console.log("Serverga ulanishda xatolik:", error.message);
                alert("Serverga ulanishda xatolik:", error.message)
            }
        } else {
            // Tokenni yangilash
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                CreateAbout(e); // Yangi token bilan qayta chaqirish
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }
        }
    };
    //PUT
    let modalValue = useRef();
    const [aboutId, setAboutId] = useState("");
    function removeModal_about() {
        modalValue.current.classList.remove("open_modal_value");
    }
    async function updateAboutModal(e, id) {
        e.preventDefault();
        setAboutId(id);
        modalValue.current.classList.add("open_modal_value");

    }
    const filteredValue = about?.find((a) => a?.id === aboutId);
    async function updateAbout(e) {
        e.preventDefault();
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        const formDataUpd = new FormData();
        formDataUpd.append("image", upd_image.current.files[0])
        formDataUpd.append("description_uz", upd_descriptionUz.current.value.trim())
        formDataUpd.append("description_ru", upd_descriptionRu.current.value.trim())
        formDataUpd.append("description_eng", upd_descriptionEng.current.value.trim())
        formDataUpd.append("experience", Number(upd_experience.current.value.trim()))
        formDataUpd.append("customer", Number(upd_customer.current.value.trim()))
        formDataUpd.append("specialist", Number(upd_specialist.current.value.trim()))
        formDataUpd.append("phone_number", upd_phoneNumber.current.value.trim())
        formDataUpd.append("email", upd_email.current.value.trim())
        formDataUpd.append("address", upd_address.current.value.trim())
        formDataUpd.append("location", upd_location.current.value.trim())
        if (timeDiff < 9.5) {
            try {
                const aboutPut = await fetch(`${URL}/about/${aboutId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                    body: formDataUpd
                });
                if (aboutPut.ok) {
                    const result = await aboutPut.json();
                    forceUpdate()
                    console.log('employe created sccff:', result);
                    alert("muvaffaqiyatli yangilandi")
                    modalValue.current.classList.remove("open_modal_value")
                    window.location.reload();
                } else if (aboutPut.status === 401) {
                    console.error('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    alert('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...')
                    Cookies.remove('role')
                    navigate('/admin');
                } else {
                    console.log('xatolik yuz berdi:', `${aboutPut.statusText} errors, or phone number may be valid.`);
                    const result = await aboutPut.json();
                    console.log(result);

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
                CreateAbout(e); // Yangi token bilan qayta chaqirish
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }
        }
    }

    //DELETE
    async function DeleteId(e, id) {
        e.preventDefault();
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 9.5) {
            try {
                const responceDel = await fetch(`${URL}/about/${id}`, {
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
                CreateAbout(e); // Yangi token bilan qayta chaqirish
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }
        }
    }

    return (
        <div className='about_admin_home banner_admin'>
            <h2 onClick={toggleAccordion}>
                Klinika haqida {icon ? <FiArrowDown /> : <FiArrowUp />}
            </h2>
            {icon ? null : (
                <>
                    <h3>Yaratish</h3>
                    <form onSubmit={CreateAbout} className='banner_create'>
                        <textarea
                            value={descriptionUz}
                            onChange={(e) => setDescriptionUz(e.target.value)}
                            placeholder='description_uz'
                        />
                        <textarea
                            value={descriptionRu}
                            onChange={(e) => setDescriptionRu(e.target.value)}
                            placeholder='description_ru'
                        />
                        <textarea
                            value={descriptionEng}
                            onChange={(e) => setDescriptionEng(e.target.value)}
                            placeholder='description_eng'
                        />
                        <input
                            type="number"
                            defaultValue={experience}
                            onChange={(e) => setExperience(Number(e.target.value))}
                            placeholder='experience'
                        />
                        <input
                            type="number"
                            defaultValue={customer}
                            onChange={(e) => setCustomer(Number(e.target.value))}
                            placeholder='customer'
                        />
                        <input
                            type="number"
                            defaultValue={specialist}
                            onChange={(e) => setSpecialist(Number(e.target.value))}
                            placeholder='specialist'
                        />
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder='phone_number'
                        />
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='email'
                        />
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder='address'
                        />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder='location'
                        />
                        <label htmlFor="file-upload" className="custom-file-upload">
                            Rasmni yuklash
                        </label>
                        <input id="file-upload" type="file" onChange={handleFileChange} />
                        <p>{fileName ? `Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}</p>
                        <button type="submit">Qo'shish</button>
                    </form>
                    <div className="value_table">
                        <h3>Tahrirlash va o'chirish</h3>
                        <div className="value_table_container">
                            <table>
                                <thead className='value_theadAdmin'>
                                    <tr>
                                        <th>description_uz</th>
                                        <th>description_ru</th>
                                        <th>description_eng</th>
                                        <th>Tahrirlash</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {about?.map((item) => {
                                        return (
                                            <tr key={item?.id}>
                                                <td>{`${item?.description_uz.slice(0, 10)}...`}</td>
                                                <td>{`${item?.description_ru.slice(0, 10)}...`}</td>
                                                <td>{`${item?.description_eng.slice(0, 10)}...`}</td>
                                                <td className="icon_del-upd">
                                                    <div className="font_icon">
                                                        <FontAwesomeIcon className="icon_values" icon={faPen} onClick={(e) => updateAboutModal(e, item?.id)} />
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
                            <div onClick={removeModal_about} className="modal_close_value">X</div>
                            <form onSubmit={(e) => updateAbout(e)} >
                                <textarea ref={upd_descriptionUz} defaultValue={filteredValue?.description_uz} />
                                <textarea ref={upd_descriptionRu} defaultValue={filteredValue?.description_ru} />
                                <textarea ref={upd_descriptionEng} defaultValue={filteredValue?.description_eng} />
                                <input ref={upd_experience} defaultValue={filteredValue?.experience} />
                                <input ref={upd_customer} defaultValue={filteredValue?.customer} />
                                <input ref={upd_specialist} defaultValue={filteredValue?.specialist} />
                                <input ref={upd_phoneNumber} defaultValue={filteredValue?.phone_number} />
                                <input ref={upd_email} defaultValue={filteredValue?.email} />
                                <input ref={upd_address} defaultValue={filteredValue?.address} />
                                <input ref={upd_location} defaultValue={filteredValue?.location} />
                                <label htmlFor="file-upload1" className="custom-file-upload">
                                    Rasmni almashtirish
                                </label>
                                <input ref={upd_image} id="file-upload1" type="file" onChange={handleFileChange} />
                                <p>{fileName ? `Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}</p>
                                <p>{filteredValue?.image}</p>

                                <button type="submit">Yangilash</button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AboutHome;
