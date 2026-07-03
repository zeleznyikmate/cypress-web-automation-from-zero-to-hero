/*

You will need to create a JavaScript function, that will provide recommendations on which car a family should select 
when they make a reservation in a car rental service based on two variables provided: 
Family size and planned distance to drive. 

Requirements:

- Create two initial variables with the names "familySize" and "plannedDistanceToDrive". 
- Assign initial values to those variables, for example, 2 for "familySize" and 100 for "plannedDistanceToDrive" 
- Create a new function with the name "recommendedCar" and pass created variables as arguments of the function.

Write a logic of the function based on these conditions:
- if familySize is four or less and the planned distance to drive is less than 200 miles, 
the function should return "Tesla"
- if familySize is four or less and the planned distance to drive is 200 or more, 
the function should return "Toyota Camry"
- if familySize is more than four, the function should return "Minivan" 

*/

let familySize = 2;
let plannedDistanceToDrive = 200;

function recommendedCar(familySize, plannedDistanceToDrive) {

var cars = ["Minivan", "Toyota Camry", "Tesla"]

    if (familySize <= 4 && plannedDistanceToDrive < 200){
        return cars[2]
    } else if (familySize <= 4 && plannedDistanceToDrive >= 200){
        return cars[1]
    } else if (familySize > 4){
        return cars[0]
    }
}

console.log(recommendedCar(familySize, plannedDistanceToDrive));