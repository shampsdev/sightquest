import { api } from "../instances/axios.instance";

export const uploadImageToS3 = async (
  uri: string,
  filename?: string,
  dir: string = "default"
): Promise<{ url: string }> => {
  const name = filename ?? uri.split("/").pop() ?? "photo.jpg";
  const ext = name.split(".").pop()?.toLowerCase();
  const type = ext === "png" ? "image/png" : "image/jpeg";

  const formData = new FormData();
  formData.append("file", {
    uri,
    type,
    name,
  } as any);

  const encodedDir = encodeURIComponent(dir);

  const response = await api.post<{ url: string }>(
    `/api/v1/images/upload/by_file?dir=${encodedDir}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }
  );

  return response.data;
};
