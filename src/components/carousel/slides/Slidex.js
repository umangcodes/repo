import { EMAIL, REPORT, BOOKNOW, HELP, FAQ, WHATSAPP } from "../../../assets"
import { useState } from "react"
import Section from "../portal/Section"
function Slidex() {
    const [activateModal, setActivateModal] = useState(false)
  return (
    <div className="flex flex-col justify-center items-center gap-5 mt-48">
        <ul className="flex flex-col gap-2">
            <li> 
                <a href="mailto:scc@mhlab.ca">
                    <div className="flex border border-secondaryShade h-20 w-[85vw] px-3 items-center rounded-xl justify-between shadow-special">
                        <img src={EMAIL} alt="email requisition at scc@mhlab.ca" className="h-8 px-2"/>
                        <div className="flex flex-col justify-end items-end">
                            <h1 className="text-md font-semibold text-secondary text-end">Email requisition</h1>
                            <a href="mailto:scc@mhlab.ca">scc@mhlab.ca</a>
                        </div>
                    </div>
                </a>
            </li>

            <li onClick={()=>{window.open("https://results.mhlab.ca/patient/#/login/")}}> 
                <div className="flex border border-secondaryShade h-20 px-5 items-center rounded-xl justify-between shadow-special">
                    <img src={REPORT} alt="Check your results" className="h-8"/>
                    <div className="flex flex-col justify-end items-end">
                        <h1 className="text-md text-end font-semibold text-secondary">Check your lab results</h1>
                        <h2>Visit portal to check for free</h2>
                    </div>
                </div>
            </li>

            {/* <li onClick={()=>{ window.open("https://www.mhlab.ca/appointment/")}}> 
                <div className="flex border border-secondaryShade h-20 px-5 items-center rounded-xl justify-between shadow-special">
                    <img src={BOOKNOW} alt="Book your appointment" className="h-10 -ml-1"/>
                    <div className="flex flex-col justify-end items-end">
                        <h1 className="text-lg font-semibold text-secondary">Book next appointment</h1>
                        <h2>Book now</h2>
                    </div>
                </div>
            </li> */}

            <li onClick={()=>{window.open("https://wa.me/message/BSYRCTM24GN6C1?src=qr")}}>
                <a href="https://wa.me/message/BSYRCTM24GN6C1?src=qr">
                    <div className="flex border border-secondaryShade h-20 px-5 items-center rounded-xl justify-between shadow-special">
                        <img src={WHATSAPP} alt="Need help" className="h-8"/>
                        <div className="flex flex-col justify-end items-end">
                            <h1 className="text-lg font-semibold text-secondary">Billing Queries</h1>
                            {/* <a href="mailto:info@mhlab.ca">Contact our main lab</a> */}
                            <h2>Chat with us on whatsapp!</h2>
                        </div>
                    </div>
                </a>
            </li>

            <li onClick={()=>{setActivateModal(true)}}>
                <div className="flex border border-secondaryShade h-20 px-5 items-center rounded-xl justify-between shadow-special">
                    <img src={FAQ} alt="Special Queries" className="h-8"/>
                    <div className="flex flex-col justify-end items-end">
                        <h1 className="text-lg font-semibold text-secondary">Special Queries?</h1>
                        <h2>Click here and select an option</h2>
                    </div>
                </div>
            </li>
        </ul>
        <Section activate={activateModal} setActivate={setActivateModal} />
    </div>
  )
}

export default Slidex