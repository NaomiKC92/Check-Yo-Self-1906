var cardDisplay = document.querySelector('.main__card--container');
var taskCard = document.querySelector('.task__card')
var makeTaskBtn = document.querySelector('.aside__task--btn');
var asideListDisplay = document.querySelector('.list__display--area');
var titleInput = document.querySelector('.aside__title--input');
var itemInput = document.querySelector('.aside__item--input');
var clearBtn = document.querySelector('.aside__clear--btn');
var listDisplay = document.querySelector('.displayed__list');
// var listSection = document.querySelector('.list__display--area');
var plusBtn = document.querySelector('.input__plus--img')
var deleteBtn = document.querySelector('.card__delete--img') 
var toDoList = [];
var newTasks = [];

checkLocalStorage();
appendList();

makeTaskBtn.addEventListener('click', createTaskList);
plusBtn.addEventListener('click', pushListItems);
clearBtn.addEventListener('click', clearInputs);
cardDisplay.addEventListener('click', deleteTaskCard)

function pushListItems() {
  var newTask = {task: itemInput.value};
  newTasks.push(newTask);
  displayList();
  clearTaskInput();
}

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
    listArray.push({text: li.innerHTML, checked: false, id: li.id});
  });
  return listArray;
};
  
function displayList() {
    var id = Date.now();
    listDisplay.insertAdjacentHTML('beforeend', `
    <li class='list__items' id='${id}'>${itemInput.value}</li>`)
};

function appendList() {
  for (var i = 0; i < toDoList.length; i++) {
    displayTaskList(toDoList[i]);
  }
}

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

function addTasksToCard(list) {
  var items = '';
  list.listItems.forEach( function(eachItem) {
    items += `<li> <img src='images/checkbox.svg' class='card__unchecked'> ${eachItem.text} </li>`
  });
  return items;
};

function deleteTaskCard(event) {
  if (event.target.classList[1] === 'card__delete--img') {
    var list = event.target.closest('.task__card');
    list.remove();
  }
}

function getListId(event) {
  var id = parseInt(event.target.closest('.task__card').dataset.id);
  return id;
}

function displayTaskList(obj) {
cardDisplay.insertAdjacentHTML('afterbegin', `<article class='task__card'>
<section class='task__card--header' data-id=${obj.id}>
  <p>${obj.title}</p>
</section>
<section class='card__body--list'>
<ul>
${addTasksToCard(obj)}
</ul>
</section>
<section class='task__card--footer'>
  <img src='images/urgent.svg' class='card__footer--img'>
  <p>URGENT</p>
  <img src='images/delete.svg' class='card__footer--img card__delete--img'>
  <P>DELETE</P>
</section>
</article>` )
};