import type { NextPage } from 'next';
import Button from '@/components/button';
import Input from '@/components/input';
import Layout from '@/components/layout';

import useUser from '@/libs/client/useUser';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import FormErrorMessage from '@/components/FormErrorMessage';
import useMutation from '@/libs/client/useMutation';

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  result: boolean;
  error: string;
}
const EditProfile: NextPage = () => {
  const { user } = useUser();

  const [setProfile, { data, loading }] =
    useMutation<EditProfileResponse>('/api/users/my');

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>();

  useEffect(() => {
    if (user?.email) setValue('email', user?.email);
    if (user?.phone) setValue('phone', user?.phone);
    if (user?.name) setValue('name', user?.name);
  }, [user, setValue]);

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;

    if (email === '' && phone === '' && name === '') {
      return setError('formErrors', {
        message: '이메일 또는 전화번호를 입력해주세요.',
      });
    }

    if (avatar && avatar.length > 0) {
      const { data } = await (await fetch(`/api/files`)).json();
      const { id, uploadURL } = data;

      const form = new FormData();
      form.append('file', avatar[0], `${user?.id}_${user?.name}`);

      const { result } = await (
        await fetch(uploadURL, {
          method: 'POST',
          body: form,
        })
      ).json();

      setProfile({
        email,
        phone,
        name,
        avatarId: result.id,
      });
    } else {
      return;
      setProfile({
        email,
        phone,
        name,
      });
    }
  };

  const avatar = watch('avatar');

  const [avatarPreview, setAvatarPreview] = useState('');
  useEffect(() => {
    if (avatar && avatar.length) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  useEffect(() => {
    if (data && !data.result) {
      setError('formErrors', {
        message: data?.error || '알 수 없는 오류입니다.',
      });
    }
  }, [data, setError]);
  return (
    <Layout canGoBack title="내 정보 변경하기">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-gray-700"
          >
            변경
            <input
              {...register('avatar')}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register('name')}
          required={false}
          label="이름"
          name="text"
          type="text"
        />
        <Input
          register={register('email')}
          required={false}
          label="이메일"
          name="email"
          type="email"
        />
        <Input
          register={register('phone')}
          required={false}
          label="전화번호"
          name="phone"
          type="number"
          kind="phone"
        />
        <FormErrorMessage message={errors.formErrors?.message || ''} />
        <Button text={loading ? '변경 중 입니다...' : '변경하기'} />
      </form>
    </Layout>
  );
};

export default EditProfile;
