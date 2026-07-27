import { Router } from 'express';
import { CategoryRepository } from '../db/repositories/CategoryRepository.js';
import { CreateCategorySchema, UpdateCategorySchema } from '../schemas/category.schema.js';
import { validate } from '../middlewares/validate.js';

export function createCategoriesRouter(categoryRepository: CategoryRepository) {
  const router = Router();

  // GET all categories for the authenticated user
  router.get('/', async (req, res) => {
    // Requires an authenticated user from a previously placed middleware.
    // We assume req.user is set by better-auth or similar.
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const categories = await categoryRepository.findAll(String(userId));
    res.json(categories);
  });

  // POST create category
  router.post('/', validate({ body: CreateCategorySchema }), async (req, res) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, color } = req.body;
    const category = await categoryRepository.create(String(userId), name, color);
    res.status(201).json(category);
  });

  // PATCH update category
  router.patch('/:id', validate({ body: UpdateCategorySchema }), async (req, res) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const category = await categoryRepository.update(id, String(userId), req.body);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  });

  // DELETE category
  router.delete('/:id', async (req, res) => {
    const userId = (req as any).user?.id || req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const success = await categoryRepository.delete(id, String(userId));
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  });

  return router;
}
