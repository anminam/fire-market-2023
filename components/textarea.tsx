import { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps {
  label?: string;
  name?: string;
  register: UseFormRegisterReturn;
  [key: string]: any;
}

export default function TextArea({
  label,
  name,
  register,
  ...rest
}: TextAreaProps) {
  return (
    <div>
      {label ? (
        <label className="text-sm opacity-50" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <textarea
        id={name}
        {...register}
        className="py-1 input input-bordered w-full placeholder-neutral-600"
        rows={4}
        {...rest}
      />
    </div>
  );
}
