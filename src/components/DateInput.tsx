import { useState } from "react";
import { useForm } from "react-hook-form";
import { Step1Form } from "../pages/Step1";
import DatePicker from "./DatePicker";
import Portal from "./Portal";
import TextInput from "./TextField";

interface DateInputProps {
  label: string,
  register: any,
  name: string,
  errors: any,
  placeholder: string,
  setValue: any
}


const DateInput: React.FC<DateInputProps> = ({ errors, label, name, placeholder, register, setValue }) => {
  const [showDatepicker, setShowDatePicker] = useState(false);
  // const { setValue } = useForm<Step1Form>();

  const onChange = (date: any) => {
    setValue(name, date);
    setShowDatePicker(false);
  }

  const onInputChange = (e: any) => {
    var value = e.target.value;
    let key = e.key === 'Backspace';
    if (key) {
      return;
    }
    if ((value.length === 4 || value.length === 7)) {
      value = value + "-";
    }
    setValue(name, value);
  }



  return (
    <div className="w-full relative">

      <TextInput
        type="text"
        label={label}
        register={register}
        name={name}
        errors={errors}
        placeholder={placeholder}
        onChange={onInputChange}
        maxLength={{ value: 10, "message": "Invalid date" }}
        minLength={{ value: 10, "message": "Invalid date" }}
        required={"This field is required"}
        pattern={{
          value: /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/g,
          message: "Invalid date"
        }}
      />
      <div className="absolute right-2 top-4 md:top-8" onClick={() => setShowDatePicker(!showDatepicker)}>
        <svg
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>


      {showDatepicker &&
        <Portal>
          <div className="relative min-h-screen flex items-center justify-center">
            <div className="w-full h-full absolute bg-black/40 cursor-pointer" onClick={() => setShowDatePicker(false)}></div>
            <DatePicker
              onChange={onChange}
            />
          </div>
        </Portal>
      }


    </div >
  )
}

export default DateInput;