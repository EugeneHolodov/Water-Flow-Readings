import { Link } from "react-router-dom"
import successImg from '../../assets/images/success-img.svg'
import './EndPage.scss'
function EndPageSuccessed() {

    return (
        <main className='end conteiner'>
            <div className='end__conteiner'>
                <div className="end__pictAndTitle">
                    <img src={successImg} className="end__image" alt="success-pic" />
                    <h1 className="end__title">Vellykket</h1>
                </div>
                <Link to='/'>
                    <button type="button" className='button'>Kom Tilbake</button>
                </Link>
            </div>
        </main>
    )
}

export default EndPageSuccessed
