import {motion} from "framer-motion"
import { AnimatePresence } from "framer-motion";
import { BILL, PAYMENT, TECH } from "../../../assets";
export default function Content({onClose}) {
    return (
      <AnimatePresence>
        <motion.div initial={{y:-400, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-400, opacity:0}} transition={{y: {type: "spring", stiffness: 300, damping:30}, opacity:{duration: 0.2}}}>
          <div className="fixed left-0 top-[40vh] inset-0 bg-secondary bg-opacity-100 z-50 p-5 h-[80vh] rounded-t-3xl flex flex-col mb-10">
            <div className="flex">
              <div className="w-[90vw]"></div>
              <button onClick={() => onClose(false)} className="text-white font-semibold">X</button>
            </div>
            <div className="bg-white h-[50vh] w-[90vw] rounded-xl flex flex-col justify-center items-center">
              <h1 className="text-secondary text-xl font-semibold pb-5">Select an option</h1>
              
              <div className="w-[90%]">
                <ul className="flex flex-col gap-5">
                  <li className="w-full">
                    <a href="mailto:support@mhlab.ca">
                        <div className="flex border h-20 px-5 items-center rounded-xl justify-between shadow-special">
                            <img src={TECH} alt="Tech Support" className="h-8"/>
                            <div className="flex flex-col justify-end items-end">
                                <h1 className="text-lg font-semibold text-secondary">Technical issues</h1>
                                <a href="mailto:support@mhlab.ca">Contact IT support</a>
                            </div>
                        </div>
                    </a>
                  </li>

                  <li className="w-full">
                    <a href="mailto:billing@mhlab.ca">
                        <div className="flex border h-20 px-5 items-center rounded-xl justify-between shadow-special">
                            <img src={PAYMENT} alt="Payment Support" className="h-8"/>
                            <div className="flex flex-col justify-end items-end">
                                <h1 className="text-lg font-semibold text-secondary">Payments</h1>
                                <a href="mailto:billing@mhlab.ca">Need help with payments</a>
                            </div>
                        </div>
                    </a>
                  </li>

                  <li className="w-full">
                    <a href="mailto:accounting@mhlab.ca">
                        <div className="flex border h-20 px-5 items-center rounded-xl justify-between shadow-special">
                            <img src={BILL} alt="Billing" className="h-8"/>
                            <div className="flex flex-col justify-end items-end">
                                <h1 className="text-lg font-semibold text-secondary">Invoice / Bills</h1>
                                <a href="mailto:accounting@mhlab.ca">Email at accounting@mhlab.ca</a>
                            </div>
                        </div>
                    </a>
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

    );
  }