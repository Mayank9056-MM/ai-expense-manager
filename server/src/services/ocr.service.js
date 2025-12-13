import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export async function extractTextFromImage(imagePath) {
  const [result] = await client.textDetection(imagePath);

  const text = result.fullTextAnnotation?.text;

  if (!text) {
    throw new Error("No text detected in image");
  }

  return text;
}
