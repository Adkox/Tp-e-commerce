var timeout;

$("#cart").on({
  mouseenter: function () {
    $("#cart-dropdown").show();
  },
  mouseleave: function () {
    timeout = setTimeout(function () {
      $("#cart-dropdown").hide();
    }, 200);
  },
});


$("#cart-dropdown").on({
  mouseenter: function () {
    clearTimeout(timeout);
  },
  mouseleave: function () {
    $("#cart-dropdown").hide();
  },
});

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c[0] == " ") {
      c = c.substring(1);
    }

    if (c.indexOf(name) != -1) {
      if ("btoa" in window) return atob(c.substring(name.length, c.length));
    } else return c.substring(name.length, c.length);
  }
  return false;
}

var inCartItemsNum;
var cartArticles;


function cartEmptyToggle() {
  if (inCartItemsNum > 0) {
    $("#cart-dropdown .hidden").removeClass("hidden");
    $("#empty-cart-msg").hide();
  } else {
    $("#cart-dropdown .go-to-cart").addClass("hidden");
    $("#empty-cart-msg").show();
  }
}


inCartItemsNum = parseInt(
  getCookie("inCartItemsNum") ? getCookie("inCartItemsNum") : 0
);
cartArticles = getCookie("cartArticles")
  ? JSON.parse(getCookie("cartArticles"))
  : [];

cartEmptyToggle();


$("#in-cart-items-num").html(inCartItemsNum);


var items = "";
cartArticles.forEach(function (v) {
  items +=
    '<li id="' +
    v.id +
    '"><a href="' +
    v.url +
    '">' +
    v.name +
    '<br><small>Quantité : <span class="qt">' +
    v.qt +
    "</span></small></a></li>";
});

$("#cart-dropdown").prepend(items);

$(".add-to-cart").click(function () {

  var $this = $(this);
  var img = $this.attr("data-img");
  var name = $this.attr("data-name");
  var price = $this.attr("data-price");
  var qt = parseInt($("#A, #B, #C, #D").val());
  inCartItemsNum += qt;

 
  $("#in-cart-items-num").html(inCartItemsNum);

  var newArticle = true;


  cartArticles.forEach(function (v) {
  
    if (v.id == id) {
      newArticle = false;
      v.qt += qt;
      $("#" + id).html(
        img +
          name +
          '<br><small>Quantité : <span class="qt">' +
          v.qt +
          "</span></small></a>"
      );
    }
  });


  if (newArticle) {
    $("#cart-dropdown").prepend(
      '<li id="' +
        id +
        '"><a href="' +
        url +
        '">' +
        name +
        '<br><small>Quantité : <span class="qt">' +
        qt +
        "</span></small></a></li>"
    );

    cartArticles.push({
      img: img,
      name: name,
      price: price,
      qt: qt,
    });
  }


  saveCart(inCartItemsNum, cartArticles);


  cartEmptyToggle();
});

if (window.location.pathname == "/panier/") {
  var items = "";
  var subTotal = 0;
  var total;
  var weight = 0;

  
  cartArticles.forEach(function (v) {

    var itemPrice = v.price.replace(",", ".") * 1000;
    items +=
      '<tr data-img="' +
      v.name +
      "</a></td>\
             <td>" +
      v.price +
      '€</td>\
             <td><span class="qt">' +
      v.qt +
      '</span> <span class="qt-minus">–</span> <span class="qt-plus">+</span> \
             <a class="delete-item">Supprimer</a></td></tr>';
    subTotal += v.price.replace(",", ".") * v.qt;
  });

  subTotal = subTotal / 1000;


  $("#cart-tablebody").empty().html(items);
  $(".subtotal").html(subTotal.toFixed(2).replace(".", ","));


  $(".qt-plus").on("click", function () {
    var $this = $(this);

 
    var qt = parseInt($this.prevAll(".qt").html());
    var id = $this.parent().parent().attr("data-id");
    var artWeight = parseInt($this.parent().parent().attr("data-weight"));


    inCartItemsNum += 1;
    weight += artWeight;
    $this.prevAll(".qt").html(qt + 1);
    $("#in-cart-items-num").html(inCartItemsNum);
    $("#" + id + " .qt").html(qt + 1);

    cartArticles.forEach(function (v) {

      if (v.id == id) {
        v.qt += 1;

        subTotal =
          (subTotal * 1000 + parseFloat(v.price.replace(",", ".")) * 1000) /
          1000;
      }
    });

    $(".subtotal").html(subTotal.toFixed(2).replace(".", ","));
    saveCart(inCartItemsNum, cartArticles);
  });

  $(".qt-minus").click(function () {
    var $this = $(this);
    var qt = parseInt($this.prevAll(".qt").html());
    var id = $this.parent().parent().attr("data-id");
    var artWeight = parseInt($this.parent().parent().attr("data-weight"));

    if (qt > 1) {

      inCartItemsNum -= 1;
      weight -= artWeight;
      $this.prevAll(".qt").html(qt - 1);
      $("#in-cart-items-num").html(inCartItemsNum);
      $("#" + id + " .qt").html(qt - 1);

      cartArticles.forEach(function (v) {
     
        if (v.id == id) {
          v.qt -= 1;

    
          subTotal =
            (subTotal * 1000 - parseFloat(v.price.replace(",", ".")) * 1000) /
            1000;
        }
      });

      $(".subtotal").html(subTotal.toFixed(2).replace(".", ","));
      saveCart(inCartItemsNum, cartArticles);
    }
  });


  $(".delete-item").click(function () {
    var $this = $(this);
    var qt = parseInt($this.prevAll(".qt").html());
    var id = $this.parent().parent().attr("data-id");
    var artWeight = parseInt($this.parent().parent().attr("data-weight"));
    var arrayId = 0;
    var price;


    inCartItemsNum -= qt;
    $("#in-cart-items-num").html(inCartItemsNum);


    $this.parent().parent().hide(600);
    $("#" + id).remove();

    cartArticles.forEach(function (v) {
    
      if (v.id == id) {
   
        var itemPrice = v.price.replace(",", ".") * 1000;
        subTotal -= (itemPrice * qt) / 1000;
        weight -= artWeight * qt;
        cartArticles.splice(arrayId, 1);

        return false;
      }

      arrayId++;
    });

    $(".subtotal").html(subTotal.toFixed(2).replace(".", ","));
    saveCart(inCartItemsNum, cartArticles);
    cartEmptyToggle();
  });
}
