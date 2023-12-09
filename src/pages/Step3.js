import { Link } from "react-router-dom";
import { BACK, CHECKMARK } from "../assets";
import Carousel from "../components/carousel/Carousel";
import { Context } from "../provider";
import { useContext } from "react";
const Step3 = () => {
    const token = window.localStorage.getItem("token")
    const waitTime = 5
    const patientAhead = 1
    const location = useContext(Context).value.location_details.location
    return (
      <div className="w-full min-h-screen md:py-10 md:px-10 flex">
        <div className="w-full flex flex-col justify-center items-center flex-grow bg-background drop-shadow-xl p-5">
          <div className="">

            <h2 className="text-center text-2xl">You are in queue!</h2>
            <h4 className="text-center text-xl pt-5">Token</h4>
            <div className="flex h-48 w-[230px] -mt-5">
              <img src={CHECKMARK} alt="registered. In queue." className="rounded-full opacity-5" />
              <p className="z-20 -mx-[135px] mt-[80px] text-4xl font-bold">10</p>
          </div>
          </div>
          <div className="text-center">
            Email requisition at <a to="mailto: scc@mhlab.ca" className="italic text-blue-800 underline font-semibold">scc@mhlab.ca</a>
          </div>
          <div>
            <Carousel />
          </div>

        </div>
      </div>
    )
  }


export default Step3