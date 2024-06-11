import { Request, Response } from "express";
import { Database } from "sqlite";
import { validateEvent } from "../utils/validate";
import { scheduleAndEmail } from "../utils/schedule";

export const addEvent = async (req: Request, res: Response, db: Database) => {
  const error = validateEvent(req);

  if (error) {
    return res.status(400).send(error);
  }

  try {
    const { userName, userEmail, eventName, eventDescription, eventStartDate, eventEndDate } = req.body;

    await db.run(
      `INSERT INTO events (user_name, user_email, event_name, event_description, event_start_date, event_end_date) VALUES (?, ?, ?, ?, ?, ?)`,
      [userName, userEmail, eventName, eventDescription, eventStartDate, eventEndDate]
    );

    scheduleAndEmail(eventStartDate, req);

    res.send('Event added');
  } catch (error) {
    console.error(error)
    res.status(500).send({ error });
  }
}