import { useState } from 'react';
import { Link } from "react-router-dom"
import Carousel from 'react-bootstrap/Carousel';
import carousel1 from '../../assets/images/carousel-1.svg'
import carousel2 from '../../assets/images/carousel-2.svg'
import carousel3 from '../../assets/images/carousel-3.svg'
import Image from 'react-bootstrap/Image';
import './CarouselPage.scss'

function CarouselPage() {
    const [index, setIndex] = useState(0);

    const handleClick = () => {
        index === 2 ?
            console.log('Move to form')
            :
            setIndex(index + 1);

    };

    return (
        <main className='carouselCastom conteiner'>
            <div className='carouselCastom__conteiner'>

                <Carousel activeIndex={index} slide={false} data-bs-theme="dark" controls={false}>
                    <Carousel.Item>
                        <div className="carouselCastom__inner-conteiner">

                            <Image src={carousel1} rounded className='carouselCastom__img' />
                            <h1 className='carouselCastom__title'>First slide label</h1>
                            <p className='carouselCastom__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className="carouselCastom__inner-conteiner">

                            <Image src={carousel2} rounded className='carouselCastom__img' />
                            <h1 className='carouselCastom__title'>Second slide label</h1>
                            <p className='carouselCastom__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                            </p>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className="carouselCastom__inner-conteiner">
                            <Image src={carousel3} rounded className='carouselCastom__img' />
                            <h1 className='carouselCastom__title'>Third slide label</h1>
                            <p className='carouselCastom__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>

                    </Carousel.Item>
                </Carousel>
            </div>
            {index === 2 ?
                <Link to='/form'>
                    <button type='button' className='button' style={{ width: '100%', marginTop: '20px' }} onClick={() => handleClick()}>Neste</button>

                </Link>
                :
                <button type='button' className='button' style={{ width: '100%', marginTop: '20px' }} onClick={() => handleClick()}>Kom I Gang</button>
            }
        </main>
    );
}

export default CarouselPage;