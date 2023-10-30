import type { NextPage } from 'next';
import Input from '@/components/input';
import Layout from '@/components/layout';

import useUser from '@/libs/client/useUser';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import FormErrorMessage from '@/components/FormErrorMessage';
import useMutation from '@/libs/client/useMutation';
import Image from 'next/image';
import { getImageSrc } from '@/libs/client/utils';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const [runEdit, { data, loading }] = useMutation<EditProfileResponse>('/api/users/edit');

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
    if (user?.name) setValue('name', user?.name);
  }, [user, setValue]);

  const onValid = async ({ email, name, avatar }: EditProfileForm) => {
    if (loading) return;

    if (email === '' && name === '') {
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

      runEdit({
        email,
        name,
        avatarId: result.id,
      });
    } else {
      runEdit({
        email,
        name,
      });
    }
  };

  const avatar = watch('avatar');

  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    user?.avatar && setAvatarPreview(getImageSrc(user.avatar, true));
  }, [user?.avatar]);

  useEffect(() => {
    if (avatar && avatar.length) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  useEffect(() => {
    if (!data) return;

    if (data && !data.result) {
      setError('formErrors', {
        message: data?.error || '알 수 없는 오류입니다.',
      });
    }
    if (data.result) {
      alert('변경되었습니다.');
      router.back();
    }
  }, [data, router, setError]);

  return (
    <Layout canGoBack title="내 정보 변경하기">
      <form onSubmit={handleSubmit(onValid)} className="py-4 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500 relative overflow-hidden">
            {avatarPreview && (
              <Image
                alt={`의 프로필 사진`}
                src={avatarPreview}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={true}
              />
            )}
          </div>
          <label htmlFor="picture" className="btn btn-sm btn-neutral">
            <div>사진변경</div>
            <input {...register('avatar')} id="picture" type="file" className="hidden" accept="image/*" />
          </label>
        </div>
        <Input register={register('name')} required={false} label="이름" name="text" type="text" />
        <Input register={register('email')} required={false} label="이메일" name="email" type="email" />
        {/* <Input
          register={register('phone')}
          required={false}
          label="전화번호"
          name="phone"
          type="number"
          kind="phone"
        /> */}
        <FormErrorMessage message={errors.formErrors?.message || ''} />
        <button className="btn btn-primary w-full">{loading ? '변경 중 입니다...' : '변경하기'} </button>
      </form>
    </Layout>
  );
};

export default EditProfile;
