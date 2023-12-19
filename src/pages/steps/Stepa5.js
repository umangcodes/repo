import React, {useState, useEffect, useContext} from "react"
import { StepContext } from "../../context/stepsContext";
function Stepa5() {
    const { newContextValue } = useContext(StepContext)
    const [data, setData] = useState(newContextValue)

  useEffect(() => {
    if (newContextValue.step1) {
        setData(newContextValue);
    }
    console.log(newContextValue)
  }, [newContextValue]);
  return (
    <>
      <p>Firstname</p>
      <input
          type="text"
          label="First Name"
          name="firstname"
          placeholder={data.step1.firstname}
          value={data.step1.firstname}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />
      
      <p>Middlename</p>
      <input
          type="text"
          label="middlename"
          name="middlename"
          placeholder={data.step1.middlename}
          value={data.step1.middlename}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Lastname</p>
      <input
          type="text"
          label="lastname"
          name="lastname"
          placeholder={data.step1.lastname}
          value={data.step1.lastname}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Healthcard</p>
      <input
          type="text"
          label="healthcard"
          name="healthcard"
          placeholder={data.step1.healthcard}
          value={data.step1.healthcard}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />
      <p>Date of Birth</p>
      <input
          type="text"
          label="Date of Birth"
          name="dob"
          placeholder={data.step1.dob}
          value={data.step1.dob}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />
      
      <p>Health card Issue Date</p>
      <input
          type="text"
          label="issueDate"
          name="issueDate"
          placeholder={data.step1.issueDate}
          value={data.step1.issueDate}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Health card Expiry Date</p>
      <input
          type="text"
          label="expiryDate"
          name="expiryDate"
          placeholder={data.step1.expiryDate}
          value={data.step1.expiryDate}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Address</p>
      <input
      disabled
          type="text"
          label="address"
          name="address"
          placeholder={data.step3.address}
          value={data.step3.address}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />
      
      <p>City</p>
      <input
        disabled
          type="text"
          label="city"
          name="city"
          placeholder={data.step3.city}
          value={data.step3.city}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Province</p>
      <input
        disabled
          type="text"
          label="province"
          name="province"
          placeholder={data.step3.province}
          value={data.step3.province}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Postal Code</p>
      <input
        disabled
          type="text"
          label="postalCode"
          name="postalCode"
          placeholder={data.step3.postalCode}
          value={data.step3.postalCode}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Phone</p>
      <input
          type="number"
          label="phone"
          name="phone"
          autoComplete="phone"
          placeholder={data.step4.phone}
          value={data.step4.phone}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />
      
      <p>Email</p>
      <input
          type="text"
          label="phone"
          name="phone"
          autoComplete="email"
          placeholder={data.step4.email}
          value={data.step4.email}
          onChange={()=>{}}
          className="border rounded-xl px-2 mx-5"
        />
    </>
  )
}

export default Stepa5