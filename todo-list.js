class List {
  constructor(obj) {
    this.title = obj.title;
    this.listItems = obj.listItems || [];
    this.id = obj.id;
    this.urgent = false;
  }

  saveToStorage(array) {
    localStorage.setItem("toDoItems", JSON.stringify(array))
  };


  deleteFromStorage(id) {
		localStorage.getItem("toDoItems", JSON.parse(ideas));
};


};