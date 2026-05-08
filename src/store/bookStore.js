const crypto = require('node:crypto');

const books = [
  {
    id: crypto.randomUUID(),
    title: 'Cien anos de soledad',
    author: 'Gabriel Garcia Marquez',
    year: 1967,
    genre: 'Realismo magico',
    available: true,
  },
  {
    id: crypto.randomUUID(),
    title: 'El principito',
    author: 'Antoine de Saint-Exupery',
    year: 1943,
    genre: 'Fabula',
    available: true,
  },
  {
    id: crypto.randomUUID(),
    title: 'Ficciones',
    author: 'Jorge Luis Borges',
    year: 1944,
    genre: 'Cuentos',
    available: false,
  },
];

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function getAll(searchText) {
  const text = normalize(searchText);

  if (!text) {
    return [...books];
  }

  return books.filter((book) => {
    return normalize(book.title).includes(text) || normalize(book.author).includes(text);
  });
}

function getById(id) {
  return books.find((book) => book.id === id) || null;
}

function create(data) {
  const now = new Date().toISOString();
  const book = {
    id: crypto.randomUUID(),
    title: data.title,
    author: data.author,
    year: data.year ?? null,
    genre: data.genre ?? null,
    available: data.available ?? true,
    createdAt: now,
    updatedAt: now,
  };

  books.push(book);
  return book;
}

function update(id, data) {
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return null;
  }

  books[index] = {
    ...books[index],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };

  return books[index];
}

function remove(id) {
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return null;
  }

  const [deleted] = books.splice(index, 1);
  return deleted;
}

function reset() {
  books.splice(0, books.length);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  reset,
};
