<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>
<style type="text/css">body,table,td {font: 11px Verdana; color: #000000;}</style>
<body text="#000000">
<table width="650" border="1" cellspacing="0" cellpadding="20" bgcolor="#FFFFFF" bordercolor="#CCCCCC" align="center">
  <tr>
    <td>
      <table width="100%" border="0" cellspacing="1" cellpadding="5">
        <tr valign="top">
          <td><a href="../../Default.asp">$(CompanyLogo)</a></td>
      <td align="right">CustomerID# $(CustomerID)</td>
    </tr>
    </table>
    <br>
      <br>
      Thank you for your order. Your order number is $(OrderNo), placed $(OrderDate)
      at $(OrderTime). <br>
      <br>
      <table width="100%" border="0" cellspacing="1" cellpadding="5">
        <tr valign="top">
          <td><b>Bill To:</b><br> <br>
            $(Bill_CompanyName) $(Bill_FirstName)&nbsp;$(Bill_LastName)<br>
            $(Bill_Address1)<br>
            $(Bill_Address2) $(Bill_City), $(Bill_State)&nbsp;$(Bill_PostalCode)
            <br>
            $(Bill_Country) <br>
            $(Bill_PhoneNumber)<br>
      $(EmailAddress)<br>
      <br></td>
          <td><b>Ship To:</b><br> <br>
            $(Ship_CompanyName) $(Ship_FirstName)&nbsp;$(Ship_LastName)<br>
            $(Ship_Address1)<br>
            $(Ship_Address2) $(Ship_City), $(Ship_State)&nbsp;$(Ship_PostalCode)
            <br>
            $(Ship_Country) <br>
            $(Ship_PhoneNumber) <br> </td>
        </tr>
        <tr valign="top">
          <td><b>Payment Info:</b> <br> <br>
            $(DisplayPaymentMethod)<br> <br> </td>
          <td><b>Shipping Method:</b><br> <br>
            $(ShippingMethod)<br> </td>
        </tr>
        <tr valign="top">
          <td colspan="2"><b>Order Details:</b><br> <br>
            $(OrderDetails) <br> </td>
        </tr>
      </table>
    $(Order_Comments)
      <br>
      $(Custom_Fields)<br>
      Thank you for shopping at $(StoreName)!<br>
      Visit us again at <a href="$(HomeURL)">$(HomeURL)</a></td>
  </tr>
</table>
</body>
</html>
