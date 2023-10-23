import type { NextPage } from 'next';
import Button from '@/components/button';
import Input from '@/components/input';
import Layout from '@/components/layout';
import TextArea from '@/components/textarea';
import { useForm, useWatch } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useCallback, useEffect, useState } from 'react';
import { Product } from '@prisma/client';
import { useRouter } from 'next/router';
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

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
  const MAX_PHOTO_COUNT = 3;
  const router = useRouter();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const { register, handleSubmit, watch, control, reset } = useForm<UploadProductForm>();
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

      if (!uploadURL) {
        alert('파일 업로드에 실패했습니다.');
        return;
      }
      const formData = new FormData();
      formData.append('file', photoFiles[0], name);

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

  

  const photoItem = useWatch({
    control,
    name: 'photo'
  });
  
  const onDeleteClick = useCallback((file: File) => {
    setPhotoFiles([...photoFiles.filter(_ => _.name !== file.name)]);
  },[photoFiles]);

  useEffect(() => {
    if (data?.result) {
      router.replace(`/products/${data.product.id}`);
      data.product;
    }
  }, [data, router]);

  
  const addPhoto = useCallback((file:File) => {
    const findLength = photoFiles.filter(item => {
      return item.name === file.name;
    }).length;

    if (findLength > 0) {
      alert('이미등록된 사진입니다.');
      return;
    };

    if (photoFiles.length >= MAX_PHOTO_COUNT) {
      alert('더이상 등록할 수 없습니다.');
      return;
    }

    
    
    setPhotoFiles((list) => [...list, file]);
  },[photoFiles]);

  // 사진 form 등록.
  useEffect(() => {
    if(!photoItem || photoItem.length <= 0) return;
  
    // 사진 등록
    addPhoto(photoItem[0]);
    // input 초기화
    reset({photo:undefined});
  }, [addPhoto, photoFiles, photoItem, reset]);

  return (
    <Layout canGoBack title="내 물건 팔기">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div className='flex space-x-2'>
          <PhotoRegister register={register} />
          <PhotoListContainer photoPreviewList={photoFiles} onDeleteClick={onDeleteClick}/>
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
          type="number"
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

const PhotoRegister =({register}:{register:any}) => {
  return (
    <label className="w-16 h-16 cursor-pointer text-gray-600 hover:border-primary hover:text-primary flex items-center justify-center border-2 border-dashed rounded-md">
      <MdOutlineAddPhotoAlternate size={40} />
      <input
        {...register('photo')}
        className="hidden"
        type="file"
        accept="image/*"
      />
    </label>
  );
}

const PhotoListContainer = ({photoPreviewList, onDeleteClick}:{photoPreviewList:File[], onDeleteClick:(file:File) => void }) => {
  return (
    <div className='flex space-x-2'>
      {photoPreviewList.map((_,i) => (
        <PhotoItem key={i} file={_} onDeleteClick={onDeleteClick}/>
      ))}
    </div>
  )
}
const PhotoItem = ({file, onDeleteClick}: {file: File, onDeleteClick:(file:File) => void}) => {

  const handleDeleteClick = (file: File) => {
    onDeleteClick(file);
  }
  return (
    <div className='relative'>
      <button className='rounded-full w-5 h-5 absolute right-[-6px] top-[-8px] bg-neutral text-xs border-1 border border-black' onClick={() => handleDeleteClick(file)}>X
      {/* <AiOutlineDelete /> */}
      </button>
      <div className="w-16 h-16 rounded-md overflow-hidden">
        <img
          alt="photo"
          src={URL.createObjectURL(file)}
          className="object-contain"
        ></img>
      </div>
    </div>
  )
}

export default Upload;
