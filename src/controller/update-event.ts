import { Request, Response } from "express";
import { Database } from "sqlite";
import { validateEvent } from "../utils/validate";
import { DBEvent } from "../model";

export const updateEvent = async (req: Request, res: Response, db: Database) => {
  const error = validateEvent(req, true);

  if (error) {
    return res.status(400).send(error);
  }

  try {
    const { id, userName, userEmail, eventName, eventDescription, eventStartDate, eventEndDate } = req.body;

    const event = await db.get<DBEvent>(`SELECT * FROM events WHERE user_email = ? AND id = ?`, [userEmail, id]);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    const alreadyStarted = new Date(event.event_start_date).getTime() < Date.now();

    if (alreadyStarted) {
      return res.status(400).send('Event already started/ended, cannot update it');
    }

    await db.run(
      `UPDATE events SET user_name = ?, event_name = ?, event_description = ?, event_start_date = ?, event_end_date = ? WHERE user_email = ? AND id = ?`,
      [userName, eventName, eventDescription, eventStartDate, eventEndDate, userEmail]
    );

    res.send('Event updated');
  } catch (error) {
    console.error(error)
    res.status(500).send({ error });
  }
}