let cardElement = document.querySelector("#card-element");
let paymentForm = document.querySelector("form");
const message = document.querySelector("#message");
const errors = document.querySelector("#errors");
const key = "pk_test_Y3zsBoi7U6kxfKFTb0U2NlzJ";
const stripe = Stripe(key);
const elements = stripe.elements();
const card = elements.create("card");
card.mount(cardElement);

(function attachEventListeners(){
    card.addEventListener("change", onCardChange);
    paymentForm.addEventListener("submit", submitPaymentForm);
})();

function onCardChange(event){
    errors.textContent = event.error
        ? event.error.message
        : "";
}

function submitPaymentForm(event){
    event.preventDefault();
    const formData = new FormData(event.target);
    stripe.createToken(card).then(result => {
        result.error
            ? displayError(result.error.message)
            : sendStripePayment({
                name: formData.get("name"),
                description: formData.get("description"),
                amount: formData.get("amount") * 100,
                token: result.token.id
            });
    });
}

function sendStripePayment(parameters){
    const url = "http://localhost:5000/charge";
    fetch(url, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify(parameters)
    }).then(response => response.json())
    .then(({data, error}) => {
        error
            ? displayMessage(error, true)
            : displayMessage(data.amount / 100, data.outcome.seller_message);
    }).catch(error => {
        displayMessage(error.message, true);
        throw new Error(error);
    });
}

function displayMessage(message, isError){
    isError
        ? errors.textContent = message
        : message.textContent = message;
}


