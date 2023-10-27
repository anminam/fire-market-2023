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
import { cls } from '@/libs/client/utils';

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
  const { register, handleSubmit, watch, control, reset, setValue } =
    useForm<UploadProductForm>();
  const [apiUploadProduct, { loading, data }] =
    useMutation<UploadProductResult>('/api/products');

  const [loadingImage, setLoadingImage] = useState(false);
  const { user } = useUser();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // 초기화
  useEffect(() => {
    const func = async () => {
      // param id가 있으면 수정모드
      const { productId } = router.query;
      if (productId && user?.id) {
        const res = await fetch(`/api/products/${productId}`);
        const json = await res.json();
        // 본인이 아니면 종료.
        if (json.product.userId !== user?.id) {
          alert('본인의 상품만 수정할 수 있습니다.');
          router.replace(`/products/${productId}`);
          return;
        }

        setValue('name', json.product.name);
        setValue('price', json.product.price);
        setValue('description', json.product.description);
        setValue('place', json.product.place);
        const imgSrc = json.product.image;

        // 로드해서 파일로만들기
        const src = `https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${imgSrc}/public`;
        const res2 = await fetch(src);
        const blob = await res2.blob();
        const file = new File([blob], imgSrc, { type: blob.type });
        setPhotoFiles([file]);

        // 수정 모드셋팅.
        setIsEditMode(true);
      }
    };
    func();
  }, [router.query, user]);

  const onValid = async ({
    name,
    price,
    description,
    place,
    photo,
  }: UploadProductForm) => {
    if (isLoading) return;

    console.log('a');
    // 가격 콤마 제거.
    price = price.replace(/,/g, '');

    if (photoFiles && photoFiles.length > 0) {
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
    } else {
      const obj = {
        name,
        price,
        description,
        place,
      };
      if (router.query.productId) {
        apiUploadProduct({ ...obj, id: router.query.productId });
      } else {
        apiUploadProduct({ obj });
      }
    }
  };

  const photoItem = useWatch({
    control,
    name: 'photo',
  });

  const onDeleteClick = useCallback(
    (file: File) => {
      setPhotoFiles([...photoFiles.filter(_ => _.name !== file.name)]);
    },
    [photoFiles]
  );

  useEffect(() => {
    if (data?.result) {
      router.replace(`/products/${data.product.id}`);
      data.product;
    }
  }, [data, router]);

  const addPhoto = useCallback(
    (file: File) => {
      const findLength = photoFiles.filter(item => {
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

      setPhotoFiles(list => [...list, file]);
    },
    [photoFiles]
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
          <PhotoListContainer
            photoPreviewList={photoFiles}
            onDeleteClick={onDeleteClick}
          />
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
        <Input
          register={register('place', { required: true })}
          name="where-is"
          label="거래 희망 장소"
          placeholder="더에셋 1층"
        />
        <button
          className={cls(
            `btn btn-primary w-full`,
            isLoading ? 'btn-disabled' : ''
          )}
          type="submit"
        >
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
      <input
        {...register('photo')}
        className="hidden"
        type="file"
        accept="image/*"
      />
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
const PhotoItem = ({
  file,
  onDeleteClick,
}: {
  file: File;
  onDeleteClick: (file: File) => void;
}) => {
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
        <img
          alt="photo"
          src={URL.createObjectURL(file)}
          className="object-contain"
        ></img>
      </div>
    </div>
  );
};

export default Upload;
