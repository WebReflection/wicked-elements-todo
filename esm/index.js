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
    this.initStorage();
    const hash = location.hash.slice(2);
    if (hash)
      this.el.querySelector(`a[href="#/${hash}"]`).click();
  },

  initStorage() {
    const id = this.el.id || '';

    const todos = localStorage.getItem('todos#' + id);
    if (todos)
      JSON.parse(todos).forEach(
        info => this.add(info.textContent, info.className)
      );

    addEventListener('beforeunload', () => {
      const todos = [];
      for (let
        label,
        labels = this.list.querySelectorAll('label'),
        i = 0; i < labels.length; i++
      ) {
        label = labels[i];
        todos[i] = {
          textContent: label.textContent,
          className: label.closest('li').className
        };
      }
      localStorage.setItem('todos#' + id, JSON.stringify(todos));
    });
  },

  add(textContent, className) {
    const li = document.createElement('li');
    const checked = className === 'completed' ? 'checked' : '';
    li.className = className || '';
    li.innerHTML = `
    <div class="view">
      <input class="toggle" type="checkbox" ${checked}>
      <label></label>
      <button class="destroy"></button>
    </div>`;
    li.querySelector('label').textContent = textContent;
    this.list.appendChild(li);
  },

  clearCompleted() {
    for (let
      lis = this.list.querySelectorAll('li.completed'),
      i = 0; i < lis.length; i++
    ) {
      lis[i].remove();
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
