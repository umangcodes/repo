import { Link, useNavigate } from "react-router-dom";
import { BACK } from "../assets";

const Step3 = () => {
    const token = window.localStorage.getItem("token")
    return (
      <div className="w-full min-h-screen md:py-10 md:px-10 flex">
        <div className="w-full flex flex-col items-start flex-grow bg-background drop-shadow-xl p-5">
          <div className="w-full flex items-center pb-5 mb-4 border-b border-black/50">
            <Link to="/">
              <img src={BACK} className="h-6 mr-4" />
            </Link>
            <h1 className="text-xl md:text-2xl font-semibold">Token: {token}</h1>
          </div>
          <div className="w-full flex items-center">
            
          </div>
        </div>
      </div>
    )
  }


export default Step3