// eslint-disable-next-line import/prefer-default-export
export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
