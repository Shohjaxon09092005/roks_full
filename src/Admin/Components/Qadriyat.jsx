import React, { useEffect, useReducer, useRef, useState } from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { URL } from "../Utils/url";
import '../AdminStyles/valuesAdmin.css'
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { refreshToken } from "../Utils/authRefreshToken";
function Qadriyat() {
  const [icon, setIcon] = useState(true);
  function toggleAccordion() {
    setIcon(!icon);
  }
  // Update
  const [update, forceUpdate] = useReducer(x => x + 1, 0);

  // Yaratish uchun
  let value_name_uz = useRef();
  let value_name_ru = useRef();
  let value_name_eng = useRef();
  let value_description_uz = useRef();
  let value_description_ru = useRef();
  let value_description_eng = useRef();
  //Yangiilash uchun
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
    getvalue()
  }, [update])
  // GET
  const [valueData, setvalueData] = useState(null)
  async function getvalue() {
    let fetchValue = await fetch(`${URL}/values`)
    let json = await fetchValue.json()
    let sortedJson = json?.values?.sort((a, b) => a.id - b.id);
    setvalueData(sortedJson)
  }

  // POST
  async function CreateValue(e) {
    e.preventDefault();
    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    const formData = {
      name_uz: value_name_uz.current.value.trim(),
      name_ru: value_name_ru.current.value.trim(),
      name_eng: value_name_eng.current.value.trim(),
      description_uz: value_description_uz.current.value.trim(),
      description_ru: value_description_ru.current.value.trim(),
      description_eng: value_description_eng.current.value.trim(),
    };
    if (timeDiff < 9.5) {
      try {
        const responceValue = await fetch(`${URL}/values`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${decryptedAccessToken}`,
          },
          body: JSON.stringify(formData),
        });
        if (responceValue.ok) {
          const result = await responceValue.json();
          forceUpdate()
          console.log('employe created sccff:', result);
          alert("Muvaffaqqiyatli qo'shildi")
          value_name_uz.current.value = ""
          value_name_ru.current.value = ""
          value_name_eng.current.value = ""
          value_description_uz.current.value = ""
          value_description_ru.current.value = ""
          value_description_eng.current.value = ""
        } else if (responceValue.status === 401) {
          console.log('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...')
          Cookies.remove("role")
          navigate('/admin');
        } else {
          console.log('xatolik yuz berdi:', `${responceValue.statusText} errors, or phone number may be valid.`);

        }

      } catch (error) {
        alert('Serverga ulanishda xatolik:', error.message)
      }
    } else {
      // Tokenni yangilash
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        CreateValue(e); // Yangi token bilan qayta chaqirish
      } else {
        console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        navigate('/admin');
      }
    }


  }
  // PUT

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
  const filteredValue = valueData?.find((a) => a?.id === valueId)


  async function updateValue(e) {
    e.preventDefault()

    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    const readyUpd = {
      name_uz: upd_value_name_uz.current.value.trim() || filteredValue?.name_uz,
      name_ru: upd_value_name_ru.current.value.trim() || filteredValue?.name_ru,
      name_eng: upd_value_name_eng.current.value.trim() || filteredValue?.name_eng,
      description_uz: upd_value_description_uz.current.value.trim() || filteredValue?.description_uz,
      description_ru: upd_value_description_ru.current.value.trim() || filteredValue?.description_ru,
      description_eng: upd_value_description_eng.current.value.trim() || filteredValue?.description_eng,
    };

    if (timeDiff < 9.5) {
      try {
        const responce = await fetch(`${URL}/values/${valueId}`, {
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
        const responceDel = await fetch(`${URL}/values/${id}`, {
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
    <div className='qadriyat banner_admin'>
      <h2 onClick={toggleAccordion}>Qadriyatlar {icon ? <FiArrowDown /> : <FiArrowUp />}</h2>
      {icon ? null : (
        <>
          <h3 >Yaratish</h3>
          <form onSubmit={(e) => CreateValue(e)} className='banner_create' >
            <input ref={value_name_uz} placeholder='title_uz' type="text" />
            <input ref={value_name_ru} placeholder='title_ru' type="text" />
            <input ref={value_name_eng} placeholder='title_eng' type="text" />
            <textarea ref={value_description_uz} placeholder='description_uz' />
            <textarea ref={value_description_ru} placeholder='description_ru' />
            <textarea ref={value_description_eng} placeholder='description_eng' />
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
                  {valueData?.map((item) => {
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
                <button type="submit">Yangilash</button>
              </form>
            </div>
          </div>

        </>
      )}

    </div>
  )
}

export default Qadriyat
