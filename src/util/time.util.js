export class TimeUtil {
  static formatTime = (unixTime, withTime = false) => {
    if (unixTime === null) {
      return "";
    }
    let time = new Date(unixTime);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    let result = y + '-' + this.add0(m) + '-' + this.add0(d);
    return withTime ? result + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
      : result;
  };

  static add0 = (m) => {
    return m < 10 ? '0' + m : m
  };
}
