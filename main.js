var cardDisplay = document.querySelector('.main__card--container');
var taskCard = document.querySelector('.task__card')
var makeTaskBtn = document.querySelector('.aside__task--btn');
var asideListDisplay = document.querySelector('.list__display--area');
var titleInput = document.querySelector('.aside__title--input');
var itemInput = document.querySelector('.aside__item--input');
var plusBtn = document.querySelector('.input__plus--img')

makeTaskBtn.addEventListener('click', createTaskList);
plusBtn.addEventListener('click', click)


function saveOnEnter(event) {
  if (event.key === "Enter") {
    event.target.blur();
    console.log('title')
    addListItems();
  }
}

function addListItems() {
  asideListDisplay.innerHTML = titleInput.value;
  asideListDisplay.innerHTML = itemInput.value;

}

function createTaskList() {
cardDisplay.insertAdjacentHTML('afterbegin', `<article class='task__card'>
<section class='task__card--header'>
  <p>${obj.title}</p>
</section>
<section class='card__body--list'>
${obj.listItems}
</section>
<section class='task__card--footer'>
  <p>URGENT</p>
  <P>DELETE</P>
</section>
</article>` )
};

function click() {
  console.log("hiiii")
}