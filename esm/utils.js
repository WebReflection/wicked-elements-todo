import storage from './storage.js';

export const data = name => {
  const info = storage(name);
  if (!info.id) {
    info.id = 0;
    info.items = {};
  }
  return info;
};

export const destroy = (items, li) => {
  delete items[li.dataset.id];
  li.remove();
};
