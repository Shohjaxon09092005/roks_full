import React, { useEffect, useState } from 'react';
import '../styles/servicesAbout.css';
import { useParams } from 'react-router-dom';
import translations from '../translate/TranslationServiesAbout'; // Tarjima matnlarini import
import { useLanguage } from '../translate/LanguageContext'; // Til boshqaruvi
import CommentService from '../components/CommentService';
import { URL } from '../Admin/Utils/url';

function ServicesAbout() {
  const { language } = useLanguage(); // Faol tilni olish
  const t = translations[language]; // Faol tilga mos tarjimalar

  // Xizmatlar ma'lumotlarini dinamik tarjima bilan aniqlash

  // GET
  const [serAbout, setSerAbout] = useState(null);

  useEffect(() => {
    getSerAbout()
    getSer_doc()
    getAboutDoc()
  }, [])

  async function getSerAbout() {
    let fetchSerAbout = await fetch(`${URL}/services`);
    let jsonSer = await fetchSerAbout.json();
    let sortedSerAbout = jsonSer?.services;
    setSerAbout(sortedSerAbout);
  }

  const { id } = useParams(); // URL parametridan xizmat ID sini olish
  const service = serAbout?.find((service) => service.id === Number(id));
  //GET
  const [filter, setFilter] = useState(null)
  async function getSer_doc() {
    let fetchFilterSer = await fetch(`${URL}/service-doctor`);
    let jsonFilter = await fetchFilterSer.json();
    setFilter(jsonFilter)

  }
  const filterDoc = filter?.service_doctor.filter((a) => a.service_id === service?.id)


  //GET
  const [docAbout, setDocAbout] = useState(null);
  async function getAboutDoc() {
    let fetchAboutDoc = await fetch(`${URL}/doctors`);
    let jsonDoc = await fetchAboutDoc.json();
    setDocAbout(jsonDoc?.doctors)

  }
  const filterDocAbout = filterDoc?.map((item) =>
    docAbout?.find((doc) => doc?.id === item?.doctor_id)
  )



  if (!service) {
    return <div>{t.serviceNotFound}</div>; // Tarjima bilan "Xizmat topilmadi"
  }

  return (
    <div className="container">
      <div className="service-details">
        <div
          className="service-image"
          style={{ backgroundImage: `url(https://clinic-web-back.onrender.com/${service.image})` }}
        ></div>
        <div className="service-content">
          <h1>{language === "uz" ? service?.name_uz : language === "ru" ? service?.name_ru : service?.name_eng}</h1>
          <p>{language === "uz" ? service?.description_uz : language === "ru" ? service?.description_ru : service?.description_eng}</p>
          <h3>{t.doctors}</h3>
          {filterDocAbout?.length > 0 ? (
            <ul>
              {filterDocAbout.map((doctor, index) => (
                <li key={index}>{doctor?.full_name}</li>
              ))}
            </ul>
          ) : (
            <p>{t.noDoctorFound || "Shifokorlar yo'q"}</p>
          )}
          <h4>{t.price}: {service?.price} UZS</h4>
        </div>
      </div>
      <CommentService title={t.title} placeholder={t.placeholder} btn_submit={t.btn_submit} success={t.success} success_desc={t.success_desc}  />
    </div>
  );
}

export default ServicesAbout;
