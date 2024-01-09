import {useState, useEffect, useContext} from "react"
import { StepContext } from "../../context/stepsContext";
import {motion} from "framer-motion"
function Stepa1() {

  const [stageValidationPass, setStageValidationPass] = useState(false)

  const [step2Data, setStep2Data] = useState({
    dob: "",
    issueDate: "",
    expiryDate: ""
  })
  const [errors, setErrors] = useState({dob: " "});

  const { newContextValue, updateNewStep1, updatePages } = useContext(StepContext)

  const validate = (name, value) => {
    switch (name) {
      case "issueDate":
      case "expiryDate":
        if(!parseInt(value)){
          return "Must be a date"
        }
        if (!/^(?:\d{8}|)$/.test(value)) {
          return "Must be in YYYYMMDD format";
        }
        break;
      case "dob":
        if(!value){
          return "Required"
        }
        if (!/^\d{8}$/.test(value)) {
          return "Must be in YYYYMMDD format";
        }
        break;
      default:
        return "";
    }
  };

  const checkOverallValidation = () => {
    const hasErrors = Object.values(errors).some(error => error);
    console.log(errors)
    console.log("errors on this page: " + hasErrors)
    setStageValidationPass(!hasErrors);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
      setErrors({
        ...errors,
        [name]: error !== undefined ? error : null,
      });
      updateNewStep1({ [name]: value });
  }
  const onLoad = () =>{
    setStep2Data({dob : newContextValue.step1.dob, issueDate: newContextValue.step1.issueDate, expiryDate: newContextValue.step1.expiryDate})
    setErrors({
      ...errors,
      dob: validate("dob", newContextValue.step1.dob)
    })
  }

  useEffect(() => {
    if (newContextValue.step1) {
      setStep2Data(newContextValue.step1);
    }
    onLoad()
    checkOverallValidation()
    // check for validation
  }, [newContextValue]);

  useEffect(() => {
    updatePages({step2: stageValidationPass})
  },[stageValidationPass])

  useEffect(() => {onLoad()}, [])

  function sanitize(string) {
    const reg = /[/|&<>"'=-]/ig;
    return string.replace(reg, (match) => "");
  }

  const displayDate = (dateString) =>{
    sanitize(dateString)
    if(dateString.length == 8){
      return `${dateString.slice(0,4)}/${dateString.slice(4,6)}/${dateString.slice(6,8)}`
    }else{
      return sanitize(dateString)
    }

  }
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.5}}>
      <p className="text-xl font-semibold">Date of Birth* <label className="text-sm font-light">(Format: YYYYMMDD)</label></p>
      <input
          type="text"
          label="Date of Birth"
          name="dob"
          placeholder={step2Data.dob || "YYYYMMDD"}
          value={displayDate(step2Data.dob)}
          onChange={handleChange}
          className="border rounded-md px-2 text-xl py-2 w-full"
        />
        {errors.dob && <p className="text-red-500">{errors.dob}</p>}

      <p className="text-xl font-semibold">Health card Issue Date <label className="text-sm font-light">(Optional)</label></p>
      <input
          type="text"
          label="issueDate"
          name="issueDate"
          placeholder={step2Data.issueDate || "YYYYMMDD"}
          value={displayDate(step2Data.issueDate)}
          onChange={handleChange}
          className="border rounded-md px-2 text-xl py-2 w-full"
        />
        {errors.dob && <p className="text-red-500">{errors.issueDate}</p>}

      <p className="text-xl font-semibold">Health card Expiry Date <label className="text-sm font-light">(Optional)</label></p>
      <input
          type="text"
          label="expiryDate"
          name="expiryDate"
          placeholder={step2Data.expiryDate || "YYYYMMDD"}
          value={displayDate(step2Data.expiryDate)}
          onChange={handleChange}
          className="border rounded-md px-2 text-xl py-2 w-full"
        />
        {errors.dob && <p className="text-red-500">{errors.expiryDate}</p>}
        { newContextValue.pages.step2 ? "" : <p className="transition-all ease-in-out duration-150 text-center pt-5 font-semibold text-red-500">Check for errors</p>}
    </motion.div>
  )
}

export default Stepa1