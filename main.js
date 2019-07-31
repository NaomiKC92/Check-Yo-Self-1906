var cardDisplay = document.querySelector('.main__card--container');
var taskCard = document.querySelector('.task__card')
var makeTaskBtn = document.querySelector('.aside__task--btn');
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
insertMsg();

makeTaskBtn.addEventListener('click', createTaskList);
plusBtn.addEventListener('click', pushListItems);
clearBtn.addEventListener('click', clearInputs);
cardDisplay.addEventListener('click', deleteTaskCard)
titleInput.addEventListener('keyup', enableMakeTaskBtn);
itemInput.addEventListener('keyup', enableMakeTaskBtn);
titleInput.addEventListener('keyup', enableClearBtn);
itemInput.addEventListener('keyup', enableClearBtn);
listSection.addEventListener('DOMCharacterDataModified', enableClearBtn);
listDisplay.addEventListener('click', deleteListItem);
cardDisplay.addEventListener('click', displayHandler)


function displayHandler(e) {
  if (e.target.classList[1] === 'card__urgent--img') markUrgent(e);
  if (e.target.className === 'item__unchecked') markChecked(e);
};

function markChecked(e) {
  var cardIndex = retrieveIndex(e);
  var listIndex = getListIndex(e);
  toDoList[cardIndex].listItems[listIndex].checked = !toDoList[cardIndex].listItems[listIndex].checked;
  e.target.src.includes('Images/checkbox.svg') ?
    e.target.src = 'Images/checkbox-active.svg' :
    e.target.src = 'Images/checkbox.svg';
  toDoList[cardIndex].saveToStorage(toDoList);
};

function markUrgent(e) {
  var i = retrieveIndex(e);
  toDoList[i].urgent = !toDoList[i].urgent;
  var urgentImg = e.target;
  toDoList[i].urgent === false ? urgentImg.src = 'Images/urgent.svg' : urgentImg.src = 'Images/urgent-active.svg';
  changeCardColor(i, e);
  toDoList[i].saveToStorage(toDoList);
};

function changeCardColor(index, e) {
  toDoList[index].urgent === true ? handleClassList("add", e) : handleClassList("remove", e);
};

function handleClassList(method, e) {
  e.target.closest('article').classList[method]('card__yellow');
}

function getListIndex(e) {
  var cardIndex = retrieveIndex(e);
  var listIndex = toDoList[cardIndex].listItems.findIndex( function(task) {
    return task.id === e.target.id
  });
    return parseInt(listIndex)
};

function retrieveIndex(e) {
  var list = e.target.closest('.task__card');
  var listId = parseInt(list.dataset.id);
  return toDoList.findIndex(function(item) {return item.id === listId});
};

function deleteListItem(e) {
  e.target.parentNode.remove();
};

function enableMakeTaskBtn() {
  (!itemInput.value || !titleInput.value) ? makeTaskBtn.disabled = true : makeTaskBtn.disabled = false;
};

function enableClearBtn() {
  (itemInput.value || titleInput.value || listDisplay.innerHTML)? clearBtn.disabled = false : clearBtn.disabled = true
};

function pushListItems() {
  var newTask = {task: itemInput.value};
  newTasks.push(newTask);
  displayList();
  itemInput.value = '';
};

function clearInputs() {
  itemInput.value = '';
  titleInput.value = '';
  listDisplay.innerHTML = '';
};

function getListItems() {
  var listArray = [];
  var asideTasks = document.querySelectorAll('.list__items');
  asideTasks.forEach( function(listItem) {
    listArray.push({text: listItem.innerText, checked: false, id: listItem.id});
  });
  return listArray;
};

function appendList() {
  for (var i = 0; i < toDoList.length; i++) displayTaskList(toDoList[i]);
};

function createTaskList() {
  var listArray = getListItems();
  var list = new List ({title: titleInput.value, listItems: listArray, id: Date.now()})
  toDoList.push(list);
  list.saveToStorage(toDoList)
  displayTaskList(list);
  clearInputs();
  removeMsg();
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
  <li class='list__items' id='${id}'><img src='Images/delete.svg' class='list__delete--img'>${itemInput.value}</li>`)
  };
};

function addTasksToCard(list) {
  var items = '';
  list.listItems.forEach( function(eachItem) {
    items += `<li> <img src=${eachItem.checked ? 'Images/checkbox-active.svg' : 'Images/checkbox.svg'} class='item__unchecked' id='${eachItem.id}'> ${eachItem.text} </li>`
  });
  return items;
};

function removeFromStorage() {
  var taskListid = getListId(e);
  toDoList = toDoList.filter( function(list) {return list.id !== taskListid;});
  var newArray = new List('title', 'listItems');
  newArray.saveToStorage(toDoList);
};

function deleteTaskCard(e) {
  if (e.target.classList[1] === 'card__delete--img') {
    var list = e.target.closest('.task__card');
    list.remove();
    insertMsg();
    removeFromStorage();
  };
};

function getListId(e) {
  return parseInt(e.target.closest('.task__card').dataset.id);
};

function removeMsg() {
  var msg = document.querySelector(".task__msg");
  if (msg) {
    msg.remove(msg)
  }
}

function insertMsg() {
  if (cardDisplay.innerHTML === '' || cardDisplay.innerHTML === ' ') {
    cardDisplay.insertAdjacentHTML('afterbegin',
      `<article class='task__msg'>
    <p class='task__msg--text'>Add To Do Lists Here</p>
  </article>`)
  };
};


function displayTaskList(obj) {
cardDisplay.insertAdjacentHTML('afterbegin', `<article class='task__card ${obj.urgent ? 'card__yellow' : 'null'}' data-id=${obj.id}>
<section class='task__card--header'>
  <p>${obj.title}</p>
</section>
<section class='card__body--list ${obj.urgent ? 'card__body--yellow' : 'null'}'>
<ul>
${addTasksToCard(obj)}
</ul>
</section>
<section class='task__card--footer'>
  <div class='card__img--block'>
    <img src =${obj.urgent ? 'Images/urgent-active.svg' :
    'Images/urgent.svg'} class='card__footer--img card__urgent--img'>
    <p>URGENT</p>
  </div>
  <div class='card__img--block'>
    <img src='Images/delete.svg' class='card__footer--img card__delete--img'>
    <P>DELETE</P>
  </div>
</section>
</article>` )
};