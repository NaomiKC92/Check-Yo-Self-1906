var cardDisplay = document.querySelector('.main__card--container');
var taskCard = document.querySelector('.task__card')
var makeTaskBtn = document.querySelector('.aside__task--btn');
var asideListDisplay = document.querySelector('.list__display--area');
var titleInput = document.querySelector('.aside__title--input');
var itemInput = document.querySelector('.aside__item--input');
var clearBtn = document.querySelector('.aside__clear--btn');
var listDisplay = document.querySelector('.displayed__list');
var listSection = document.querySelector('.list__display--area');
var plusBtn = document.querySelector('.input__plus--img')
var deleteBtn = document.querySelector('.card__delete--img');
var deleteItemImg = document.querySelector('.list__delete--img');
var toDoList = [];
var newTasks = [];

checkLocalStorage();
appendList();

makeTaskBtn.addEventListener('click', createTaskList);
plusBtn.addEventListener('click', pushListItems);
clearBtn.addEventListener('click', clearInputs);
cardDisplay.addEventListener('click', deleteTaskCard)
titleInput.addEventListener('keyup', enableMakeTaskBtn);
itemInput.addEventListener('keyup', enableMakeTaskBtn);
titleInput.addEventListener('keyup', enableClearBtn);
itemInput.addEventListener('keyup', enableClearBtn);
listSection.addEventListener('DOMCharacterDataModified', enableClearBtn);
listDisplay.addEventListener('click', handleDeleteTasks);
cardDisplay.addEventListener('click', displayHandler)


function displayHandler(event) {
  if (event.target.classList.contains('card__urgent--img')) {
    markUrgent(event);
  }

  if (event.target.className === 'item__unchecked') {
    markChecked(event)
  }
}

function getListIndex(event) {
  var cardIndex = retrieveIndex(event);
  var listIndex = toDoList[cardIndex].listItems.findIndex( function(task) {
    return task.id === event.target.id
  });
    return parseInt(listIndex)
};

function toggleChecked(event) {
  var cardIndex = retrieveIndex(event);
  var listIndex = getListIndex(event);
  toDoList[cardIndex].listItems[listIndex].checked = !toDoList[cardIndex].listItems[listIndex].checked
  console.log(toDoList[cardIndex].listItems[listIndex].checked)
}

function markChecked(event) {
  if (event.target.src.includes('images/checkbox.svg')) {
    event.target.src = 'images/checkbox-active.svg'
  } else {
    event.target.src = 'images/checkbox.svg'
  }
  toggleChecked(event);
}

function retrieveIndex(event) {
  var list = event.target.closest('.task__card');
  var listId = parseInt(list.dataset.id);
  var listIndex = toDoList.findIndex(function(item) {
    return item.id === listId
});
  return listIndex;
};

function markUrgent(event) {
  var i = retrieveIndex(event);
  toDoList[i].urgent = !toDoList[i].urgent;
  var urgentImg = event.target;
  var notUrgent = 'images/urgent.svg';
  var urgent = 'images/urgent-active.svg';
  toDoList[i].urgent === false ? urgentImg.src = notUrgent :
    urgentImg.src = urgent;
    changeCardColor();
  toDoList[i].saveToStorage(toDoList);
};

function changeCardColor() {
  var i = retrieveIndex(event);
  var taskCard = document.querySelector('.task__card');
  if (toDoList[i].urgent === true) {
    taskCard.classList.add('card__yellow')
  } else {taskCard.classList.remove('card__yellow')
  toDoList[i].saveToStorage(toDoList);
}
}

function handleDeleteTasks(event) {
  event.target.parentNode.remove();
};

function enableMakeTaskBtn() {
  if (itemInput.value !== '' && titleInput.value !== '') {
    makeTaskBtn.disabled = false;
  };
};

function enableClearBtn() {
  if (itemInput.value !== '' || titleInput.value !== '' || listDisplay.innerHTML !== '') {
    clearBtn.disabled = false;
  } else {
    clearBtn.disabled = true
  };
};

function pushListItems() {
  var newTask = {task: itemInput.value};
  newTasks.push(newTask);
  displayList();
  clearTaskInput();
};

function clearInputs() {
  itemInput.value = '';
  titleInput.value = '';
  listDisplay.innerHTML = '';
};

function clearTaskInput() {
  itemInput.value = ''
};

function getListItems() {
  var listArray = [];
  var asideTasks = document.querySelectorAll('.list__items');
  asideTasks.forEach( function(li) {
    listArray.push({text: li.innerText, checked: false, id: li.id});
  });
  return listArray;
};

function appendList() {
  for (var i = 0; i < toDoList.length; i++) {
    displayTaskList(toDoList[i]);
  };
};

function createTaskList() {
  var listArray = getListItems();
  var list = new List ({title: titleInput.value, listItems: listArray, id: Date.now()})
  toDoList.push(list);
  list.saveToStorage(toDoList)
  displayTaskList(list);
  clearInputs();
};

function checkLocalStorage() {
  if (JSON.parse(localStorage.getItem("toDoItems")) === null) {
    toDoList = []
  } else {
    toDoList = JSON.parse(localStorage.getItem("toDoItems")).map(function(element) {
      return new List(element)
    });
  };
};

function displayList() {
  var id = Date.now();
  if (itemInput.value !== '') {
  listDisplay.insertAdjacentHTML('beforeend', `
  <li class='list__items' id='${id}'><img src='images/delete.svg' class='list__delete--img'>${itemInput.value}</li>`)
  };
};

function addTasksToCard(list) {
  var items = '';
  list.listItems.forEach( function(eachItem) {
    items += `<li> <img src='images/checkbox.svg' class='item__unchecked' id='${eachItem.id}'> ${eachItem.text} </li>`
  });
  return items;
};

function deleteBoth() {
  var taskListid = getListId(event);
    toDoList = toDoList.filter( function(list) {
      return list.id !== taskListid;
    });
    var newArray = new List('title', 'listItems');
    newArray.saveToStorage(toDoList);
};

function deleteTaskCard(event) {
  if (event.target.classList[1] === 'card__delete--img') {
    var list = event.target.closest('.task__card');
    list.remove();
    deleteBoth();
  };
};

function getListId(event) {
  var id = parseInt(event.target.closest('.task__card').dataset.id);
  return id;
};

function displayTaskList(obj) {
cardDisplay.insertAdjacentHTML('afterbegin', `<article class='task__card' data-id=${obj.id}>
<section class='task__card--header'>
  <p>${obj.title}</p>
</section>
<section class='card__body--list'>
<ul>
${addTasksToCard(obj)}
</ul>
</section>
<section class='task__card--footer'>
  <div class='card__img--block'>
    <img src =${obj.urgent ? 'images/urgent-active.svg' :
    'images/urgent.svg'} class='card__footer--img card__urgent--img'>
    <p>URGENT</p>
  </div>
  <div class='card__img--block'>
    <img src='images/delete.svg' class='card__footer--img card__delete--img'>
    <P>DELETE</P>
  </div>
</section>
</article>` )
};