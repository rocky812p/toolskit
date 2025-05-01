document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('calc-display');
    const buttons = document.querySelectorAll('.calc-btn');
    let currentInput = '';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;

    // Add click event to all calculator buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value >= '0' && value <= '9' || value === '.') {
                handleNumber(value);
            } else if (['+', '-', '*', '/'].includes(value)) {
                handleOperator(value);
            } else if (value === '=') {
                handleEquals();
            } else if (value === 'C') {
                clearDisplay();
            }

            updateDisplay();
        });
    });

    // Handle number input
    function handleNumber(num) {
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }
        // Prevent multiple decimal points
        if (num === '.' && currentInput.includes('.')) return;
        // Prevent leading zeros
        if (num === '0' && currentInput === '0') return;
        // Replace leading zero with number
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else {
            currentInput += num;
        }
    }

    // Handle operator input
    function handleOperator(op) {
        if (currentInput === '') return;
        if (previousInput !== '') {
            handleEquals();
        }
        operation = op;
        previousInput = currentInput;
        shouldResetDisplay = true;
    }

    // Handle equals
    function handleEquals() {
        if (currentInput === '' || previousInput === '' || !operation) return;

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }

        // Format the result
        currentInput = result.toString();
        operation = null;
        previousInput = '';
        shouldResetDisplay = true;
    }

    // Clear calculator
    function clearDisplay() {
        currentInput = '';
        previousInput = '';
        operation = null;
        shouldResetDisplay = false;
    }

    // Update display
    function updateDisplay() {
        display.value = currentInput || '0';
    }

    // Initialize display
    updateDisplay();

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            handleNumber(e.key);
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            handleOperator(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            handleEquals();
        } else if (e.key === 'Escape') {
            clearDisplay();
        }
        updateDisplay();
    });
}); 