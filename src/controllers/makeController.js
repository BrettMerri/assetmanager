import { Router } from 'express';

import { NotFoundError } from '../errorClasses';
import { validate, nameValidationRules, idValidationRules } from '../validator';
import { asyncMiddleware } from '../middleware';
import query from '../db';

const makeController = () => {
  const router = Router();

  // Create
  router.post('/add', asyncMiddleware(async (req, res, next) => {
    const { name, typeId } = req.body;

    const inputErrors = validate([
      { name: 'name', value: name, rules: nameValidationRules },
      { name: 'typeId', value: typeId, rules: idValidationRules },
    ]);
    inputErrors.forEach(idError => idError && next(idError));

    const timestamp = new Date();

    const { rows } = await query(
      'INSERT INTO make(name,type_id,created,updated) VALUES($1,$2,$3,$4) RETURNING id',
      [name, typeId, timestamp, timestamp],
    );
    const [id] = rows;
    res.status(201).json(id);
  }));

  // Read
  router.get('/get', asyncMiddleware(async (req, res) => {
    const { rows } = await query('SELECT * FROM MAKE');
    res.json(rows);
  }));

  router.get('/get/id/:id', asyncMiddleware(async (req, res, next) => {
    const { id } = req.params;

    const inputError = validate({ name: 'id', value: Number(id), rules: idValidationRules });
    if (inputError) next(inputError);

    const { rows } = await query('SELECT * FROM MAKE WHERE id = $1', [id]);
    if (rows.length === 0) {
      next(new NotFoundError(`Type ID ${id} not found`));
    }

    res.json(rows[0]);
  }));

  // Update
  router.put('/update', asyncMiddleware(async (req, res, next) => {
    const { id, name, typeId } = req.body;

    const inputErrors = validate([
      { name: 'id', value: id, rules: idValidationRules },
      { name: 'name', value: name, rules: nameValidationRules },
      { name: 'typeId', value: typeId, rules: idValidationRules },
    ]);
    inputErrors.forEach(idError => idError && next(idError));

    const timestamp = new Date();

    await query(
      'UPDATE MAKE SET name = $1, type_id = $2, updated = $3 WHERE id = $4',
      [name, typeId, timestamp, id],
    );
    res.status(204).end();
  }));

  // Delete
  router.delete('/delete', asyncMiddleware(async (req, res, next) => {
    const { id } = req.body;

    const inputError = validate({ name: 'id', value: id, rules: idValidationRules });
    if (inputError) next(inputError);

    await query('DELETE FROM MAKE WHERE id = $1', [id]);
    res.status(204).end();
  }));

  return router;
};

export default makeController;
