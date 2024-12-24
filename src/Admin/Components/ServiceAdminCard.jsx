import React, { useState } from 'react';
import '../AdminStyles/serviceAdminCard.css';
// import rasm from '../Images/loginImages-removebg-preview.png'
function ServiceAdminCard() {
  const [fileName, setFileName] = useState('Fayl tanlanmagan');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : 'Fayl tanlanmagan');
  };

  return (
    <div className="service_card_admin">
      <h2>Xizmatlar</h2>
      <form>
        <h3>Yaratish</h3>
        <input type="text" placeholder="Xizmat nomi" />
        <label htmlFor="file-upload" className="custom-file-upload">
          Rasm yuklash
        </label>
        <input
           id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
        <span id="file-name">{fileName}</span>
        <input type="text" placeholder='Title' />
        <input type="text" placeholder='Description' />
        <input type="text" placeholder='Size' />
        <button className='btn_service' type="submit">Create</button>
      </form>
      <form>
        <h3>Yangilash yoki o'chirish</h3>
        <input type="text" placeholder="Xizmat nomi" />
        <label htmlFor="file-upload" className="custom-file-upload">
          Rasmni almashtirish
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
        <span id="file-name">{fileName}</span>
        <p>Img title</p>

         
        <input type="text" placeholder='Title' />
        <input type="text" placeholder='Description' />
        <input type="text" placeholder='Size' />
        <div className="btn_all_ser">
          <button className='btn_service' type="submit">Update</button>
        <button className='btn_service_del'>Delete</button>
        </div>
        
      </form>
      
    </div>
  );
}

export default ServiceAdminCard;
