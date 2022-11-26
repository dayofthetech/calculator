
/* use a class for the output fields  current and previous. */
/* will construct with elements stored above from querySelector */
class Calculator {

	/* When the user enters a digit after completing an operation explicitly with = then */
	/* the current operand should be cleared so the number entered is not concatenated to it */
	/* lastOpEqual is true if the last operation was ended by = sign */
	
	constructor(previousOperandTextElement, currentOperandTextElement) {
		this.previousOperandTextElement = previousOperandTextElement
		this.currentOperandTextElement = currentOperandTextElement
		this.lastOpEqual = false
		this.clear()
	}

	setEqualFlag () {
		console.log ("Equal Flag is true")
		this.lastOpEqual = true
	}
	
	/* Functions (methods) of the calculator class */
	/* Clear: clear all the different variables */
	clear() {
		this.currentOperand = ''
		this.previousOperand = ''
		this.operation = undefined
	}

	/* Delete: Clear a singe number */
	delete() {
		this.currentOperand = this.currentOperand.toString().slice(0, -1)
	}

	/* Every time a user clicks on a number to add to the display called  */
	appendNumber(number) {

	/* Check to ignore any repeat of dot character */
		if (number === '.' && this.currentOperand.includes('.')) return

		/* If the last operation ended with equal to clear current operand, staring all over */
		if (this.lastOpEqual) {
			this.currentOperand= ''
			this.lastOpEqual= false
		}
				
		/* Convert to string and concatenate */
		this.currentOperand = this.currentOperand.toString() + number.toString()
	}

	/* Controls what will happen anytime a user clicks on any operation button. (add, subtract, etc) */
	chooseOperation(operation) {
		if (this.currentOperand === '') return	/* don't do anything if current operand is empty, nothing to work on */
		if (this.previousOperand !== '') {		/* if there is a previous operand then finish the last operation     */
			this.compute()
		}
		this.operation = operation					/* The current operation                                    */
		this.previousOperand = this.currentOperand	/* If nothing in previous operand then move current into it */
		this.currentOperand = ''					/* Clear current operand                                    */
	}

	/* Takes the values inside your calculator and displays the result. */
	compute() {
		let computation
		const prev = parseFloat(this.previousOperand)		/* Convert previous operand from string to float */
		const current = parseFloat(this.currentOperand)		/* Convert current operand from string to flost */
		
		/* isNaN (Not A Number) */
		/* If either previous or current operand are not numbers than don't do anything */
		/* This should only happen if either are empty ? */
		if (isNaN(prev) || isNaN(current)) return
		
		/* Perform computation based on operation */
		switch (this.operation) {
		  case '+':
			computation = prev + current
			break
		  case '-':
			computation = prev - current
			break
		  case '*':
			computation = prev * current
			break
		  case '÷':
			computation = prev / current
			break
		  default:
			return
		}
		this.currentOperand = computation	/* Update current operand field in calculator to result */
		this.operation = undefined			/* Clear operation */
		this.previousOperand = ''			/* Clear the previous operand field in the calculator */
	}

	/* getDisplayNumber: Return string that represents the number passed in */
	getDisplayNumber(number) {
		const stringNumber = number.toString()							/* Convert number to string */
		const integerDigits = parseFloat(stringNumber.split('.')[0])	/* Get the integer (to left of dot) digits */
		const decimalDigits = stringNumber.split('.')[1]				/* Get the decimal digits (to right of dot) */
		let integerDisplay
		
		/* Integer digits */
		if (isNaN(integerDigits)) {			/* If not a number then set to blank */
			integerDisplay = ''
		} 
		else {
			/* returns a string with a language-sensitive representation of this number */
			integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
		}
		
		/* Decimal digits - should change to locale String? */
		if (decimalDigits != null) {
			return `${integerDisplay}.${decimalDigits}`
		/* if not decimal digits then just return the integer digits */
		} else {
			return integerDisplay
		}
  }
	
	/* updateDisplay: update the values inside of the output. */
	updateDisplay() {
		
		/* Current operand is just the number properly formatted */
	    this.currentOperandTextElement.innerText =
			this.getDisplayNumber(this.currentOperand)
		
		/* Previous operand */
		/* If there is an operation in progress then append to the previous operand number */
		if (this.operation != null) {
			this.previousOperandTextElement.innerText =
				`${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
		} 
		/* If no operation in progress then the previous operand is cleared */
		/* Only the current operand, the result of an operation or the first entry after clear, is presented */
		else {
			this.previousOperandTextElement.innerText = ''
		}
	}
}

/* store the elements in const vars for later reference. Use All when more than one element */
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

/* Create Calculator object */
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

/* Numbers: Set one event listener for all of the number buttons previously found with Select All */
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText.trim())
    calculator.updateDisplay()
  })
})

/* Operations: Set an event listener for all the operation buttons */
operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

/* Equals: Set an event listener for the = button */
equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
  console.log ("Set flag")
  calculator.setEqualFlag ()
})

/* Clear: Set an event listener for the clear button */
allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

/* Delete: Set an event listener for the delete button */
deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})


/* Enable keyboard entry */
document.addEventListener('keydown', function (event) {
  let patternForNumbers = /[0-9]/g;
  let patternForOperators = /[+\-*\/]/g
  if (event.key.match(patternForNumbers)) {
    event.preventDefault();
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
  }
  if (event.key === '.') {
    event.preventDefault();
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
  }
  if (event.key.match(patternForOperators)) {
    event.preventDefault();
    calculator.chooseOperation(event.key)
    calculator.updateDisplay()
  }
  if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculator.compute()
    calculator.updateDisplay()
  }
  if (event.key === "Backspace") {
    event.preventDefault();
    calculator.delete()
    calculator.updateDisplay()
  }
  if (event.key == 'Delete') {
    event.preventDefault();
    calculator.clear()
    calculator.updateDisplay()
  }

});