/* Checkout page. */
var checkoutPage = {
    isCurrentPage: (location.pathname == "/one-page-checkout.asp") ||
        (location.pathname.indexOf("/one-page-checkout.asp") != -1),

    defaultAnnouncements: {
        main: "Please update the following information as mush as you can, " +
            "our professional sales will contact you to finalize the details in 1 business day!",
        shipping: "Select any shipping method for now " +
            "and our customer service will contact you for shipping details within 24 hours!",
        payment: "Select any payment method for now " +
            "and our customer service will contact you for payment details within 24 hours!"
    },

    setup: function(event) {
        var thisCheckoutPage = this;
        $('#v65-onepage-header').livequery(function() {
            thisCheckoutPage.reStructure();
            thisCheckoutPage.addAnouncement();
            $('#v65-onepage-CheckoutForm').ready(thisCheckoutPage.setupFormEvents.bind(thisCheckoutPage));
        });
    },

    reStructure: function() {
        // Swap address table and cart table.
        var addressTable = document.getElementById('v65-onepage-ContentTable');
        var cartTable = document.getElementById('table_checkout_cart0');
        cartTable.parentNode.insertBefore(cartTable, addressTable);

        // Move shipping address and cost table outside.
        var shippingCostTable = document.getElementById('v65-onepage-ShippingCostParent');
        cartTable.parentNode.appendChild(shippingCostTable);

        // Move payment table outside.
        var paymentTable = document.getElementById('v65-onepage-payment-details-parent-table');
        cartTable.parentNode.appendChild(paymentTable);

        // Separate total cell in cart table.
        var totalRow = document.getElementById('v65-onepage-ShippingCostTotalRow');
        var totalValue = document.getElementById('v65-onepage-total-value-cell');
        var totalCell = document.createElement("TD");
        var totalSpan = $('#TotalsTotalTD');
        totalCell.innerText = "Total:";
        totalCell.style.color = "#111";
        totalCell.style.fontSize = "20px";
        totalRow.insertBefore(totalCell, totalValue);
        totalSpan.text(totalSpan.text().slice(totalSpan.text().indexOf('$')))

        // Remove line break in tables.
        $("#TotalsDivContainer br").remove();
        $("#table_checkout_cart0 br").remove();
        $("#v65-onepage-ContentTable br").remove();
        $("#v65-onepage-payment-details-parent-table br").remove();

        // Remove unused tr.
        $('#v65-onepage-Billing tr:nth-last-child(-n+3)').remove();

        // Register same billing address button.
        $('#v65-onepage-shippingParent-row').hide();
        $('#v65-onepage-savedShipping-row').hide();
        $('#v65-SameAsBilling').change(function(event) {
            if (event.target.checked) {
                $('#v65-onepage-shippingParent-row').hide();
                $('#v65-onepage-savedShipping-row').hide();
            } else {
                $('#v65-onepage-shippingParent-row').show();
                $('#v65-onepage-savedShipping-row').show();
            }
        });

        // Hide cell if no saved addresses.
        if ($('#v65-onepage-saved-billing-table').length == 0) {
            $('#v65-onepage-Detail > tbody > tr.v65-onepage-SavedLocations').hide();
        }
        if ($('#v65-onepage-saved-shipping-table').length == 0) {
            $('#v65-onepage-savedShipping-row').hide();
        }

        // Add bottom place order btn.
        var theForm = document.getElementById('v65-onepage-CheckoutForm');

        var clearDiv = document.createElement('DIV');
        clearDiv.id = 'tablesClear';
        theForm.appendChild(clearDiv);

        var bottomSubmitBtn = document.getElementById('btnSubmitOrder').cloneNode();
        var bottomPriceText = document.createTextNode('Total: ' + $('#TotalsTotalTD').text());

        var btnDiv = document.createElement('DIV');
        btnDiv.id = 'btnSubmitOrderBottom';
        btnDiv.appendChild(bottomSubmitBtn);
        btnDiv.appendChild(bottomPriceText);
        theForm.appendChild(btnDiv);

        this.tranlsateToSpanish();
    },

    tranlsateToSpanish: function() {
        // Change place order btn if spanish.
        if (document.documentElement.lang == 'es') {
            var placeOrderBtn = 'https://linzytoys.us/v/vspfiles/assets/images/buttons/order_es.gif'
            var savedBillingAddr = 'Las direcciones de facturación Guardadas';
            var shipToBilling = ' Enviar a mi dirección de facturación';
            var savedShipAddr = 'Las direcciones de envío Guardadas';
            var billingInfo = 'DATOS DE FACTURACIÓN';
            var shippingInfo = 'INFORMACIÓN DE ENVÍO';
            var payment = 'PAGO';
            var yourOrder = 'Su pedido';
            var edit = 'Editar';
            document.getElementById('btnSubmitOrder').src = placeOrderBtn;
            $('#btnSubmitOrderBottom #btnSubmitOrder')[0].src = placeOrderBtn;
            $('#v65-onepage-saved-billing-table > tbody > tr > td > font').text(savedBillingAddr);
            $('#v65-sameasbilling-checkbox-row > td')[0].lastChild.nodeValue = shipToBilling;
            $('#v65-onepage-saved-shipping-table > tbody > tr > td > font').text(savedShipAddr);
            $('<style>#content_area #billing-header .v65-onepage-headerShort::before{content: "'+ billingInfo + '}"</style>').appendTo('head');
            $('<style>#content_area #shipping-header .v65-onepage-headerShort::before{content: "'+ shippingInfo + '}"</style>').appendTo('head');
            $('<style>#content_area #v65-checkout-payment-header .v65-onepage-headerShort::before{content: "'+ payment + '"}</style>').appendTo('head');
            $('#v65-onepage-cartsummary-label').text(yourOrder);
            $('#v65-onepage-editcart').text(edit);
        }
    },

    addAnouncement: function() {
        /* Get announcements texts. */
        var mainAnnouncement = $('meta[name="checkout-announce-main"]').attr('content') ||
                                this.defaultAnnouncements.main;
        var shippingMethodAnnouncement = $('meta[name="checkout-announce-shipping"]').attr('content') ||
                                this.defaultAnnouncements.shipping;
        var paymentMethodAnnouncement = $('meta[name="checkout-announce-payment"]').attr('content') ||
                                this.defaultAnnouncements.payment;

        var addressTable = document.getElementById('v65-onepage-ContentTable');

        // Add address announcement.
        var announceDiv = document.createElement("DIV");
        announceDiv.innerText = mainAnnouncement;
        announceDiv.id = 'billing-info-announcement';
        addressTable.parentNode.insertBefore(announceDiv, addressTable);

        // Change error msg location.
        var errorDiv = document.getElementById('FormatListofErrorsDiv');
        addressTable.parentNode.insertBefore(errorDiv, addressTable);

        // Add shipping method title and expl.
        var shippingMethodTitle = document.createElement('DIV');
        shippingMethodTitle.id = "shipping-method-title";
        shippingMethodTitle.innerText = "Shipping Method:"

        var shippingMethodExpl = document.createElement('DIV');
        shippingMethodExpl.id = "shipping-method-expl";
        shippingMethodExpl.innerText = shippingMethodAnnouncement;

        var shippingMethodSelect = document.getElementById('DisplayShippingSpeedChoicesTD');
        shippingMethodSelect.parentNode.parentNode.insertBefore(shippingMethodTitle, shippingMethodSelect.parentNode);
        shippingMethodSelect.parentNode.parentNode.appendChild(shippingMethodExpl);

        // Add payment method expl.
        var paymentMethodExpl = document.createElement('DIV');
        paymentMethodExpl.id = "payment-method-expl";
        paymentMethodExpl.innerText = paymentMethodAnnouncement;

        var paymentRow = document.getElementById('v65-onepage-payment-details-parent-row');
        paymentRow.parentNode.appendChild(paymentMethodExpl);
    },

    // Same as copy_billing_to_shipping except not reCalculateShipping in the end.
    myCopyB2S: function() {
        var Form = document.OnePageCheckoutForm

        ChosenCopyElement(Form.ShipCountry, Form.BillingCountry.value);

        if (typeof(v2makeSel) == 'function') {
            v2makeSel(document.getElementById('ShipCountry'));
        }

        ChosenCopyElement(Form.ShipFirstName, Form.BillingFirstName.value);
        ChosenCopyElement(Form.ShipLastName, Form.BillingLastName.value);
        ChosenCopyElement(Form.ShipCompanyName, Form.BillingCompanyName.value);
        ChosenCopyElement(Form.ShipAddress1, Form.BillingAddress1.value);
        ChosenCopyElement(Form.ShipAddress2, Form.BillingAddress2.value);
        ChosenCopyElement(Form.ShipCity, Form.BillingCity.value);
        ChosenCopyElement(Form.ShipState, Form.BillingState.value);

        if (Form.ShipState_dropdown.length > 0) {
            document.getElementById('span_v2state_dropdown').style.display='block';
            document.getElementById('span_v2state_textbox').style.display='none';
            ChosenCopyElement(Form.ShipState_dropdown, Form.ShipState.value);
        }
        else {
            document.getElementById('span_v2state_dropdown').style.display='none';
            document.getElementById('span_v2state_textbox').style.display='block';
        }
        ChosenCopyElement(Form.ShipPostalCode, Form.BillingPostalCode.value);
        ChosenCopyElement(Form.ShipPhoneNumber, Form.BillingPhoneNumber.value);
        ChosenCopyElement(Form.ShipFaxNumber, Form.BillingFaxNumber.value);
    },

    setupFormEvents: function() {
        // Use myCopyB2S func.
        document.getElementById('v65-onepage-CopyBillingToShippingLink').onclick = this.myCopyB2S;

        // Remove re calculate shipping event.
        document.getElementById('BillingState_dropdown').onchange = function() {
            document.getElementById('BillingState').value=this.value;
            this.style.backgroundColor='#ffffff';
        };
        document.getElementById('BillingState').onblur = function(){};

        document.getElementById('ShipState_dropdown').onchange = function() {
            document.getElementById('ShipState').value=this.value;
            this.style.backgroundColor='#ffffff';
        };
        document.getElementById('ShipState').onblur = function(){};

        $('#DisplayShippingSpeedChoicesTD select')[0].onchange = function(){};
        $('#v65-onepage-CheckoutForm').unbind();
    }
}

/* Product detail page. */
var productDetailPage = {
    isCurrentPage: (location.pathname == "/ProductDetails.asp") ||
                    (location.pathname.indexOf("-p/") != -1) ||
                    (location.pathname.indexOf("_p/") != -1),

    setup: function(event) {
        // Setup zoom image size.
        $('#product_photo').mouseover(function() {
            $('#vZoomMagnifierImage').width($('#vZoomTransparentOverlay').width());
        });

        // Move action button td.
        var containerTr = $('#v65-product-parent > tbody > tr:nth-child(2)')[0];
        var actionTd = document.getElementById('v65-productdetail-action-wrapper');
        containerTr.appendChild(actionTd);
        $('#v65-productdetail-action-wrapper br').remove();
        var actionWrapperDiv = document.createElement('DIV');
        actionWrapperDiv.id = 'action-wrapper-div';
        var shareBtns = document.getElementById('v65-share-buttons-container');
        actionWrapperDiv.appendChild(shareBtns);
        while (actionTd.childNodes.length > 0) {
            actionWrapperDiv.appendChild(actionTd.childNodes[0]);
        }
        actionTd.appendChild(actionWrapperDiv);

        // Make second add to cart button.
        var addToCart2 = $('input.vCSS_input_addtocart')[0].cloneNode();
        addToCart2.type = 'submit';
        addToCart2.value = 'ADD TO CART';
        addToCart2.classList.remove('vCSS_input_addtocart');
        addToCart2.classList.add('vCSS_input_addtocart2');
        $('input.vCSS_input_addtocart').after(addToCart2);

        // Make second add to wish list button.
        var addToWL2 = $('#v65-product-wishlist-button')[0].cloneNode();
        addToWL2.type = 'submit';
        addToWL2.value = 'ADD TO WISH LIST';
        addToWL2.id = 'v65-product-wishlist-button2';
        $('#v65-product-wishlist-button').after(addToWL2);

        // Rearrange locations of product title, itemnumber, and price table.
        var titleFont = $('font.productnamecolorLARGE.colors_productname')[0];
        var offerDiv = $('div[itemprop="offers"]')[0];
        var titleUnderLineDiv = document.createElement('DIV');
        titleUnderLineDiv.id = 'titleUnderline';
        var itemNumber = $('div[itemprop="offers"] i');
        itemNumber = itemNumber[itemNumber.length-1];

        $('#v65-product-parent > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > div > table')[0].id = 'priceTable';
        var priceTable = document.getElementById('priceTable');
        $(offerDiv.parentNode).prepend(priceTable);
        $(offerDiv.parentNode).prepend(titleUnderLineDiv);
        $(offerDiv.parentNode).prepend(itemNumber);
        $(offerDiv.parentNode).prepend(titleFont);
        $('#priceTable br').remove();

        // Cleanup breadcrumb td.
        var breadcrumbTd = $('td.vCSS_breadcrumb_td')[0];
        while (breadcrumbTd.childNodes.length > 1) {
            breadcrumbTd.removeChild(breadcrumbTd.lastChild);
        }

        // Remove br in itemoffers.
        var offersBrs = $('div[itemprop="offers"] br');
        offersBrs[offersBrs.length-1].remove();
        $('#v65-product-parent > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td:nth-child(1) br').remove();

        // Clear feature fields.
        $('#v65-product-related').siblings().hide();

        // Hide large pic button.
        $('#product_photo_zoom_url').next().next().hide();
        $('#product_photo_zoom_url').next().hide();

        // Add image action expl.
        var imageActionExplDivText = 'Roll over image to zoom in';
        var imageActionExplDivHoverText = 'Click to open expanded view';
        var imageActionExplDiv = document.createElement('DIV');
        imageActionExplDiv.id = 'imageActionExpl';
        imageActionExplDiv.innerText = imageActionExplDivText;
        $('#product_photo_zoom_url').after(imageActionExplDiv);

        $('#product_photo_zoom_url').mouseover(function() {
            imageActionExplDiv.innerText = imageActionExplDivHoverText;
        });
        $('#vZoomMagnifierImage').mouseout(function() {
            imageActionExplDiv.innerText = imageActionExplDivText;
        });

        // Remove unnecessary br in related products.
        $('td.v65-productAvailability br').remove();

        this.tranlsateToSpanish();
    },

    tranlsateToSpanish: function() {
        if (document.documentElement.lang == 'es') {
            var addToCartText = 'Añadir a la cesta';
            var addToWLText = 'Añadir a la Lista de deseos';
            var addToCartBtn = 'https://linzytoys.us/v/vspfiles/assets/images/buttons/cart2_es.gif';
            var wlBtn = 'https://linzytoys.us/v/vspfiles/assets/images/buttons/wl2_es.gif';
            $('input[src*="btn_addtocart.gif"]').attr("src", addToCartBtn);
            $('img[src*="btn_addtocart.gif"]').attr("src", addToCartBtn);
            $('input[src*="btn_addtowishlist.gif"]').attr("src", wlBtn);
            $('input[value="ADD TO CART"]').attr("value", addToCartText);
            $('input[value="ADD TO WISH LIST"]').attr("value", addToWLText);
        }
    }
}

/* Bind setup callback for current page. */
if (checkoutPage.isCurrentPage) {
    $(checkoutPage.setup.bind(checkoutPage));
} else if (productDetailPage.isCurrentPage) {
    $(productDetailPage.setup.bind(productDetailPage));
}
