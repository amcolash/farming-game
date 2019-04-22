export class Util {
  static getTime(ms: number): string {
    const sec = ms / 1000;
    const min = sec / 60;
    const hour = min / 60;
    const day = hour / 24;

    if (sec < 60) return sec.toFixed(0) + 's';
    if (min < 60) return min.toFixed(0) + 'm';
    if (hour < 60) return hour.toFixed(1) + 'h';
    return day.toFixed(1) + 'd';
  }

  static numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  static titleCase(str: string): string {
    return str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}