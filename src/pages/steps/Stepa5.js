import {useState, useEffect, useContext} from "react"
import { StepContext } from "../../context/stepsContext";
import {motion} from "framer-motion"

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
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.5}}>
      {newContextValue.pages.step1 && newContextValue.pages.step4 ?  "" : <p>Go Back and resolve the errors</p>}
    </motion.div>
  )
}

export default Stepa5