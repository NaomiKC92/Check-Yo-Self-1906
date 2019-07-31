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
listDisplay.addEventListener('click', deleteCard);
cardDisplay.addEventListener('click', displayHandler)


function displayHandler(e) {
  if (e.target.classList[1] === 'card__urgent--img') markUrgent(e);
  if (e.target.className === 'item__unchecked') markChecked(e);
};

// function toggleChecked(event) {
//   var cardIndex = retrieveIndex(event);
//   var listIndex = getListIndex(event);
//   toDoList[cardIndex].listItems[listIndex].checked = !toDoList[cardIndex].listItems[listIndex].checked
// };

function markChecked(e) {
  var cardIndex = retrieveIndex(e);
  var listIndex = getListIndex(e);
  toDoList[cardIndex].listItems[listIndex].checked = !toDoList[cardIndex].listItems[listIndex].checked;
  e.target.src.includes('images/checkbox.svg') ?
    e.target.src = 'images/checkbox-active.svg' :
    e.target.src = 'images/checkbox.svg';
  toDoList[cardIndex].saveToStorage(toDoList);
};

function markUrgent(e) {
  var i = retrieveIndex(e);
  toDoList[i].urgent = !toDoList[i].urgent;
  var urgentImg = e.target;
  toDoList[i].urgent === false ? urgentImg.src = 'images/urgent.svg' : urgentImg.src = 'images/urgent-active.svg';
  changeCardColor(i, e);
  toDoList[i].saveToStorage(toDoList);
};

function changeCardColor(index, e) {
  toDoList[index].urgent === true ? handleClassList("add", e) : handleClassList("remove", e);
};

function handleClassList(method, e) {
  e.target.closest('article').classList[method]('card__yellow');
}

function getListIndex(event) {
  var cardIndex = retrieveIndex(event);
  var listIndex = toDoList[cardIndex].listItems.findIndex( function(task) {
    return task.id === event.target.id
  });
    return parseInt(listIndex)
};

function retrieveIndex(event) {
  var list = event.target.closest('.task__card');
  var listId = parseInt(list.dataset.id);
  return toDoList.findIndex(function(item) {return item.id === listId});
};

function deleteCard(event) {
  event.target.parentNode.remove();
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
    items += `<li> <img src=${eachItem.checked ? 'images/checkbox-active.svg' : 'images/checkbox.svg'} class='item__unchecked' id='${eachItem.id}'> ${eachItem.text} </li>`
  });
  return items;
};

function removeFromStorage() {
  var taskListid = getListId(event);
  toDoList = toDoList.filter( function(list) {return list.id !== taskListid;});
  var newArray = new List('title', 'listItems');
  newArray.saveToStorage(toDoList);
};

function deleteTaskCard(event) {
  if (event.target.classList[1] === 'card__delete--img') {
    var list = event.target.closest('.task__card');
    list.remove();
    removeFromStorage();
  };
};

function getListId(event) {
  return parseInt(event.target.closest('.task__card').dataset.id);
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