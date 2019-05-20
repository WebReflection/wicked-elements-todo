import wickedElements from 'wicked-elements';

import {destroy, data} from './utils.js';

const {forEach} = [];

wickedElements.define('.todoapp', {
  style: `
    .todo-list.completed li:not(.completed),
    .todo-list.active li.completed {
      display: none;
    }
  `,

  init(event) {
    this.el = event.currentTarget;
    this.list = this.el.querySelector('.todo-list');
    const name = 'todos#' + (this.el.id || '');
    this.el.dataset.storage = name;
    this.data = data(name);
    if (!this.list.children.length)
      Object.keys(this.data.items).forEach(this.add, this);
    const hash = location.hash.slice(2);
    if (hash)
      this.el.querySelector(`a[href="#/${hash}"]`).click();
  },

  create(text) {
    const id = ++this.data.id;
    this.data.items[id] = {text, checked: false};
    this.add(id);
  },

  add(id) {
    const li = document.createElement('li');
    li.dataset.id = id;
    this.list.appendChild(li);
  },

  removeCompleted() {
    forEach.call(
      this.list.querySelectorAll('li.completed'),
      destroy.bind(null, this.data.items)
    );
  },

  toggleAll(checked) {
    const {items} = this.data;
    Object.keys(items).forEach(id => {
      items[id].checked = checked;
    });
    this.el.dispatchEvent(new CustomEvent('update'));
  },

  // delegated events
  onchange(event) {
    const {target} = event;
    switch (target.className) {
      case 'new-todo':
        this.create(target.value);
        target.value = '';
        break;
      case 'toggle-all':
        this.toggleAll(target.checked);
        break;
    }
  },

  onclick(event) {
    const {target} = event;
    switch (target.className) {
      case 'clear-completed':
        this.removeCompleted();
        break;
      default:
        if (target.nodeName === 'A' && !target.classList.contains('selected')) {
          this.el.querySelector('a.selected').classList.remove('selected');
          target.classList.add('selected');
          this.list.classList.remove('active', 'completed');
          const className = target.hash.slice(2);
          if (className)
            this.list.classList.add(className);
        }
        break;
    }
  }
});
