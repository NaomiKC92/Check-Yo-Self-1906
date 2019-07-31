class List {
  constructor(obj) {
    this.title = obj.title;
    this.listItems = obj.listItems || [];
    this.id = obj.id;
    this.urgent = obj.urgent || false;
  }

  saveToStorage(array) {
    localStorage.setItem("toDoItems", JSON.stringify(array))
  };

  deleteFromStorage() {
    localStorage.getItem("toDoItems", JSON.parse(ideas));
  };

  updateToDo() {

  };

  updateTasks() {

  };

};