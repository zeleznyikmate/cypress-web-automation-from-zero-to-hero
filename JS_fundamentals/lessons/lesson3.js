//object

var customer = {
    firstName: 'John',
    lastName: 'Smith',
    cars: ["Volvo", "Toyota", "Tesla"]
}
// Dot notation
customer.firstName = "Mike"
// Bracket notation
customer['lastName'] = "Silver"
console.log(`${customer.firstName} ${customer.lastName}`)

//arrays
var car = ["Volvo", "Toyota", "Tesla"]
car[1] = "BMW"
console.log(car[1])
console.log(customer.cars[0])