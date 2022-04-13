import { Select as MSelect, SelectProps } from 'react-materialize'

export const Select = ({ children, ...props }: SelectProps) => {
  return (
    <MSelect
      options={{
        dropdownOptions: {
          alignment: 'left',
          autoTrigger: true,
          closeOnClick: true,
          constrainWidth: true,
          coverTrigger: true,
          hover: false,
          inDuration: 150,
          outDuration: 250,
          ...props.options?.dropdownOptions,
        },
        ...props.options,
      }}
      {...props}
    >
      {children}
    </MSelect>
  )
}
