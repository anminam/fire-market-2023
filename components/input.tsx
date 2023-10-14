interface InputProps {
  label: string;
  name: string;
  register: any;
  kind?: 'text' | 'phone' | 'price';
  [key: string]: any;
}

export default function Input({
  label,
  name,
  kind = 'text',
  register,
  type,
  required,
  ...rest
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold" htmlFor={name}>
        {label}
      </label>
      {kind === 'text' ? (
        <div className="rounded-md relative flex items-center shadow-sm">
          <input
            id={name}
            {...register}
            {...rest}
            class="input input-bordered w-full placeholder-neutral-600"
          />
        </div>
      ) : null}
      {kind === 'price' ? (
        <div className="rounded-md relative flex items-center shadow-sm">
          <div className="absolute left-0 pointer-events-none pl-3 flex items-center justify-center">
            <span className="text-gray-500 text-sm">₩</span>
          </div>
          <input
            id={name}
            required={required}
            type={type}
            {...register}
            {...rest}
            className="appearance-none pl-7 input input-bordered w-full placeholder-neutral-600"
          />
          <div className="absolute right-0 pointer-events-none pr-3 flex items-center">
            <span className="text-gray-500">원</span>
          </div>
        </div>
      ) : null}
      {kind === 'phone' ? (
        <div className="flex rounded-md shadow-sm">
          <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
            +82
          </span>
          <input
            id={name}
            required={required}
            type={type}
            {...register}
            {...rest}
            className="appearance-none pl-7 input input-bordered w-full placeholder-neutral-600"
          />
        </div>
      ) : null}
    </div>
  );
}
