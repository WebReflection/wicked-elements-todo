import wickedElements from 'wicked-elements';

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
  },

  add(value) {
    const li = document.createElement('li');
    li.innerHTML = `<div class="view">
      <input class="toggle" type="checkbox">
      <label></label>
      <button class="destroy"></button>
    </div>`;
    li.querySelector('label').textContent = value;
    this.list.appendChild(li);
  },
  clearCompleted() {
    for (let
      inputs = this.list.querySelectorAll('input:checked'),
      i = 0; i < inputs.length; i++
    ) {
      inputs[i].closest('li').remove();
    }
  },
  toggleAll(checked) {
    for (let
      inputs = this.list.querySelectorAll('input'),
      i = 0; i < inputs.length; i++
    ) {
      this.update(inputs[i], checked);
    }
  },
  update(input, checked) {
    input.checked = checked;
    input.closest('li').classList.toggle('completed', checked);
  },

  // delegated events
  onchange(event) {
    const {target} = event;
    switch (target.className) {
      case 'new-todo':
        this.add(target.value);
        target.value = '';
        break;
      case 'toggle':
        this.update(target, target.checked);
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
        this.clearCompleted();
        break;
      case 'destroy':
        target.closest('li').remove();
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
