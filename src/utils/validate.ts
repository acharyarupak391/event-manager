import { Request } from 'express';
import Joi from 'joi';

const EventSchema = Joi.object({
  userName: Joi.string().required(),
  userEmail: Joi.string().email().required(),
  eventName: Joi.string().required(),
  eventDescription: Joi.string().required(),
  eventStartDate: Joi.date().iso().greater('now').required(),
  eventEndDate: Joi.date().iso().greater(Joi.ref('eventStartDate')).required(),
  participants: Joi.array().items(Joi.string().email()).required(),
  timezone: Joi.string().required()
});

// add id to the above schema
const UpdateEventSchema = EventSchema.keys({
  id: Joi.number().required()
});

const validateEvent = (req: Request, updateEvent?: boolean) => {
  const Schema = updateEvent ? UpdateEventSchema : EventSchema;

  const validation = Schema.validate(req.body);

  if (validation.error) {
    return validation.error.details[0].message;
  }

  return null;
}

const validateEmail = (req: Request, deleteEvent?: boolean) => {
  const Schema = deleteEvent ? Joi.object({
    email: Joi.string().email().required(),
    id: Joi.number().required()
  }) : Joi.object({
    email: Joi.string().email().required()
  })

  const data = deleteEvent ? { email: req.params.email, id: req.query.id } : { email: req.params.email };
  const validation = Schema.validate(data);

  if (validation.error) {
    return validation.error.details[0].message;
  }

  return null;
}

const validateYear = (req: Request) => {
  const currentYear = new Date().getFullYear();
  const Schema = Joi.object({
    year: Joi.number().min(1970).max(currentYear).required(),
    country: Joi.string().required().max(4).min(2)
  });

  const validation = Schema.validate({
    year: req.params.year,
    country: req.query.country
  });

  if (validation.error) {
    return validation.error.details[0].message;
  }

  return null;
}

export { validateEvent, validateEmail, validateYear };