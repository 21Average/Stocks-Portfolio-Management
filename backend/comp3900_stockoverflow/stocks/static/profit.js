function profit(){
    var shares = document.getElementById('buying_quality').value;
    var buying_price = document.getElementById('bbuying_p').value;
    var current_price = document.getElementById('current_price').value;

    document.getElementById("profit").innerHTML = (buying_price-current_price)*shares

}