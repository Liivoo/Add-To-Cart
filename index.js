import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
	databaseURL : "https://realtime-database-9b409-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

//Ref Locations #1
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list")


// Functions
function clearShoppingListEl() {
	shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
	inputFieldEl.value = "";
}


//Button Event Listener
addButtonEl.addEventListener("click", function(){
	let inputValue = inputFieldEl.value;
	
	// PUSH : Ref Direction  | What To Push
	push(shoppingListInDB, inputValue);
	
	clearInputFieldEl();
	
})


// Bring From Database To Display
// onValue
onValue(shoppingListInDB, function(snapshot) {
	 
	 // Fixing the bug when no data is there in DB
	 if (snapshot.exists()){
	 	let itemsArray = Object.entries(snapshot.val())
	 	
	 	clearShoppingListEl();
	 	
	 	for (let i = 0; i < itemsArray.length; i++) {
	 	
	 		// Array with 2 items (Keys & Values)
	 		let currentItem = itemsArray[i]
	 	
	 		//So lets divide
	 		//0. Keys 
	 		let currentItemID = currentItem[0];
	 		//1. Values
	 		let currentItemValue = currentItem[1];
	 	
	 		appendItemToShoppingListEl(currentItem)
	 	}
	 } else {
	 	shoppingListEl.innerHTML = `<p style="margin:10px auto">No Items Here....Yet!</p>`
	 }
	 
	 
})


function appendItemToShoppingListEl(item) {
//	shoppingListEl.innerHTML += `<li>${itemValue}</li>`;

let itemID = item[0];
let itemValue = item[1];

//Using createElement Instead
let newEl = document.createElement("li")

 newEl.textContent = itemValue;
 
 shoppingListEl.append(newEl);
 
 
 // Click For Remove Function
 newEl.addEventListener("dblclick", function(){
  //Exact Location to remove
 	let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
 	
 	remove(exactLocationOfItemInDB)
 })
}
