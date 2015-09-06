var util = {
    changeImageBtn2Submit: function(btnPath, value) {
        var btn = $(btnPath);
        btn[0].type = 'submit';
        btn.attr('value', value);
        btn.removeAttr('src');
        btn.removeAttr('alt');
        return btn;
    },

    checkCurrentPage: function(paths) {
        var cur = false;
        var curLoc = location.pathname.toLowerCase();
        var curPath = '';
        for(var i = 0; i < paths.length; i++) {
            curPath = paths[i].toLowerCase();
            cur = cur || (curLoc == curPath) || (curLoc.indexOf(curPath) != -1);
        }
        return cur;
    },

    // http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
    getURLParameter: function(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }
}

/* Every page. */
var allPage = {
    setup: function(event) {
        $('body > div.page-wrap').ready(function() {
            // Move private catalog to the bottom.
            var catalogAnchors = $('li.vnav__item a[onclick*="2016_VALENTINE_CATALOG"]').parent().remove().find('a');
            catalogAnchors.attr('title', '2016 Valentine Catalog');
            catalogAnchors.removeClass().addClass('quick-link-hl');

            $('<li/>').append(catalogAnchors[0]).prependTo($('footer.footer div.linksWrap ul.left'));
            $('<li/>').append(catalogAnchors[1]).appendTo($('#link-col-1 > div > ul'));
        });

        $(document).ready(function() {
            $('#content_area > form').fadeIn('fast');
        });
    }
}

/* Checkout page. */
var checkoutPage = {
    isCurrentPage: util.checkCurrentPage(["/one-page-checkout.asp"]),

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
            $('#v65-onepage-CheckoutForm').fadeIn('fast');
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

        // Re-style submit order btn.
        util.changeImageBtn2Submit('input#btnSubmitOrder', 'Place order').addClass('primary-btn');

        // Add bottom place order btn.
        var theForm = document.getElementById('v65-onepage-CheckoutForm');

        var clearDiv = document.createElement('DIV');
        clearDiv.id = 'tablesClear';
        theForm.appendChild(clearDiv);

        var bottomSubmitBtn = util.changeImageBtn2Submit($('input#btnSubmitOrder').clone(), 'Place order')
                                    .removeAttr('id')
                                    .attr('id', 'btnSubmitOrder2')
                                    .addClass('primary-btn');

        var bottomPriceText = document.createTextNode('Total: ' + $('#TotalsTotalTD').text());

        var btnDiv = document.createElement('DIV');
        btnDiv.id = 'btnSubmitOrderBottom';
        btnDiv.appendChild(bottomSubmitBtn[0]);
        btnDiv.appendChild(bottomPriceText);
        theForm.appendChild(btnDiv);

        this.hideMethodsSelection();

        this.tranlsateToSpanish();
    },

    hideMethodsSelection: function() {
        var shippingMethod = $('tr#v65-onepage-shippingCost-row select');
        shippingMethod.val(shippingMethod.find('option:last-child').val()).change();

        var paymentMethod = $('select#PaymentMethodTypeDisplay');
        paymentMethod.val(paymentMethod.find('option:last-child').val()).change();
    },

    tranlsateToSpanish: function() {
        // Change place order btn if spanish.
        if (document.documentElement.lang == 'es') {
            var placeOrderBtn = 'Realizar pedido';
            var savedBillingAddr = 'Las direcciones de facturación Guardadas';
            var shipToBilling = ' Enviar a mi dirección de facturación';
            var savedShipAddr = 'Las direcciones de envío Guardadas';
            var billingInfo = 'DATOS DE FACTURACIÓN';
            var shippingInfo = 'INFORMACIÓN DE ENVÍO';
            var payment = 'PAGO';
            var yourOrder = 'Su pedido';
            var edit = 'Editar';

            $('input#btnSubmitOrder').attr('value', placeOrderBtn);
            $('#btnSubmitOrderBottom input#btnSubmitOrder2').attr('value', placeOrderBtn);
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
    isCurrentPage: util.checkCurrentPage(['/productdetails.asp', '-p/', '_p/']),

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
        var addToCart2 = util.changeImageBtn2Submit($('input.vCSS_input_addtocart').clone(), 'Add to cart')
                                .addClass('vCSS_input_addtocart2')
                                .addClass('primary-btn')
                                .removeClass('vCSS_input_addtocart');
        $('input.vCSS_input_addtocart').after(addToCart2);

        util.changeImageBtn2Submit('input.vCSS_input_addtocart', 'Add to cart')
            .addClass('primary-btn');

        // Make second add to wish list button.
        var addToWL2 = util.changeImageBtn2Submit($('#v65-product-wishlist-button').clone(), 'Add to wish list')
                           .attr('id', 'v65-product-wishlist-button2')
                           .addClass('secondary-btn');
        $('#v65-product-wishlist-button').after(addToWL2);
        util.changeImageBtn2Submit('#v65-product-wishlist-button', 'Add to wish list')
            .addClass('secondary-btn');

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
        $('#Header_ProductDetail_ProductDetails').siblings().hide();

        // Hide description box if there is not description.
        if (($('div#ProductDetail_ProductDetails_div span#product_description').text() == "\n" ||
             $('div#ProductDetail_ProductDetails_div span#product_description').text() == "") &&
             ($('div#ProductDetail_ProductDetails_div div[itemprop="video"]').length == 0)) {
            $('#v65-product-related').siblings().hide();
        }

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

        // Re-style embedded youtube video.
        var youtubeVideo = $('#ProductDetail_ProductDetails_div div.video_player > iframe');
        if (youtubeVideo.length != 0) {
            var videoId = youtubeVideo.attr('src').match(/embed\/(.+)\?/)[1];
            youtubeVideo.attr('width', '560');
            youtubeVideo.attr('height', '315');
            youtubeVideo.removeAttr('allowfullscreen');
            youtubeVideo.attr('src', "https://www.youtube.com/embed/" + videoId + "?modestbranding=1&fs=0&rel=0&showinfo=0");
        }

        this.tranlsateToSpanish();

        $('main#content_area > div[itemtype="http://schema.org/Product"]').fadeIn('fast');
    },

    tranlsateToSpanish: function() {
        if (document.documentElement.lang == 'es') {
            var addToCartText = 'Añadir a la cesta';
            var addToWLText = 'Añadir a la Lista de deseos';
            $('input[value="Add to cart"]').attr("value", addToCartText);
            $('input[value="Add to wish list"]').attr("value", addToWLText);
        }
    }
}

/* Category page. */
var categoryPage = {
    isCurrentPage: util.checkCurrentPage(['-s/', '_s/']),

    setup: function(event) {
        /* Category page has an #SortBy element. */
        if ($('#SortBy').length == 1) {
            this.categoryPage.setup();
        } else {
            this.subcategoryPage.setup();
        }
    },

    categoryPage: {
        setup: function() {
            this.reStructure();
            this.reBindEvents();
        },

        reStructure: function() {
            var isSpanish = document.documentElement.lang == 'es';

            if (isSpanish) {
                var perPageSearchTerm = 'por';
                var perPageText = ' productos/página';
                var pageSelectSearchTerm = 'de ';
                var pageSelectText = ' de ';
                var sortByText = 'Ordenar por: ';
                var displayText = 'Display: ';
                var curPageText = 'Ver página: ';
                var nextPageText = 'Pagina siguiente >';
                var prevPageText = '< Pagina anterior';
            } else {
                var perPageSearchTerm = 'per';
                var perPageText = ' products/page';
                var pageSelectSearchTerm = 'of ';
                var pageSelectText = ' of ';
                var sortByText = 'Sort by: ';
                var displayText = 'Display: ';
                var curPageText = 'View page: ';
                var nextPageText = 'Next page >';
                var prevPageText = '< Prev page';
            }

            var selectClass = 'category-action-select';
            var explClass = 'category-action-expl';
            var tdClass = 'category-action-td';
            var sortByTdID = 'sort-by-td';
            var perPageTdID = 'per-page-td';
            var curPageTdID = 'cur-page-td';

            // Sort by.
            var sortByTd = $('form#MainForm > input[name="Cat"] + table td[valign="bottom"][rowspan="2"]');
            sortByTd.append($('#jmenuhide select'));
            sortByTd.children()[0].remove();
            $(sortByTd.children()[0]).addClass(selectClass);
            sortByTd.addClass(tdClass);
            sortByTd.attr('id', sortByTdID);

            // Products per page.
            var perPageTd = sortByTd.siblings();
            perPageTd.addClass(tdClass);
            perPageTd.attr('id', perPageTdID);
            $('#per-page-td select').addClass(selectClass);
            $('#per-page-td select option').each(function(){
               var productsPerPage = $(this).text().slice(0,$(this).text().indexOf(perPageSearchTerm) - 1);
               $(this).text(productsPerPage + perPageText);
            });
            var curPageNoBr = $('#per-page-td nobr').remove();

            // Current page number.
            var curPageTd = $('<td/>', {
                'id': curPageTdID,
                'class': tdClass
            });
            perPageTd.after(curPageTd);
            var curPageSelect = $('<select/>', {'class': selectClass});
            var currentPageNum = parseInt(curPageNoBr.find('input').attr('value'));

            var totalPageNum = parseInt(
                curPageNoBr.text()[curPageNoBr.text().indexOf(pageSelectSearchTerm)+3]
            );

            for (i = 1; i < totalPageNum+1; i++) {
                $('<option/>', {
                    'value': i,
                    'text': i + pageSelectText + totalPageNum
                }).appendTo(curPageSelect);
            }
            curPageSelect.appendTo(curPageTd);
            $('#cur-page-td select.category-action-select').val(currentPageNum);

            // Add expl texts.
            $('<span/>', {
                'class': explClass,
                'text': displayText
            }).prependTo(perPageTd);
            $('<span/>', {
                'class': explClass,
                'text': sortByText
            }).prependTo(sortByTd);
            $('<span/>', {
                'class': explClass,
                'text': curPageText
            }).prependTo(curPageTd);

            // Redo page navigation btns.
            var pageNav = $('<div/>', {'id':'page-navigator'});
            var prevPageContainer = $('<div/>', {'id':'prev-page-container'});
            var nextPageContainer = $('<div/>', {'id':'next-page-container'});
            var prevPageBtn = $('<a/>', {
                'id':'prev-page-button',
                'text': prevPageText
            });
            var nextPageBtn = $('<a/>', {
                'id':'next-page-button',
                'text': nextPageText
            });
            prevPageBtn.appendTo(prevPageContainer);
            nextPageBtn.appendTo(nextPageContainer);
            prevPageContainer.appendTo(pageNav);
            nextPageContainer.appendTo(pageNav);
            pageNav.appendTo($('#MainForm'));

            if ($('input.previous_page_img').length != 0) {
                prevPageBtn.addClass('page-nav-btn');
                prevPageBtn[0].onclick = $('input.previous_page_img')[0].onclick;
            } else {
                prevPageBtn.addClass('page-nav-btn-disabled');
            }

            if ($('input.next_page_img').length != 0) {
                nextPageBtn.addClass('page-nav-btn');
                nextPageBtn[0].onclick = $('input.next_page_img')[0].onclick;
            } else {
                nextPageBtn.addClass('page-nav-btn-disabled');
            }
        },

        reBindEvents: function() {
            // Change #SortBy select onchange event.
            v$('SortBy').onchange = function() {
                if (this.value != '') {
                    Add_Search_Param('sort', this.value);
                }
                Refine();
            }

            // Add refine event to current page selector.
            $('td#cur-page-td select')[0].onchange = function() {
                if (this.value != '') {
                    Add_Search_Param('page', this.value);
                }
                Refine();
            }
        }
    },

    subcategoryPage: {
        setup: function() {

        }
    }
}

/* User login/register page. */
var registerPage = {
    isCurrentPage: util.checkCurrentPage(['/register.asp', '/el-es-wirf/Linzy-juguetes']),

    setup: function(event) {
        this.reStructure();
    },

    reStructure: function() {
        if (document.documentElement.lang == 'es') {
            var loginEmail = 'Email';
            var loginPassword = 'Contraseña';
            var signUpTitle = 'New to Linzy Toys? Sign up here!';
            var signUpEmail = 'Email';
            var signUpEmailRepeat = 'Reingresar en email';
            var signUpPassword = 'Contraseña';
            var signUpPasswordRepeat = 'Reingresar en contraseña';
            var billingInfoTitle = 'Su dirección de facturación';
            var registerSubmitText = 'Inscribirse para Linzy Toys';
            var biFirstName = 'Nombre';
            var biLastName = 'Apellido';
            var biCompany = 'Compañía';
            var biAddress = 'Dirección';
            var biCity = 'Ciudad';
            var biCountry = 'País';
            var biState = 'Estado / provincia';
            var biZip = 'Código postal código';
            var biPhone = 'Teléfono';
            var biFax = 'Fax';
        } else {
            var loginEmail = 'Email';
            var loginPassword = 'Password';
            var signUpTitle = 'New to Linzy Toys? Sign up here!';
            var signUpEmail = 'Email';
            var signUpEmailRepeat = 'Re-enter email';
            var signUpPassword = 'Password';
            var signUpPasswordRepeat = 'Re-enter password';
            var billingInfoTitle = 'Billing Information';
            var registerSubmitText = 'Sign up for Linzy Toys';
            var biFirstName = 'First Name';
            var biLastName = 'Last Name';
            var biCompany = 'Company';
            var biAddress = 'Address';
            var biCity = 'City';
            var biCountry = 'Country';
            var biState = 'State / Province';
            var biZip = 'Zip / Postal Code';
            var biPhone = 'Phone Number';
            var biFax = 'Fax';
        }
        var requiredStar = '<span>*</span>';
        var colon = ':';

        // Add id to login table.
        $('#RegisterForm').prev().attr('id', 'login-table');
        $('#RegisterForm > table > tbody > tr:nth-child(2) > td > table').attr('id', 'register-info');
        $('#RegisterForm > table > tbody > tr:nth-child(4) > td > table').attr('id', 'billing-info');
        $('#RegisterForm > table > tbody > tr:nth-child(5) > td').attr('id', 'register-submit-td');

        // Move error blocks to the top.
        $('#login-table').before($('div.v65-error-list-wrapper'));

        // Remove unnecessary classes.
        $('#login-table form > table').removeClass();
        $('#login-table form > table tr').removeClass();

        // Restructure table.
        $('#login-table form > table tr:first-child td:nth-child(2)').attr('colspan', '2');
        $('#login-table form > table tr:first-child td:nth-child(1)').remove();
        $('#login-table form > table tr:nth-child(2) > td:nth-child(1)').remove();
        $('<td/>').append($('#login-table form > table input[type="submit"]'))
                .appendTo($('#login-table form > table tr:nth-child(2)'));
        $('#login-table form > table input[type="hidden"]').appendTo($('#login-table form'));
        $('#login-table form > table tr:nth-child(3)').remove();

        // Add placeholder to input fields.
        $('#login-table form > table input[name="email"]').attr('placeholder', loginEmail);
        $('#login-table form > table input[name="password"]').attr('placeholder', loginPassword);

        // Wrap inner table with a div for radius border.
        $('<div/>').append($('#login-table form > table')).prependTo($('#login-table form'));

        // Add sign up toggle.
        $('#RegisterForm').before(
            $('<div/>', {
                'id': 'sign-up-toggle',
                'class': 'sign-up-toggle-off',
                'text': signUpTitle
        }));

        // Change sign up table text.
        var signUpTableTexts = $('#register-info td[width="48%"] b');
        signUpTableTexts[0].innerHTML = signUpEmail + requiredStar + colon;
        signUpTableTexts[1].innerHTML = signUpEmailRepeat + requiredStar + colon;
        signUpTableTexts[2].innerHTML = signUpPassword + requiredStar + colon;
        signUpTableTexts[3].innerHTML = signUpPasswordRepeat + requiredStar + colon;

        // Change billing info title text.
        $('#RegisterForm > table > tbody > tr:nth-child(3) > td').text(billingInfoTitle);

        // Hide unrelated elements above submit btns.
        $('#register-submit-td input').siblings().hide();

        // Style register submit btn and login btn.
        $('#submitRegistration').attr('value', registerSubmitText);
        $('#submitRegistration').addClass('primary-btn');
        $('#login-table form div table input[name="Login"]').addClass('color-theme-btn');

        // Change billing info table text.
        var billingInfoTexts = $('#billing-info > tbody > tr > td:nth-child(1)');
        billingInfoTexts[0].innerHTML = biFirstName + requiredStar + colon;
        billingInfoTexts[1].innerHTML = biLastName + requiredStar + colon;
        billingInfoTexts[2].innerHTML = biCompany + colon;
        billingInfoTexts[3].innerHTML = biAddress + requiredStar + colon;
        billingInfoTexts[5].innerHTML = biCity + requiredStar + colon;
        billingInfoTexts[6].innerHTML = biCountry + requiredStar + colon;
        billingInfoTexts[7].innerHTML = biState + requiredStar + colon;
        billingInfoTexts[8].innerHTML = biZip + requiredStar + colon;
        billingInfoTexts[9].innerHTML = biPhone + requiredStar + colon;
        billingInfoTexts[10].innerHTML = biFax + colon;

        // Show register form if register errors.
        var logInErrors = ['Please type your e-mail address below.',
                           'Sorry, the email address or password you typed is invalid. Please try again.',
                           'You are now logged out.'];

        if ($('div.v65-error-list-text li').length != 0 &&
            logInErrors.indexOf($('div.v65-error-list-text li').text()) == -1) {
            $('#RegisterForm').show();
        }

        // Adjust if there is announcement.
        if ($('#div_articleid_61').length != 0) {
            $('#div_articleid_61').parent().append($('div.v65-error-list-wrapper, #login-table, #sign-up-toggle, #RegisterForm'));
        }

        this.bindEvents();
    },

    bindEvents: function() {
        var toggleOffCls = 'sign-up-toggle-off';
        var toggleOnCls = 'sign-up-toggle-on';

        $('#sign-up-toggle').click(function() {
            if ($('#RegisterForm').is(':visible')) {
                $('#RegisterForm').slideUp(500, function() {
                    $('#sign-up-toggle').removeClass(toggleOnCls);
                    $('#sign-up-toggle').addClass(toggleOffCls);
                });
            } else {
                $('#sign-up-toggle').removeClass(toggleOffCls);
                $('#sign-up-toggle').addClass(toggleOnCls);
                $('#RegisterForm').slideDown(500);
            }
        });
    }
}

/* Shopping cart page. */
var shoppingCartPage = {
    isCurrentPage: util.checkCurrentPage(['/shoppingcart.asp']),

    setup: function(event) {
        this.reStructure();
    },

    englishText: {
        cartTitle: 'Shopping Cart',
        checkoutBtnText: 'Proceed to checkout',
        cartTitleItem: 'Item',
        cartTitlePrice: 'Price',
        cartTitleQty: 'Quantity',
        cartTitleSubtotal: 'Subtotal',
        removeFromCart: 'Remove from cart',
        removeCoupon: 'Remove coupon',
        couponText: 'Coupon Code',
        applyCoupon: 'Apply',
        recalculate: 'Recalculate',
        mobileDelete: 'Delete',
        priceSummary: 'Price summary'
    },

    spanishText: {
        cartTitle: 'Carrito de compras',
        checkoutBtnText: 'Pasar por la caja',
        cartTitleItem: 'Artículo',
        cartTitlePrice: 'Precio',
        cartTitleQty: 'Cantidad',
        cartTitleSubtotal: 'Total parcial',
        removeFromCart: 'Quitar del carrito',
        removeCoupon: 'Retire cupón',
        couponText: 'Código promocional',
        applyCoupon: 'Aplicar',
        recalculate: 'Recalcular',
        mobileDelete: 'Borrar',
        priceSummary: 'Resumen de precio'
    },

    t: function(text) {
        if (document.documentElement.lang == 'es') {
            return this.spanishText[text];
        } else {
            return this.englishText[text];
        }
    },

    clearCells: function() {
        // Add id to shopping cart form.
        $('table#v65-cart-table-container > tbody > tr > td > form').attr('id', 'shoppingcart-form');

        // Remove unnecessary table cells.
        $('table#v65-cart-table > tbody > tr:first-child').remove();
        $('table#v65-cart-table tr.v65-cart-details-separator').remove();
        $('table#v65-cart-table tr.v65-divider-hr-row').remove();

        $('table#v65-cart-table tr.v65-cart-total-estimate-row + tr').remove();
        $('table#v65-cart-table tr#v65-cart-footer-row').remove();

        $('table#v65-cart-table td.table-border-left').remove();
        $('table#v65-cart-table td.table-border-right').remove();
        $('table#v65-cart-table td#v65-cart-header-left').remove();
        $('table#v65-cart-table td#v65-cart-header-right').remove();
        $('table#v65-cart-table td.v65-cart-header-blank').remove();
        $('table#v65-cart-table td.colors_lines').remove();
    },

    reorganizeCartDetails: function() {
        // Update shopping cart title texts.
        var cartTitle = $('tr#cart-header td');
        $(cartTitle[0]).text(this.t('cartTitleItem'));
        $(cartTitle[1]).text(this.t('cartTitlePrice'));
        $(cartTitle[2]).text(this.t('cartTitleQty'));
        $(cartTitle[3]).text(this.t('cartTitleSubtotal'));

        // Re-organize cart details row.
        var that = this;
        $('table#v65-cart-table tr.v65-cart-details-row').each(function() {
            var descCell = $($(this).children()[1]);
            var priceCell = $($(this).children()[2]);
            var qtyCell = $($(this).children()[3]);

            descCell.addClass('item-desc');
            priceCell.addClass('item-price');
            qtyCell.addClass('item-qty');
            $($(this).children()[4]).addClass('item-subtotal');

            descCell.find('font').after(
                $('<div/>', {
                    'class': 'mobile-price',
                    'text': priceCell.find('font').text().trim()
            }));

            $(this).find('td.v65-cart-detail-productimage img')
                    .prependTo($(this).find('td.item-desc'));
            $(this).find('td.v65-cart-item-remove-cell a')
                    .appendTo($(this).find('td.item-qty'));

            var deleteBtn = $(this).find('a.v65-cart-item-remove-link');
            $('<a/>', {
                'href': deleteBtn.attr('href'),
                'class': 'mobile-delete secondary-btn',
                'text': that.t('mobileDelete')
            }).appendTo(qtyCell);
        });
        $('table#v65-cart-table tr.v65-cart-details-row td.v65-cart-detail-productimage').remove();
        $('table#v65-cart-table tr.v65-cart-details-row td.v65-cart-item-remove-cell').remove();

        // Chagne remove link text.
        $('table#v65-cart-table a.v65-cart-item-remove-link').html(this.t('removeFromCart'));
    },

    reorganizeCouponRow: function() {
        // Re-organize coupon row if exists.
        var couponRow = 'table#v65-cart-table tr.v65-cart-giftcert-details-row';
        var detailCell = 'td.v65-cart-giftcert-details-cell';
        var removeCell = 'td.v65-cart-item-remove-cell';
        if ($(couponRow).length != 0) {
            $(couponRow + ' ' + detailCell).after($(couponRow + ' ' + removeCell));
            $(couponRow + ' ' + detailCell).attr('colspan', '2');
            $(couponRow + ' ' + detailCell + ' img').remove();
            $(couponRow + ' ' + removeCell + ' a').html(this.t('removeCoupon'));

            // Mobile price.
            $('<span/>', {
                'class': 'mobile-price-coupon',
                'text': $(couponRow + ' ' + 'table.v65-cart-giftcert-total font').text().trim()
            }).appendTo($(couponRow + ' ' + detailCell));

            // Mobile button.
            $('<a/>', {
                'class': 'mobile-delete-coupon secondary-btn',
                'text': this.t('removeCoupon'),
                'href': $(couponRow + ' ' + removeCell + ' a').attr('href')
            }).appendTo($(couponRow + ' ' + detailCell));
        }
    },

    rebuildActionDiv: function() {
        // Rebuild action div.
        var shoppingCartAction = $('<div/>', {
            'id': 'shopping-cart-action'
        });
        $('table#v65-cart-table').after(shoppingCartAction);
        shoppingCartAction.append($('table#v65-cart-table tr#v65-empty-cart-row a').addClass('secondary-btn'));
        shoppingCartAction.append($('table#v65-cart-table div#v65-cart-coupon-entry-details-div'));
        shoppingCartAction.append($('table#v65-cart-table td#v65-cart-update-total-cell input').addClass('secondary-btn'));
        $('input#v65-cart-coupon-entry-details-button').addClass('secondary-btn');
        $('div#v65-cart-coupon-entry-details-div').contents()[0].remove();
        $('input#v65-cart-coupon-entry-details-input').attr('placeholder', this.t('couponText'));
        $('table#v65-cart-table tr#v65-empty-cart-row').remove();
        $('table#v65-cart-table tr#v65-coupon-table-row').remove();

        // Change image btn to submit btn.
        util.changeImageBtn2Submit('table#v65-cart-checkout-table input.btn_checkout_guest', this.t('checkoutBtnText'));
        util.changeImageBtn2Submit('input#v65-cart-coupon-entry-details-button', this.t('applyCoupon'));
        util.changeImageBtn2Submit('input#btnRecalculate', this.t('recalculate'));
    },

    rebuildTotalPrice: function() {
        // Rebuild total price.
        var cartPriceTable = $('<table/>', {
            'id': 'cart-price-table'
        });
        $('<tbody/>').append($('table#v65-cart-table tr.v65-cart-tax-row'))
                        .append($('table#v65-cart-table tr.v65-cart-total-estimate-row'))
                        .appendTo(cartPriceTable);
        $('table#v65-cart-checkout-parent form[name="Proceed_To_Checkout_Form"]').before(cartPriceTable);
        $('table#cart-price-table tr.v65-cart-tax-row > td:first-child').remove();
        $('table#cart-price-table tr.v65-cart-tax-row > td:last-child').remove();
        $('table#cart-price-table tr.v65-cart-tax-row > td:first-child').removeAttr('colspan');
        $('table#cart-price-table tr.v65-cart-total-estimate-row > td:first-child').remove();
        $('table#cart-price-table tr.v65-cart-total-estimate-row > td:last-child').remove();
        $('table#cart-price-table tr.v65-cart-total-estimate-row > td:first-child').removeAttr('colspan');
    },

    reorganizeProceedToCheckout: function() {
        // Re-organize proceed to checkout btn and price summary.
        var priceTableCheckoutTd = $('#v65-cart-checkout-parent > tbody > tr > td:nth-child(2)');
        var priceTableCheckout = $('<div/>', {'id':'price-table-checkout'})
                                    .append(priceTableCheckoutTd.children())
                                    .appendTo(priceTableCheckoutTd);
        $('<div/>', {
            'id': 'price-summary-title',
            'text': this.t('priceSummary')
        }).prependTo($('div#price-table-checkout'));

        $('div#price-table-checkout br').remove();

        // Add btn style to proceed to checkout btn.
        $('#v65-cart-checkout-table td.v65-cart-checkout-membersonly-cell input').addClass('primary-btn');

        // Add mobile proceed to checkout.
        $('div#price-table-checkout form').clone()
                                            .attr('id', 'mobile-checkout-table')
                                            .prependTo('body > div.page-wrap');
        $('body > div.page-wrap').addClass('mobile-push-down');
    },

    reStructure: function() {
        // Change shopping cart title.
        $('h2.v65-your-cart-title').text(this.t('cartTitle')).prependTo($('form#shoppingcart-form'));

        // Cart is not empty.
        if ($('#v65-cart-table-container').length != 0) {
            this.clearCells();
            this.reorganizeCartDetails();
            this.reorganizeCouponRow();
            this.rebuildActionDiv();
            this.rebuildTotalPrice();
            this.reorganizeProceedToCheckout();
        } else {
            $('h2.v65-your-cart-title + table td').attr('id', 'empty-cart-cell');
        }

        $('h2.v65-your-cart-title + table').fadeIn('fast');
    }
}

/* My account page. */
var myAccountPage = {
    isCurrentPage: util.checkCurrentPage(['/myaccount.asp']),

    setup: function(event) {
        // Add ids.
        $('main#content_area > form').attr('id', 'myaccount-form');
        $('main#content_area > form > table').attr('id', 'myaccount-table');

        // Hide unnecessary br.
        $('main#content_area br').hide();

        // Hide empty table cell.
        $('#myaccount-table > tbody > tr > td > table td').each(function() {
            if ($(this).text().trim() == '') {
                $(this).hide();
            }
        });

        // Style log out btn.
        $('#myaccount-table > tbody > tr:nth-child(6) > td > a').addClass('secondary-btn');

        $('#myaccount-form').fadeIn('fast');
    }
}

/* Orders page. */
var ordersPage = {
    isCurrentPage: util.checkCurrentPage(['/orders.asp']),

    englishText: {
        viewOrderPeriod: 'View',
        changeOrderText: 'View or change order',
        showOrderDetailText: 'Show detail',
        hideOrderDetailText: 'Hide detail',
        showAllText: 'Expand all',
        hideAllText: 'Collapse all'
    },

    spanishText: {
        viewOrderPeriod: 'Ver'
    },

    t: function(text) {
        if (document.documentElement.lang == 'es') {
            return this.spanishText[text];
        } else {
            return this.englishText[text];
        }
    },

    setup: function(event) {
        // Add ids.
        $('main#content_area > form').attr('id', 'orders-form');
        $('main#content_area > form > table').attr('id', 'orders-table-container');
        $('#orders-table-container > tbody > tr:nth-child(3) > td > table').attr('id', 'orders-table')
                                                                            .removeClass();

        this.styleOrdersPeriodSelect();
        this.styleOrdersDetailTable();

        // Fade in after re-structure.
        $('form#orders-form').fadeIn('fast');
    },

    styleOrdersPeriodSelect: function() {
        // Add view orders period text.
        $('<span/>', {
            'text': this.t('viewOrderPeriod') + ': '
        }).prependTo($('#orders-table-container > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)'));

        // Bind events to select.
        $('#orders-table-container > tbody > tr:nth-child(2) > td select').change(function(event) {
            $('#content_area > form').submit();
        });
    },

    styleOrdersDetailTable: function() {
        var that = this;

        // Toggal all btn.
        $('<a/>', {
            'class': 'secondary-btn',
            'id': 'show-all-toggle',
            'text': this.t('showAllText')
        }).appendTo($('#orders-table > tbody > tr:nth-child(1) > td'));

        $('#orders-table a#show-all-toggle').click(function() {
            var allOrderDetailCell = $('#orders-table > tbody > tr.colors_backgroundneutral > td:nth-child(3)');
            if (allOrderDetailCell.is(':hidden')) {
                allOrderDetailCell.slideDown(500);
                that.updateToggleAllText();
                $('#orders-table a.order-detail-toggle').text(that.t('hideOrderDetailText'));
            } else {
                $('#orders-table a.order-detail-toggle').text(that.t('showOrderDetailText'));
                allOrderDetailCell.slideUp(500, that.updateToggleAllText.bind(that));
            }
        });

        // Restructure each order row.
        $('table#orders-table > tbody > tr.colors_backgroundneutral').each(function() {
            var orderNumberCell = $(this).find('> td:nth-child(1)');
            var orderDetailCell = $(this).find('> td:nth-child(2)');
            var orderUpdateCell = $(this).find('> td:nth-child(3)');

            // Swap update btn cell and order detail cell.
            orderDetailCell.before(orderUpdateCell);

            // Hide order detail cell.
            orderDetailCell.hide();

            // Style and add anchor in update cell.
            orderUpdateCell.find('a').html(that.t('changeOrderText')).addClass('secondary-btn');
            $('<a/>', {
                'href': 'javascript: void(0);',
                'text': that.t('showOrderDetailText'),
                'class': 'secondary-btn order-detail-toggle'
            }).appendTo(orderUpdateCell);

            // Add clear div in the end.
            $('<div/>', {
                'class': 'order-detail-clear'
            }).appendTo($(this));

            // Add class to table in detail cell.
            orderDetailCell.find('> table').addClass('order-detail-table');

            orderDetailCell.find('tr:not(:first-child)').each(function() {
                var itemPrice = $(this).find('td:nth-child(2)').text().trim();
                $('<span/>', {
                    'class': 'mobile-price',
                    'text': itemPrice
                }).appendTo($(this).find('li'));
            });
        });

        // Add toggle event.
        $('table#orders-table a.order-detail-toggle').click(function() {
            var orderDetailCell = $(this).parent().next();

            if (orderDetailCell.is(":visible")) {
                $(this).text(that.t('showOrderDetailText'));
                orderDetailCell.slideUp(500, that.updateToggleAllText.bind(that));
            } else {
                orderDetailCell.slideDown(500);
                $(this).text(that.t('hideOrderDetailText'));
                that.updateToggleAllText();
            }
        });
    },

    updateToggleAllText: function() {
        if ($('#orders-table > tbody > tr.colors_backgroundneutral > td:nth-child(3)').is(':hidden')) {
            $('#orders-table a#show-all-toggle').text(this.t('showAllText'));
        } else {
            $('#orders-table a#show-all-toggle').text(this.t('hideAllText'));
        }
    }
}

/* Home page. */
var homePage = {
    isCurrentPage: util.checkCurrentPage(['/default.asp']) || location.pathname == '/',

    setup: function(event) {
        var featuredProductsTitle = $('<h2/>', {
            'id': 'featured-products-title',
            'class': 'homepage-subtitle',
            'text': 'Featured Products'
        });
        $('img[src*="FeaturedProducts.gif"]').replaceWith(featuredProductsTitle);
        $('h2#featured-products-title ~ br').remove();
        $('h2#featured-products-title + table').remove();
    }
}

/* Order finished page. */
var orderFinishedPage = {
    isCurrentPage: util.checkCurrentPage(['/OrderFinished.asp']),

    setup: function(event) {
        $('<h2>', {
            'class': 'order-finish-title',
            'text': 'Thank you, your order is placed!'
        }).insertBefore('#content_area > table');
    }
}


/* Bind setup callback for current page. */
if (checkoutPage.isCurrentPage) {
    $(checkoutPage.setup.bind(checkoutPage));
} else if (productDetailPage.isCurrentPage) {
    $(productDetailPage.setup.bind(productDetailPage));
} else if (categoryPage.isCurrentPage) {
    $(categoryPage.setup.bind(categoryPage));
} else if (registerPage.isCurrentPage) {
    $(registerPage.setup.bind(registerPage));
} else if (shoppingCartPage.isCurrentPage) {
    $(shoppingCartPage.setup.bind(shoppingCartPage));
} else if (myAccountPage.isCurrentPage) {
    $(myAccountPage.setup.bind(myAccountPage));
} else if (ordersPage.isCurrentPage) {
    $(ordersPage.setup.bind(ordersPage));
} else if (homePage.isCurrentPage) {
    $(homePage.setup.bind(homePage));
} else if (orderFinishedPage.isCurrentPage) {
    $(orderFinishedPage.setup.bind(orderFinishedPage));
}

$(allPage.setup(allPage));
