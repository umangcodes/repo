import { BG, BRAND_LOGO, LONG_ARROW, THUNDERBOLT } from "../assets"

const Sidebar = () => {
  return (
    <div className="w-full h-full p-10 flex flex-col">
      <div className="w-full flex flex-col items-start">
        <img src={BRAND_LOGO} className="h-16 mb-10" />

        <div className="flex flex-col my-3">
          <h1 className="text-5xl font-normal text-white mb-3 font-oswald">Welcome !</h1>
          <p className="text-base text-white font-normal">Getting started is simple</p>
          <img src={LONG_ARROW} className="my-1" />
        </div>

        <div className="flex items-center my-3">
          <img src={THUNDERBOLT} className="h-6 mr-2" />
          <p className="text-base text-white font-semibold">Auto Fill Application</p>
        </div>

        <h3 className="text-3xl text-white font-normal font-oswald my-2">Save time by uploading the ID card</h3>

      </div>
    </div>
  )
}

export default Sidebar