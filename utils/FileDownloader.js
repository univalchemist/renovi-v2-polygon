import axios from "axios";
import fileDownload from "js-file-download"

export const handleDownload = async (url, filename) => {
  try {
    const res = await axios.get(url, { responseType: "blob" })
    fileDownload(res.data, filename)
  } catch (error) {
    return false;
  }
}