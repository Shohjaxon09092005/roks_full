import React, { useEffect, useReducer, useRef, useState } from 'react'
import '../AdminStyles/docServiceApp.css'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { URL } from '../Utils/url';
import { refreshToken } from '../Utils/authRefreshToken';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function DoctorServiceApp() {
    // Update
    const [update, forceUpdate] = useReducer(x => x + 1, 0);
    //navigate
    let navigate = useNavigate()

    // Shifrlangan ma'lumotni cookie'dan olish
    const encryptedAccessToken = Cookies.get('access_token');
    const encryptedStoredTime = Cookies.get('stored_time');

    // Ma'lumotni dekodlash
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
    const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);
    //GET
    const [serviceId, setServiceId] = useState(null);
    const [docId, serDocId] = useState(null);
    useEffect(() => {
        getServiceId()
        getDocId()
        getSer_Doc()
    }, [update])
    async function getServiceId() {
        let fetchServiceId = await fetch(`${URL}/services`);
        let json = await fetchServiceId.json();
        let sorted = json?.services.sort((a, b) => a.id - b.id);
        setServiceId(sorted)
    }
    async function getDocId() {
        let fetchDocId = await fetch(`${URL}/doctors`);
        let jsonDoc = await fetchDocId.json();
        let sorted = jsonDoc?.doctors.sort((a, b) => a.id - b.id);
        serDocId(sorted);
    }

    //POST
    const [ser_id, set_ser_id] = useState(null);
    const [doc_id, set_doc_id] = useState(null);
    const serviceChangeId = (e) => {
        e.preventDefault();
        set_ser_id(e.target.value);
    }
    const docChangeId = (e) => {
        e.preventDefault();
        set_doc_id(e.target.value);
    }
    async function serDocSubmit(e) {
        e.preventDefault();
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        let formData = {
            service_id: Number(ser_id),
            doctor_id: Number(doc_id),
        }
        if (timeDiff < 9.5) {
            try {
                const responceDocSer = await fetch(`${URL}/service-doctor`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                    body: JSON.stringify(formData)
                });
                if (responceDocSer.ok) {
                    const resultD_S = await responceDocSer.json();
                    forceUpdate();
                    console.log("Disease created successfully:", resultD_S);
                    alert("Muvaffaqiyatli biriktirildi")

                } else if (responceDocSer.status === 401) {
                    console.log("Token yaroqsiz. Login sahifasiga yo'naltirilmoqda...");
                    alert("Token yaroqsiz. Login sahifasiga yo'naltirilmoqda...")
                    Cookies.remove("role");
                    navigate("/admin");
                } else {
                    console.log(
                        "Xatolik yuz berdi:",
                        `${responceDocSer.statusText} errors, or phone number may be valid.`
                    );
                    alert("Xatolik yuz berdi:",
                        `${responceDocSer.statusText} errors, or phone number may be valid.`)

                }

            } catch (error) {
                console.log("Serverga ulanishda xatolik:", error.message);
                alert("Serverga ulanishda xatolik:", error.message)
            }

        } else {
            // Tokenni yangilash
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                serDocSubmit(e); // Yangi token bilan qayta chaqirish
            } else {
                console.log("Token yangilanmadi. Login sahifasiga o'ting.");
                navigate('/admin');
            }
        }

    }
    //GET 2
    const [serDoc, setSerDoc] = useState(null);
    async function getSer_Doc() {
        let fetchSerDoc = await fetch(`${URL}/service-doctor`);
        let json = await fetchSerDoc.json()
        let sortedDocSer = json?.service_doctor.sort((a, b) => a.id - b.id);


        setSerDoc(sortedDocSer)

    }
    const sortedAllSer = serDoc?.map((item) => {
        const serviceAll = serviceId?.find((s) => s.id === item.service_id);
        const doctorAll = docId?.find((d) => d.id === item.doctor_id);
        return {
            id: item?.id,
            serviceName: serviceAll?.name_uz || 'Unknown Service',
            doctorName: doctorAll?.full_name || 'Unknown Doctor',
        };
    })

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
    const filteredSerDoc = serDoc?.find((e) => e.id === valueId);
    const filteredSer = serviceId?.find((a) => a.id === filteredSerDoc?.service_id);
    const filteredDoc = docId?.find((b) => b.id === filteredSerDoc?.doctor_id)


    async function updateValue(e) {
        e.preventDefault();
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        let formUpdData = {
            service_id: Number(ser_id)||filteredSerDoc?.service_id,
            doctor_id: Number(doc_id)|| filteredSerDoc?.doctor_id
        }
        if (timeDiff < 9.5) {
            try {
                const responceUpd = await fetch(`${URL}/service-doctor/${valueId}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                    body: JSON.stringify(formUpdData)
                });
                if (responceUpd.ok) {
                    const result = await responceUpd.json();
                    forceUpdate();
                    console.log('employe created sccff:', result);
                    alert("Muvaffaqiyatli yangilandi")
                    modalValue.current.classList.remove("open_modal_value")
                    window.location.reload()

                } else if (responceUpd.status === 401) {
                    console.error('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    Cookies.remove('role')
                    navigate('/admin');
                }
                else {
                    console.log('xatolik yuz berdi:', `${responceUpd.statusText} errors, or phone number may be valid.`);
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
    async function DeleteId(e, id) {
        e.preventDefault();
        const current_time = new Date();
        const stored_time = decryptedStoredTime;
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
       
        if (timeDiff < 9.5) {
            try {
                const responceUpd = await fetch(`${URL}/service-doctor/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${decryptedAccessToken}`,
                    },
                });
                if (responceUpd.ok) {
                    const result = await responceUpd.json();
                    forceUpdate();
                    console.log('employe created sccff:', result);
                    alert("Muvaffaqiyatli o'chirildi")
                    modalValue.current.classList.remove("open_modal_value")
                    window.location.reload()

                } else if (responceUpd.status === 401) {
                    console.error('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    Cookies.remove('role')
                    navigate('/admin');
                }
                else {
                    console.log('xatolik yuz berdi:', `${responceUpd.statusText} errors, or phone number may be valid.`);
                    alert("muvaffaqiyatsiz o'chirildi")
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

    return (
        <div className='Doc_serviceApp'>
            <h1 style={{ textAlign: "center" }}>Shifokorlarni xizmatlarga biriktirish</h1>
            <form onSubmit={(e) => serDocSubmit(e)} >
                <label style={{ fontSize: "18px", fontWeight: "600", marginTop: "20px" }} htmlFor="service">Xizmatlar</label>
                <select id='service' onChange={serviceChangeId} style={{ width: "100%" }} >
                    {serviceId?.map((item) => {
                        return (
                            <option key={item?.id} value={item?.id}  >{item?.name_uz}</option>
                        )
                    })}


                </select>
                <label style={{ fontSize: "18px", fontWeight: "600", marginTop: "20px" }} htmlFor="service">Shifokorlar</label>
                <select onChange={docChangeId} id='service' style={{ width: "100%" }} >
                    {docId?.map((ready) => {
                        return (
                            <option value={ready?.id} key={ready?.id} >{ready?.full_name}</option>
                        )
                    })}


                </select>
                <button className='ser-doc-btn' type="submit">Biriktish</button>
            </form>
            <div className="value_table">
                <div className="value_table_container">
                    <table>
                        <thead className='value_theadAdmin'>
                            <tr>
                                <th>Service</th>
                                <th>Shifokor</th>
                                <th>Tahrirlash</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAllSer?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item?.serviceName}</td>
                                        <td>{item?.doctorName}</td>
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
                        <label style={{ fontSize: "18px", fontWeight: "600", marginTop: "20px" }} htmlFor="service">Xizmatlar</label>
                        <select id='service' onChange={serviceChangeId} style={{ width: "100%" }} >
                            {serviceId?.map((item) => {
                                return (
                                    <option key={item?.id} value={item?.id}
                                        selected={item?.name_uz === filteredSer?.name_uz}  >{item?.name_uz}</option>
                                )
                            })}


                        </select>
                        <label style={{ fontSize: "18px", fontWeight: "600", marginTop: "20px" }} htmlFor="service">Shifokorlar</label>
                        <select

                            onChange={docChangeId} id='service' style={{ width: "100%" }} >
                            {docId?.map((ready) => {
                                return (
                                    <option value={ready?.id}
                                        selected={ready?.full_name === filteredDoc?.full_name} key={ready?.id} >{ready?.full_name}</option>
                                )
                            })}


                        </select>

                        <button className='mainButton_modal' type="submit">Yangilash</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DoctorServiceApp
