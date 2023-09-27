import React from 'react';
import { createContext, useState } from 'react'

export interface IStep1 {
  firstName: string,
  middleName: string,
  lastName: string,
  healthCardID: string,
  dateOfBirth: string,
  sex: string,
  issueDate: string,
  expiryDate: string,
  healthCardImage: string,
  signature: string
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

let defaultValue: {
  personal_details: IStep1,
  address_details: IStep2
} = {
  personal_details: {
    firstName: "",
    middleName: "",
    lastName: "",
    healthCardID: "",
    dateOfBirth: "",
    sex: "",
    issueDate: "",
    expiryDate: "",
    healthCardImage: "",
    signature: ""

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
  }
}

export const Context = createContext({
  value: defaultValue,
  updateStep1: (data: IStep1) => { },
  updateStep2: (data: IStep2) => { },
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

  const resetValues = () => {
    setValue(defaultValue);
  }
  return <Context.Provider value={{ value, updateStep1, updateStep2, resetValues }}  >
    {children}
  </Context.Provider>
}

export default Provider;