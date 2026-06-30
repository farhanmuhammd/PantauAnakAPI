import { Router } from 'express';
import * as kidsJournalController from '../controllers/kids_journal.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createKidsJournalSchema } from '../validators/kids_journal.validator.js';
import { upload } from '../utils/upload.js';

const router = Router();

router.use(authenticate);

router.post(
    '/kids-journals',
    upload.single('image'),
    validate(createKidsJournalSchema),
    kidsJournalController.createKidsJournal
);

router.get('/kids-journals', kidsJournalController.getAllKidsJournals);
router.get('/kids-journals/:id', kidsJournalController.getKidsJournalById);
router.delete('/kids-journals/:id', kidsJournalController.deleteKidsJournal);

export default router;