import {Router} from 'express';
import multer from 'multer';
import {
    // initializeFileUpload,
    partFileUpload,
} from '../controllers/FileController.js';

const router = Router();
const upload = multer({limits: {fileSize: 5000000}});

// router.post('/init', initializeFileUpload);
router.post('/upload', upload.single('uploaded_file'), partFileUpload);
// router.delete('/remove/:id', createAnnouncementProject);
// signed url?
// router.get('/:id', listAnnouncementsByProject);

export default router;