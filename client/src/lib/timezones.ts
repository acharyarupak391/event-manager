export type TimeZoneData = {
  timezone: string;
  timezoneName: string;
  offset: string;
  offsetInMs: number;
  current?: boolean;
};

const getOffsetValueInMs = (offsetString: string): number => {
  const match = offsetString.match(/^GMT(\+|\-)(\d{1,2}):(\d{1,2})$/);
  if (!match) throw new Error('Invalid offset string');
  const [_, sign, hour, minute] = match;

  const value = (parseInt(hour) * 60 + parseInt(minute)) * 60 * 1000;
  return sign === "+" ? value : -1 * value;
};

function getTimeZonesWithOffset(): TimeZoneData[] {
  const timezones = Intl.supportedValuesOf("timeZone");

  const data = timezones.map((tz) => {
    const localeString = new Date().toLocaleString("en-US", {
      timeZone: tz,
      timeZoneName: "longOffset",
    });
    const match = localeString.match(/.*\s(AM|PM)\s(.*)/);
    if (!match) throw new Error('Invalid locale string');
    const [_, __, offset] = match;
    const _offset = offset === "GMT" ? "GMT+00:00" : offset;

    return {
      timezone: `(${_offset}) ${tz}`,
      timezoneName: tz,
      offset: _offset,
      offsetInMs: getOffsetValueInMs(_offset),
      current: false,
    };
  });

  const sortedByOffset = data.sort(
    (a, b) => a.offsetInMs - b.offsetInMs
  );

  const currentDate = new Date().toLocaleString("en-US", {
    timeZoneName: "longOffset",
  })
  const currentOffset = sortedByOffset.findIndex(tz => currentDate.includes(tz.offset))

  if (currentOffset !== -1) {
    sortedByOffset[currentOffset].current = true;
  }

  return sortedByOffset;
}

const getISOTimeByOffset = (date: Date, offsetInMs: number): string => {
  const newTimestamp = date.getTime() + offsetInMs;
  return new Date(newTimestamp).toISOString();
}

const isTimeError = (start: Date, end: Date): boolean => {
  // check if start time is at least 1 minutes after current time
  const currentTime = new Date().getTime();
  const startTime = start.getTime();
  const endTime = end.getTime();

  return startTime < currentTime + (10 * 60000) || startTime >= endTime;
}

const getInitialStartAndEndTime = (date: Date) => {
  // get minutes hours and seconds fron current date
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const seconds = new Date().getSeconds();

  const startTimestamp = new Date(date).setHours(hours, minutes + 20, seconds);
  const startTime = new Date(startTimestamp);

  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + 1);

  return {
    startTime,
    endTime,
  }
}

export { getTimeZonesWithOffset, getISOTimeByOffset, isTimeError, getInitialStartAndEndTime };