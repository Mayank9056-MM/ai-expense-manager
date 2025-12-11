import axios from "axios";

export const runClineReceiptAgent = async (imageUrl) => {
  const res = await axios.post(process.env.CLINE_RECEIPT_AGENT_URL, {
    image: imageUrl,
  });

  return res.data;
};
