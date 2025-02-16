import React, { useEffect, useReducer, useRef, useState } from "react";
import '../AdminStyles/docAdmin.css'
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { URL } from "../Utils/url";
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { refreshToken } from '../Utils/authRefreshToken';
function DocAdminCard() {
  const [fileName, setFileName] = useState("");
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Tanlangan fayl
    if (file) {
      setFileName(file.name); // Fayl nomini o'rnatish
      setUpd_img(file)
    } else {
      setFileName(""); // Agar fayl tanlanmasa, nomni tozalash
    }
  };
  // Update
  const [update, forceUpdate] = useReducer(x => x + 1, 0);

  // Yaratish uchun
  let doc_image = useRef();
  let full_name = useRef();
  let doc_specialist_uz = useRef();
  let doc_specialist_ru = useRef();
  let doc_specialist_eng = useRef();
  let doc_experience = useRef();
  let doc_description_uz = useRef();
  let doc_description_ru = useRef();
  let doc_description_eng = useRef();
  let doc_working_hours = useRef();

  //Yangilash uchun
  const [upd_img, setUpd_img] = useState("");
  const [upd_full_name, setUpd_full_name] = useState("");
  const [upd_doc_specialist_uz, setUpd_doc_specialist_uz] = useState("");
  const [upd_doc_specialist_ru, setUpd_doc_specialist_ru] = useState("");
  const [upd_doc_specialist_eng, setUpd_doc_specialist_eng] = useState("");
  const [upd_doc_experience, setUpd_doc_experience] = useState("");
  const [upd_doc_description_uz, setUpd_doc_description_uz] = useState("");
  const [upd_doc_description_ru, setUpd_doc_description_ru] = useState("");
  const [upd_doc_description_eng, setUpd_doc_description_eng] = useState("");
  const [upd_doc_working_hours, setUpd_doc_working_hours] = useState("");
  //navigate
  let navigate = useNavigate()

  // Shifrlangan ma'lumotni cookie'dan olish
  const encryptedAccessToken = Cookies.get('access_token');
  const encryptedStoredTime = Cookies.get('stored_time');

  // Ma'lumotni dekodlash
  const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
  const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);

  //GET

  useEffect(() => {
    getDoc()
  }, [update])
  const [doctor, setDoctor] = useState(null)
  async function getDoc() {
    let fetchDoc = await fetch(`${URL}/doctors`);
    let jsonDoc = await fetchDoc.json();
    let sortedDoc = jsonDoc?.doctors.sort((a, b) => a.id - b.id);
    setDoctor(sortedDoc);
  }
  // POST
  async function CreateDoc(e) {
    e.preventDefault();
    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    const formData = new FormData();
    formData.append("image", doc_image.current.files[0]);
    formData.append("full_name", full_name.current.value.trim());
    formData.append("specialist_uz", doc_specialist_uz.current.value.trim());
    formData.append("specialist_ru", doc_specialist_ru.current.value.trim());
    formData.append("specialist_eng", doc_specialist_eng.current.value.trim());
    formData.append("experience", Number(doc_experience.current.value, 10));
    formData.append("description_uz", doc_description_uz.current.value.trim());
    formData.append("description_ru", doc_description_ru.current.value.trim());
    formData.append("description_eng", doc_description_eng.current.value.trim());
    formData.append("working_hours", doc_working_hours.current.value.trim());

    if (timeDiff < 9.5) {
      try {
        const responceDoc = await fetch(`${URL}/doctors`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${decryptedAccessToken}`,
          },
          body: formData,
        });
        if (responceDoc.ok) {
          const result = await responceDoc.json();
          forceUpdate()
          console.log('employe created sccff:', result);
          alert("muvaffaqiyatli qo'shildi")
          setFileName("")
          full_name.current.value = ""
          doc_specialist_uz.current.value = ""
          doc_specialist_ru.current.value = ""
          doc_specialist_eng.current.value = ""
          doc_experience.current.value = ""
          doc_description_uz.current.value = ""
          doc_description_ru.current.value = ""
          doc_description_eng.current.value = ""
          doc_working_hours.current.value = ""

        } else if (responceDoc.status === 401) {
          console.log('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...')
          Cookies.remove("role")
          navigate('/admin');
        } else {
          console.log('xatolik yuz berdi:', `${responceDoc.statusText} errors, or phone number may be valid.`);
          alert("xatolik yuz berdi")



        }

      } catch (error) {
        console.log('Serverga ulanishda xatolik:', error.message);
      }
    } else {
      // Tokenni yangilash
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        CreateDoc(e); // Yangi token bilan qayta chaqirish
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
  const filteredValue = doctor?.find((a) => a?.id === valueId)


  async function updateValue(e) {
    e.preventDefault()

    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    const formData_upd = new FormData();
    formData_upd.append("image", upd_img || filteredValue?.image); // Faylni qo'shish
    formData_upd.append("full_name", upd_full_name || filteredValue?.full_name);
    formData_upd.append("specialist_uz", upd_doc_specialist_uz || filteredValue?.specialist_uz);
    formData_upd.append("specialist_ru", upd_doc_specialist_ru || filteredValue?.specialist_ru);
    formData_upd.append("specialist_eng", upd_doc_specialist_eng || filteredValue?.specialist_eng);
    formData_upd.append("experience", upd_doc_experience || filteredValue?.experience);
    formData_upd.append("description_uz", upd_doc_description_uz || filteredValue?.description_uz);
    formData_upd.append("description_ru", upd_doc_description_ru || filteredValue?.upd_doc_description_ru);
    formData_upd.append("description_eng", upd_doc_description_eng || filteredValue?.description_eng);
    formData_upd.append("working_hours", upd_doc_working_hours || filteredValue?.working_hours);

    if (timeDiff < 9.5) {
      try {
        const responce = await fetch(`${URL}/doctors/${valueId}`, {
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
        const responceDel = await fetch(`${URL}/doctors/${id}`, {
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
    <div className="admin-panel">
      <h1>Admin Panel - Shifokorlar</h1>

      {/* Add New Doctor Form */}
      <div className="add-doctor-form">
        <h2>Yangi Shifokor Qo'shish</h2>
        <form onSubmit={CreateDoc} >
          <input
            ref={full_name}
            type="text"
            placeholder="Ism-Familiya(UZ)"


          />
          <input
            ref={doc_specialist_uz}
            type="text"
            placeholder="Mutaxassislik(UZ)"

          />

          <input
            ref={doc_specialist_ru}
            type="text"
            placeholder="Mutaxassislik(RU)"

          />
          <input
            ref={doc_specialist_eng}
            type="text"
            placeholder="Mutaxassislik(ENG)"

          />
          <input
            ref={doc_experience}
            type="text"
            placeholder="Tajriba"
          />
          <textarea
            ref={doc_description_uz}
            placeholder="Batafsil(UZ)"
          />
          <textarea
            ref={doc_description_ru}
            placeholder="Batafsil(RU)"
          />
          <textarea
            ref={doc_description_eng}
            placeholder="Batafsil(ENG)"
          />
          <input
            ref={doc_working_hours}
            type="text"
            placeholder="Ish vaqti"
          />
          <label htmlFor="file-upload" className="custom-file-upload">
            Rasmni yuklash
          </label>
          <input
            ref={doc_image}
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
                  <th>FullName</th>

                  <th>Tahrirlash</th>
                </tr>
              </thead>
              <tbody>
                {doctor?.map((item) => {
                  return (
                    <tr key={item?.id}>
                      <td>{item?.full_name}</td>

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

              <input onChange={(e) => setUpd_full_name(e.target.value.trim())} defaultValue={filteredValue?.full_name} />
              <input onChange={(e) => setUpd_doc_specialist_uz(e.target.value.trim())} defaultValue={filteredValue?.specialist_uz} />
              <input onChange={(e) => setUpd_doc_specialist_ru(e.target.value.trim())} defaultValue={filteredValue?.specialist_ru} />
              <input onChange={(e) => setUpd_doc_specialist_eng(e.target.value.trim())} defaultValue={filteredValue?.specialist_eng} />
              <input onChange={(e) => setUpd_doc_experience(Number(e.target.value))} defaultValue={filteredValue?.specialist_eng} />
              <textarea onChange={(e) => setUpd_doc_description_uz(e.target.value.trim())} defaultValue={filteredValue?.description_uz} />
              <textarea onChange={(e) => setUpd_doc_description_ru(e.target.value.trim())} defaultValue={filteredValue?.description_ru} />
              <textarea onChange={(e) => setUpd_doc_description_eng(e.target.value.trim())} defaultValue={filteredValue?.description_eng} />
              <input onChange={(e) => setUpd_doc_working_hours(e.target.value.trim())} defaultValue={filteredValue?.specialist_eng} />
              <label htmlFor="file-upload1" className="custom-file-upload">
                Rasmni almashtirish
              </label>
              <p>{fileName ? `Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}</p>

              <input

                id="file-upload1" type="file" onChange={handleFileChange} />
              <button type="submit">Yangilash</button>
            </form>
          </div>
        </div>
      </div>


    </div>
  )
}

export default DocAdminCard
