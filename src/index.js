import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import './dotenv';
import typeController from './controllers/typeController';
import makeController from './controllers/makeController';
import modelController from './controllers/modelController';
import assetController from './controllers/assetController';
import locationController from './controllers/locationController';
import userController from './controllers/userController';
import { BadRequestError, NotFoundError } from './errorClasses';

require('@babel/polyfill');

const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/type/', typeController());
app.use('/api/make/', makeController());
app.use('/api/model/', modelController());
app.use('/api/asset/', assetController());
app.use('/api/location/', locationController());
app.use('/api/user/', userController());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.use((req, res, next) => {
  res.status(404).end();
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof BadRequestError) {
    res.status(400).json(err.name);
    next();
  }

  if (err instanceof NotFoundError) {
    res.status(404).json('not found');
    next();
  }

  console.error(err.stack); // eslint-disable-line no-console
  res.status(500).end();
  next();
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`)); // eslint-disable-line no-console
