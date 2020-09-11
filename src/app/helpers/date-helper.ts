export class DateHelper {
  static makeDateString(daysAfterToday: string): string {
    const daysToAdd = Number.parseInt(daysAfterToday);
    const newDate = new Date();
    console.log('newDate before: ', newDate);
    console.log('daysAfterToday: ', daysToAdd);
    newDate.setDate(newDate.getDate() + daysToAdd);
    // newDate.setHours(0, 0, 0, 0);
    console.log('newDate after: ', newDate);
    return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`;
  }

  static makeDate(daysAfterToday: number): Date {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysAfterToday);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
}
