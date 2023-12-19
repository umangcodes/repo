import React, {useState, useEffect, useContext} from "react"
import { StepContext } from "../../context/stepsContext";
import {motion} from "framer-motion"
function Stepa1() {
  const [step1Data, setStep1Data] = useState({
    firstname: "",
    healthcard: "",
    lastname: "",
    middlename: "",
    vc: "",
  })

  const { newContextValue, updateNewStep1 } = useContext(StepContext)

  useEffect(() => {
    if (newContextValue.step1) {
      setStep1Data(newContextValue.step1);
    }
    console.log(newContextValue)
  }, [newContextValue]);
  return (
    <div className="flex flex-col items-center justify-center px-5">
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div>
      <p>Firstname</p>
      <input
          type="text"
          label="First Name"
          name="firstname"
          placeholder={step1Data.firstname}
          value={step1Data.firstname}
          onChange={(e)=>{updateNewStep1({firstname: e.target.value})}}
          className="border rounded-xl px-2 "
        />
      
      <p>Middlename</p>
      <input
          type="text"
          label="First Name"
          name="firstname"
          placeholder={step1Data.middlename}
          value={step1Data.middlename}
          onChange={(e)=>{updateNewStep1({middlename: e.target.value})}}
          className="border rounded-xl px-2 "
        />

      <p>Lastname</p>
      <input
          type="text"
          label="First Name"
          name="firstname"
          placeholder={step1Data.lastname}
          value={step1Data.lastname}
          onChange={(e)=>{updateNewStep1({lastname: e.target.value})}}
          className="border rounded-xl px-2 "
        />

      <p>Healthcard</p>
      <input
          type="text"
          label="Healthcard"
          name="healthcard"
          placeholder={step1Data.healthcard}
          value={step1Data.healthcard}
          onChange={(e)=>{updateNewStep1({healthcard: e.target.value})}}
          className="border rounded-xl px-2 "
        />
      </div>
      </motion.div>
    </div>
  )
}

export default Stepa1