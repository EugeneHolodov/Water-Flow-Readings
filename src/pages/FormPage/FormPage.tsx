/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios, { AxiosError, AxiosResponse } from 'axios';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';
import Cookies from 'js-cookie';
import phoneValidator from '../../utils/phoneValidator';
import circle from '../../assets/images/circle.svg'
import flag from '../../assets/images/norway-flag.svg'
import drop from '../../assets/images/drop-1.svg'
import { setDefaults, fromLatLng, OutputFormat } from "react-geocode";
import './FormPage.scss'

interface ILocation {
  street: string,
  city: string,
  postcode: string,
}

interface IFormData {
  name: string,
  status: string,
  phoneNumber: string,
  city: string,
  street: string,
  zip: string,
  liters?: string,
}

setDefaults({
  key: "AIzaSyDZqlVc7-z0Zd8zcv5aqk39f1sHbiNS780",
  outputFormat: OutputFormat.JSON
});

const COOKIE_NAME = 'formData';
const COOKIE_EXPIRATION_DAYS = 30;

const saveFormDataToCookie = (data: IFormData) => {
  Cookies.set(COOKIE_NAME, JSON.stringify(data), { expires: COOKIE_EXPIRATION_DAYS });
};

const loadFormDataFromCookie = (): IFormData | null => {
  const cookieData = Cookies.get(COOKIE_NAME);
  return cookieData ? JSON.parse(cookieData) : null;
};

function FormPage() {
  const { Formik } = formik;
  const navigate = useNavigate()
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const initialFormData: IFormData = loadFormDataFromCookie() || {
    name: '',
    status: '',
    phoneNumber: '',
    city: '',
    street: '',
    zip: '',
  };
  console.log('Init data', initialFormData)
  console.log(Cookies)
  const useCurrentLocation = async () => {
    setIsLoading(true)
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false)
      return;
    }

    try {
      //Request current position from device
      const position: GeolocationPosition = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
      const { latitude, longitude } = position.coords;

      //Query the reverse geocoding API
      const address = await fromLatLng(latitude, longitude);
      console.log("[useCurrentLocation]", { latitude, longitude, address });

      //Extract address components from Google Maps API response
      const components = address.results[0]?.address_components.reduce((acc: { [x: string]: any; }, component: { types: (string | number)[]; long_name: any; }) => {
        acc[component.types[0]] = component.long_name;
        return acc;
      }, {});

      const locationData: ILocation = {
        street: [components.route, components.street_number].filter((x) => x).join(" ") || "",
        city: components.locality || components.postal_town || "",
        postcode: components.postal_code || ""
      }

      setIsDisabled(true)
      setIsLoading(false)
      return locationData
    } catch (error) {
      setIsDisabled(false)
      setIsLoading(false)
      console.error("Error:", error);
    }
  };

  const schema = yup.object().shape({
    name: yup.string().required().min(2).max(60),
    phoneNumber: yup.string().test('phoneNumber', 'Invalid phone number', phoneValidator).required(),
    status: yup.string().required("Fill who are you"),
    city: yup.string().required().min(3).max(30),
    street: yup.string().required().min(2).max(30),
    zip: yup.string().required().min(3),
    liters: yup.number().required().positive().max(1000000),
  });

  const postData = async (formData: IFormData): Promise<any> => {
    try {
      const response: AxiosResponse = await axios.post<FormData>(
        // 'http://localhost:3005/submit',
        'https://water-tracker.azurewebsites.net/api/post-data-function',
        formData
      );
      console.log('Response:', response.data);
      return response
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Server responded with status code:', axiosError.response.status);
        console.error('Response data:', axiosError.response.data);
      } else if (axiosError.request) {
        console.error('Error sending request:', axiosError.request);
      } else {
        console.error('Error:', axiosError.message);
      }
    }
  };

  return (
    <main className='form conteiner'>
      <div className="form__inner">

        <img src={circle} className='form__circle-img' alt="circle" />

        <Formik
          validationSchema={schema}

          onSubmit={(values: IFormData) => {
            setIsSubmiting(true)
            postData(values)
              .then((data) => {
                if (data) {
                  const { liters, ...rest } = values;
                  saveFormDataToCookie(rest)
                }
                console.log('Data successfully sent', data);
                setIsSubmiting(false);
                !!data ?
                  navigate('/finish_successed')
                  :
                  navigate('/finish_failed')
              })
              .catch(error => console.error('Error sending data:', error))
              .finally(() => {
                setIsSubmiting(false);
              });
          }}
          initialValues={{
            ...initialFormData,
            liters: ''
          }}
        >
          {({ handleSubmit, handleChange, setValues, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit} className='form__form-conteiner'>
              <Row className="mb-2">
                <Form.Group as={Col} className="mb-3 form__group-lable" controlId="validationFormik01">
                  <Form.Label>Navn</Form.Label>
                  <Form.Control
                    disabled={isLoading}
                    required
                    className='form__input'
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={touched.name && !!errors.name}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>

                </Form.Group>
                <Form.Group as={Row} className="mb-3 form__group-lable" controlId="validationFormik00" required>
                  <Row style={{ margin: '0 auto' }}>
                    <Form.Check
                      disabled={isLoading}
                      style={{ width: "min-content" }}
                      type="radio"
                      label="Privat"
                      name="status"
                      id="formHorizontalRadios1"
                      value="privat"
                      checked={values.status === "privat"}
                      onChange={handleChange}
                      isInvalid={touched.status && !!errors.status}
                    />
                    <Form.Check
                      disabled={isLoading}
                      style={{ width: "min-content" }}
                      type="radio"
                      label="Company"
                      name="status"
                      id="formHorizontalRadios2"
                      value="company"
                      checked={values.status === "company"}
                      onChange={handleChange}
                      isInvalid={touched.status && !!errors.status} />

                    <Form.Control.Feedback type="invalid">
                      {errors.status}
                    </Form.Control.Feedback>
                  </Row>


                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col} className="mb-3 form__group-lable" controlId="validationFormikPhoneNumber">
                  <Form.Label>Telefonnumer</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text id="inputGroupPrepend">
                      <img src={flag} alt='flag' style={{ marginRight: "5px" }}></img>
                      <span className='phone-index'>+47</span>
                    </InputGroup.Text>
                    <Form.Control
                      disabled={isLoading}
                      className='form__input'
                      type="text"
                      placeholder="Telefonnumer"
                      aria-describedby="inputGroupPrepend"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row >

                <Form.Group as={Col} md="6" className="mb-3 form__group-lable" controlId="validationFormik04">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    disabled={isLoading}
                    className='form__input'
                    type="text"
                    placeholder="Street"
                    name="street"
                    value={values.street}
                    onChange={handleChange}
                    isInvalid={!!errors.street}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.street}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="3" className="mb-3 form__group-lable" controlId="validationFormik03">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    disabled={isLoading}
                    className='form__input'
                    type="text"
                    placeholder="City"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    isInvalid={!!errors.city}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} className="mb-3 form__group-lable" controlId="validationFormik05">
                  <Form.Label>Poscode</Form.Label>
                  <Form.Control
                    disabled={isLoading}
                    className='form__input'
                    type="text"
                    placeholder="Zip"
                    name="zip"
                    value={values.zip}
                    onChange={handleChange}
                    isInvalid={!!errors.zip}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.zip}
                  </Form.Control.Feedback>
                </Form.Group>


              </Row>
              <Form.Check
                disabled={isDisabled}
                type="switch"
                id="custom-switch"
                onChange={async () => {
                  await useCurrentLocation().then(e => {
                    e && setValues({ ...values, city: e.city, street: e.street, zip: e.postcode })
                  });
                }}
                label={
                  isLoading ?
                    <>
                      Lasting...
                      <Spinner animation="border" role="status" size="sm" style={{ marginLeft: '3px' }}>
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </>
                    :

                    "Fylles Automatisk"
                }
              />
              <Row className="mb-2">
                <Form.Group as={Col} className="mb-3 form__group-lable" controlId="validationFormikPhoneNumber">
                  <Form.Label>Antall Lite</Form.Label>
                  <InputGroup hasValidation>

                    <Form.Control
                      disabled={isLoading}
                      className="form-control form__input"
                      required
                      type="text"
                      placeholder="Antall Lite"
                      aria-describedby="inputGroupPrepend"
                      name="liters"
                      value={values.liters}
                      onChange={handleChange}
                      isInvalid={!!errors.liters}
                    />
                    <InputGroup.Text id="inputGroupPrepend">
                      <span className='phone-index'>L</span>
                      <img src={drop} alt='drop' style={{ marginLeft: "5px", width: '10px' }}></img>
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.liters}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>

              <button type="submit" className='button' disabled={isSubmiting}>Sende</button>
            </Form>
          )}
        </Formik>

      </div>
    </main>
  );
}

export default FormPage;