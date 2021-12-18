export default function (mailBody) {
  let toExamine = [mailBody];

  do {
    const current = toExamine.shift();
    if(current.headers["Content-Type"].type === "text/plain") {
      return current.content.substring(0, 97) + "...";
    }
    if(current.parts) toExamine = [...toExamine, ...current.parts];
  } while (toExamine.length > 0);

  return null;
}