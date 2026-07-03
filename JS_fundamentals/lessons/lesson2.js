//Concatenation and Interpolation
var price = 80
var itemName = "Table"
var messageToPrint = "The price for you "+itemName+" is "+price+" dollars" //Concatenation
var messageToPrint2 = `The price for you ${itemName} is ${price} dollars` //Interpolation 
console.log(messageToPrint);
console.log(messageToPrint2);