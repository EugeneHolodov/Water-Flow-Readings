import React from 'react'
import { Link } from "react-router-dom"
import './Home.scss'
import homeIcon from '../../assets/images/home-icon.svg'

function Home() {
  return (
    <main className="Home conteiner">
      <div className="Home__conteiner">
        <img src={homeIcon} className="Home__image" alt="logo" />
        <h1 className="Home__title">Wann Tracker</h1>
        <p className="Home__text">Hold oversikt over vannforbruket dittt</p>
        <Link to='/about'>
          <button className='button' style={{ border: "1px solid #fff" }}>Neste</button>
        </Link>
      </div>
      <div className="Home__wave-border"></div>
    </main>
  )
}

Home.propTypes = {}

export default Home
