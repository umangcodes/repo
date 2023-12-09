import { REPORT } from "../../../assets"

function Slide1() {
  return (
    <div className="flex flex-col">
        <h1 className="text-xl text-center py-5">Want to check results online for free?</h1>
        <div className="flex items-center justify-center">
          <img src={REPORT} alt="book an appointment today!" className=" opacity-5 rounded-full"/>
          <h2 className="text-center text-blue-800 underline -ml-[225px] font-bold text-xl"><a href="https://www.mhlab.ca/patient-result-portal-registration-request/">Sign up for patient portal</a></h2>
        </div>
      </div>
  )
}

export default Slide1