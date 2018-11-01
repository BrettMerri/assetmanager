import { Router } from 'express';
import bcrypt from 'bcrypt';

import { NotFoundError } from '../errorClasses';
import { validate, nameValidationRules, idValidationRules } from '../validator';
import { asyncMiddleware } from '../middleware';
import query from '../db';

const hashPassword = password => bcrypt.hash(password, 10);

const userController = () => {
  const router = Router();

  // Create
  router.post('/add', asyncMiddleware(async (req, res, next) => {
    const { displayname, password } = req.body;

    const inputErrors = validate([
      { name: 'displayname', value: displayname, rules: nameValidationRules },
      { name: 'password', value: password, rules: idValidationRules },
    ]);
    inputErrors.forEach(idError => idError && next(idError));

    const timestamp = new Date();
    const hash = await hashPassword(password);

    const { rows } = await query(
      'INSERT INTO USERS(displayname,password,created,updated) VALUES($1,$2,$3,$4) RETURNING id',
      [displayname, hash, timestamp, timestamp],
    );
    const [id] = rows;
    res.status(201).json(id);
  }));

  // Read
  router.get('/get', asyncMiddleware(async (req, res) => {
    const { rows } = await query('SELECT displayname, id FROM USERS');
    res.json(rows);
  }));

  router.get('/get/id/:id', asyncMiddleware(async (req, res, next) => {
    const { id } = req.params;

    const inputError = validate({ name: 'id', value: Number(id), rules: idValidationRules });
    if (inputError) next(inputError);

    const { rows } = await query('SELECT displayname, id FROM USERS WHERE id = $1', [id]);
    if (rows.length === 0) {
      next(new NotFoundError(`Type ID ${id} not found`));
    }

    res.json(rows[0]);
  }));

  // Update
  router.put('/update', asyncMiddleware(async (req, res, next) => {
    const { id, displayname, password } = req.body;

    const inputErrors = validate([
      { name: 'id', value: id, rules: idValidationRules },
      { name: 'displayname', value: displayname, rules: nameValidationRules },
      { name: 'password', value: password, rules: idValidationRules },
    ]);
    inputErrors.forEach(idError => idError && next(idError));

    const timestamp = new Date();
    const hash = await hashPassword(password);

    await query(
      'UPDATE USERS SET displayname = $1, password = $2, updated = $3 WHERE id = $4',
      [displayname, hash, timestamp, id],
    );
    res.status(204).end();
  }));

  // Delete
  router.delete('/delete', asyncMiddleware(async (req, res, next) => {
    const { id } = req.body;

    const inputError = validate({ name: 'id', value: id, rules: idValidationRules });
    if (inputError) next(inputError);

    await query('DELETE FROM USERS WHERE id = $1', [id]);
    res.status(204).end();
  }));

  return router;
};

export default userController;
