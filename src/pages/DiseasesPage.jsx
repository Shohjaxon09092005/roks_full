import React from "react";
import DiseaseCard from "../components/DiseaseCard";
import SearchBar from "../components/SearchBar";
import { useLanguage } from "../translate/LanguageContext"; // Tanlangan tilni olish
import translations from "../translate/DiseasesPage"; // Tarjima ma'lumotlari
import "../styles/diseasesPage.css";

function DiseasesPage() {
  const { language } = useLanguage(); // Foydalanuvchi tanlagan tilni olish
  const t = translations[language] || translations["uz"]; // Default qilib o‘zbek tilini olish




  return (
    <div className="Kasallik">
      <h1>{t.diseasesTitle || "Kasalliklar haqida ma'lumot"}</h1>
      <SearchBar placeholder={t.searchPlaceholder || "Qidiruv..."} />
      <div className="diseases-list">
        <DiseaseCard />
      </div>
    </div>
  );
}

export default DiseasesPage;
