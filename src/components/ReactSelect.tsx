import React, { useState, useEffect } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

interface Props {
  options: { label: string, value: string }[]
  selectedValue?: any,
  setSelectedValue?: any,
  defaultValue?: string,
  placeholder: string,
  onChange?: any,
  inputRef?: any
}

const ReactSelect: React.FC<Props> = ({ options, setSelectedValue, selectedValue, defaultValue = "", placeholder, inputRef, onChange }) => {
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: '1px solid #8A8A8A',
      color: state.isSelected ? 'black' : '#7D9BC0',
      padding: 8,
      fontSize: '14px'
    }),
    container: (provided: any, state: any) => ({
      ...provided,
      border: '1px solid #8A8A8A',
      borderRadius: '2px',
      padding: 4,
      paddingLeft: 8
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      border: 'none',
      padding: 0,
      outline: 'none',
      boxShadow: '0 0 0 1px #fff'
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      border: 'none',
      padding: 0,
      fontSize: '14px',
      color: 'black'
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      border: 'none',
      padding: 0,
      fontSize: '14px',
      color: 'black'
    }),
    indicatorsContainer: (provided: any, state: any) => ({
      ...provided,
      border: 'none',
      padding: 0,
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      border: 'none',
      padding: 8,
      zIndex: 1000
    }),
    placeholder: (provided: any, state: any) => ({
      ...provided,
      color: "#00000050"
    })
  }
  const [value, setValue] = useState<any>(null);
  const selectOptions = options.map((option) => ({ label: option.label, value: option.value }))

  // const onChange = (newValue: any) => {
  //   setSelectedValue(newValue.value)
  //   setValue({ label: newValue.value, value: newValue.value });
  // }

  useEffect(() => {
    if (selectedValue) {
      const item = options.find((item) => item.value === selectedValue);
      if (item) {
        setValue({ label: item.label, value: item.value });
      }
    }
  }, [selectedValue]);

  const loadOptions = async (search: any, prevOptions: any) => {
    let filteredOptions;
    if (!search) {
      filteredOptions = selectOptions;
    } else {
      const searchLower = search.toLowerCase();

      filteredOptions = selectOptions.filter(({ label }) =>
        label.toLowerCase().includes(searchLower)
      );
    }

    const hasMore = filteredOptions.length > prevOptions.length + 10;
    const slicedOptions = filteredOptions.slice(
      prevOptions.length,
      prevOptions.length + 10
    );

    return {
      options: slicedOptions,
      hasMore
    };
  };


  const Option = (props: any) => {
    const {
      children,
      className,
      cx,
      getStyles,
      isDisabled,
      isFocused,
      isSelected,
      innerRef,
      innerProps,
    } = props;
    return (
      <div ref={innerRef} {...innerProps} className={`${isSelected ? "bg-primary text-white" : "bg-none"}`}>
        <p className="w-full text-sm py-2 px-2 border-b hover:bg-gray-100 cursor-pointer">
          {children}
        </p>
      </div>
    )
  }

  return (
    <div className='w-full z-50' style={{}}>
      <AsyncPaginate
        placeholder={placeholder}
        styles={customStyles}
        value={value}
        controlShouldRenderValue={true}
        components={{ Option }}
        loadOptions={loadOptions}
        onChange={onChange}
        selectRef={inputRef}

      />
    </div>
  )

}




export default ReactSelect;