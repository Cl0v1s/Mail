

const Storage = JSON.parse(
  localStorage.getItem('storage') || JSON.stringify({
    preferences: {
      conversations: [],
    }
  })
);

console.log(Storage);

Storage.update = () => localStorage.setItem('storage', JSON.stringify(Storage));

export default Storage;