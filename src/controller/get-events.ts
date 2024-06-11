import { Request, Response } from "express";
import { Database } from "sqlite";
import { validateEmail } from "../utils/validate";
import { DBEvent } from "../model";

export const getEvents = async (req: Request, res: Response, db: Database) => {
  const error = validateEmail(req);

  if (error) {
    return res.status(400).send(error)
  }

  try {
    const email = req.params.email;

    const events = await db.all<DBEvent[]>(`SELECT * FROM events WHERE user_email = ?`, [email]);

    res.send(events);
  } catch (error) {
    console.error(error)
    res.status(500).send({ error });
  }
}