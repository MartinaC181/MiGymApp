export const getWeekKey = (date: Date) => {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor(
      (date.getTime() - firstJan.getTime()) / 86_400_000
    );
    const week = Math.ceil((dayOfYear + firstJan.getDay() + 1) / 7);
    const result = `${date.getFullYear()}-W${week}`;
    // console.log(`getWeekKey(${date.toISOString().split('T')[0]}) = ${result}`);
    return result;
  };
  
  export const countAttendancesThisWeek = (
    attendance: string[],
    today = new Date()
  ) => {
    const currentKey = getWeekKey(today);
    return attendance.filter(
      (d) => getWeekKey(new Date(d)) === currentKey
    ).length;
  };
  
  export const calcularRachaSemanal = (
  attendance: string[],
  goal: number,
  today = new Date()
) => {
  let streak = 0;
  let cursor = new Date(today);

  while (true) {
    const key = getWeekKey(cursor);
    const count = attendance.filter(
      (d) => getWeekKey(new Date(d)) === key
    ).length;

    if (count >= goal) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 7);
    } else {
      break;
    }
  }

  const currentWeekCount = countAttendancesThisWeek(attendance, today);
  return { currentWeekCount, streak };
};

export const addAttendanceIfNeeded = (attendance: string[], date: Date = new Date()) => {
  const dateStr = date.toISOString().split("T")[0];
  if (attendance.includes(dateStr)) return { updated: attendance, added: false };
  return { updated: [...attendance, dateStr], added: true };
};