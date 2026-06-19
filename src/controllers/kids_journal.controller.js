import * as kidsJournalService from '../services/kids_journal.service.js';
import { sendSuccess } from '../utils/response.js';
import { ValidationError } from '../utils/errors.js';

export const createKidsJournal = async (req, res, next) => {
    try {
        if (!req.file) throw new ValidationError('Image is required');

        const journal = await kidsJournalService.createKidsJournal({
            title: req.body.title,
            caption: req.body.caption,
            childs: req.body.childs,
            imagePath: req.file.path,
            userId: req.user._id,
        });

        sendSuccess(res, { journal }, 201);
    } catch (err) {
        next(err);
    }
};

export const getAllKidsJournals = async (req, res, next) => {
    try {
        const { data, pagination } = await kidsJournalService.getAllKidsJournals(req.query);
        sendSuccess(res, { journals: data }, 200, pagination);
    } catch (err) {
        next(err);
    }
};

export const getKidsJournalById = async (req, res, next) => {
    try {
        const journal = await kidsJournalService.getKidsJournalById(req.params.id);
        sendSuccess(res, { journal });
    } catch (err) {
        next(err);
    }
};

export const deleteKidsJournal = async (req, res, next) => {
    try {
        await kidsJournalService.deleteKidsJournal(req.params.id);
        sendSuccess(res, null, 204);
    } catch (err) {
        next(err);
    }
};