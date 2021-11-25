export function format(time) {
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  let second = date.getSeconds();
  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + second;
}
