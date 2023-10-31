interface ImageResponse {
  id: string; // "4efe545f-48ad-48b1-23ea-79acf1c5ad00"
  filename: string; // "2_안미남맨"
  uploaded: string; // "2023-10-31T14:51:07.490Z"
  requireSignedURLs: boolean; // false
  variants: string[]; // [ "https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/4efe545f-48ad-48b1-23ea-79acf1c5ad00/public", "..."]
}
export const asyncSendImageFile = async (fileList: FileList, name: string): Promise<ImageResponse> => {
  const { data } = await (await fetch(`/api/files`)).json();
  const { uploadURL } = data;

  const form = new FormData();
  form.append('file', fileList[0], name);

  const { result } = await (
    await fetch(uploadURL, {
      method: 'POST',
      body: form,
    })
  ).json();

  return result;
};
