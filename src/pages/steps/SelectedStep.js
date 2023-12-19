import Stepa1 from "./Stepa1"
import Stepa2 from "./Stepa2"
import Stepa3 from "./Stepa3"
import Stepa4 from "./Stepa4"
import Stepa5 from "./Stepa5"

function SelectedStep({currentPage}) {
  switch(currentPage){
    case 1:
        return <Stepa1/>
    case 2:
        return <Stepa2/>
    case 3:
        return <Stepa3/>
    case 4:
        return <Stepa4/>
    case 5:
        return <Stepa5/>
    default:
        return <Stepa1 />
  }
}

export default SelectedStep