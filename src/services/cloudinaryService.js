import axios from 'axios';

/**
 * Uploads a file directly to Cloudinary using a signed request.
 * 
 * @param {File} file - The file to upload.
 * @param {Object} signatureData - The signature data from the backend.
 * @param {string} signatureData.signature - The signature.
 * @param {number} signatureData.timestamp - The timestamp.
 * @param {string} signatureData.apiKey - The Cloudinary API key.
 * @param {string} signatureData.cloudName - The Cloudinary cloud name.
 * @param {string} signatureData.folder - The folder to upload to.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export const uploadToCloudinary = async (file, signatureData) => {
  const { signature, timestamp, apiKey, cloudName, folder } = signatureData;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
