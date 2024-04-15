import { Link } from "react-router-dom"
import failedImg from '../../assets/images/faild-img.svg'
import './EndPage.scss'
function EndPageFailed() {

    return (
        <main className='end conteiner'>
            <div className='end__conteiner'>
                <div className="end__pictAndTitle">
                    <img src={failedImg} className="end__image" alt="success-pic" />
                    <h1 className="end__title">Noe gikk galt, prøv igjen</h1>
                </div>
                <Link to='/'>
                    <button type="button" className='button'>Kom Tilbake</button>
                </Link>
            </div>
        </main>
    )
}

export default EndPageFailed
