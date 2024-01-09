import { useContext } from "react"
import {useParams, Navigate} from "react-router-dom"
import { StepContext } from "../context/stepsContext"
function Location() {
    const param = useParams()
    const {updateNewLocation} = useContext(StepContext)
    console.log("Welcome to location: " + param.id)
    if(param.id){
      updateNewLocation({location: param.id})
    }
  return (
    <div>
        Welcome to location {param.id}
        {param.id ? <Navigate to="/" /> :""}    
    </div>
  )
}

export default Location