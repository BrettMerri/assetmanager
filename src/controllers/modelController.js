import { Router } from 'express';

import { NotFoundError } from '../errorClasses';
import { validate, nameValidationRules, idValidationRules } from '../validator';
import { asyncMiddleware } from '../middleware';
import query from '../db';

const modelController = () => {
  const router = Router();

  // Create
  router.post('/add', asyncMiddleware(async (req, res, next) => {
    const { name, makeId } = req.body;

    const inputErrors = validate([
      { name: 'name', value: name, rules: nameValidationRules },
      { name: 'makeId', value: makeId, rules: idValidationRules },
    ]);
    inputErrors.forEach(idError => idError && next(idError));

    const timestamp = new Date();

    const { rows } = await query(
      'INSERT INTO MODEL(name,make_id,created,updated) VALUES($1,$2,$3,$4) RETURNING id',
      [name, makeId, timestamp, timestamp],
    );
    const [id] = rows;
    res.status(201).json(id);
  }));

  // Read
  router.get('/get', asyncMiddleware(async (req, res) => {
    const { rows } = await query('SELECT * FROM MODEL');
    res.json(rows);
  }));

  router.get('/get/id/:id', asyncMiddleware(async (req, res, next) => {
    const { id } = req.params;

    const inputError = validate({ name: 'id', value: Number(id), rules: idValidationRules });
    if (inputError) next(inputError);

    const { rows } = await query('SELECT * FROM MODEL WHERE id = $1', [id]);
    if (rows.length === 0) {
      next(new NotFoundError(`Type ID ${id} not found`));
    }

    res.json(rows[0]);
  }));

  // Update
  router.put('/update', asyncMiddleware(async (req, res, next) => {
    const { id, name, makeId } = req.body;

    const inputErrors = validate([
      { name: 'id', value: id, rules: idValidationRules },
      { name: 'name', value: name, rules: nameValidationRules },
      { name: 'makeId', value: makeId, rules: idValidationRules },
    ]);
    inputErrors.forEach(idError => idError && next(idError));

    const timestamp = new Date();

    await query(
      'UPDATE MODEL SET name = $1, make_id = $2, updated = $3 WHERE id = $4',
      [name, makeId, timestamp, id],
    );
    res.status(204).end();
  }));

  // Delete
  router.delete('/delete', asyncMiddleware(async (req, res, next) => {
    const { id } = req.body;

    const inputError = validate({ name: 'id', value: id, rules: idValidationRules });
    if (inputError) next(inputError);

    await query('DELETE FROM MODEL WHERE id = $1', [id]);
    res.status(204).end();
  }));

  return router;
};

export default modelController;
