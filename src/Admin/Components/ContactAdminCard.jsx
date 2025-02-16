import React, { useEffect, useReducer, useRef, useState } from "react";
import '../AdminStyles/contactAdmin.css'
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { URL } from "../Utils/url";
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function ContactAdminCard() {
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
  let social_image = useRef();
  let social_name = useRef();
  let social_link = useRef();
  //Yangilash uchun
  let updSocial_image = useRef()
  let updSocial_name = useRef()
  let updSocial_link = useRef()
  //navigate
  let navigate = useNavigate()

  // Shifrlangan ma'lumotni cookie'dan olish
  const encryptedAccessToken = Cookies.get('access_token');
  const encryptedRefreshToken = Cookies.get('refresh_token');
  const encryptedStoredTime = Cookies.get('stored_time');
  const encryptedUserId = Cookies.get('user_id');

  // Ma'lumotni dekodlash
  const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
  const decryptedRefreshToken = CryptoJS.AES.decrypt(encryptedRefreshToken, 'secret-key').toString(CryptoJS.enc.Utf8);
  const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);
  const decryptedUserId = CryptoJS.AES.decrypt(encryptedUserId, 'secret-key').toString(CryptoJS.enc.Utf8);

  // Shifrlash funksiyasi
  function saveEncryptedCookie(name, value) {
    const encryptedValue = CryptoJS.AES.encrypt(value, 'secret-key').toString();
    Cookies.set(name, encryptedValue, { expires: 7, path: '' }); // 7 kun davomida saqlanadi
    // Cookies.remove(name, encryptedValue, { expires: 7, path: '' })
  }
  // Refresh token olish
  async function refreshTokenIfNeeded() {
    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;

    if (timeDiff > 9.5) {
      const readyPost = {
        userId: decryptedUserId,
        refreshToken: decryptedRefreshToken,
      };
      const refreshResponse = await fetch(`${URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(readyPost),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        saveEncryptedCookie("refresh_token", data.refresh_token);
        saveEncryptedCookie("access_token", data.access_token);
        saveEncryptedCookie("stored_time", new Date().toISOString());
      } else {
        Cookies.remove("role");
        navigate("/admin");
        throw new Error("Refresh token yaroqsiz.");
      }
    }
  }
  //GET
  useEffect(() => {
    getSocial()
  }, [update])
  const [social, setSocial] = useState(null)
  async function getSocial() {
    let fetchData = await fetch(`${URL}/social-networks`);
    let json = await fetchData.json()
    let sortedSocial = json.social_networks.sort((a, b) => a.id - b.id);
    setSocial(sortedSocial)
  }

  // POST
  async function CreateSocial(e) {
    e.preventDefault();
    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    const formData = new FormData()
    formData.append("image", social_image.current.files[0])
    formData.append("name", social_name.current.value.trim())
    formData.append("link", social_link.current.value.trim())

    if (timeDiff < 9.5) {
      try {
        const responceSocial = await fetch(`${URL}/social-networks`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${decryptedAccessToken}`,
          },
          body: formData,
        });
        if (responceSocial.ok) {
          const result = await responceSocial.json();
          forceUpdate()
          console.log('employe created sccff:', result);
          alert("Muvaffaqiyatli qo'shildi")
          social_link.current.value=''
          social_name.current.value=''
          setFileName('')

        } else if (responceSocial.status === 401) {
          console.log('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...')
          Cookies.remove("role")
          navigate('/admin');
        } else {
          console.log('xatolik yuz berdi:', `${responceSocial.statusText} errors, or phone number may be valid.`);
          const result = await responceSocial.json();
          console.log(result);
          console.log(formData);


        }

      } catch (error) {
        console.log('Serverga ulanishda xatolik:', error.message);
      }
    } else {
      // token muddati tugadi yangi token olish
      await refreshTokenIfNeeded()
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

    console.log(filteredValue);

  }
  const filteredValue = social?.find((a) => a?.id === valueId)


  async function updateValue(e) {
    e.preventDefault()

    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    const formDataSocial = new FormData()
    formDataSocial.append("image", updSocial_image.current.files[0])
    formDataSocial.append('name', updSocial_name.current.value.trim())
    formDataSocial.append('link', updSocial_link.current.value.trim())

    if (timeDiff < 9.5) {
      try {
        const responce = await fetch(`${URL}/social-networks/${valueId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${decryptedAccessToken}`,
          },
          body: formDataSocial
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
        window.location.reload()
      }
    } else {
      await refreshTokenIfNeeded()

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
        const responceDel = await fetch(`${URL}/social-networks/${id}`, {
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
      await refreshTokenIfNeeded();
    }
  }


  return (
    <div className="contactAdmin">
      <h2>Bog‘lanish Ma‘lumotlari</h2>


      {/* Yangi ma'lumot yaratish */}


      <form onSubmit={CreateSocial}>

        <input type="text" placeholder="Social_name" ref={social_name} />
        <input type="url" placeholder="Social_link" ref={social_link} />
        <label htmlFor="file-upload" className="custom-file-upload">
          Rasmni yuklash
        </label>
        <input
          ref={social_image}
          id="file-upload" type="file" onChange={handleFileChange} />
        <p>{fileName ? `Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}</p>


        <button style={{width:"100%",marginBottom:'20px'}} type="submit">Yaratish</button>

      </form>
      <div className="value_table">
        <h2>Tahrirlash va o'chirish</h2>
        <div className="value_table_container">
          <table>
            <thead className='value_theadAdmin'>
              <tr>
                <th>Name</th>
                <th>link</th>
                <th>Image</th>
                <th>Tahrirlash</th>
              </tr>
            </thead>
            <tbody>
              {social?.map((item) => {
                return (
                  <tr key={item?.id}>
                    <td>{item?.name}</td>
                    <td>{item?.link}</td>
                    <td>{item?.image}</td>
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

            <input ref={updSocial_name} defaultValue={filteredValue?.name} />
            <input ref={updSocial_link} defaultValue={filteredValue?.link} />
            <label htmlFor="file-upload1" className="custom-file-upload">
              Rasmni yangilash
            </label>
            <input
              ref={updSocial_image}
              id="file-upload1" type="file" onChange={handleFileChange} />
            <h4>{filteredValue?.image}</h4>
            <p>{fileName ? `Yangilangan Fayl nomi: ${fileName}` : "Fayl tanlanmagan."}</p>
            <button type="submit">Yangilash</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactAdminCard
