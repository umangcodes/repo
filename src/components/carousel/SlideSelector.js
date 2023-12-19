import { useEffect } from "react"
import Slide1 from "./slides/Slide1"
import Slide2 from "./slides/Slide2"
import Slide3 from "./slides/Slide3"
import Slide4 from "./slides/Slide4"
import Slide5 from "./slides/Slide5"
import Slidex from "./slides/Slidex"
function SlideSelector({currentPage, timeUp, setTimeUp}) {
    useEffect(() => {
        // setTimeout(() =>{
        //     setTimeUp(val => val = !val)
        //     console.log("update")
        // },5000)
    },[timeUp])
      switch(currentPage){
        case 1:
            return <Slidex />
        case 2:
            return <Slide2 />
        case 3:
            return <Slide3 />
        case 4:
            return <Slide4 />
        case 5:
            return <Slide5 />
        default:
            return <Slide1 />
      }

}

export default SlideSelector