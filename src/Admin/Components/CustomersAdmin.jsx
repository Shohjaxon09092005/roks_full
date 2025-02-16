import React, { useEffect, useReducer, useRef, useState } from 'react';
import '../AdminStyles/customersAdmin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { refreshToken } from '../Utils/authRefreshToken';
import { URL } from '../Utils/url';
function CustomersAdmin() {


  const [showModal, setShowModal] = useState(false);
  const [roleId, setRoleId] = useState(null)
  const handleEditClick = (id) => {
    setShowModal(true); // Modal oynani ko'rsatamiz
    setRoleId(id)
  };


  //post
  //navigate
  let navigate = useNavigate()

  // Shifrlangan ma'lumotni cookie'dan olish
  const encryptedAccessToken = Cookies.get('access_token');
  const encryptedStoredTime = Cookies.get('stored_time');


  // Ma'lumotni dekodlash
  const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
  const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);



  // Update
  const [update, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {

  }, [update])
  //yaratish
  let full_name = useRef();
  let phone_number = useRef();
  let login = useRef();
  let password = useRef();
  async function roleSubmit(e) {
    e.preventDefault();

    const phoneRegex = /^\+998\d{9}$/; // +998 bilan boshlanib, jami 13 ta belgi bo‘lishi kerak
    if (password.current.value.length < 6 || !phoneRegex.test(phone_number.current.value)) {
      alert("Parol 6 ta belgidan kam bo‘lmasligi kerak! yoki Telefon raqami noto‘g‘ri! To‘g‘ri format: +998901234567");
      return;
    }

    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;

    let readyForm = {
      full_name: full_name.current.value.trim(),
      phone_number: phone_number.current.value.trim(),
      login: login.current.value.trim(),
      password: password.current.value.trim(),
      role: "admin"
    };

    if (timeDiff < 9.5) {
      try {
        const responceRole = await fetch(`${URL}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${decryptedAccessToken}`,
          },
          body: JSON.stringify(readyForm),
        });

        if (responceRole.ok) {
          const result = await responceRole.json();
          forceUpdate();
          console.log(result);
          alert("Muvaffaqqiyatli qo'shildi");
          full_name.current.value = "";
          phone_number.current.value = "";
          login.current.value = "";
          password.current.value = "";
        } else if (responceRole.status === 401) {
          alert("Token yaroqsiz");
          Cookies.remove("role");
          navigate('/admin');
        } else {
          alert(`Xatolik yuz berdi: ${responceRole.statusText} yoki telefon raqami noto‘g‘ri.`);
        }
      } catch (error) {
        alert('Serverga ulanishda xatolik:', error.message);
      }
    } else {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        roleSubmit(e);
      } else {
        console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        navigate('/admin');
      }
    }
  }
  //GET
  const [role, setRole] = useState([]);
  useEffect(() => {

    // Shifrlangan ma'lumotni cookie'dan olish
    const encryptedAccessToken = Cookies.get('access_token');
    const encryptedStoredTime = Cookies.get('stored_time');

    // Ma'lumotni dekodlash
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
    const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);
    // Update
    async function getRole() {
      const current_time = new Date();
      const stored_time = decryptedStoredTime;
      const timeDiff = (current_time - new Date(stored_time)) / 60000;
      if (timeDiff < 9.5) {
        try {
          const responceRole = await fetch(`${URL}/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${decryptedAccessToken}`,
            },

          });
          if (responceRole.ok) {
            let resultRole = await responceRole.json();
            let sortedRole = resultRole?.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRole(sortedRole)
          }


        } catch (error) {
          alert('Serverga ulanishda xatolik:', error.message)
        }
      } else {
        // Tokenni yangilash
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          getRole(); // Yangi token bilan qayta chaqirish
        } else {
          console.log("Token yangilanmadi. Login sahifasiga o'ting.");
          navigate('/admin');
        }
      }

    }
    getRole()
  }, [update, navigate])
  const filterRole = role?.find((item) => item?.id === roleId)
  console.log(filterRole);

  //PUT
  const [upd_name, setUpdName] = useState('');
  const [upd_phone, setUpdPhone] = useState('');
  const [upd_login, setUpdLogin] = useState('');
  const [upd_password, setUpdPassword] = useState('');
  const handleSave = async (e) => {
    e.preventDefault();
    const phoneRegex = /^\+998\d{9}$/; // +998 bilan boshlanib, jami 13 ta belgi bo‘lishi kerak
    if (upd_password.length < 6 || !phoneRegex.test(upd_phone || filterRole?.phone_number)) {
      alert("Parol 6 ta belgidan kam bo‘lmasligi kerak! yoki Telefon raqami noto‘g‘ri! To‘g‘ri format: +998901234567");
      return;
    }
    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    const formRole = {
      full_name: upd_name || filterRole?.full_name,
      phone_number: upd_phone || filterRole?.phone_number,
      login: upd_login || filterRole?.login,
      hashed_password: upd_password,
      role: filterRole?.role
    }
    if (timeDiff < 9.5) {
      try {
        const responceUpdRole = await fetch(`${URL}/user/${roleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
           "Authorization": `Bearer ${decryptedAccessToken}`,
          },
          body: JSON.stringify(formRole)
        });                    
        if (responceUpdRole.ok) {
          const resultUpdRole = await responceUpdRole.json();
          console.log(resultUpdRole);
          alert("Muvaffaqiyatli yangilandi")
          setShowModal(false); // Modalni yopamiz
          window.location.reload()

        } else if (responceUpdRole.status === 401) {
          Cookies.remove("role")
          navigate('/admin');
          alert("Token yaroqsiz")
        } else {
          alert("Xatolik yuz berdi")
        }

      } catch (error) {
        alert('Serverga ulanishda xatolik:', error.message)
      }

    } else {
      // Tokenni yangilash
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        handleSave(e); // Yangi token bilan qayta chaqirish
      } else {
        console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        navigate('/admin');
      }
    }

  };
  //Delete
  async function deleteForm(e, id) {
    e.preventDefault();
    const current_time = new Date();
    const stored_time = decryptedStoredTime;
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    if (timeDiff < 9.5) {
      try {
        const responceUpdRole = await fetch(`${URL}/user/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decryptedAccessToken}`,
          },
        });
        if (responceUpdRole.ok) {
          const resultUpdRole = await responceUpdRole.json();
          console.log(resultUpdRole);
          alert("Muvaffaqiyatli o'chirildi")
          forceUpdate()
          setShowModal(false); // Modalni yopamiz


        } else if (responceUpdRole.status === 401) {
          Cookies.remove("role")
          navigate('/admin');
          alert("Token yaroqsiz")
        } else {
          alert("Xatolik yuz berdi")
        }

      } catch (error) {
        alert('Serverga ulanishda xatolik:', error.message)
      }

    } else {
      // Tokenni yangilash
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        deleteForm(e, id); // Yangi token bilan qayta chaqirish
      } else {
        console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        navigate('/admin');
      }
    }
  }
  return (
    <section className='Admin_role'>
      <h2>Admin biriktirish</h2>
      <form onSubmit={(e) => roleSubmit(e)} className='admin_role'>
        <input ref={full_name} type="text" placeholder='Ism familiya' />
        <input ref={phone_number} type="text" placeholder='Telefon' />
        <input ref={login} type="text" placeholder='Login' />
        <input ref={password} type="text" placeholder='Password' />
        <button type="submit">Biriktirish</button>
      </form>
      <div className="customers-table_admin">
        <h2>Adminlar ro'yxati</h2>
        <table>
          <thead className='theadAdmin'>
            <tr>
              <th>Ro'l</th>
              <th>Ism va familiya</th>
              <th>Tahrirlash</th>
            </tr>
          </thead>
          <tbody>
            {role?.map((customer) => (
              <tr key={customer.id}>
                <td style={{ textAlign: "center" }}>{customer?.role}</td>
                <td style={{ textAlign: "center" }}>{customer?.full_name}</td>
                <td  >
                  <div className="icon_customer">
                    <FontAwesomeIcon
                      className='icon_c1'
                      icon={faPen}
                      style={{ color: "#1f5137", cursor: 'pointer' }}
                      onClick={() => handleEditClick(customer?.id)} // Tahrirlash funksiyasi
                    />
                    <FontAwesomeIcon onClick={(e) => deleteForm(e, customer?.id)} className='icon_c1' icon={faTrashCan} style={{ color: "red", cursor: "pointer" }} />

                  </div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal oynasi */}
        {showModal && (
          <div className="modal_admin">
            <div className="modal-content_admin">
              <h3>Edit Customer</h3>
              <label>
                Ism familiya:
                <input type="text" name="name" defaultValue={filterRole?.full_name} onChange={(e) => setUpdName(e.target.value)} />
              </label>

              <label>
                Telefon:
                <input type="text" name="location" defaultValue={filterRole?.phone_number} onChange={(e) => setUpdPhone(e.target.value)} />
              </label>
              <label>
                Role:
                <input type="text" name="location" value={filterRole?.role} />
              </label>
              <label>
                Login:
                <input type="text" name="location" onChange={(e) => setUpdLogin(e.target.value)} defaultValue={filterRole?.login} />
              </label>

              <label>
                Yangi password:
                <input type="text" name="location" onChange={(e) => setUpdPassword(e.target.value)} />
              </label>
              <div className="modal-actions_admin">
                <button onClick={(e) => handleSave(e)}>Save</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>

  );
}

export default CustomersAdmin;
