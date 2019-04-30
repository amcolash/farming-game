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

  static readonly months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  static getDate(ms: number): string {
    const date = new Date(ms);
    
    let hour = date.getUTCHours();
    let am = hour < 12 ? 'am' : 'pm';
    if (hour == 0) hour = 12;
    if (hour > 12) hour -= 12;

    let min = date.getUTCMinutes().toString();
    if (min.length === 1) min = '0' + min;
    
    return Util.months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + hour + ':' + min + am;
  }

  static numberWithCommas(x: number): string {
    return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  static titleCase(str: string): string {
    return str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  static lerpTowards(current: number, target: number, delta: number): number {
      if (Math.abs(target - current) <= delta) {
          return target;
      }
      return current + Math.sign(target - current) * delta;
  }
}