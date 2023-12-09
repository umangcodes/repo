import { useContext } from "react"
import { Context } from "../../../provider"
function Slide5() {
    const location = useContext(Context).value.location_details.location
    switch(location){
        case 100:
            return <div>Ratings</div>
        default:
            return <div>Ratings page</div>
    }
}

export default Slide5