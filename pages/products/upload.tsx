import type { NextPage } from 'next';
import Button from '@/components/button';
import Input from '@/components/input';
import Layout from '@/components/layout';
import TextArea from '@/components/textarea';
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect, useState } from 'react';
import { Product } from '@prisma/client';
import { useRouter } from 'next/router';

interface UploadProductForm {
  name: string;
  price: string;
  description: string;
  place: string;
  photo: FileList;
}

interface UploadProductResult {
  result: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [apiUploadProduct, { loading, data }] =
    useMutation<UploadProductResult>('/api/products');

  const onValid = async ({
    name,
    price,
    description,
    place,
    photo,
  }: UploadProductForm) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const {
        data: { uploadURL },
      } = await (await fetch('/api/files')).json();
      const formData = new FormData();
      formData.append('file', photo[0], name);

      const res = await (
        await fetch(uploadURL, {
          method: 'POST',
          body: formData,
        })
      ).json();
      const photoId = res.result.id;

      apiUploadProduct({ name, price, description, place, photoId });
    } else {
      apiUploadProduct({ name, price, description, place });
    }
  };

  useEffect(() => {
    if (data?.result) {
      router.push(`/products/${data.product.id}`);
      data.product;
    }
  }, [data, router]);

  const photo = watch('photo');
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);

  return (
    <Layout canGoBack title="내 물건 팔기">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {photoPreview ? (
            <img
              src={photoPreview}
              className="w-full object-contain h-48 rounded-md"
            ></img>
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register('photo')}
                className="hidden"
                type="file"
                accept="image/*"
              />
            </label>
          )}
        </div>
        <Input
          register={register('name', { required: true })}
          label="제목"
          name="name"
          type="text"
          placeholder="제목"
        />
        <Input
          register={register('price', { required: true })}
          label="가격"
          placeholder="가격을 입력해주세요."
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register('description', { required: true })}
          name="description"
          label="자세한 설명"
          placeholder="이쁜말 고은말"
        />
        <TextArea
          register={register('place', { required: true })}
          name="where-is"
          label="거래 희망 장소"
          placeholder="더에셋 1층"
        />
        <Button text={loading ? '기다리는 중...' : '작성완료'} />
      </form>
    </Layout>
  );
};

export default Upload;
