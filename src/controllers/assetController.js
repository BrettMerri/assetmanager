import { Router } from 'express';

import { NotFoundError } from '../errorClasses';
import { validate, nameValidationRules, idValidationRules } from '../validator';
import { asyncMiddleware } from '../middleware';
import query from '../db';

const brandController = () => {
  const router = Router();

  // Create
  router.post('/add', asyncMiddleware(async (req, res, next) => {
    const {
      typeId,
      makeId,
      modelId,
      locationId,
      serialNumber,
    } = req.body;

    const inputErrors = validate([
      { name: 'typeId', value: typeId, rules: idValidationRules },
      { name: 'makeId', value: makeId, rules: idValidationRules },
      { name: 'modelId', value: modelId, rules: idValidationRules },
      { name: 'locationId', value: locationId, rules: idValidationRules },
      { name: 'serialNumber', value: serialNumber, rules: nameValidationRules },
    ]);
    inputErrors.forEach(idError => idError && next(idError));

    const timestamp = new Date();

    const { rows } = await query(
      'INSERT INTO ASSET(created,updated,type_id,make_id,model_id,location_id,serial_number) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [timestamp, timestamp, typeId, makeId, modelId, locationId, serialNumber],
    );
    const [id] = rows;
    res.status(201).json(id);
  }));

  // Read
  router.get('/get', asyncMiddleware(async (req, res) => {
    const { rows } = await query('SELECT * FROM ASSET');
    res.json(rows);
  }));

  router.get('/get/id/:id', asyncMiddleware(async (req, res, next) => {
    const { id } = req.params;

    const inputError = validate({ name: 'id', value: Number(id), rules: idValidationRules });
    if (inputError) next(inputError);

    const { rows } = await query('SELECT * FROM ASSET WHERE id = $1', [id]);
    if (rows.length === 0) {
      next(new NotFoundError(`Type ID ${id} not found`));
    }

    res.json(rows[0]);
  }));

  // Update
  router.put('/update', asyncMiddleware(async (req, res, next) => {
    const {
      id,
      typeId,
      makeId,
      modelId,
      locationId,
      serialNumber,
    } = req.body;

    const inputErrors = validate([
      { name: 'id', value: id, rules: idValidationRules },
      { name: 'typeId', value: typeId, rules: idValidationRules },
      { name: 'makeId', value: makeId, rules: idValidationRules },
      { name: 'modelId', value: modelId, rules: idValidationRules },
      { name: 'locationId', value: locationId, rules: idValidationRules },
      { name: 'serialNumber', value: serialNumber, rules: nameValidationRules },
    ]);
    inputErrors.forEach(idError => idError && next(idError));

    const timestamp = new Date();

    await query(
      'UPDATE ASSET SET type_id = $1, make_id = $2, model_id = $3, location_id = $4 serialNumber = $5, updated = $6 WHERE id = $7',
      [typeId, makeId, modelId, locationId, serialNumber, timestamp, id],
    );
    res.status(204).end();
  }));

  // Delete
  router.delete('/delete', asyncMiddleware(async (req, res, next) => {
    const { id } = req.body;

    const inputError = validate({ name: 'id', value: id, rules: idValidationRules });
    if (inputError) next(inputError);

    await query('DELETE FROM ASSET WHERE id = $1', [id]);
    res.status(204).end();
  }));

  return router;
};

export default brandController;
