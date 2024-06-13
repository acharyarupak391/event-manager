import { Request, Response } from "express";
import { Database } from "sqlite";
import { validateEvent } from "../utils/validate";
import { scheduleAndEmail } from "../utils/schedule";

export const addEvent = async (req: Request, res: Response, db: Database) => {
  const error = validateEvent(req);

  if (error) {
    return res.status(400).send({ error });
  }

  try {
    const { userName, userEmail, eventName, eventDescription, eventStartDate, eventEndDate, participants, timezone } = req.body;

    const result = await db.run(
      `INSERT INTO events (user_name, user_email, event_name, event_description, event_start_date, event_end_date, participants, timezone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userName, userEmail, eventName, eventDescription, eventStartDate, eventEndDate, JSON.stringify(participants), timezone]
    );

    scheduleAndEmail(eventStartDate, req, result.lastID);

    res.send({ message: 'Event added' });
  } catch (error) {
    console.error(error)
    res.status(500).send({ error });
  }
}