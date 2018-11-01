import { Router } from 'express';

import { NotFoundError } from '../errorClasses';
import { validate, nameValidationRules, idValidationRules } from '../validator';
import { asyncMiddleware } from '../middleware';
import query from '../db';

const locationController = () => {
  const router = Router();

  // Create
  router.post('/add', asyncMiddleware(async (req, res, next) => {
    const { name } = req.body;

    const inputError = validate({ name: 'name', value: name, rules: nameValidationRules });
    if (inputError) next(inputError);

    const timestamp = new Date();

    const { rows } = await query(
      'INSERT INTO LOCATION(name,created,updated) VALUES($1,$2,$3) RETURNING id',
      [name, timestamp, timestamp],
    );
    const [id] = rows;
    res.status(201).json(id);
  }));

  // Read
  router.get('/get', asyncMiddleware(async (req, res) => {
    const { rows } = await query('SELECT * FROM LOCATION');
    res.json(rows);
  }));

  router.get('/get/id/:id', asyncMiddleware(async (req, res, next) => {
    const { id } = req.params;

    const inputError = validate({ name: 'id', value: Number(id), rules: idValidationRules });
    if (inputError) next(inputError);

    const { rows } = await query('SELECT * FROM LOCATION WHERE id = $1', [id]);
    if (rows.length === 0) {
      next(new NotFoundError(`Type ID ${id} not found`));
    }

    res.json(rows[0]);
  }));

  // Update
  router.put('/update', asyncMiddleware(async (req, res, next) => {
    const { id, name } = req.body;

    const inputErrors = validate([
      { name: 'id', value: id, rules: idValidationRules },
      { name: 'name', value: name, rules: nameValidationRules },
    ]);
    inputErrors.forEach(idError => idError && next(idError));

    const timestamp = new Date();

    await query(
      'UPDATE LOCATION SET name = $1, updated = $2 WHERE id = $3',
      [name, timestamp, id],
    );
    res.status(204).end();
  }));

  // Delete
  router.delete('/delete', asyncMiddleware(async (req, res, next) => {
    const { id } = req.body;

    const inputError = validate({ name: 'id', value: id, rules: idValidationRules });
    if (inputError) next(inputError);

    await query('DELETE FROM LOCATION WHERE id = $1', [id]);
    res.status(204).end();
  }));

  return router;
};

export default locationController;
