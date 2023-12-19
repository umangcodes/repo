import React, {useState, useEffect, useContext} from "react"
import { StepContext } from "../../context/stepsContext";
import AutoComplete from "react-google-autocomplete";

function Stepa3() {
  const [addressInput, setAddressInput] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const { newContextValue, updateNewStep3 } = useContext(StepContext)

  const [step3Data, setStep3Data] = useState({
    address: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    country: ""
  })
  const updateAddress = (resp) => {
    console.log(resp)
    console.log(addressInput)
    if(resp.address_components){
      resp.address_components.map((address_array_ele) => {
        if(address_array_ele.types.includes("administrative_area_level_3")){
          setAddress(resp.formatted_address)
        }
        if(address_array_ele.types.includes("administrative_area_level_2")){
          setCity(address_array_ele.long_name)
        }
        if(address_array_ele.types.includes("administrative_area_level_1")){
          setProvince(address_array_ele.long_name)
        }
        if(address_array_ele.types == "postal_code"){
          setPostalCode(address_array_ele.long_name)
        }
      })
    }
  }


  useEffect(() => {
    if (newContextValue.step3) {
      setStep3Data(newContextValue.step3);
    }
  }, [newContextValue]);
  useEffect(() => {
    updateAddress(addressInput)
  },[addressInput])
  useEffect(() => {
    // console.log("address update")
    // console.log(address)
    updateNewStep3({
      address: address,
      city: city,
      province:province,
      postalCode: postalCode
    })
  },[postalCode])
  return (
    <>
      <div id="address-field" className="flex flex-col">
          <label className="text-xl">Address*</label>
          <AutoComplete apiKey={process.env.REACT_APP_GOOGLE_API_KEY} style={{ width: "100%" }} options={{
          types: ['address'],
          componentRestrictions: { country: "ca" },
        }} onPlaceSelected={(place) => {setAddressInput(place)}} placeholder="Enter your address here" className="border px-2 py-2 mt-2 rounded-xl"/>
      </div>
      <p>Address</p>
      <input
      disabled
          type="text"
          label="address"
          name="address"
          placeholder={step3Data.address}
          value={step3Data.address}
          className="border rounded-xl px-2 mx-5"
        />
      
      <p>City</p>
      <input
        disabled
          type="text"
          label="city"
          name="city"
          placeholder={step3Data.city}
          value={step3Data.city}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Province</p>
      <input
        disabled
          type="text"
          label="province"
          name="province"
          placeholder={step3Data.province}
          value={step3Data.province}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Postal Code</p>
      <input
        disabled
          type="text"
          label="postalCode"
          name="postalCode"
          placeholder={step3Data.postalCode}
          value={step3Data.postalCode}
          className="border rounded-xl px-2 mx-5"
        />
    </>
  )
}

export default Stepa3