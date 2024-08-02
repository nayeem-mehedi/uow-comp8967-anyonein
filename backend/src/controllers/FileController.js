import { AppDataSource } from '../config/db.js';
import {v7 as uuidv7}  from "uuid";
import {File} from '../models/File.js';
import {User} from '../models/User.js';
import azureStorageClient from '../config/azureStorageClient.js'
import { checkAuthHeader } from '../helper/authHelper.js'
import {getImageURL} from "../helper/fileHelper.js";

const fileRepository = AppDataSource.getRepository(File);
const userRepository = AppDataSource.getRepository(User);
//
// export const initializeFileUpload =  async (req, res) => {
//     try {
//         // Check and validate Authorization token
//         let userDataRedis;
//         try {
//             userDataRedis = await checkAuthHeader(req);
//             if (!userDataRedis) {
//                 return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
//             }
//         } catch (error) {
//             console.log(error);
//             return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
//         }
//
//         let user;
//
//         try {
//             user = await userRepository.findOneBy({ id: userDataRedis.userId });
//         } catch (error) {
//             return res.status(500).json({ message: 'Error finding user', error: error.message });
//         }
//
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//
//         const fileId = uuidv7();
//
//         // Create a new file record with the generated ID
//         const newFile = fileRepository.create({id: fileId, owner: user});
//         await fileRepository.save(newFile);
//
//         res.status(201).json({file_id: fileId});
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };

export const partFileUpload =  async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if (!userDataRedis) {
                return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }

        let user;

        try {
            user = await userRepository.findOneBy({ id: userDataRedis.userId });
        } catch (error) {
            return res.status(500).json({ message: 'Error finding user', error: error.message });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fileId = uuidv7();


        // const fileId = req.params.id;
        // const userId = userDataRedis.userId;
        const file_name = req.body.file_name;
        const originalFileName = req.file.originalname;
        const filePart = req.file.buffer;
        const fileMimeType = req.file.mimetype;

        console.log(req.file)
        console.log(file_name)
        console.log(originalFileName)
        console.log(fileId)
        console.log(fileMimeType)

        const fileIdWithExtension = originalFileName.replace(file_name, fileId);
        console.log(fileIdWithExtension)

        // Create a new file record with the generated ID
        const newFile = fileRepository.create({id: fileId, objectId: fileIdWithExtension, owner: user});
        await fileRepository.save(newFile);

        // // file entry check
        // let file = await fileRepository.findOne({where: { id: fileId }, relations: ['owner']} );
        // if (!file) {
        //     return res.status(404).json({ message: 'File not found' });
        // }

        // // check owner
        // let user;
        //
        // try {
        //     user = await userRepository.findOneBy({ id: userId });
        // } catch (error) {
        //     return res.status(500).json({ message: 'Error finding user', error: error.message });
        // }

        // if(user.id !== file.owner.id) {
        //     return res.status(401).json({message: 'User not authorized'});
        // }
        //

        const blockBlobClient = azureStorageClient.getBlockBlobClient(fileIdWithExtension);
        await blockBlobClient.upload(filePart, filePart.length, {blobHTTPHeaders: {blobContentType: fileMimeType}});

        res.status(200).json({ message: 'File part uploaded successfully', link: getImageURL(fileIdWithExtension) });
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
