export class DateHelper {
  static makeDateString(daysAfterToday: number): string {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysAfterToday);
    newDate.setHours(0, 0, 0, 0);
    return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`;
  }

  static makeDate(daysAfterToday: number): Date {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysAfterToday);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
}
