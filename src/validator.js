import { BadRequestError, ExtendableError } from './errorClasses';

const validatorLogic = (name, value, rules) => {
  const {
    type,
    minLength,
    maxLength,
    integer,
    min,
    max,
  } = rules;
  const valueType = typeof value;
  const valueLength = typeof value === 'string' || Array.isArray(value) ? value.length : null;
  const valueIsInteger = Number.isInteger(value);

  if (type && valueType !== type) {
    return new ExtendableError(`Expected ${name} to be ${type} but got ${valueType}`);
  }

  if (minLength && valueLength < minLength) {
    return new BadRequestError(`Expected ${name} to have a minimum length of ${minLength} but got length ${valueLength}`);
  }

  if (maxLength && valueLength > maxLength) {
    return new BadRequestError(`Expected ${name} to have a max length of ${maxLength} but got length ${valueLength}`);
  }

  if (integer && !valueIsInteger) {
    return new BadRequestError(`Expected ${name} to be an integer but got ${value}`);
  }

  if (min && Number(value) < min) {
    return new BadRequestError(`Expected ${name} to be less than ${min} but got ${value}`);
  }

  if (max && Number(value) > max) {
    return new BadRequestError(`Expected ${name} to be greater than ${max} but got ${value}`);
  }

  return null;
};

export const nameValidationRules = {
  type: 'string',
  minLength: 2,
  maxLength: 20,
};

export const idValidationRules = {
  type: 'number',
  min: 0,
  max: 2147483647,
};

export const validate = validatorInput => (
  Array.isArray(validatorInput)
    ? validatorInput.map(({ name, value, rules }) => validatorLogic(name, value, rules))
    : validatorLogic(validatorInput.name, validatorInput.value, validatorInput.rules)
);
