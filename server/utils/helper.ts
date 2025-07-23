import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const getCurrentWeekRange = (): [Date, Date] => {
  const today = dayjs().utc();

  const startOfWeek =
    today.day() === 0
      ? today.subtract(6, "day")
      : today.startOf("week").add(1, "day"); // Monday

  const startUTC = startOfWeek.startOf("day").toDate();
  const endUTC = startOfWeek.add(6, "day").startOf("day").toDate();

  return [startUTC, endUTC];
};
