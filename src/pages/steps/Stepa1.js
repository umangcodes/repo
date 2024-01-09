import {useState, useEffect, useContext} from "react"
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
  const [errors, setErrors] = useState({firstname: " ", lastname: " ", healthcard: " "});
  const [stageValidationPass, setStageValidationPass] = useState(false)
  const { newContextValue, updateNewStep1, updatePages } = useContext(StepContext)


  // Validation
  const validate = (name, value) => {
    switch (name) {
      case "firstname":
      case "lastname":
        if (!value) {
          return "Required. Cannot be empty";
        }
        if(value.length < 3){
          return "Minimum 3 characters"
        }
        break;
      case "healthcard":
        if(!value){
          return "Required"
        }
        if (!/^\d{10}$/.test(value)) {
          return "Healthcard must be 10 digits.";
        }
        break;
      default:
        return "";
    }
  };

  const checkOverallValidation = () => {
    const hasErrors = Object.values(errors).some(error => error);
    setStageValidationPass(!hasErrors);
  };
  function sanitize(string) {
    const reg = /[/|&<>"'=-]/ig;
    return string.replace(reg, (match) => "");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    if(name != "healthcard"){
      setErrors({
        ...errors,
        [name]: error !== undefined ? error : null,
      });
      updateNewStep1({ [name]: value });
    }else{
      setErrors({
        ...errors,
        [name]: error !== undefined ? error : null,
      });
      updateNewStep1({ [name]: sanitize(value) });
    }
  };

  useEffect(() => {
    if (newContextValue.step1) {
      setStep1Data(newContextValue.step1);
    }
    checkOverallValidation()
    console.log(errors)
  }, [newContextValue]);

  useEffect(() => {
    updatePages({step1: stageValidationPass})
  },[stageValidationPass])
  return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.5}}>
      <div>
      <p className="text-xl font-semibold">Firstname*</p>
      <input
          type="text"
          label="First Name"
          name="firstname"
          placeholder={step1Data.firstname || "First Name"}
          value={step1Data.firstname}
          onChange={handleChange}
          className="border rounded-md px-2 text-xl py-2 w-full"
        />
        {errors.firstname && <p className="text-red-500">{errors.firstname}</p>}
      
      <p className="text-xl font-semibold">Middlename</p>
      <input
          type="text"
          label="Middle Name"
          name="middlename"
          placeholder={step1Data.middlename || "Middle Name"}
          value={step1Data.middlename}
          onChange={handleChange}
          className="border rounded-md px-2 text-xl py-2 w-full"
        />

      <p className="text-xl font-semibold">Lastname*</p>
      <input
          type="text"
          label="Last Name"
          name="lastname"
          placeholder={step1Data.lastname || "Last Name"}
          value={step1Data.lastname}
          onChange={handleChange}
          className="border rounded-md px-2 text-xl py-2 w-full"
        />
        {errors.lastname && <p className="text-red-500">{errors.lastname}</p>}


      <p className="text-xl font-semibold">Healthcard* <label className="text-sm font-light">(Format: 1234567890)</label></p>
      <input
          type="text"
          label="Healthcard"
          name="healthcard"
          placeholder={step1Data.healthcard || "Healthcard"}
          value={step1Data.healthcard}
          onChange={handleChange}
          className="border rounded-md px-2 text-xl py-2 w-full"
        />
        {errors.healthcard && <p className="text-red-500">{errors.healthcard}</p>}


        { newContextValue.pages.step1 ? "" : <p className="transition-all ease-in-out duration-150 text-center pt-5 font-semibold text-red-500">Check for errors</p>}
      </div>
      </motion.div>
  )
}

export default Stepa1