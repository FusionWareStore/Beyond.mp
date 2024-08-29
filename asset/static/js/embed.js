var getUniqueAttributeValue = function(productOnLoad, productUpdated, attributeName) {
    var values = [];

    for (let i = 0; i < productOnLoad.length; i++) {
        var element = productOnLoad[i];
        if (element.hasAttribute(attributeName)) {
            var value = element.getAttribute(attributeName);
            if (values.indexOf(value) === -1) {
                values.push(value);
            } else {
                values.splice(values.indexOf(value), 1);
            }
        }
    }

    for (let i = 0; i < productUpdated.length; i++) {
        var element = productUpdated[i];
        if (element.hasAttribute(attributeName)) {
            var value = element.getAttribute(attributeName);
            if (values.indexOf(value) === -1) {
                values.push(value);
            } else {
                values.splice(values.indexOf(value), 1);
            }
        }
    }

    if (values.length > 0) {
        return values;
    } else {
        return false;
    }
};


var updateCartQuantity = function (uniqid, increment) {

    var cartElement = document.querySelector('[data-sellix-cart]');

    if (cartElement) {

        var currentCart = cartElement.getAttribute('data-sellix-cart');
        currentCart = currentCart ? currentCart.split(',') : [];

        var inCart = currentCart.find(item => item.startsWith(`${uniqid}`));
        var inCartIndex = currentCart.findIndex(item => item.startsWith(`${uniqid}`));

        if (inCart) {
            var quantity = parseInt(inCart.split(':')[1]) || 1;

            quantity += increment;

            if (quantity <= 0) {
                currentCart.splice(inCartIndex, 1);
            } else {
                currentCart[inCartIndex] = `${uniqid}:${quantity}`;
            }

        } else {
            if (increment === 1) {
                currentCart.push(`${uniqid}:${1}`);
            }
        }

        cartElement.setAttribute('data-sellix-cart', currentCart.join(','));
    }
}


var initializeSellixEmbed = function () {

    if(!document.getElementById("sellix-container")) {
        var sellixContainerElem = document.createElement("div");
        sellixContainerElem.setAttribute("id", "sellix-container");
        document.body.appendChild(sellixContainerElem);
    }

    if(!document.getElementById("sellix-buttons-pointers-fix")) {
        var pointerFix = document.createElement("div");
        pointerFix.setAttribute("id", "sellix-buttons-pointers-fix");
        pointerFix.innerHTML = "<style>[data-sellix-product] * {\n    pointer-events: none;\n}\n[data-sellix-group] * {\n    pointer-events: none;\n}</style>";
        document.getElementById("sellix-container").appendChild(pointerFix);
    }

    var productButtons = document.querySelectorAll("[data-sellix-product]");
    var groupButtons = document.querySelectorAll("[data-sellix-group]");
    var cartButtons = document.querySelectorAll("[data-sellix-cart]");

    setTimeout(function waiter(repeat) {

        var hasProduct = document.querySelector("[data-sellix-product]");
        var hasGroup = document.querySelector("[data-sellix-group]");
        var hasCart = document.querySelector("[data-sellix-cart]");

        var productsOnLoad = document.querySelectorAll("[data-sellix-product]");
        var groupsOnLoad = document.querySelectorAll("[data-sellix-group]");
        var cartOnLoad = document.querySelectorAll("[data-sellix-cart]");

        if(getUniqueAttributeValue(productsOnLoad, productButtons, "data-sellix-product")) {
            repeat = false;
        }

        if(getUniqueAttributeValue(groupsOnLoad, groupButtons, "data-sellix-group")) {
            repeat = false;
        }

        if(getUniqueAttributeValue(cartOnLoad, cartButtons, "data-sellix-group")) {
            repeat = false;
        }


        if (((hasProduct || hasGroup || hasCart) && !repeat)) {

            var customStyles = document.getElementById("sellix-css");
            var onClickProduct = function (e, type) {

                var ID = e.target.getAttribute("data-sellix-" + type);
                if(!ID) {
                    return null;
                }
                var customFields = "?";
                var attributes = e.target.attributes;

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-css") > -1) {
                        customFields += "css=" + currentAttribute.nodeValue + "&";
                    }
                }

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-referral") > -1) {
                        customFields += "rcid=" + currentAttribute.nodeValue + "&";
                    }
                }

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-custom") > -1) {
                        customFields += currentAttribute.nodeName.replace("data-sellix-custom-", "custom-") + "=" + currentAttribute.nodeValue + "&"
                    }
                }

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-gateway") > -1) {
                        customFields += "gateway=" + currentAttribute.nodeValue + "&";
                    }
                }

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-blockchain") > -1) {
                        customFields += "blockchain=" + currentAttribute.nodeValue + "&";
                    }
                }

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-quantity") > -1) {
                        customFields += "quantity=" + currentAttribute.nodeValue + "&";
                    }
                }

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-variant") > -1) {
                        customFields += "variant=" + currentAttribute.nodeValue + "&";
                    }
                }

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-step") > -1) {
                        customFields += "step=" + currentAttribute.nodeValue + "&";
                    }
                }

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-email") > -1) {
                        customFields += "email=" + currentAttribute.nodeValue + "&";
                    }
                }

                for (var i = 0; i < attributes.length; i++) {
                    let currentAttribute = attributes[i];

                    if (currentAttribute.nodeName.indexOf("data-sellix-coupon") > -1) {
                        customFields += "coupon=" + currentAttribute.nodeValue + "&";
                    }
                }

                if (customStyles && !(customFields.indexOf('css=') > -1)) {
                    customFields += "css=" + customStyles.href;
                }

                var link = "https://embed.sellix.io/" + type + "/" + ID + customFields;
                var fallbackButton = '<div class="sellix-fallback-button-container"><a class="sellix-fallback-button" href="' + link + '" target="_blank" >Go to product</a></div>';

                var sellixModalElem = document.createElement("div");
                sellixModalElem.setAttribute("id", "sellix-modal-" + ID);
                sellixModalElem.setAttribute("style", "display:none; position:fixed; top: 0; left:0; width: 100%; height:100%; z-index:-1050");
                sellixModalElem.innerHTML =
                    '<div id="backdrop" class="sellix-backdrop"></div>' +
                    '<style>.sellix-iframe-placeholder { z-index: 1; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin: 0 auto; width: 500px; height: 600px; will-change: transform; transition: transform 0.5s ease; border-radius: 16px; background-size: 200%; background-position: left; animation-duration: 1.7s; animation-fill-mode: forwards; animation-iteration-count: infinite; animation-timing-function: linear; animation-name: placeholderAnimate; background: #f6f7f8; background: linear-gradient(to right, rgb(238 238 238 / 10%) 2%, rgb(221 221 221 / 20%) 18%, rgb(238 238 238 / 10%) 33%); background-size: 1300px; } @keyframes placeholderAnimate { 0% { background-position: -650px 0; } 100% { background-position: 650px 0; } } @media (max-width: 768px) { .sellix-iframe-placeholder { width: 100%; height: calc(100% - 4rem); top: 0; transform: translate(-50%, 4rem); border-radius: 1rem 1rem 0 0; } }  .sellix-iframe {\n    width:100%;\n    height:100%;\n    border:none;\n}\n\n.sellix-iframe-content {\n    height: 100%;\n}\n\n.sellix-iframe-wrapper {\n    top:20px;\n    margin:auto;\n    width: 100%;\n    height:100%;\n    z-index: 1;\n}\n\n.sellix-iframe-loader-container {\n    z-index: 1;\n    position: absolute;\n    top: 30%;\n    left: 50%;\n    transform: translate(-50%);\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n}\n\n.sellix-backdrop {\n    background: #00000075;\n    backdrop-filter: blur(3px);\n    width:100%;\n    height:100%;\n    position:absolute;\n}\n\n.sellix-fallback-button {\n    font-family: "Open Sans";\n    font-size: 14px;\n    font-weight: 600;\n    color: white;\n    text-decoration: none;\n}\n\n.sellix-fallback-button-container {\n    position: absolute;\n    z-index: 2;\n    display: none;\n    top: 50%;\n    height: 50px;\n    line-height: 40px;\n    max-height: 50px;\n    box-sizing: border-box;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    background: #613bea;\n    padding: .375rem .75rem;\n    border-radius: 3px;\n}</style>' +
                    '<div class="sellix-iframe-loader-container" style="display: none;">' +
                    '<img src="https://cdn.sellix.io/static/embed/loader.png" alt="Loader" class="sellix-iframe-loader" style="width: 35px;" />' +
                    '</div>' +
                    '<div class="sellix-iframe-placeholder"></div>'
                    + fallbackButton +
                    '<div class="sellix-iframe-wrapper">' +
                    '<div class="sellix-iframe-content">' +
                    '<iframe scrolling="auto" src="' + link + '" class="sellix-iframe" id="sellix-iframe" allow="payment" onerror="(e) => console.log(e)">' +
                    '</div>' +
                    '</div>';
                document.getElementById("sellix-container").appendChild(sellixModalElem);

                var sellixModalElemCreated = document.getElementById("sellix-modal-" + ID);
                sellixModalElemCreated.style.display = "flex";
                sellixModalElemCreated.style.zIndex = "99999";

                var iframeElem = document.querySelector("#sellix-iframe");

                iframeElem.addEventListener("load", function (e) {
                    setTimeout(() => {
                        document.querySelector(".sellix-iframe-loader").style.display = "none";
                        document.querySelector(".sellix-iframe-placeholder").style.display = "none";
                    }, 1000);
                });

                iframeElem.addEventListener("error", function (e) {
                    document.querySelector(".sellix-iframe-loader").style.display = "none";
                    document.querySelector(".sellix-fallback-button-container").style.display = "flex";
                });

                window.addEventListener("message", function (messageEvent) {
                    if(messageEvent.data === "close-embed") {
                        sellixModalElemCreated.style.display = "none";
                        sellixModalElemCreated.style.zIndex = "-1050";

                        if (sellixModalElemCreated.parentNode) {
                            sellixModalElemCreated.parentNode.removeChild(sellixModalElemCreated);
                        }
                    }
                }, false)

            };

            var eventFuncProduct = function (e) {
                onClickProduct(e, "product")
            };
            var eventFuncGroup = function(e) {
                onClickProduct(e, "group")
            };
            var eventFuncCart = function(e) {
                onClickProduct(e, "cart")
            };

            var replaceSelf = function(node) {
                const clone = node.cloneNode(true);
                node.replaceWith(clone);

                return clone;
            };

            for (var key = 0; key < productsOnLoad.length; key++) {
                var prdt = replaceSelf(productsOnLoad[key]);
                prdt.addEventListener("click", eventFuncProduct);
            }

            for (var key = 0; key < groupsOnLoad.length; key++) {
                var grp = replaceSelf(groupsOnLoad[key]);
                grp.addEventListener("click", eventFuncGroup)
            }

            for (var key = 0; key < cartOnLoad.length; key++) {
                var crt = replaceSelf(cartOnLoad[key]);
                crt.addEventListener("click", eventFuncCart);
            }

            if (document.querySelectorAll('[data-sellix-cart-add]')) {
                document.querySelectorAll('[data-sellix-cart-add]').forEach(addButton => {

                    var uniqid = addButton.getAttribute('data-sellix-cart-add');

                    if (uniqid) {
                        addButton.addEventListener('click', (event) => {
                            event.stopPropagation();
                            updateCartQuantity(uniqid, 1);
                        });
                    }
                });
            }

            if (document.querySelectorAll('[data-sellix-cart-remove]')) {
                document.querySelectorAll('[data-sellix-cart-remove]').forEach(removeButton => {

                    var uniqid = removeButton.getAttribute('data-sellix-cart-remove');

                    if (uniqid) {
                        removeButton.addEventListener('click', (event) => {
                            event.stopPropagation();
                            updateCartQuantity(uniqid, -1);
                        });
                    }

                });
            }


            var clearOld = function () {
                productButtons = document.querySelectorAll("[data-sellix-product]");
                groupButtons = document.querySelectorAll("[data-sellix-group]");
                cartButtons = document.querySelectorAll("[data-sellix-cart]");
            }
            clearOld();

            repeat = true;
        }


        if(hasProduct || hasGroup || hasCart) {
            setTimeout(waiter, 1000, repeat);
        } else {
            repeat = false;
            setTimeout(waiter, 1000, repeat);
        }

    }, 1000, false)
};

if (window.addEventListener) {
    window.addEventListener("load", initializeSellixEmbed, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", initializeSellixEmbed);
}

window.initializeSellixEmbed = initializeSellixEmbed;
