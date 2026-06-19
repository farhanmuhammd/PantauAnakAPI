import fs from 'fs';
import KidsJournal from '../models/kids_journal.model.js';
import { NotFoundError } from '../utils/errors.js';
import { getPagination, buildPaginatedResponse } from '../utils/pagination.js';

export const createKidsJournal = async ({ title, caption, childs, imagePath, userId }) => {
    return KidsJournal.create({
        title,
        caption,
        childs,
        image: imagePath,
        createdBy: userId,
    });
};

export const getAllKidsJournals = async (query) => {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.childId) filter.childs = query.childId;

    const [journals, total] = await Promise.all([
        KidsJournal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        KidsJournal.countDocuments(filter),
    ]);

    return buildPaginatedResponse(journals, total, page, limit);
};

export const getKidsJournalById = async (id) => {
    const journal = await KidsJournal.findById(id);
    if (!journal) throw new NotFoundError('Kids journal not found');
    return journal;
};

export const deleteKidsJournal = async (id) => {
    const journal = await KidsJournal.findByIdAndDelete(id);
    if (!journal) throw new NotFoundError('Kids journal not found');

    fs.unlink(journal.image, (err) => {
        if (err) console.error('Failed to delete image file:', err.message);
    });
};