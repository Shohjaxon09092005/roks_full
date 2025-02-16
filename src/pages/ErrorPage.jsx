import React from 'react'
import '../styles/error.css'
import { NavLink } from 'react-router-dom'
function ErrorPage() {
  return (
    <div className='Error'>
      <div className='Error-wrapper'>
        <h1>
          Xatolik(Sayt yangilanayotgan bo'lishi mumkin!)
        </h1>
        <NavLink to="/">
          Yangilash
        </NavLink>
      </div>
    </div>
  )
}

export default ErrorPage
