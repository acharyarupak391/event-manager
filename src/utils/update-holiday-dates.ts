import { HolidaysResponse } from "holidayapi";

export const updateHolidayDates = (holidayResponse: HolidaysResponse, year: number) => {
  if (holidayResponse.error || !holidayResponse.holidays) {
    return []
  }

  return holidayResponse.holidays.map(holiday => {
    const updatedDateTimestamp = new Date(holiday.date).setFullYear(year)
    const updatedDate = new Date(updatedDateTimestamp)

    const updatedYear = updatedDate.getUTCFullYear()
    const updatedMonth = updatedDate.getUTCMonth() + 1
    const updatedDay = updatedDate.getUTCDate()

    return {
      ...holiday,
      date: `${updatedYear}-${updatedMonth}-${updatedDay}`,
      observed: `${updatedYear}-${updatedMonth}-${updatedDay}`
    }
  })
}