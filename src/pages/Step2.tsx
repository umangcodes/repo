/* global google */

import { useLoadScript } from '@react-google-maps/api';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BACK, CANCEL, LOADER_PRIMARY, OK } from "../assets";
import Button from "../components/Button";
import ReactSelect from "../components/ReactSelect";
import TextInput from "../components/TextField";
import { db, dbCollections, storage } from '../firebase';
import { Context } from "../provider";
import { cities } from '../assets/cities'
import Portal from '../components/Portal';
import * as Sentry from "@sentry/browser";

const libraries: ["places"] = ["places"]

const Step2 = () => {
  return (
    <div className="w-full min-h-screen md:py-10 md:px-10 flex">
      <div className="w-full flex flex-col items-start flex-grow bg-background drop-shadow-xl p-5">
        <div className="w-full flex items-center pb-5 mb-4 border-b border-black/50">
          <Link to="/">
            <img src={BACK} className="h-6 mr-4" />
          </Link>
          <h1 className="text-xl md:text-2xl font-semibold">Step 2: Fill the Address</h1>
        </div>
        <div className="w-full flex items-center">
          <Stpep2Form />
        </div>
      </div>
    </div>
  )
}

type Step2Form = {
  phoneNumber: string,
  email: string,
  address: string,
  apartment?: string,
  city: string,
  province: string,
  postalCode: string,
  country: string
}
const Stpep2Form = () => {
  const { value, updateStep2, updateStep1, resetValues } = useContext(Context)
  const { handleSubmit, register, control, setValue, formState: { errors } } = useForm<Step2Form>();
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY!, libraries });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      initAutocomplete();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!value.personal_details.firstName) {
      navigate('/');
    }
  }, []);

  const convertBase64ToBlob = (base64Image: string) => {
    // Split into two parts
    const parts = base64Image.split(';base64,');

    // Hold the content type
    const imageType = parts[0].split(':')[1];

    // Decode Base64 string
    const decodedData = window.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }


  const uploadImageToStorage = async (image: string) => {
    const file = convertBase64ToBlob(image);

    const storageRef = ref(storage, `${value.personal_details.healthCardID}.${file.type.split("/")[1]}`);

    const snapshot = await uploadBytes(storageRef, file)
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  }

  function sanitize(string: string) {
    const reg = /[/|&<>"'=-]/ig;
    return string.replace(reg, (match) => "");
  }


  const onSubmit = async (data: Step2Form) => {
    Sentry.setUser({ email: data.email });
    Sentry.configureScope(scope => scope.setTransactionName("submit form"))

    updateStep2(data);
    setLoading(true);

    let downloadUrl = "";
    if (value.personal_details.healthCardImage) {
      // downloadUrl = await uploadImageToStorage(value.personal_details.healthCardImage);
    }
    // const docRef = doc(collection(db, dbCollections.formData));
    // await setDoc(doc(db, dbCollections.formData, docRef.id), {
    //   personal_details: {
    //     ...value.personal_details,
    //     // healthCardImage: downloadUrl
    //   },
    //   address_details: data,
    //   id: docRef.id,
    //   created_at: serverTimestamp()
    // }).then(() => {
    // }).catch(err => {
    //   // setLoading(false);
    //   // setError(true);
    //   // setSubmitted(false);
    //   // resetValues();
    //   console.log(err)
    // })

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("firstname", sanitize(value.personal_details.firstName));
    urlencoded.append("middlename", sanitize(value.personal_details.middleName));
    urlencoded.append("lastname", sanitize(value.personal_details.lastName));
    urlencoded.append("healthcard", sanitize(value.personal_details.healthCardID));
    urlencoded.append("dob", sanitize(value.personal_details.dateOfBirth));
    urlencoded.append("issue", sanitize(value.personal_details.issueDate));
    urlencoded.append("expiry", sanitize(value.personal_details.expiryDate).slice(0, 4));
    urlencoded.append("phone", sanitize(data.phoneNumber));
    urlencoded.append("address", sanitize(data.address));
    urlencoded.append("email", sanitize(data.email));

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    //@ts-ignore
    fetch(process.env.REACT_APP_REGISTER_PATIENT!, requestOptions)
      .then(res => res.json())
      .then(async (data) => {
        console.log("submitted")
        const docRef = doc(collection(db, dbCollections.formData));
        await setDoc(doc(db, dbCollections.formData, docRef.id), {
          personal_details: {
            ...value.personal_details,
            healthCardImage: value.personal_details.healthCardImage
          },
          address_details: data,
          id: docRef.id,
          created_at: serverTimestamp()
        }).then(() => {
        }).catch(err => {
          console.log(err)
        })
        setLoading(false);
        setError(false);
        setSubmitted(true)
        resetValues();
      }).catch(err => {
        setLoading(false);
        setError(true);
        setSubmitted(false);
        resetValues();
        console.log(err)
      })
  }

  let autocomplete: google.maps.places.Autocomplete;
  const fullAddressRef = useRef<HTMLInputElement | null>(null);

  function fillInAddress() {
    // Get the place details from the autocomplete object.
    const place = autocomplete.getPlace();
    for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];
      switch (componentType) {
        case "locality": {
          setValue("city", component.long_name);
          break;
        }
        case "administrative_area_level_1": {
          setValue("province", component.long_name);
          break;
        }
        case "postal_code": {
          setValue("postalCode", component.long_name);
          break;
        }
        // case "state": {
        //   setValue("postalCode", component.long_name);
        //   break;
        // }
        case "country": {
          setValue("country", component.long_name);
          break;
        }
      }
    }
  }

  function initAutocomplete() {
    if (fullAddressRef.current) {
      // Create the autocomplete object, restricting the search predictions to
      // addresses in the US and Canada.
      autocomplete = new google.maps.places.Autocomplete(
        fullAddressRef.current,
        {
          componentRestrictions: { country: ["ca"] },
          fields: ["address_components"],
          types: ["address"]
        }
      );
      fullAddressRef.current.focus();

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autocomplete.addListener("place_changed", fillInAddress);
    }
  }


  return (
    <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full my-3">
        <TextInput
          innerRef={fullAddressRef}
          type="text"
          label="Address"
          register={register}
          name="address"
          errors={errors}
          placeholder="Address*"
          required={"This field is required"}
        />
      </div>

      <div className="w-full my-3">
        <TextInput
          type="text"
          label="Phone Number"
          register={register}
          name="phoneNumber"
          errors={errors}
          placeholder="Phone Number*"
          required={"This field is required"}
        />
      </div>

      <div className="w-full my-3">
        <TextInput
          type="email"
          label="Email"
          register={register}
          name="email"
          errors={errors}
          placeholder="Email*"
          required={"This field is required"}
        // pattern={{
        //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        //   message: "Invalid email address"
        // }}
        />
      </div>

      <div className="w-full my-3">
        <TextInput
          type="text"
          label="Apartment/Unit No."
          register={register}
          name="apartment"
          errors={errors}
          placeholder="Apartment/Unit No."
        />
      </div>

      <div className="w-full my-3">
        <Controller
          control={control}
          // defaultValue={options.map(c => c.value)}
          name="city"
          rules={{ required: { value: true, message: "This field is required" } }}
          render={({ field: { onChange, value, ref } }) => (
            <div className="w-full flex flex-col">
              <p className="hidden md:block text-sm text-black font-medium mb-1">City</p>
              <ReactSelect
                inputRef={ref}
                options={cities.map((city) => ({ label: city.name, value: city.name }))}
                placeholder="City"
                selectedValue={value}
                onChange={(val: any) => onChange(val.value)}
              />
              {errors["city"] && <p className="text-xs font-medium text-red-400">{errors["city"].message}</p>}
            </div>
          )}
        />
      </div>

      <div className="flex items-center gap-x-5 my-3">
        <div className="w-full">
          <TextInput
            type="text"
            label="Province"
            register={register}
            name="province"
            errors={errors}
            placeholder="Province*"
            required={"This field is required"}
          />
        </div>
        <div className="w-full">
          <TextInput
            type="text"
            label="Postal Code"
            register={register}
            name="postalCode"
            errors={errors}
            placeholder="Postal Code*"
            required={"This field is required"}
          />
        </div>
      </div>

      <div className="w-full my-3">
        <TextInput
          type="text"
          label="Country"
          register={register}
          name="country"
          errors={errors}
          placeholder="Country*"
          required={"This field is required"}
        />
      </div>

      <div className="ml-auto min-w-[128px] max-w-[164px] my-10">
        <Button text={`${submitted ? "Submitted" : "Submit"}`} disabled={submitted} loading={loading} />
      </div>

      {(loading || submitted || error) &&
        <Portal>
          <div className="fixed top-0 left-0 w-full min-h-screen bg-white flex items-center justify-center z-50">
            <div className='w-[90%] md:w-1/2 min-h-[400px] bg-white p-7 max-w-[420px] flex flex-col drop-shadow-2xl'>
              {submitted &&
                <div className='w-full h-full flex flex-col grow items-center justify-center'>
                  <img src={OK} className="w-14 h-14" />
                  <h1 className='text-2xl font-semibold my-10'>Submitted</h1>
                </div>
              }
              {error &&
                <div className='w-full h-full flex flex-col grow items-center justify-center'>
                  <img src={CANCEL} className="w-14 h-14" />
                  <h1 className='text-2xl font-semibold my-10'>Something went wrong.</h1>
                </div>
              }
              {
                loading &&
                <div className='w-full h-full flex flex-col grow items-center justify-center'>
                  <img src={LOADER_PRIMARY} className="w-14 h-14" />
                  <h1 className='text-2xl font-semibold my-10'>Submitting...</h1>
                </div>
              }
              {(submitted || error) &&
                <div className="mt-auto w-full min-w-[128px]">
                  <Button text={`Back`} onClick={() => {
                    navigate("/")
                  }} />
                </div>
              }
            </div>
          </div>
        </Portal>
      }
    </form >
  )
}

export default Step2;