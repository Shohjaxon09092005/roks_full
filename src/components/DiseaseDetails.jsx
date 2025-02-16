import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../translate/LanguageContext"; // Tanlangan tilni olish
import translations from "../translate/DiseanceDetails"; // Tarjima ma'lumotlari
import "../styles/diseanseDetails.css";
import FeedbackDiseace from "./FeedbackDiseace";
import { URL } from "../Admin/Utils/url";

function DiseaseDetails() {
  const { id } = useParams();
  const { language } = useLanguage(); // Foydalanuvchi tanlagan tilni olish
  const t = translations[language] || translations["uz"]; // Default qilib o‘zbek tilini qo‘llash

  //GET 
  const [dis, setDis] = useState(null);
  useEffect(() => {
    getDiseace()
  }, [])
  async function getDiseace() {
    let fetchDis = await fetch(`${URL}/encyclopedia-diseases`)
    let json = await fetchDis.json();
    let sortedDis = json?.encyclopedia_diseases.sort((a, b) => a.id - b.id);
    setDis(sortedDis);

  }
  const disease = dis?.find((d) => d.id === parseInt(id));

  if (!disease) {
    return <h2>{t.noDiseaseMessage || "Kasallik haqida ma'lumot topilmadi"}</h2>;
  }

  return (
    <div className="disease-details">
      <h1 className="disease-title">{language === "uz" ? disease?.name_uz : language === "uz" ? disease?.name_ru : disease?.name_eng}</h1>
      <p className="disease-description">{language === "uz" ? disease?.description_uz : language === "uz" ? disease?.description_ru : disease?.description_eng}</p>
      <Link to="/kasalliklar" className="back-link">
        {t.backButton || "Orqaga qaytish"}
      </Link>
      <FeedbackDiseace title={t.title} placeholder={t.placeholder} btn_submit={t.btn_submit} success={t.success} success_desc={t.success_desc} fullName={t.fullName} surname_plc={t.surname_plc} name_plc={t.name_plc} save_full={t.save_full} del_full={t.del_full} />
    </div>
  );
}

export default DiseaseDetails;
