class ManageList {
    constructor() {
        window.addEventListener('load', this.addTask);
        document.querySelector('.button').addEventListener('click', this.addTask);
        document.querySelector('.add-task').addEventListener('keyup', event => {
            if (event.key === 'Enter') this.addTask()
        });

        this.taskListBlock = document.querySelector('.list');
        this.listOfTasks = this.taskListBlock.children;
        this.ELEMENT_HEIGHT = 40;  // высота элемента списка
        this.BORDER = 1;  // граница списка
        this.sortIcon = document.querySelector('.sort');
        this.sortIcon.addEventListener('click', this.sortList);
        this.sorted = false;
    }

    addTask = () => {
        const task = new Task(this.taskListBlock);  // создаём объект который содержит в себе записанные данные на странице
        this.value = task.value;
        this.taskListBlock.append(this.generateTaskLine(this.value));
        this.taskListBlock.lastElementChild.querySelector('.task').focus();  // фокусируемся на последнем элементе
    }

    generateTaskLine(value) {
        const taskBlock = document.createElement('form');
        const dragPoint = document.createElement('div');
        const inputLine = document.createElement('input');
        const cancelTask = document.createElement('div');

        taskBlock.classList.add('input');
        dragPoint.classList.add('drag');
        inputLine.classList.add('task');
        inputLine.type = 'text';
        inputLine.name = 'task';
        inputLine.value = value;
        cancelTask.classList.add('cancel-task');

        dragPoint.addEventListener('mousedown', this.moveTaskLine);
        cancelTask.addEventListener('click', event => this.deleteTaskLine(event));
        taskBlock.addEventListener('submit', this.handleSubmit);

        taskBlock.append(dragPoint);
        taskBlock.append(inputLine);
        taskBlock.append(cancelTask);

        return taskBlock;
    }

    handleSubmit(event) {
        event.preventDefault();
    }


    sortList = () => {
        this.sortIcon.classList.toggle('sorted');
        let sortedArray = [...this.listOfTasks].sort(callBackSort);  // отсортированный список
        function callBackSort(a, b) {   // колбэк функция для правильной сортировки элементов
            a = a.children[1].value
            b = b.children[1].value
            if (!isNaN(a) && !isNaN(b)) return a - b;
            else return a.localeCompare(b);
        }

        if (this.sorted === true) {
            sortedArray = sortedArray.reverse();
        }
        const sortedList = document.createElement('div');
        sortedList.classList.add('list');
        sortedArray.forEach(element => sortedList.append(element));  // вставляется в лист отсортированный список
        this.taskListBlock.replaceWith(sortedList);
        this.taskListBlock = sortedList;
        this.listOfTasks = this.taskListBlock.children;
        this.sorted = !this.sorted;
    }

    deleteTaskLine = e => {
        const element = e.target.parentNode;
        if (element.parentNode.children.length > 1)
            element.remove();
    }

    moveTaskLine = e => {
        if (this.listOfTasks.length <= 2) {
            return;
        }
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.dropElement);

        this.movedElement = e.target.parentNode;  // перетаскиваемый элемент
        const elementBorder = this.movedElement.getBoundingClientRect();  // границы передвигающегося элемента
        this.movedElement.style = 'position: absolute; background: #FFDC40;';
        this.listAfterClick = this.taskListBlock.getBoundingClientRect();  // границы списка после вытаскивания элемента из него                                                        
        this.clickToTop = e.pageY - elementBorder.top; // расстояние от точки клика до верха элемента
        this.clickToBottom = this.ELEMENT_HEIGHT - this.clickToTop;  // расстояние от точки клика до низа элемента

        let top = elementBorder.top - (this.listAfterClick.top + this.BORDER);  // расстояние от верха списка до верха элемента
        if (this.listAfterClick.top > elementBorder.top) top = 0;
        else if (elementBorder.bottom > this.listAfterClick.bottom) top -= this.clickToTop;
        this.movedElement.style.top = top + 'px';
    }
    handleMouseMove = e => {
        this.taskListBlock.style.cursor = 'move';
        if (e.pageY >= this.listAfterClick.top + this.BORDER + this.clickToTop &&
            e.pageY <= this.listAfterClick.bottom - this.BORDER - this.clickToBottom) {
            this.movedElement.style.top = (e.pageY - this.listAfterClick.top - this.BORDER - this.clickToTop) + 'px';  // движение элемента по оси Y
        }
    }
    dropElement = (e) => {
        document.removeEventListener('mouseup', this.dropElement);
        document.removeEventListener('mousemove', this.handleMouseMove);

        let movedElementClone = this.taskListBlock.removeChild(this.movedElement);  // клон вставляемого элемента
        let position = Math.round(movedElementClone.style.top.slice(0, -2) / this.ELEMENT_HEIGHT);  // позиция элемента
        let inPosition = this.taskListBlock.children[position];  // элемент находящийся на этой позиции
        let ratio = (e.pageY - this.listAfterClick.top + this.BORDER) / this.ELEMENT_HEIGHT;  // склонность . определяется куда будет вставлен
        movedElementClone.style = '';                                                         // элемент относительно элемента находящегося 
        const side = (ratio - Math.trunc(ratio)) <= 0.5 ? 'beforebegin' : 'afterend';           // на этой позиции

        inPosition.insertAdjacentElement(side, movedElementClone);
    }
}
class Task {
    constructor(taskData) {
        this.value = '';
        if (taskData.children.length > 0) {
            this.value = taskData.lastElementChild.value || '';
        }
    }
}

new ManageList();