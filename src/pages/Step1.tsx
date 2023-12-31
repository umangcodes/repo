import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import ReactSelect from "../components/ReactSelect";
import TextInput from "../components/TextField";
import UploadContainer from "../components/UploadContainer";
import { Context } from "../provider";
import axios from "axios";
export interface Step1Data {
  dob: string,
  expiryDate: string,
  firstname: string,
  healthcard: string,
  issueDate: string,
  lastname: string,
  middlename: string,
  sex: string,
  signature: string,
  healthCardImage: string,
  vc: string
}

const Step1 = () => {
  const [step1Data, setStep1Data] = useState<Step1Data>({
    dob: "",
    expiryDate: "",
    firstname: "",
    healthcard: "",
    issueDate: "",
    lastname: "",
    middlename: "",
    sex: "",
    signature: "",
    healthCardImage: "",
    vc: ""
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
  firstname: string,
  middlename: string,
  lastname: string,
  healthcard: string,
  dob: string,
  sex: string,
  issueDate: string,
  expiryDate: string
}

const Step1Form = ({ step1Data }: { step1Data: Step1Data }) => {
  const { handleSubmit, watch, register, control, formState: { errors }, setValue } = useForm<Step1Form>({
    defaultValues: {
      dob: step1Data.dob,
      expiryDate: step1Data.expiryDate,
      firstname: step1Data.firstname,
      healthcard: step1Data.healthcard,
      issueDate: step1Data.issueDate,
      lastname: step1Data.lastname,
      middlename: step1Data.middlename,
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
    setValue("dob", step1Data.dob)
    setValue("expiryDate", step1Data.expiryDate)
    setValue("firstname", step1Data.firstname)
    setValue("healthcard", step1Data.healthcard)
    setValue("issueDate", step1Data.issueDate)
    setValue("lastname", step1Data.lastname)
    setValue("middlename", step1Data.middlename)
    setValue("sex", step1Data.sex)
    let base64Type = detectMimeType(step1Data.signature);
    setSignature(`data:${base64Type};base64, ${step1Data.signature}`)

    updateStep1(step1Data)
  }, [step1Data]);

  const navigate = useNavigate();
  const { updateStep1 } = useContext(Context)

  const onSubmit = async (data: any) => {
    // console.log(data);
    try{
          console.log("creating new visit")
          const resp2 = await axios.post("https://us-central1-patient-registration-portal.cloudfunctions.net/web/newVisit", {healthcard: step1Data.healthcard, location: "101"})
          if(resp2.data.msg == "visit created"){
            window.localStorage.setItem("token", resp2.data.token)
            console.log("visit created")
            navigate("/registered")
            // TODO: Route to registered page
          }else{
            console.log("error occured.")
          }
      }catch(err){
        console.log("error: " + err)
      }
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
    setValue("healthcard", value);
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex flex-col md:flex-row items-center gap-5 lg:gap-10 my-5">
        <TextInput
          type="text"
          label="First Name"
          register={register}
          name="firstname"
          errors={errors}
          placeholder="First Name"
          required={"This field is required"}
        />
        <TextInput
          type="text"
          label="Middle Name"
          register={register}
          name="middlename"
          errors={errors}
          placeholder="Middle Name"
        />
        <TextInput
          type="text"
          label="Last Name"
          register={register}
          name="lastname"
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
          name="healthcard"
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
          name="dob"
          errors={errors}
          placeholder="DOB in YYYY-MM-DD FORMAT"
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
          placeholder="Card Issue Date YYYY-MM-DD"
          setValue={setValue}
        />
        <DateInput
          label="Expiry Date"
          register={register}
          name="expiryDate"
          errors={errors}
          placeholder="Card Expiry Date YYYY-MM-DD"
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