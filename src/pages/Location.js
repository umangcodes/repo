import { useContext } from "react"
import {useParams, Navigate} from "react-router-dom"
import { Context } from "../provider"
function Location() {
    const param = useParams()
    const { value, updateLocation } = useContext(Context)
    console.log("Welcome to location: " + param.id)
    if(param.id){
      updateLocation({location: param.id})
    }
  return (
    <div>
        Welcome to location {param.id}
        {param.id ? <Navigate to="/" /> :""}    
    </div>
  )
}

export default Location