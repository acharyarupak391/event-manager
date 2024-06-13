import { Request, Response } from "express";
import { Database } from "sqlite";
import { validateEvent } from "../utils/validate";
import { DBEvent } from "../model";
import { updateSchedule } from "../utils/schedule";

export const updateEvent = async (req: Request, res: Response, db: Database) => {
  const error = validateEvent(req, true);

  if (error) {
    return res.status(400).send({ error });
  }

  try {
    const { id, userName, userEmail, eventName, eventDescription, eventStartDate, eventEndDate, participants, timezone } = req.body;

    const event = await db.get<DBEvent>(`SELECT * FROM events WHERE user_email = ? AND id = ?`, [userEmail, id]);

    if (!event) {
      return res.status(404).send({ error: 'Event not found' });
    }

    const alreadyStarted = new Date(event.event_start_date).getTime() < Date.now();

    if (alreadyStarted) {
      return res.status(400).send({ error: 'Event already started/ended, cannot update it' });
    }

    await db.run(
      `UPDATE events SET user_name = ?, event_name = ?, event_description = ?, event_start_date = ?, event_end_date = ?, participants = ?, timezone = ? WHERE user_email = ? AND id = ?`,
      [userName, eventName, eventDescription, eventStartDate, eventEndDate, JSON.stringify(participants), timezone, userEmail, id]
    );
    updateSchedule(eventStartDate, req, Number(id));

    res.send({ message: 'Event updated' });
  } catch (error) {
    console.error(error)
    res.status(500).send({ error });
  }
}