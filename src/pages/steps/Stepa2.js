import React, {useState, useEffect, useContext} from "react"
import { StepContext } from "../../context/stepsContext";
function Stepa1() {
  const [step2Data, setStep2Data] = useState({
    dob: "",
    issueDate: "",
    expiryDate: ""
  })

  const { newContextValue, updateNewStep1 } = useContext(StepContext)

  useEffect(() => {
    if (newContextValue.step1) {
      setStep2Data(newContextValue.step1);
    }
    console.log(newContextValue)
  }, [newContextValue]);
  return (
    <>
      <p>Date of Birth</p>
      <input
          type="text"
          label="Date of Birth"
          name="dob"
          placeholder={step2Data.dob}
          value={step2Data.dob}
          onChange={(e)=>{updateNewStep1({dob: e.target.value})}}
          className="border rounded-xl px-2 mx-5"
        />
      
      <p>Health card Issue Date</p>
      <input
          type="text"
          label="issueDate"
          name="issueDate"
          placeholder={step2Data.issueDate}
          value={step2Data.issueDate}
          onChange={(e)=>{updateNewStep1({issueDate: e.target.value})}}
          className="border rounded-xl px-2 mx-5"
        />

      <p>Health card Expiry Date</p>
      <input
          type="text"
          label="expiryDate"
          name="expiryDate"
          placeholder={step2Data.expiryDate}
          value={step2Data.expiryDate}
          onChange={(e)=>{updateNewStep1({expiryDate: e.target.value})}}
          className="border rounded-xl px-2 mx-5"
        />
    </>
  )
}

export default Stepa1