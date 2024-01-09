import React, {useState, useEffect, useContext} from "react"
import { StepContext } from "../../context/stepsContext";
import {motion} from "framer-motion"

function Stepa4() {
  const [errors, setErrors] = useState({phone: " ", email: " "});
  const [stageValidationPass, setStageValidationPass] = useState(false)
  const [step4Data, setStep4Data] = useState({
    phone:"",
    email:"",
    confirmEmail:""
  })

  const validate = (name, value) => {
    switch (name) {
      case "phone":
        if(!value){
          return "Required"
        }
        if (!/^\d{10}$/.test(value)) {
          return "Must be a 10 digit number";
        }
        break;
      case "email":
        if(!value){
          return "Required"
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return "Enter a valid email address.";
        }
        break;
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
      setErrors({
        ...errors,
        [name]: error !== undefined ? error : null,
      });
      updateNewStep4({ [name]: value });
  }

  const { newContextValue, updateNewStep4, updatePages } = useContext(StepContext)
  
  const checkOverallValidation = () => {
    const hasErrors = Object.values(errors).some(error => error);
    console.log(errors)
    console.log("errors on this page: " + hasErrors)
    setStageValidationPass(!hasErrors);
  };

  useEffect(() => {
    if (newContextValue.step1) {
      setStep4Data(newContextValue.step4);
    }
    checkOverallValidation()
    console.log(errors)
  }, [newContextValue]);

  useEffect(() => {
    updatePages({step4: stageValidationPass})
  },[stageValidationPass])

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.5}}>
      <p className="text-xl font-semibold capitalize">Phone* <label className="text-sm font-light">(Format: 1234567890)</label></p>
      <input
          type="text"
          label="phone"
          name="phone"
          placeholder={step4Data.phone || "1234567890"}
          value={step4Data.phone}
          onChange={handleChange}
          className="border rounded-md px-2 text-xl py-2 w-full"
        />
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}

      <p className="text-xl font-semibold ">Email* <label className="text-sm font-light">(Format: johndoe@domain.co)</label></p>
      <input
          type="text"
          label="email"
          name="email"
          placeholder={step4Data.email || "johndoe@domain.co"}
          value={step4Data.email}
          onChange={handleChange}
          className="border rounded-md px-2 text-xl py-2 w-full"
        />
      {errors.email && <p className="text-red-500">{errors.email}</p>}
    </motion.div>
  )
}

export default Stepa4