let stripe = Stripe('pk_test_Y3zsBoi7U6kxfKFTb0U2NlzJ');
let elements = stripe.elements();
let style = {
    base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

let card = elements.create('card', { style: style });

card.mount('#card-element');

card.addEventListener('change', function (event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

let form = document.getElementById('payment-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    stripe.createToken(card).then(function (result) {
        if (result.error) {
            let errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            stripeTokenHandler(result.token);
        }
    });
});

document.getElementById('amount').addEventListener('blur', function () {
    if (amount.value <= 0) {
        document.getElementById('error').innerText = "Amount needs to be greater than 0"
    } else if (amount.value > 387) {
        document.getElementById('error').innerText = "Amount should be $387 or less"
    } else if (amount.value > 0 && amount.value < 387) {
        document.getElementById('error').innerText = ""
    }
});

function stripeTokenHandler(token) {
    let form = document.getElementById('payment-form');
    let hiddenInput = document.createElement('input');
    let amount = document.getElementsByName('amount')
    let amountCharged = amount.value
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    hiddenInput.setAttribute('amount', amountCharged);
    form.appendChild(hiddenInput);
    form.submit();
};


