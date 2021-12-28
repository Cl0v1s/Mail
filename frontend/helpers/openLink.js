export default function(e) {
  if (e.target.nodeName !== 'A' || e.target.target !== '_blank') return;
  e.preventDefault();
  const download = e.target.getAttribute("download");
  if(download) window.open(e.target.href, '_blank', download);
  else window.open(e.target.href, '_blank');
}