import React from "react";
import "../AdminStyles/bannerAdmin.css";
// import { FiArrowUp, FiArrowDown } from "react-icons/fi";
// import axios from "axios";

function BannerAdmin() {
    // const [icon, setIcon] = useState(true);
    // const [formData, setFormData] = useState({ id: "", title: "", description: "", language: "uz" });

    // // Form qiymatlarini boshqarish
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });
    // };

    // // Yaratish funksiyasi
    // const createBanner = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post("/api/banners", formData);
    //         alert(response.data.message);
    //         setFormData({ id: "", title: "", description: "", language: "uz" });
    //     } catch (error) {
    //         console.error(error);
    //         alert("Xatolik: " + (error.response?.data?.error || "Server xatosi"));
    //     }
    // };

    // // Yangilash funksiyasi
    // const updateBanner = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.put(`/api/banners/${formData.id}`, formData);
    //         alert(response.data.message);
    //         setFormData({ id: "", title: "", description: "", language: "uz" });
    //     } catch (error) {
    //         console.error(error);
    //         alert("Xatolik: " + (error.response?.data?.error || "Server xatosi"));
    //     }
    // };

    // // O'chirish funksiyasi
    // const deleteBanner = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.delete(`/api/banners/${formData.id}`);
    //         alert(response.data.message);
    //         setFormData({ id: "", title: "", description: "", language: "uz" });
    //     } catch (error) {
    //         console.error(error);
    //         alert("Xatolik: " + (error.response?.data?.error || "Server xatosi"));
    //     }
    // };

    return (
        // <div className="banner_admin">
        //     <h2 onClick={() => setIcon(!icon)}>
        //         Banner {icon ? <FiArrowDown /> : <FiArrowUp />}
        //     </h2>

        //     {!icon && (
        //         <>
        //             {/* Yaratish formasi */}
        //             <h3 >Yaratish</h3>  

        //             <form className="banner_create" onSubmit={createBanner}>
        //                 <input
        //                     name="title"
        //                     placeholder="Sarlavha"
        //                     type="text"
        //                     value={formData.title}
        //                     onChange={handleInputChange}
        //                 />
        //                 <input
        //                     name="description"
        //                     placeholder="Tavsif"
        //                     type="text"
        //                     value={formData.description}
        //                     onChange={handleInputChange}
        //                 />
                       
        //                 <button type="submit">Qo'shish</button>
        //             </form>

        //             {/* Yangilash va o'chirish formasi */}
        //             <form className="banner_update">
        //                 <h3>Yangilash yoki O'chirish</h3>
        //                 <input
        //                     name="id"
        //                     placeholder="Banner ID"
        //                     type="text"
        //                     value={formData.id}
        //                     onChange={handleInputChange}
        //                 />
        //                 <input
        //                     name="title"
        //                     placeholder="Sarlavha"
        //                     type="text"
        //                     value={formData.title}
        //                     onChange={handleInputChange}
        //                 />
        //                 <input
        //                     name="description"
        //                     placeholder="Tavsif"
        //                     type="text"
        //                     value={formData.description}
        //                     onChange={handleInputChange}
        //                 />
        //                 <div className="ban_upd_btn">
        //                     <button type="button" onClick={updateBanner}>
        //                         Update
        //                     </button>
        //                     <button type="button" className="del_banner" onClick={deleteBanner}>
        //                         Delete
        //                     </button>
        //                 </div>
        //             </form>
        //         </>
        //     )}
        // </div>
        <div className="div"></div>
    );
}

export default BannerAdmin;
