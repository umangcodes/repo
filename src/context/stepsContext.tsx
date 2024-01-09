import React, { createContext, useState } from 'react'

export interface IStep1 {
  firstname: string,
  middlename: string,
  lastname: string,
  healthcard: string,
  vc: string,
  sex: string,
  dob: string,
  issueDate: string,
  expiryDate: string
}

export interface IStep2 {
    dob: string,
    issueDate: string,
    expiryDate: string
}

export interface IStep3 {
  address: string,
  apartment?: string,
  city: string,
  province: string,
  postalCode: string,
  country: string
}

export interface IStep4 {
  phone: string,
  email: string,
}

export interface ILocation {
  location: String,
}

export interface IPagesConfig {
  step1 : Boolean,
  step2 : Boolean,
  step3 : Boolean,
  step4 : Boolean,
}

let defaultValue: {
  step1: IStep1,
  // step2: IStep2,
  step3: IStep3,
  step4: IStep4,
  location_details: ILocation,
  pages: IPagesConfig
} = {
  step1: {
    firstname: "",
    middlename: "",
    lastname: "",
    healthcard: "",
    vc: "",
    sex: "",
    dob: "",
    issueDate: "",
    expiryDate: ""
  },

  step3: {
    address: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    country: ""
  },

  step4: {
    phone: "",
    email: "",
  },
  location_details:{
    location: ""
  },
  pages:{
    step1: false,
    step2: false,
    step3: false,
    step4: false
  }
}

export const StepContext = createContext({
  newContextValue: defaultValue,
  updateNewStep1: (data: IStep1) => { },
  updateNewStep3: (data: IStep3) => { },
  updateNewStep4: (data: IStep4) => { },

  updateNewLocation: (data: ILocation) => { },
  updatePages: (data: IPagesConfig) => { },

  resetValues: () => { }
});


const StepsProvider = ({ children }: { children: JSX.Element }) => {
  const [newContextValue, setNewContextValue] = useState(defaultValue)

  const updateNewStep1 = (data: IStep1) => {
    console.log("step updating")
    console.log(data)
    setNewContextValue({
      ...newContextValue,
      step1: {...newContextValue.step1, ...data}
    })
  }

  // const updateNewStep2 = (data: IStep2) => {
  //   console.log("step 2 updating")
  //   setNewContextValue({
  //     ...newContextValue,
  //     step2: data
  //   })
  // }

  const updateNewStep3 = (data: IStep3) => {
    setNewContextValue({
      ...newContextValue,
      step3: {...newContextValue.step3, ...data}
    })
  }
  const updateNewStep4 = (data: IStep4) => {
    setNewContextValue({
      ...newContextValue,
      step4: {...newContextValue.step4, ...data}
    })
  }

  const updateNewLocation = (data: ILocation) => {
    setNewContextValue({
      ...newContextValue,
      location_details: data
    })
  }

  const updatePages = (data: IPagesConfig) => {
    setNewContextValue({
      ...newContextValue,
      pages: {...newContextValue.pages, ...data}
    })
  }

  const resetValues = () => {
    setNewContextValue(defaultValue);
  }
  return <StepContext.Provider value={{ newContextValue, updateNewStep1, 
  // updateNewStep2, 
  updateNewStep3, updateNewStep4, updateNewLocation, updatePages, resetValues }}  >
    {children}
  </StepContext.Provider>
}

export default StepsProvider;