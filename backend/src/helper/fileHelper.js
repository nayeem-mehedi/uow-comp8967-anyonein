import dotenv from 'dotenv';

dotenv.config();

const imageStorageBucketURL = process.env.AZURE_STORAGE_BUCKET_URL;
const imageContainerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

export const getImageURL = (imageId) => {
    return `${imageStorageBucketURL}/${imageContainerName}/${imageId}`;
}