import { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';

interface LoginForm {
  username: string;
  password: string;
  email: string;
  errors?: string;
}

export default function Forms() {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    setError,
    reset,
    resetField,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'onChange',
  });

  const onValid = (data: LoginForm) => {
    resetField('password');
    // setError('username', { message: '이미 존제하는 에러가 발생했습니다' });
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register('username', {
          required: '이름을 입력해주세요',
          minLength: { value: 5, message: '5글자 이상 입력해주세요' },
        })}
        type="text"
        placeholder="이름"
      />
      {errors.username?.message}
      <input
        {...register('email', {
          required: '이메일을 입력해주세요',

          validate: {
            notGmail: (value) =>
              !value.includes('gmail.com') || 'gmail.com은 사용할 수 없습니다',
          },
        })}
        type="email"
        placeholder="email"
        className={`${
          Boolean(errors.email?.message) ? 'border border-red-500' : ''
        }`}
      />
      {errors.email?.message}
      <input
        {...register('password', { required: '비밀번호를 입력해주세요' })}
        type="password"
        placeholder="password"
      />
      <input type="submit" value="입장하기" />
      <div>{errors.errors?.message}</div>
    </form>
  );
}
