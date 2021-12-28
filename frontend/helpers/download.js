export default function(e) {
  if (e.target.nodeName !== 'A') return;
  e.preventDefault();
  const filename = e.target.getAttribute("download");
  window.download(e.target.href, filename);
}