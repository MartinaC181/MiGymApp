export const getWeekKey = (date: Date) => {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor(
      (date.getTime() - firstJan.getTime()) / 86_400_000
    );
    const week = Math.ceil((dayOfYear + firstJan.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${week}`;
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