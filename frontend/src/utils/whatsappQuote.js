export function generateWhatsAppMessage(customer, quoteItems, totalPrice) {
  let message = `Hello Dhote Tent & Lighting House,

I would like to request a quotation.

========================
CUSTOMER DETAILS
========================

Name: ${customer.name}
Phone: ${customer.phone}
`;

  if (customer.eventDate) {
    message += `Event Date: ${customer.eventDate}\n`;
  }

  if (customer.address) {
    message += `Address: ${customer.address}\n`;
  }

  message += `

========================
RENTAL ITEMS
========================

`;

  quoteItems.forEach((item, index) => {
    message += `${index + 1}. ${item.name}
   • Quantity : ${item.quantity} ${item.unit}${item.quantity > 1 ? "s" : ""}
   • Duration : ${item.duration} ${item.durationType}${
      item.duration > 1 ? "s" : ""
    }
   • Estimated Price : ₹${item.totalPrice}

`;
  });

  message += `Estimated Total : ₹${totalPrice}

`;

  if (customer.note) {
    message += `Additional Note:
${customer.note}

`;
  }

  message += `Please share the final quotation.

Thank you.`;

  // Returned raw — `whatsappLink()` in data/company.js does the URL encoding.
  return message;
}