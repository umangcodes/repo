import {useState, useEffect} from "react"
import SlideSelector from "./SlideSelector.js"
function Carousel() {
    const [currentPage, setCurrentPage] = useState(1)
    const [timeUp, setTimeUp] = useState(false)
    const FIRSTPAGE = 1
    const LASTPAGE = 4

    useEffect(() => {
        if(currentPage > LASTPAGE){
            setCurrentPage(FIRSTPAGE)
        }
        if(currentPage < FIRSTPAGE){
            setCurrentPage(LASTPAGE)
        }
    },[currentPage])
    useEffect(() => {
        if(timeUp){
            console.log("updating page")
            setCurrentPage(val => val=val+1)
            if(currentPage > LASTPAGE){
                setCurrentPage(FIRSTPAGE)
            }
            if(currentPage < FIRSTPAGE){
                setCurrentPage(LASTPAGE)
            }
        }
    },[timeUp])

  return (
    <div className="flex h-96 mt-2">
        <SlideSelector currentPage={currentPage} timeUp={timeUp} setTimeUp={setTimeUp}/> 
    </div>
  )
}

export default Carousel