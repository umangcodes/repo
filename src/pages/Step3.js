import Carousel from "../components/carousel/Carousel";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LOADER_PRIMARY } from "../assets";
const Step3 = () => {
  const [data, setData] = useState(0)
  const [finalCall, setFinalCall] = useState(false)
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
    // const location = useContext(Context).value.location_details.location
    const location = localStorage.getItem("location")
    const healthcard = localStorage.getItem("healthcard")
    const getData = async() => {
      console.log({healthcard: healthcard, location: location})
      console.log(data ? data.data.waitingInQueue : 1)
      await axios.post("https://us-central1-patient-registration-portal.cloudfunctions.net/web/waittime", {healthcard: healthcard, location: location}).then(resp => {setData(resp); console.log(resp)}, error => console.log(error))
    }

    const finalCallRef = useRef(finalCall);
  finalCallRef.current = finalCall;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!finalCallRef.current) {
        getData();

        // Check the updated condition with the current state of data
        if (data && data.data.waitingInQueue <= 0) {
          setFinalCall(true);
        }
      }
    }, 15000);
    //  avg. api calls per month per user cal: 60 * 60 * 10 (avg hours) * 365 / 15(api call freq) / 12(months) = 73000 continious calls. our free limit 2M
    //  so ~27 users can simultaniously use this system for free
    //  increase the time to 20 sec api call interval for increase free limit to ~36.6 users.

    return () => clearInterval(interval);
  }, [data]);

    

    return (
    <div>
      <div className="border w-full flex items-center justify-center bg-[#138bea] text-xl text-center text-white rounded-b-xl">{data ? data.data.address : ""}</div>
      <div className="w-full md:py-10 md:px-10 flex">
        <div className="w-full flex flex-col justify-center items-center flex-grow p-5">
          <div className="">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-2xl font-bold text-secondary">Welcome {data ? data.data.name ? capitalizeFirstLetter(data.data.name) : "" : ""}</h1>
              <div className="flex">
                {
                data.data ?
                    data.data.waitingInQueue > 0 ? 
                    <>
                      <div className="flex flex-col items-center">
                        <div className="flex">
                          <div id="stats" className="border shadow-sm h-16 w-16 rounded-full flex items-center justify-center text-2xl font-semibold bg-[#138bea]"><div className="h-14 w-14 flex flex-col items-center justify-center border rounded-full bg-white">{data.data.waitingInQueue}</div></div>
                          <div className="h-1 w-1 rounded-full bg-[#138bea] animate-ping"></div>
                        </div>
                        <h2 className="text-xl font-bold text-secondary pt-2">Patients Ahead Of You</h2>
                      </div>
                    </> 
                    : 
                    <div className="flex flex-col items-center">
                      <div className="flex">
                        <div id="stats" className="border shadow-sm h-24 w-24 rounded-full flex items-center justify-center text-lg font-semibold bg-[#138bea] "><div className="h-[90px] w-[90px] flex flex-col items-center justify-center border rounded-full bg-white text-center">Now Serving</div></div>
                        <div className="h-1 w-1 rounded-full bg-[#138bea] animate-ping"></div>
                      </div>
                      <h2 className="text-xl font-bold text-secondary pt-2">Please check with the reception</h2>
                    </div>
                  : <div>
                    <img src={LOADER_PRIMARY} alt="Loading" className="h-24"/>
                    <p>You are added to the queue. Please wait while we check for patients ahead of you.</p>
                    </div>
                }
              </div>
            </div>
          </div>
          <div>
            <Carousel />
          </div>
        </div>
      </div>
    </div>
    )
  }


export default Step3