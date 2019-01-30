var menuItems = [
  {
    "id": 1,
    "name": "Crusty Garlic Focaccia with Melted Cheese",
    "courseType": "main course",
    "cost": "200.00"
  },
  {
    "id": 2,
    "name": "French Fries",
    "courseType": "appetizers" ,
    "cost": "100.00"
  },
  {
    "id": 3,
    "name": "Home Country Fries with Herbs and Chilli Flakes",
    "courseType": "appetizers",
    "cost": "105.00"
  },
  {
    "id": 4,
    "name": "French Fries with Cheese and Jalapenos",
    "courseType": "main course",
    "cost": "150.00"
  }
];

var tableItems = [
  {
    "id": 1,
    "totalBill": 0,
    "itemCount": 0,
    "itemsOrdered": {}
  },
  {
    "id": 2,
    "totalBill": 0,
    "itemCount": 0,
    "itemsOrdered": {}
  },
  {
    "id": 3,
    "totalBill": 0,
    "itemCount": 0,
    "itemsOrdered": {}
  }
];

var currentTableDiv; // stores the div element for which modal is opened
var currentTableId;// stores the id of currentTable

// render menu items:
function renderMenuItems(){
  let menuItemWrapper = document.getElementsByClassName("menu-item-wrapper")[0];
  for(item of menuItems){
    let div = document.createElement("div");
    div.setAttribute("class","menu-item card");
    div.setAttribute("draggable","true");
    div.setAttribute("ondragstart","handleDragStart(event)");
    div.setAttribute("id","item-" + item.id);
    let h2 = document.createElement("h2");
    h2.innerHTML = item.name;
    div.appendChild(h2);
    let p = document.createElement("p");
    p.innerHTML = item.cost;
    div.appendChild(p);
    menuItemWrapper.append(div);
  }
}
renderMenuItems();

// render tables
function renderTableItems(){
   let tableItemsWrapper = document.getElementsByClassName("tables-item-wrapper")[0];
   for(item of tableItems){
      let div = document.createElement("div");
      div.setAttribute("class","table-item card");
      div.setAttribute("ondrop","handleDrop(event)");
      div.setAttribute("ondragover","allowDrag(event)");
      div.setAttribute("id","table-" + item.id);
      div.setAttribute("onclick","showModal(this.id)");
      let h2 = document.createElement("h2");
      h2.innerHTML = "Table " + item.id;
      div.appendChild(h2);
      let p = document.createElement("p");
      let span1 = document.createElement("span");
      span1.setAttribute("id","total-bill");
      span1.innerHTML = "Rs " + item.totalBill +" |";
      p.appendChild(span1);
      let span2 = document.createElement("span");
      span2.setAttribute("id","item-count");
      span2.innerHTML = " Total item count : " + item.itemCount;
      p.appendChild(span2);
      div.appendChild(p);
      tableItemsWrapper.appendChild(div);
   }
}
renderTableItems();

// search by table name
function searchTables(){
    let filter = document.getElementById("table-search-bar").value;
    filter = filter.trim().toLowerCase();
    for(item of tableItems){
        let tableName = "table " + item.id;
        if(tableName.indexOf(filter) >=0){
          document.getElementById("table-" + item.id).style.display = "";
        }
        else {
          document.getElementById("table-" + item.id).style.display = "none";
        }
    }
  }


// search by dish name or by course type
function searchMenu(){
   let filter = document.getElementById("menu-search-bar").value;
   filter = filter.trim().toLowerCase();
   for(item of menuItems){
     if(item.name.toLowerCase().indexOf(filter) >=0 || item.courseType.toLowerCase().indexOf(filter) >=0){
       document.getElementById("item-" + item.id).style.display = "";
     }
     else {
       document.getElementById("item-" + item.id).style.display = "none";
     }
   }

}

// update table div conetents after modifying data in modal
function updateTable(){
  let p = currentTableDiv.getElementsByTagName("p")[0];
  let span1 = p.getElementsByTagName("span")[0];
  let span2 = p.getElementsByTagName("span")[1];
  span2.innerHTML = " Total item count : " + tableItems[currentTableId - 1].itemCount;
  span1.innerHTML = "Rs " + tableItems[currentTableId - 1].totalBill + " |";

}

function allowDrag(e){
  e.preventDefault();
}
// handle drop event
function handleDrop(e){
   e.preventDefault();
   let data = e.dataTransfer.getData("text");
   let menuItemId = parseInt(data.substring(5,6));
   let tableId = parseInt(e.currentTarget.id.substring(6,7));
   // The event.target is always the deepest element clicked, while event.currentTarget will point to the element to which the handler is bound, or to the element that the delegate selector matched.

   // check if the dish was already ordered
   let table = tableItems[tableId - 1];
   if(table.itemsOrdered.hasOwnProperty(menuItemId)){
    // alert("already ordered");
     table.itemsOrdered[menuItemId] += 1;
   }
   else{
     //alert("ordering first time");
     table.itemsOrdered[menuItemId] = 1;
   }
   table.itemCount += 1;
   // update table div after drag and drop
   let div = document.getElementById("table-" + table.id);
   let p = div.getElementsByTagName("p")[0];
   let span1 = p.getElementsByTagName("span")[0];
   let span2 = p.getElementsByTagName("span")[1];
   span2.innerHTML = " Total item count : " + table.itemCount;
   table.totalBill += parseFloat(menuItems[menuItemId - 1].cost);
   span1.innerHTML = "Rs " + table.totalBill + " |";

}
// set selected menuItemId in data transfer object
function handleDragStart(e) {
    e.dataTransfer.setData("text",e.target.id);
}

// render modal table element
function updateModalContents(){
  let id = currentTableId;
  let mainDiv = document.getElementsByClassName("modal-content-body")[0];
  mainDiv.innerHTML = "";
  let table = tableItems[id - 1];
  let count = 1;
  for(let key in table.itemsOrdered){ // for each item ordered
    let menuItemId = key;
    let servingCount = table.itemsOrdered[key];
    let name = menuItems[menuItemId - 1].name;
    let cost = menuItems[menuItemId - 1].cost;
    let tr = document.createElement("tr");
    let td = document.createElement("td"); //sno
    td.innerHTML = count;
    tr.appendChild(td);
    count++;
    td = document.createElement("td"); // name
    td.innerHTML = name;
    tr.appendChild(td);
    td = document.createElement("td"); // cost
    td.innerHTML = cost;
    tr.appendChild(td);
    td = document.createElement("td"); // serving
    let input = document.createElement("input");
    input.setAttribute("type","number");
    input.setAttribute("class","servings");
    input.setAttribute("min","0")
    input.setAttribute("id",menuItemId);
    input.setAttribute("value",servingCount);
    input.setAttribute("onchange","handleServingChange(this.value,this.id)");
    td.appendChild(input);
    tr.appendChild(td);
    td = document.createElement("td");
    let img = document.createElement("img");
    img.setAttribute("src","images/delete-icon.png");
    img.setAttribute("alt","delete icon");
    img.setAttribute("id",menuItemId);
    img.setAttribute("onclick","handleDelete(this.id)");
    td.appendChild(img);
    tr.appendChild(td);
    mainDiv.append(tr);
  }
  let p = document.getElementById("modal-cost");
  p.innerHTML = "Total : " + table.totalBill;
}

function showModal(id){
  let table = document.getElementById(id);
  currentTableDiv = table;
  let tableId = parseInt(id.substring(6,7));
  currentTableId = tableId;
  table.style.background = "#FF9A28";
  document.getElementsByClassName("modal-wrapper")[0].style.display = "block";
  document.getElementById("modal-heading").innerHTML = "Table - " + tableId+" | Order Details";
  updateModalContents();

}
// handle close button click
function closeModal(){
  currentTableDiv.style.background = "#fcfcfc";
  document.getElementsByClassName("modal-wrapper")[0].style.display = "none";
}

// end session and close modal, show the bill in alert
function generateBill(){
  currentTableDiv.style.background = "#fcfcfc";
  document.getElementsByClassName("modal-wrapper")[0].style.display = "none";
  let bill = "";
  bill += "Item name cost Qty\n";
  for(key in tableItems[currentTableId - 1].itemsOrdered){
    bill += menuItems[key - 1].name + " Rs ";
    bill += menuItems[key - 1].cost + " Qty ";
    bill += tableItems[currentTableId - 1].itemsOrdered[key]+"\n";
  }
  bill+= "Total Amount " + tableItems[currentTableId - 1].totalBill;
  alert(bill);
  // reset table contents:
  tableItems[currentTableId -1] = {
    "id": currentTableId,
    "totalBill": 0,
    "itemCount": 0,
    "itemsOrdered": {}
  };
  updateTable();
}

  // delete item with id passed as param for currently opened table
function handleDelete(key){
   let quantity = tableItems[currentTableId - 1].itemsOrdered[key];
   delete tableItems[currentTableId - 1].itemsOrdered[key];
   // now update total bill
   let amountToBeDeducted = parseFloat(menuItems[key - 1].cost) * quantity;
   tableItems[currentTableId - 1].totalBill -= amountToBeDeducted;
   // reduce the total items
   tableItems[currentTableId - 1].itemCount -= quantity;
   updateModalContents();
   updateTable();
}

// handle serving value changes for dish in modal
function handleServingChange(newValue,menuId){
  if(newValue == 0)
  {
    handleDelete(menuId);
    return;
  }
  let oldValue = tableItems[currentTableId - 1].itemsOrdered[menuId];
  tableItems[currentTableId - 1].itemsOrdered[menuId] = newValue;
  tableItems[currentTableId -1].itemCount += (newValue - oldValue);
  tableItems[currentTableId -1].totalBill += (newValue - oldValue)*(menuItems[menuId - 1].cost);
  updateTable();
  updateModalContents();

}
