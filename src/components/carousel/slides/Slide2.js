import { APPOINTMENT } from "../../../assets"
function Slide2() {
  return (
    <div className="flex flex-col w-[85vw]">
        <h1 className="text-xl text-center py-5">Save time on you next visit</h1>
        <div className="flex">
          <img src={APPOINTMENT} alt="book an appointment today!" className="opacity-5 rounded-full"/>
          <h2 className="text-center text-blue-800 underline -ml-[270px] mt-[70px] font-bold text-xl"><a href="https://www.mhlab.ca/appointment/">Book an appointment today!</a></h2>
        </div>
    </div>
  )
}

export default Slide2