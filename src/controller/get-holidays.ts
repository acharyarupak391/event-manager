import { Request, Response } from "express";
import { getCountry } from "../utils/get-country";
import { HolidayAPI } from "holidayapi";
import { updateHolidayDates } from "../utils/update-holiday-dates";

export const getHolidays = async (req: Request, res: Response) => {
  const holidayApi = new HolidayAPI({ key: process.env.HOLIDAY_API_KEY });
  const userCountry = await getCountry(req);

  try {
    const lastYear = new Date().getFullYear() - 1;
    const response = await holidayApi.holidays({ country: userCountry, year: lastYear });

    if (response.error) {
      res.status(500).send({ error: response.error });
      return;
    }

    res.status(200).send(updateHolidayDates(response));
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get holidays" });
  }
}