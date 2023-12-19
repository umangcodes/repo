import React, {useState, useEffect, useContext} from "react"
import { StepContext } from "../../context/stepsContext";
function Stepa4() {
  const [step4Data, setStep4Data] = useState({
    phone:"",
    email:""
  })

  const { newContextValue, updateNewStep4 } = useContext(StepContext)

  useEffect(() => {
    if (newContextValue.step4) {
      setStep4Data(newContextValue.step4);
    }
    console.log(newContextValue)
  }, [newContextValue]);
  return (
    <>
      <p>Phone</p>
      <input
          type="number"
          label="phone"
          name="phone"
          autoComplete="phone"
          placeholder={step4Data.phone}
          value={step4Data.phone}
          onChange={(e)=>{updateNewStep4({phone: e.target.value})}}
          className="border rounded-xl px-2 mx-5"
        />
      
      <p>Email</p>
      <input
          type="text"
          label="email"
          name="email"
          autoComplete="email"
          placeholder={step4Data.email}
          value={step4Data.email}
          onChange={(e)=>{updateNewStep4({email: e.target.value})}}
          className="border rounded-xl px-2 mx-5"
        />
    </>
  )
}

export default Stepa4