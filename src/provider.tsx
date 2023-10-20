import { createContext, useState } from 'react'

export interface IStep1 {
  firstname: string,
  middlename: string,
  lastname: string,
  healthcard: string,
  dob: string,
  sex: string,
  issueDate: string,
  expiryDate: string,
  healthCardImage: string,
  signature: string,
  vc: string
}

export interface IStep2 {
  phoneNumber: string,
  email: string,
  address: string,
  apartment?: string,
  city: string,
  province: string,
  postalCode: string,
  country: string
}

export interface ILocation {
  location: String,
}

let defaultValue: {
  personal_details: IStep1,
  address_details: IStep2,
  location_details: ILocation
} = {
  personal_details: {
    firstname: "",
    middlename: "",
    lastname: "",
    healthcard: "",
    dob: "",
    sex: "",
    issueDate: "",
    expiryDate: "",
    healthCardImage: "",
    signature: "",
    vc: ""

  },
  address_details: {
    phoneNumber: "",
    email: "",
    address: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    country: ""
  },
  location_details:{
    location: ""
  }
}

export const Context = createContext({
  value: defaultValue,
  updateStep1: (data: IStep1) => { },
  updateStep2: (data: IStep2) => { },
  updateLocation: (data: ILocation) => { },
  resetValues: () => { }
});


const Provider = ({ children }: { children: JSX.Element }) => {
  const [value, setValue] = useState(defaultValue)

  const updateStep1 = (data: IStep1) => {
    setValue({
      ...value,
      personal_details: data
    })
  }

  const updateStep2 = (data: IStep2) => {
    setValue({
      ...value,
      address_details: data
    })
  }

  const updateLocation = (data: ILocation) => {
    setValue({
      ...value,
      location_details: data
    })
  }

  const resetValues = () => {
    setValue(defaultValue);
  }
  return <Context.Provider value={{ value, updateStep1, updateStep2, updateLocation, resetValues }}  >
    {children}
  </Context.Provider>
}

export default Provider;