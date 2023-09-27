import React, { useState, useEffect, useRef } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import TextInput from "./TextField";

interface Props {
  onChange: (date: any) => void
}

const DatePicker: React.FC<Props> = ({ onChange }) => {
  const datePickerRef = useRef(null);
  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [state, setState] = useState({
    showDatepicker: false,
    datepickerValue: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).toDateString(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    no_of_days: [0],
    blankdays: [0],
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  });

  useEffect(() => {
    let today = new Date();
    setState({
      ...state,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      datepickerValue: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ).toDateString()
    });
  }, []);

  useEffect(() => {
    getNoOfDays();
  }, [state.month]);

  const isToday = (date: number) => {
    const today = new Date();
    const d = new Date(state.year, state.month, date);
    return today.toDateString() === d.toDateString() ? true : false;
  };
  const isSelected = (date: number) => {
    const selected = state.datepickerValue;
    const d = new Date(state.year, state.month, date);
    return selected === d.toDateString() ? true : false;
  };

  const getDateValue = (date: number) => {
    let selectedDate = new Date(state.year, state.month, date);

    setState({
      ...state,
      datepickerValue: selectedDate.toDateString(),
      showDatepicker: false
    });
    onChange(new Date(selectedDate).toISOString().split("T")[0]);

    // setValue(("0" + selectedDate.getDate()).slice(-2)
    //   +
    //   "-" +
    //   ("0" + selectedDate.getMonth()).slice(-2) +
    //   "-" +
    //   selectedDate.getFullYear()
    // )
    // console.log(this.$refs.date.value);
    // this.showDatepicker = false;
  };

  const getNoOfDays = () => {
    let daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    // find where to start calendar day of week
    let dayOfWeek = new Date(state.year, state.month).getDay();
    let blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    let daysArray = [];
    for (var x = 1; x <= daysInMonth; x++) {
      daysArray.push(x);
    }
    setState({ ...state, blankdays: blankdaysArray, no_of_days: daysArray });
  };

  const handleOutsideClick = () => {
    setState({ ...state, showDatepicker: false })
  }
  useClickOutside(datePickerRef, handleOutsideClick)



  return (
    // <div ref={datePickerRef} className="relative flex items-center justify-center w-full h-full">
    <div className=" bg-white mt-12 rounded-lg shadow p-4 flex flex-col w-[17rem] z-50">
      <div className="flex w-full justify-between items-center mb-2">
        {/* CURRENT MONTH AND YEAR TEXT */}
        <div>
          {/* <span
            x-text="MONTH_NAMES[month]"
            className="text-lg font-bold text-gray-800"
          >
            {MONTH_NAMES[state.month]}
          </span> */}

          <select
            // defaultValue={MONTH_NAMES[state.month]}
            onChange={(e) => setState({ ...state, month: e.target.selectedIndex })}
          >
            {MONTH_NAMES.map((month, index) =>
              <option selected={index === state.month} value={index}>{month}</option>
            )}
          </select>

          {/* <span
            x-text="year"
            className="ml-1 text-lg text-gray-600 font-normal"
          >
            {state.year}
          </span> */}
          <select
            defaultValue={new Date().getFullYear()}
            onChange={(e) => setState({ ...state, year: e.target.selectedIndex })}
          >
            {[...new Array(new Date().getFullYear() - 1969)].map((year, index) =>
              <option className="text-sm py-1" value={new Date().getFullYear() - index}>{new Date().getFullYear() - index}</option>

            )}
          </select>
        </div>

        {/* ARROW BUTTONS FOR NEXT AND PREV MONTH */}
        <div>
          <button onClick={() => setState({ ...state, month: state.month - 1 })} type="button"
            className={` transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full `}>
            <svg
              className="h-6 w-6 text-gray-500 inline-flex"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => setState({ ...state, month: state.month + 1 })}
            type="button"
            className={` transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full `}>
            <svg
              className="h-6 w-6 text-gray-500 inline-flex"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* WEEK DAYS */}
      <div className="flex w-full mb-2 -mx-1">
        {DAYS.map((day, index) => (
          <div className="w-8 px-1" key={index}>
            <div className="text-gray-800 font-medium text-center text-xs">
              {day}
            </div>
          </div>
        ))}
      </div>
      {/* BLANK DAYS AND ACTUTAL DAYS */}
      <div className="flex flex-wrap -mx-1">
        {state.blankdays.map((blackday, index) => (
          <div className="w-8 text-center p-1 border-transparent text-sm border-gray-200 "></div>
        ))}
        {state.no_of_days.map((day, index) => (
          <div className="w-8 h-6 px-1 mb-1" key={index}>
            <div onClick={() => getDateValue(day + 1)}
              className={`${isToday(day) ? "bg-gray-200 text-black" : ""}
                        ${isSelected(day) ? "bg-primary text-white" : "bg-white"}
                        flex items-center justify-center w-full h-full cursor-pointer text-center text-sm rounded-full leading-loose transition ease-in-out duration-100`}
            >
              {day}
            </div>
          </div>
        ))}
      </div>
    </div >
    // </div>
  );
};

export default DatePicker;