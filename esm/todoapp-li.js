import wickedElements from 'wicked-elements';

import {destroy, data} from './utils.js';

wickedElements.define('.todoapp .todo-list li', {

  get info() { return this.items[this.el.dataset.id]; },
  get items() { return data(this.storage).items; },

  get label() { return this.el.querySelector('label'); },
  get toggle() { return this.el.querySelector('.toggle'); },

  init(event) {
    this.el = event.currentTarget;
    this.app = this.el.closest('.todoapp');
    this.app.addEventListener('update', this);
    this.storage = this.app.dataset.storage;
    this.render();
    this.update();
  },

  destroy() {
    this.app.removeEventListener('update', this);
  },

  render() {
    this.el.innerHTML = `
    <div class="view">
      <input class="toggle" type="checkbox">
      <label></label>
      <button class="destroy"></button>
    </div>`;
  },

  update() {
    const {text, checked} = this.info;
    this.label.textContent = text;
    this.toggle.checked = checked;
    this.el.classList.toggle('completed', checked);
  },

  // Events handling
  ondblclick(event) {
    const {target} = event;
    const {label} = this;
    if (target === label) {
      event.preventDefault();
      event.stopPropagation();
      label.contentEditable = true;
    }
  },

  onfocusout(event) {
    const {label} = this;
    if (event.target === label) {
      event.stopPropagation();
      label.contentEditable = false;
      this.info.text = label.textContent;
    }
  },

  onkeydown(event) {
    if (event.key === 'Enter') {
      const {label} = this;
      if (event.target === label && label.contentEditable) {
        event.preventDefault();
        label.blur();
      }
    }
  },

  onchange(event) {
    const {target} = event;
    switch (target.className) {
      case 'toggle':
        event.stopPropagation();
        this.info.checked = target.checked;
        this.el.classList.toggle('completed', target.checked);
        break;
    }
  },

  onclick(event) {
    const {target} = event;
    switch (target.className) {
      case 'destroy':
        event.stopPropagation();
        destroy(this.items, this.el);
        this.destroy();
        break;
    }
  },

  onupdate() {
    const action = this.el.isConnected ? 'update' : 'destroy';
    this[action]();
  }

});
