import faildImg from '../../assets/images/faild-img.svg'


function NotFoundPage() {
    return (
        <main className='end conteiner'>
            <div className='end__conteiner'>
                <img src={faildImg} alt="faild-pic" />
                <h1 className="end__title">Not Found 404!</h1>
            </div>
        </main>
    )
}

export default NotFoundPage
