document.addEventListener('DOMContentLoaded', () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const amount = document.getElementById('amount');
    const convertBtn = document.getElementById('convert-btn');
    const result = document.getElementById('result');

    // Mock exchange rates (for demo purposes)
    const exchangeRates = {
        USD: {
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.0
        },
        EUR: {
            USD: 1.18,
            GBP: 0.86,
            JPY: 129.5
        },
        GBP: {
            USD: 1.37,
            EUR: 1.16,
            JPY: 150.0
        },
        JPY: {
            USD: 0.0091,
            EUR: 0.0077,
            GBP: 0.0067
        }
    };

    // Convert currency
    function convertCurrency() {
        if (!amount.value || amount.value <= 0) {
            result.textContent = 'Please enter a valid amount';
            return;
        }

        const from = fromCurrency.value;
        const to = toCurrency.value;
        const value = parseFloat(amount.value);

        if (from === to) {
            result.textContent = `${value.toFixed(2)} ${from}`;
            return;
        }

        const rate = exchangeRates[from][to];
        const converted = value * rate;
        result.textContent = `${value.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to}`;

        // Add animation
        result.classList.add('animate-fade-in');
        setTimeout(() => {
            result.classList.remove('animate-fade-in');
        }, 500);
    }

    // Event listeners
    convertBtn.addEventListener('click', convertCurrency);
    amount.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });

    // Input validation
    amount.addEventListener('input', () => {
        const value = amount.value;
        if (value < 0) amount.value = 0;
    });

    // Swap currencies
    function swapCurrencies() {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        if (amount.value) convertCurrency();
    }

    // Add swap button dynamically
    const swapBtn = document.createElement('button');
    swapBtn.innerHTML = '<i class="fas fa-exchange-alt"></i>';
    swapBtn.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-200';
    swapBtn.addEventListener('click', swapCurrencies);

    // Insert swap button between currency selects
    const currencyContainer = document.querySelector('.currency-container');
    const selectsContainer = currencyContainer.querySelector('.grid');
    selectsContainer.style.position = 'relative';
    selectsContainer.appendChild(swapBtn);
}); 