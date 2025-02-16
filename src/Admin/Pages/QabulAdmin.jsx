import React, { useEffect, useReducer, useRef, useState } from 'react'
import { URL } from '../Utils/url';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { refreshToken } from '../Utils/authRefreshToken';
import SidebarAdmin from '../Components/SidebarAdmin';
import HeaderAdmin from '../Components/HeaderAdmin';
function QabulAdmin() {
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
  let upd_full_name = useRef();
  let upd_email = useRef();
  let upd_phone_number = useRef();
  let upd_date = useRef();
  let upd_time = useRef();
  let upd_message = useRef();
  //get
  const [ed, setEd] = useState([]);
  useEffect(() => {
    getEd()
  }, [update])
  async function getEd() {
    let fetchEd = await fetch(`${URL}/acceptance`);
    let jsonEd = await fetchEd.json();
    let sortedEd = jsonEd?.acceptance.sort((a, b) => b.id - a.id);
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
      full_name:upd_full_name.current.value.trim(),
      email:upd_email.current.value.trim(),
      phone_number:upd_phone_number.current.value.trim(),
      date:upd_date.current.value.trim(),
      time:upd_time.current.value.trim(),
      service_id:filteredValue?.service_id,
      description: upd_message.current.value.trim()

    }

    if (timeDiff < 9.5) {
      try {
        const responce = await fetch(`${URL}/acceptance/${valueId}`, {
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
        const responceDel = await fetch(`${URL}/acceptance/${id}`, {
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
  //get
  const[serAll,setSerAll]=useState([]);
  useEffect(()=>{
    getSerAll()
  },[])
  async function getSerAll() {
    let fetchSerAll=await fetch(`${URL}/services`);
    let jsonSerAll=await fetchSerAll.json();
    setSerAll(jsonSerAll)
    
  }
  const filterSerAll=serAll?.services?.find((a)=>a.id===filteredValue?.service_id)
  
  return (
    <div className='qabul_admin app-containerAdmin'>
      <SidebarAdmin />
      <div className="admin-panel main-contentAdmin">
        <HeaderAdmin />

        <h1>Online arizalar</h1>
        <div className="appointments">
          <h2>Qabul qilingan ma'lumotlar</h2>
          <div className="value_table">
            <div className="value_table_container">
              <table>
                <thead className='value_theadAdmin'>
                  <tr>
                    <th>Nomer</th>
                    <th>Ism va familiya</th>
                    <th>Barcha ma'lumotlarni ko'rish va Tahrirlash</th>
                  </tr>
                </thead>
                <tbody>
                  {ed?.map((item, index) => {
                    return (
                      <tr key={item?.id}>
                        <td>{index + 1}</td>
                        <td>{item?.full_name}</td>
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
              <label htmlFor="full_name">Ism familiya</label>
                <input type="text" id='full_name' defaultValue={filteredValue?.full_name} ref={upd_full_name}/>
                <label htmlFor="email">Email</label>
                <input type="text" id='email' defaultValue={filteredValue?.email} ref={upd_email} />
                <label htmlFor="phone">Telefon nomer</label>
                <input type="text" id='phone' defaultValue={filteredValue?.phone_number} ref={upd_phone_number} />
                <label htmlFor="sana">Sana</label>
                <input type="text" id='sana' defaultValue={filteredValue?.date} ref={upd_date} />
                <label htmlFor="time">Vaqt</label>
                <input type="text" id='time' defaultValue={filteredValue?.time} ref={upd_time} />
                <label htmlFor="time">Xizmat turi</label>
                <input type="text" defaultValue={filterSerAll?.name_uz}/>
                
                <label htmlFor="message">Foydalanuvchi xabari</label>
                <textarea ref={upd_message} id='message' defaultValue={filteredValue?.description} />

                <button className='mainButton_modal' type="submit">Yangilash</button>
              </form>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default QabulAdmin
