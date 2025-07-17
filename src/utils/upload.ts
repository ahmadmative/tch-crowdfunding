import axios from "axios";


interface UploadResponse {
  data: {
    url: string;
  };
}

const upload = async (file: any) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr");

  try {
    const res = await axios.post("https://api.cloudinary.com/v1_1/dvbnpdo51/upload", data);

    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};

export default upload;







export const uploadMedia = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  if (!file) throw new Error("No file provided");

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dtku1tzlh/video/upload", 
      data,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            // @ts-ignore
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );
    return res.data;  // Assuming `res.data` contains the URL
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw new Error("Failed to upload to Cloudinary");
  }
};


