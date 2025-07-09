import { validationResult } from 'express-validator';
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extracted = errors.array().map(e => ({ field: e.param, msg: e.msg }));
  return res.status(422).json({ errors: extracted });
};

export default validate;
