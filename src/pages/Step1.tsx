import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import ReactSelect from "../components/ReactSelect";
import TextInput from "../components/TextField";
import UploadContainer from "../components/UploadContainer";
import { Context } from "../provider";

export interface Step1Data {
  dateOfBirth: string,
  expiryDate: string,
  firstName: string,
  healthCardID: string,
  issueDate: string,
  lastName: string,
  middleName: string,
  sex: string,
  signature: string,
  healthCardImage: string,
}

const Step1 = () => {
  const [step1Data, setStep1Data] = useState<Step1Data>({
    dateOfBirth: "",
    expiryDate: "",
    firstName: "",
    healthCardID: "",
    issueDate: "",
    lastName: "",
    middleName: "",
    sex: "",
    signature: "",
    healthCardImage: "",
  })

  const { value, updateStep1 } = useContext(Context)

  useEffect(() => {
    if (value.personal_details) {
      setStep1Data(value.personal_details);
    }
  }, []);


  const submitStep1 = (data: Step1Data) => {
    console.log(data);
  }

  return (
    <div className="w-full min-h-screen md:py-10 md:px-10 flex">
      <div className="w-full flex flex-col items-start flex-grow bg-background drop-shadow-xl p-5">
        <h1 className="text-xl md:text-2xl font-semibold mb-4">Step 1: Upload your healthcard</h1>
        <p className="text-sm text-black/60">Upload your healthcard to autofill the details or Enter manually.</p>

        <UploadContainer
          setStep1Data={setStep1Data}
          step1Data={step1Data} />

        <div className="w-full flex items-center">
          <Step1Form step1Data={step1Data} />
        </div>
      </div>
    </div>
  )
}


export type Step1Form = {
  firstName: string,
  middleName: string,
  lastName: string,
  healthCardID: string,
  dateOfBirth: string,
  sex: string,
  issueDate: string,
  expiryDate: string
}

const Step1Form = ({ step1Data }: { step1Data: Step1Data }) => {
  const { handleSubmit, watch, register, control, formState: { errors }, setValue } = useForm<Step1Form>({
    defaultValues: {
      dateOfBirth: step1Data.dateOfBirth,
      expiryDate: step1Data.expiryDate,
      firstName: step1Data.firstName,
      healthCardID: step1Data.healthCardID,
      issueDate: step1Data.issueDate,
      lastName: step1Data.lastName,
      middleName: step1Data.middleName,
      sex: step1Data.sex
    }
  });
  const [signature, setSignature] = useState("");

  var signatures: any = {
    JVBERi0: "application/pdf",
    R0lGODdh: "image/gif",
    R0lGODlh: "image/gif",
    iVBORw0KGgo: "image/png",
    "/9j/": "image/jpg"
  };

  function detectMimeType(b64: any) {
    if (b64) {
      for (var s in signatures) {
        if (b64.indexOf(s) === 0) {
          return signatures[s];
        }
      }
    }
  }

  useEffect(() => {
    // console.log(step1Data);
    setValue("dateOfBirth", step1Data.dateOfBirth)
    setValue("expiryDate", step1Data.expiryDate)
    setValue("firstName", step1Data.firstName)
    setValue("healthCardID", step1Data.healthCardID)
    setValue("issueDate", step1Data.issueDate)
    setValue("lastName", step1Data.lastName)
    setValue("middleName", step1Data.middleName)
    setValue("sex", step1Data.sex)
    let base64Type = detectMimeType(step1Data.signature);
    setSignature(`data:${base64Type};base64, ${step1Data.signature}`)

    updateStep1(step1Data)
  }, [step1Data]);

  const navigate = useNavigate();
  const { updateStep1 } = useContext(Context)

  const onSubmit = (data: any) => {
    // console.log(data);
    updateStep1({
      ...data,
      healthCardImage: step1Data.healthCardImage,
      signature: step1Data.signature
    })
    navigate('/fill-address');
  }

  const onInputChange = (e: any) => {
    var value = e.target.value;
    let key = e.key === 'Backspace';
    if (key) {
      return;
    }
    if ((value.length === 4 || value.length === 8 || value.length === 11)) {
      value = value + "-";
    }
    setValue("healthCardID", value);
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex flex-col md:flex-row items-center gap-5 lg:gap-10 my-5">
        <TextInput
          type="text"
          label="First Name"
          register={register}
          name="firstName"
          errors={errors}
          placeholder="First Name"
          required={"This field is required"}
        />
        <TextInput
          type="text"
          label="Middle Name"
          register={register}
          name="middleName"
          errors={errors}
          placeholder="Middle Name"
        />
        <TextInput
          type="text"
          label="Last Name"
          register={register}
          name="lastName"
          errors={errors}
          placeholder="Last Name"
          required={"This field is required"}
        />
      </div>
      <div className="w-full my-5">
        <TextInput
          type="text"
          label="Health Card ID"
          register={register}
          name="healthCardID"
          errors={errors}
          onChange={onInputChange}
          placeholder="XXXX - XXX - XXX - XX"
          required={"This field is required"}
          maxLength={{ value: 15, "message": "Invalid Health Card Id" }}
          minLength={{ value: 15, "message": "Invalid Health Card Id" }}
        />
      </div>
      <div className="w-full flex flex-col md:flex-row items-center gap-5 lg:gap-10 my-5">
        <DateInput
          label="Date of Birth"
          register={register}
          name="dateOfBirth"
          errors={errors}
          placeholder="YYYY-MM-DD"
          setValue={setValue}
        />

        <Controller
          control={control}
          // defaultValue={options.map(c => c.value)}
          rules={{ required: { value: true, message: "This field is required" } }}
          name="sex"
          render={({ field: { onChange, value, ref, } }) => (
            <div className="w-full flex flex-col">
              <p className="hidden md:block text-sm text-black font-medium mb-1">Sex</p>
              <ReactSelect
                inputRef={ref}
                options={[
                  { label: "Male", value: "M" },
                  { label: "Female", value: "F" },
                  { label: "Prefer not to say", value: "Prefer not to say" }
                ]}
                placeholder="Sex"
                selectedValue={value}
                onChange={(val: any) => onChange(val.value)}
              />
              {errors["sex"] && <p className="text-xs font-medium text-red-400">{errors["sex"].message}</p>}
            </div>
          )}
        />

      </div>
      <div className="w-full flex flex-col md:flex-row items-center gap-5 lg:gap-10 my-5">
        <DateInput
          label="Issued Date"
          register={register}
          name="issueDate"
          errors={errors}
          placeholder="YYYY-MM-DD"
          setValue={setValue}
        />
        <DateInput
          label="Expiry Date"
          register={register}
          name="expiryDate"
          errors={errors}
          placeholder="YYYY-MM-DD"
          setValue={setValue}
        />
      </div>

      <div className="w-full flex items-end my-5">
        {signature.length > 50 &&
          <div className="w-full flex flex-col">
            <p className="hidden md:block text-sm text-black font-medium mb-1">Signature</p>
            <div className=" max-w-[164px] h-16 p-2 border-dotted border-2 border-black">
              <img src={signature} alt="signature" className="w-full h-full object-contain bg-gray-400" />
            </div>
          </div>
        }

        <div className="ml-auto min-w-[128px] max-w-[164px]">
          <Button text="Next" disabled={false} />
        </div>
      </div>
    </form >
  )
}

interface Props {
  register: any,
  options: any,
  name: any
}

export function Select({ register, options, name, ...rest }: Props) {
  return (
    <select {...register(name)} {...rest}>
      {options.map((value: any) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}
export default Step1;