import React, { useEffect, useReducer, useRef, useState } from 'react';
import '../AdminStyles/serviceAdminCard.css';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { URL } from '../Utils/url';
import { useNavigate } from 'react-router-dom';
import { refreshToken } from '../Utils/authRefreshToken';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function ServiceAdminCard() {
  const [update, forceUpdate] = useReducer(x => x + 1, 0);
  const [service, setService] = useState();

  //Rasm fileni olish 
  const [fileName, setFileName] = useState("");
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Tanlangan fayl
    if (file) {

      setFileName(file.name);
      // Fayl nomini o'rnatish
    } else {
      setFileName(""); // Agar fayl tanlanmasa, nomni tozalash
    }
  };
  // Yaratish formasi uchun useRef
  const c_image = useRef()
  const c_name_uz = useRef()
  const c_name_ru = useRef();
  const c_name_eng = useRef();
  const c_desc_uz = useRef();
  const c_desc_ru = useRef();
  const c_desc_eng = useRef();
  const price = useRef();

  // Tahrirlash formasi uchun useRef
  const upd_name_uz = useRef();
  const upd_name_ru = useRef();
  const upd_name_eng = useRef();
  const upd_desc_uz = useRef();
  const upd_desc_ru = useRef();
  const upd_desc_eng = useRef();
  const upd_price = useRef();
  const upd_image = useRef();
  //navigate
  let navigate = useNavigate()

  // Shifrlangan ma'lumotni cookie'dan olish
  const encryptedAccessToken = Cookies.get('access_token');
  const encryptedStoredTime = Cookies.get('stored_time');

  // Ma'lumotni dekodlash
  const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
  const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);
  // Shifrlash funksiyasi

  useEffect(() => {
    getSer();
  }, [update]);

  async function getSer() {

    const fetchSer = await fetch('https://clinic-web-back.onrender.com/api/services');
    const json = await fetchSer.json();
    let sortedService = json?.services.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setService(sortedService);
  }
  async function CreateService(e) {
    e.preventDefault();

    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;

    // FormData obyektini yaratish
    const formData = new FormData();
    formData.append("image", c_image.current.files[0]); // Faylni qo'shish
    formData.append("name_uz", c_name_uz.current.value.trim() || "");
    formData.append("name_ru", c_name_ru.current.value.trim() || "");
    formData.append("name_eng", c_name_eng.current.value.trim() || "");
    formData.append("description_uz", c_desc_uz.current.value.trim() || "");
    formData.append("description_ru", c_desc_ru.current.value.trim() || "");
    formData.append("description_eng", c_desc_eng.current.value.trim() || "");
    formData.append("price", Number(price.current.value) || 0);

    if (timeDiff < 9.5) {
      try {
        const responce = await fetch(`${URL}/services`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${decryptedAccessToken}`,
          },
          body: formData, // FormData jo'natamiz
        });

        if (responce.ok) {
          const result = await responce.json();
          forceUpdate();
          console.log('Service created successfully:', result);
          alert("Muvaffaqiyatli qo'shildi")
        } else if (responce.status === 401) {
          console.error('Token yaroqsiz. Login sahifasiga yo\'naltirilmoqda...');
          Cookies.remove('role');
          navigate('/admin');
        } else {
          console.log('Xatolik yuz berdi:', responce.statusText);
        }
      } catch (error) {
        console.log('Serverga ulanishda xatolik:', error.message);
      }
    } else {
      // Tokenni yangilash
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        CreateService(e); // Yangi token bilan qayta chaqirish
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
  const filteredValue = service?.find((a) => a?.id === valueId)


  async function updateValue(e) {
    e.preventDefault()

    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    const formData = new FormData();
    formData.append("image", upd_image.current.files[0])
    formData.append("name_uz", upd_name_uz.current.value.trim())
    formData.append("name_ru", upd_name_ru.current.value.trim())
    formData.append("name_eng", upd_name_eng.current.value.trim())
    formData.append("description_uz", upd_desc_uz.current.value.trim())
    formData.append("description_ru", upd_desc_ru.current.value.trim())
    formData.append("description_eng", upd_desc_eng.current.value.trim())
    formData.append("price", upd_price.current.value.trim())


    if (timeDiff < 9.5) {
      try {
        const responce = await fetch(`${URL}/services/${valueId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${decryptedAccessToken}`,
          },
          body: formData
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
        CreateService(e); // Yangi token bilan qayta chaqirish
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
        const responceDel = await fetch(`${URL}/services/${id}`, {
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
        CreateService(e); // Yangi token bilan qayta chaqirish
      } else {
        console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        navigate('/admin');
      }
    }
  }

  return (
    <div className="service_card_admin">
      <h2>Xizmatlar</h2>

      <form onSubmit={CreateService}>
        <h3>Yangi xizmat qo'shish</h3>
        <input type="text" ref={c_name_uz} placeholder="Xizmat nomi (uz)" />
        <input type="text" ref={c_name_ru} placeholder="Xizmat nomi (ru)" />
        <input type="text" ref={c_name_eng} placeholder="Xizmat nomi (eng)" />
        <input type="text" ref={c_desc_uz} placeholder="Description (uz)" />
        <input type="text" ref={c_desc_ru} placeholder="Description (ru)" />
        <input type="text" ref={c_desc_eng} placeholder="Description (eng)" />
        <input type="number" ref={price} placeholder="Price" />
        <label htmlFor="file-upload" className="custom-file-upload">
          Rasmni yuklash
        </label>
        <input ref={c_image}
          id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
        <span id="file-name">{fileName ? `Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}</span> <br />
        <button className="btn_service" type="submit">Create</button>
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
              {service?.map((item) => {
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
            <textarea ref={upd_desc_uz} defaultValue={filteredValue?.description_uz} />
            <textarea ref={upd_desc_ru} defaultValue={filteredValue?.description_ru} />
            <textarea ref={upd_desc_eng} defaultValue={filteredValue?.description_eng} />
            <input ref={upd_price} defaultValue={filteredValue?.price} />
            <label htmlFor="file-upload1" className="custom-file-upload">
              Rasmni almashtirish
            </label>
            <input ref={upd_image}
              id="file-upload1" type="file" accept="image/*" onChange={handleFileChange} />
            <span id="file-name">{fileName ? `Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}
              <p>{filteredValue?.image}</p>
            </span>
            <button className='mainButton_modal' type="submit">Yangilash</button>
          </form>
        </div>
      </div>

    </div>
  );

}

export default ServiceAdminCard;
