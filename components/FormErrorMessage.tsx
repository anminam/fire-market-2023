import React from 'react';

interface Props {
  message: string;
}
const FormErrorMessage = ({ message: text }: Props) => {
  return (
    <div className={`!mt-2 text-xs font-semibold text-red-500`}>{text}</div>
  );
};

export default FormErrorMessage;
