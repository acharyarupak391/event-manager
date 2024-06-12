import { Request, Response } from "express";
import { HolidayAPI } from "holidayapi";
import { updateHolidayDates } from "../utils/update-holiday-dates";
import { validateYear } from "../utils/validate";

export const getHolidays = async (req: Request, res: Response) => {
  const holidayApi = new HolidayAPI({ key: process.env.HOLIDAY_API_KEY });

  const error = validateYear(req);

  if (error) {
    res.status(400).send({ error });
    return;
  }

  const { year } = req.params;
  const { country } = req.query;

  try {
    // need to set the year to ONLY the previous year because of holidayAPI free tier limitations
    const currentYear = new Date().getFullYear();

    const response = await holidayApi.holidays({ country: country as string, year: currentYear - 1 });

    if (response.error) {
      res.status(500).send({ error: response.error });
      return;
    }

    res.status(200).send({ holidays: updateHolidayDates(response, Number(year)) });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get holidays for the year " + year });
  }
}