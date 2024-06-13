import { Request, Response } from "express";
import { Database } from "sqlite";
import { validateEmail } from "../utils/validate";
import { deleteSchedule } from "../utils/schedule";

export const deleteEvent = async (req: Request, res: Response, db: Database) => {
  const error = validateEmail(req, true);

  if (error) {
    return res.status(400).send({ error })
  }

  try {
    const email = req.params.email;
    const id = req.query.id;

    await db.run(`DELETE FROM events WHERE user_email = ? AND id = ?`, [email, id]);

    deleteSchedule(Number(id))

    res.send({ message: 'Event deleted' });
  } catch (error) {
    console.error(error)
    res.status(500).send({ error });
  }
}