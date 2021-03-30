'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = ''; // Clear the html

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i) {
    
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>
    `;
    
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate) / 100)
  .filter((int, i, arr) => {
    // console.log(arr);
    return int >= 1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function(accs) {
  accs.forEach(function(acc){
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map( word => word[0] )
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

const updateUI = function(acc) {
    // Display movements
    displayMovements(acc.movements);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);
};

///////////////////////////
//// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function(e){
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username ===  inputLoginUsername.value);
  // console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // Lose focus

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferTo.value = inputTransferAmount.value = '';

  if(
    amount > 0 &&
    receiverAcc && 
    currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if(
    currentAccount.username === inputCloseUsername.value 
    && currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
////////////////////////
// SIMPLE ARRAY METHODS

let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE() => From where we want to start
console.log('----SLICE()----');
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE() => Remove elements
console.log('----SPLICE()----');
// console.log(arr.splice(2));
arr.splice(-1);
arr.splice(1, 2);
console.log(arr);

// REVERSE() => Reverse the elements of an array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT() => Concatenation of two arrays
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN() => Join an array and the results it will be a String
console.log(letters.join(' - '));
*/

/*
//////////////////////////
// LOOPING ARRAYS FOREACH

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if(movement > 0)
    console.log(`Movement ${i + 1}: You deposited ${Math.abs(movement)}`); // Math.abs() removes the sign
    else
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
} 

console.log('--- FOREACH ---');

// movements.forEach(function(movement, index, array) {
movements.forEach(function(mov, i, arr) {
  if(mov > 0)
    console.log(`Movement ${i + 1}: You deposited ${Math.abs(mov)}`);
    else
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
});
// 0: function(200, 0, [200, 450, -400, 3000, -650, -130, 70, 1300])
// 1: function(450, 1, [200, 450, -400, 3000, -650, -130, 70, 1300])
// 2: function(-400, 2, [200, 450, -400, 3000, -650, -130, 70, 1300])
// ...
*/

/*
/////////////////////////////
// FOREACH WITH MAPS AND SETS

// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map) {
  console.log(`${key}: ${value}`);
});

// Set => There is no key in Sets only the values
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function(value, _, map) {
  console.log(`${value}: ${value}`);
});
*/

/////// PROJECT: "BANKIST" APP /////////
///////////////////////////////////////
// CREATING DOM ELEMENTS

/*
//////////////////////////////
// CODING CHALLENGE #1

/////// my VERSION
// const checkDogs = function(dogsJulia, dogsKate) {
//     console.log('--- EX1 ---');
//     const newJualiaDogs = dogsJulia;
//     console.log('Old: ', newJualiaDogs);
//     newJualiaDogs.splice(0, 1);
//     newJualiaDogs.splice(2, 2);
//     console.log('New: ', newJualiaDogs);
  
//     console.log('--- EX2 ---');
//     const dogsJuliaCorrected = newJualiaDogs.concat(dogsKate);
//     console.log(dogsJuliaCorrected);
  
//     console.log('--- EX3 ---');
//     dogsJuliaCorrected.forEach(function(dog, i){
//     if (dog >= 3)
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//         else if (dog < 3)
//           console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//       });
// };
    
////// his VERSION
const checkDogs = function(dogsJulia, dogsKate) {
  console.log('--- EX1 ---');
  const dogsJuliaCorrected = dogsJulia.slice();
  // dogsJulia.slice(1, 3);
  // Slice() here only selects the elements to the another array, if we use it without slice() it will be modified in the original array!
      
  console.log('Old: ', dogsJuliaCorrected);
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(2, 2);
  console.log('New: ', dogsJuliaCorrected);
      
    console.log('--- EX2 ---');
    const dogs = dogsJuliaCorrected.concat(dogsKate);
    console.log('Concatenation of the two arrays: ', dogs);
      
    console.log('--- EX3 ---');
    dogs.forEach(function(dog, i){
      if (dog >= 3)
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
      else if (dog < 3)
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    });
};
    
// checkDogs(dogsJulia, dogsKate); // If we set them to variables
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/

////////////////////////////////////////////
// DATA TRANSFORMATIONS MAP, FILTER, REDUCE

/*
// MAP METHOD
const eurToUsd = 1.1;

// const movementsUSD = movements.map(function(mov){
//   return mov * eurToUsd;
// });

const movementsUSD = movements.map( mov => mov * eurToUsd );

console.log(movements);
console.log(movementsUSD);

const movementUSDfor = [];
for (const mov of movements) {
  movementUSDfor.push(mov * eurToUsd);
}
console.log(movementUSDfor);

const movementsDescriptions = movements.map((mov, i) => 
  `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
);

console.log(movementsDescriptions);
*/

/*
// FILTER METHOD
const deposits = movements.filter(function(mov, i, arr) {
  return mov > 0;
});

const withdrawals = movements.filter(mov => mov < 0 );
console.log(movements);
console.log(deposits);
console.log(withdrawals);
*/

/*
// FILTER REDUCE
console.log(movements);

// ACC => Accumulator => SNOWBALL
// const balance = movements.reduce(function(acc, cur, i, arr) {
//   console.log(`Iteration ${i} : ${acc}`);
//   return acc + cur;
// }, 0); // 0 => Starter number (second argument)

const balance = movements.reduce((acc, cur) =>  acc + cur, 0); 
console.log(balance, ', With reduce()');

let balance2= 0;
for (const mov of movements) balance2 += mov;
console.log(balance2, 'With simple loop');

// Maximum value
const max = movements.reduce((acc, mov, i, arr) => {
  if (acc > mov) return acc; else return mov;
}, movements[0]);

console.log(`The maximum movement: ${max}`);

// Minimum value
const min = movements.reduce((acc, mov) => {
  if (acc < mov) return acc; else return mov;
}, movements[0]);
console.log(`The minimum movement: ${min}`);
*/

/*
///////////////////////
// CODING CHALLENGE #2

// const dogsAge = [5, 2, 4, 1, 15, 8, 3];
// const dogsAge = [16, 6, 10, 5, 6, 1, 4];

// my VERSION
// const calcul = dogsAge.map(function(age, i, arr) {
  //   if (age <= 2)
  //     return 2 * age;
  //   else (age > 2)
  //     return 16 + age * 4;
  // });
  // console.log('Calculating human age: ', calcul);
  
  // const filterLess18 = calcul.filter(function(age, i, arr){
    //     return age < 18;
    // });
    // const filter18 = calcul.filter(function(age, i, arr){
      //   return age >= 18;
      // });
      // console.log('Less than 18 years old human age: ', filterLess18);
      // console.log('At least 18 years old human age: ', filter18);
      
      // const average = filter18.reduce(function(acc, age, i, arr) {
        //   return acc + age / filter18.length;
        // }, filter18[0]);
// console.log('Average human age of all adult dogs: ', average);

// his VERSION
const calcAverageHumanAge = function(ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);
  console.log('Dogs ages in human age: ', humanAges);
  console.log('Adults dogs: ', adults);
  
  // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;  
  const average = adults.reduce((acc, age, i, arr) => acc + age / arr.length, 0);

  // we have 2 and 3 => (1- Method:) (2+3)/2 = 2.5
  // (2- Method:) 2/2+3/2 = 2.5
  
  return `Dogs ages average: ${average.toFixed(2)}`;
};

const calcAverageHumanAge_withChaining_Jonas = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const calcAverageHumanAge_withChaining = function(ages) {
  const average = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  
  return `Dogs ages average: ${average.toFixed(2)}`;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1,'\n',avg2);

console.log('--- WITH CHAINING: ---');
const avg11 = calcAverageHumanAge_withChaining_Jonas([5, 2, 4, 1, 15, 8, 3]);
const avg22 = calcAverageHumanAge_withChaining_Jonas([16, 6, 10, 5, 6, 1, 4]);
console.log(avg11,'\n',avg22);
*/

/*
///////////////////
// THE FIND METHOD

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

/*
//////////////////
// SOME AND EVERY

console.log(movements);

// EQUALITY
console.log(movements.includes(-130));

// SOME: CONDITION
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);

// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate Callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

/*
////////////////////
// FLAT AND FLATMAP

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// Flat
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// flatMap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);
*/

/*
//////////////////
// SORTING ARRAYS

// Strings
const owners = ['Adil', 'Mohammed', 'Farid', 'Mehdi'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);

// return < 0, A, B (keep order)
// return > 0, B, A (switch order)

// Ascending
// movements.sort((a, b) => {
//   if(a > b)
//     return 1;
//   if(a < b)
//     return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if(a > b)
//   return -1;
//   if(a < b)
//   return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

/*
//////////////////////////////////////////////
//// MORE WAYS OF CREATING AND FILLING ARRAYS

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty arrays + fill method
const x = new Array(7);
console.log(x);
console.log(x.map(() => 5));
x.fill(1, 3, 5);
x.fill(1);
console.log(x);

arr.fill(23, 4, 6);
console.log(arr);

// Array.from
const y = Array.from({length: 7}, () => 1);
console.log(y);

const z = Array.from({length: 7}, (_, i) => i +1);
console.log(z);


labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', '')));
  
  console.log(movementsUI);

  const movementsUI2 = [...querySelectorAll('.movements__value')]; // And after we do the mapping but array.from is more nicer with two arguments
});

const a = Array.from({length: 50}, (_, i) => Number((Math.random(i) * 100).toFixed(0)));
// console.log(a);
*/

////////////////////////
//// CODING CHALLENGE #4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28))); 
console.log(dogs);

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(`Sarah's dog is eating too ${dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'}!`);

// dogSarah.recFood > dogSarah.curFood ? console.log('Sarah\'s dog is eating much more! 👍') : console.log('Sarah\'s dog is eating too little! 👎');

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.recFood > dog.curFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.recFood < dog.curFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.
const strEatMuch = ownersEatTooMuch.join(' and ') + '\'s dogs eat to much!';
console.log(strEatMuch);

const strEatLittle = ownersEatTooLittle.join(' and ') + '\'s dogs eat to little!';
console.log(strEatLittle);

// 5.
console.log('See if there is a dog who eating EXACTLY the amount food recommended: ', dogs.some(dog => dog.curFood === dog.recFood));

// 6.
const checkEatingOkay = dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log('See if there is any dog eating an OKAY amount of food recommended: ', dogs.some(checkEatingOkay));

// 7.
console.log(dogs.filter(checkEatingOkay));

// 8.
// Sort it by recommended food portion in an ascending order
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);

