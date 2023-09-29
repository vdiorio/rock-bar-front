export default function formatDate(inputString: string) {
  const inputDate = new Date(inputString);
  const day = inputDate.getDate().toString().padStart(2, "0");
  const month = (inputDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const hours = inputDate.getHours().toString().padStart(2, "0");
  const minutes = inputDate.getMinutes().toString().padStart(2, "0");

  return `${day}/${month} - ${hours}:${minutes}`;
}
