import {BlobServiceClient} from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

class AzureStorageClient {
    constructor() {
        if (!AzureStorageClient.instance) {
            this.blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
            this.containerClient = this.blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
            AzureStorageClient.instance = this;
        }

        return AzureStorageClient.instance;
    }

    getBlockBlobClient(fileId) {
        return this.containerClient.getBlockBlobClient(fileId);
    }

    getBlobClient(blobName) {
        return this.containerClient.getBlobClient(blobName);
    }
}

const instance = new AzureStorageClient();
Object.freeze(instance);

export default instance;
