import type { NextPage } from 'next';
import Input from '@/components/input';
import Layout from '@/components/layout';
import TextArea from '@/components/textarea';
import { useForm, useWatch } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useCallback, useEffect, useState } from 'react';
import { Product } from '@prisma/client';
import { useRouter } from 'next/router';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import useUser from '@/libs/client/useUser';
import { asyncGetFileByImage, cls } from '@/libs/client/utils';
import useSWR from 'swr';

interface UploadProductForm {
  name: string;
  price: string | number; // 콤마찍히면 문자로 넘어옴
  description: string;
  place: string;
  photo: FileList;
}

interface UploadProductResult {
  result: boolean;
  data: Product;
}

interface ProductDataResponse {
  result: boolean;
  data: Product;
}

const Upload: NextPage = () => {
  const MAX_PHOTO_COUNT = 3;
  const router = useRouter();
  const { user } = useUser();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const { register, handleSubmit, watch, control, reset, setValue } = useForm<UploadProductForm>();

  const [apiUploadProduct, { loading, data }] = useMutation<UploadProductResult>('/api/products');
  const { data: productData } = useSWR<ProductDataResponse>(
    router.query.productId ? `/api/products/${router.query.productId}` : null,
  );

  const [loadingImage, setLoadingImage] = useState(false);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // 초기화
  useEffect(() => {
    // 수정모드일때 초기화.
    const func = async () => {
      // param id가 있으면 수정모드
      if (productData?.data?.userId && user?.id) {
        // 본인이 아니면 종료.
        if (productData?.data?.userId !== user?.id) {
          alert('본인의 상품만 수정할 수 있습니다.');
          const productId = productData?.data?.id;
          router.replace(`/products/${productId}`);
          return;
        }

        setValue('name', productData.data.name);
        setValue('price', productData.data.price);
        setValue('description', productData.data.description);
        setValue('place', productData.data.place);
        const imgSrc = productData.data.image;

        // 로드해서 파일로만들기
        const file = await asyncGetFileByImage(imgSrc);
        setPhotoFiles([file]);

        // 수정 모드셋팅.
        setIsEditMode(true);
      }
    };
    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, user]);

  const onValid = async ({ name, price, description, place, photo }: UploadProductForm) => {
    if (isLoading) return;

    // 가격 콤마 제거.
    price = price.toString().replace(/,/g, '');

    // 이미지 없으면 종료.
    if (photoFiles.length <= 0) {
      alert('사진을 등록해주세요.');
      return;
    }

    try {
      setLoadingImage(true);
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
      const obj = {
        name,
        price,
        description,
        place,
        photoId,
      };
      if (router.query.productId) {
        apiUploadProduct({ ...obj, id: router.query.productId });
      } else {
        apiUploadProduct(obj);
      }
    } catch (e) {
    } finally {
      setLoadingImage(false);
    }
  };

  const photoItem = useWatch({
    control,
    name: 'photo',
  });

  const onDeleteClick = useCallback(
    (file: File) => {
      setPhotoFiles([...photoFiles.filter((_) => _.name !== file.name)]);
    },
    [photoFiles],
  );

  useEffect(() => {
    if (data?.result) {
      router.replace(`/products/${data.data.id}`);
    }
  }, [data, router]);

  const addPhoto = useCallback(
    (file: File) => {
      const findLength = photoFiles.filter((item) => {
        return item.name === file.name;
      }).length;

      if (findLength > 0) {
        alert('이미등록된 사진입니다.');
        return;
      }

      if (photoFiles.length >= MAX_PHOTO_COUNT) {
        alert('더이상 등록할 수 없습니다.');
        return;
      }

      setPhotoFiles((list) => [...list, file]);
    },
    [photoFiles],
  );

  // 사진 form 등록.
  useEffect(() => {
    if (!photoItem || photoItem.length <= 0) return;

    // 사진 등록
    addPhoto(photoItem[0]);
    // input 초기화
    reset({ photo: undefined });
  }, [addPhoto, photoFiles, photoItem, reset]);

  // ! 지저분하다....
  const isLoading = loading || loadingImage || data?.result === true;

  return (
    <Layout canGoBack title="내 물건 팔기">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex space-x-2">
          <PhotoRegister register={register} />
          <PhotoListContainer photoPreviewList={photoFiles} onDeleteClick={onDeleteClick} />
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
          placeholder="이쁜말 고운말"
        />
        <Input
          register={register('place', { required: true })}
          name="where-is"
          label="거래 희망 장소"
          placeholder="더에셋 1층"
        />
        <button className={cls(`btn btn-primary w-full`, isLoading ? 'btn-disabled' : '')} type="submit">
          {isLoading ? '업로드중...' : '작성완료'}
        </button>
      </form>
    </Layout>
  );
};

const PhotoRegister = ({ register }: { register: any }) => {
  return (
    <label className="w-16 h-16 cursor-pointer text-gray-600 hover:border-primary hover:text-primary flex items-center justify-center border-2 border-dashed rounded-md">
      <MdOutlineAddPhotoAlternate size={40} />
      <input {...register('photo')} className="hidden" type="file" accept="image/*" />
    </label>
  );
};

const PhotoListContainer = ({
  photoPreviewList,
  onDeleteClick,
}: {
  photoPreviewList: File[];
  onDeleteClick: (file: File) => void;
}) => {
  return (
    <div className="flex space-x-2">
      {photoPreviewList.map((_, i) => (
        <PhotoItem key={i} file={_} onDeleteClick={onDeleteClick} />
      ))}
    </div>
  );
};
const PhotoItem = ({ file, onDeleteClick }: { file: File; onDeleteClick: (file: File) => void }) => {
  const handleDeleteClick = (file: File) => {
    onDeleteClick(file);
  };
  return (
    <div className="relative">
      <button
        className="rounded-full w-5 h-5 absolute right-[-6px] top-[-8px] bg-neutral text-xs border-1 border border-black"
        onClick={() => handleDeleteClick(file)}
      >
        X{/* <AiOutlineDelete /> */}
      </button>
      <div className="w-16 h-16 rounded-md overflow-hidden">
        <img alt="photo" src={URL.createObjectURL(file)} className="object-contain"></img>
      </div>
    </div>
  );
};

export default Upload;
