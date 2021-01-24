
export function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return monthNames[monthIndex] + ' ' + year;
}  
export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug", 
    "Sep", "Oct", "Nov", "Dec"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + date.getMinutes();
}  

export function hashCode(str) { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
} 

export function intToRGB(i){
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "#"+"00000".substring(0, 6 - c.length) + c;
} 