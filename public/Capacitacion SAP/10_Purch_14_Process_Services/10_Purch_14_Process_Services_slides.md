# Transcripción por Diapositiva: 10_Purch_14_Process_Services

## Diapositiva 1

PUBLIC Purchasing: Purchasing Services SAP Business One Version 10.0 1

---

## Diapositiva 2

In this session, we will discuss the options for purchasing services. We look at two ways services are handled in purchasing – with and without purchase orders. Then we will look at the steps needed to enter A/P invoices for services such as rent or utilities.  In the end, we discuss the possibility of using recurring transactions. 2 PUBLIC At the end of this topic, you will be able to:  Describe the options for purchasing services. Objectives

---

## Diapositiva 3

Sometimes you purchase services such as web design or landscaping from vendors.  In cases like these, you work with the vendor beforehand to agree on the type of work to be done and the price.  In these cases, it makes sense to use a purchase order in the purchasing process to confirm your agreement with the vendor. Other services such as electricity or rent, are purchased without purchase orders.  Instead when the invoice is received from the vendor, you enter the information directly in an A/P invoice. Recurring transactions help you generate A/P invoices for service agreements with regular payments. 3 3 PUBLIC Business Scenario  You purchase services such as web design and landscaping from vendors using purchase orders.  Other services such as electricity or rent are purchased with an A/P invoice and no preceding documents.  Recurring transactions help you generate A/P invoices for service agreements with regular payments.

---

## Diapositiva 4

When you buy landscaping, training or other non-physical purchases, you can still use purchase orders and A/P invoices. When purchasing services, you may wish to begin with a purchase order which describes the service being purchased, the price agreed to, and the G/L account associated with the service.  The purchase order is optional.  The advantage of using a purchase order is that it gives you a document in which to set the conditions and price for the service. Generally you discuss the scope of the project and expected price with the vendor and at that point the purchase order is created with the details of the agreement. When the vendor receives the purchase order, they confirm the agreement and dates are set for them to perform the service. The goods receipt PO document is generally not used for purchasing services. Usually, this step occurs outside the system. After the service is received and the vendor sends an invoice, an A/P invoice is entered into the system. Finally, an outgoing payment is created to pay the vendor. 4 PUBLIC Purchasing Services – Process Overview Purchase Order Service Receipt A\P Invoice Outgoing Payment

---

## Diapositiva 5

You have two options when purchasing services, you can either set up a service as an item or use a description to purchase the service. A sales or purchasing document can include either pre-defined items from master data or descriptions of services which are directly entered in its rows.  The document cannot include both. When you create a document, you set the Item/Service Type to either Service or Item. This setting applies to the entire document, and you cannot change it once you have saved the document The table view on the Content tab page is different for each option. When would you set the Item/Service type to Service?  You only use the Service option in SAP Business One to buy or sell a service that does not have a master record. When would you set the Item/Service Type to Item?  When you are purchasing physical items and/or services set up as item master data. 5 PUBLIC Item  / Service Type Service Customer Description Document G/L Account Price C00001 Name Smith Item Customer Item No. Document Description Quantity C00001 Name Smith Price In Purchasing (and Sales), you can set your documents as either Item type or Service type.

---

## Diapositiva 6

Let us take a look at setting up a service in an item master record. Service items can be very useful if you purchase a service frequently and the price is pre-set with the vendor. As we mentioned before, a nice advantage of using service items is that you can add the service item onto item-type marketing documents, such as purchase orders.  This allows you to combine items and services on the same document. When you add the item master onto a marketing document, you specify the quantity used.  This allows you to better track services in standard reports. You can use the usual sales and purchasing analyses for services. Having  item master data for your services also reduces the chance for errors during data entry. You can set up prices, sales quantities, and so on, that default into your documents. When you create a service item, you will set the item category as a non- inventory item.  For service items you buy, you mark the checkbox for purchased items. Service items can also be used in sales as well as in purchasing.  In fact, typically creating a service item is done more frequently for selling services, than for purchasing services. 6 PUBLIC Service Items L1919 General Item Master Data Purchasing Data Sales Data Landscape Service Description Item No. Document Item Customer Item No. Purchase Order Description Landscape Service Quantity C00001 Name Smith 1 L1919 Purchased Item Inventory Item Sales Item Item Category:

---

## Diapositiva 7

For services such as electricity or rent, there is usually no purchase order involved in the process.  Let us take a look at the process of creating an A/P invoice for this type of service. Imagine that you just received a vendor invoice for rent from your landlord. The vendor invoice contains the vendor’s name, their own invoice number, the date the invoice was issued, a description of the service purchased and the amount due. 7 PUBLIC Create a Service Invoice Vendor Invoice  Vendor name  Invoice number  Invoice date  Description  Amount due  …

---

## Diapositiva 8

You create an A/P invoice in SAP Business One and enter in the vendor code. 8 PUBLIC Create a Service Invoice Vendor Invoice Enter data A /P Invoice  Vendor number  Vendor name  Invoice number  Invoice date  Description  Amount due  …

---

## Diapositiva 9

This brings in the default data from the vendor master record such as the vendor name, address, payment terms, payment method and more. 9 PUBLIC Create a Service Invoice Vendor Master Data Vendor Invoice Default data Enter data A /P Invoice  Vendor number  Vendor name  Invoice number  Invoice date  Description  Amount due  …  Vendor number  Vendor name  Address  Payment terms  Payment method  …

---

## Diapositiva 10

You enter the vendor invoice number and the vendor invoice date that you read on the vendor invoice. You verify that the correct Item/Service type setting exists to enter service information such as the description of the services and the appropriate G/L account. And of course, you enter the amount due in the total due field in the A/P invoice. 10 PUBLIC Create a Service Invoice Vendor Master Data Vendor Invoice Default data Enter data A /P Invoice  Vendor number  Invoice number  Invoice date  Description  G/L Account  Total due  Vendor name  Invoice number  Invoice date  Description  Amount due  …  Vendor number  Vendor name  Address  Payment terms  Payment method  …

---

## Diapositiva 11

 When you save the invoice, SAP Business One performs a duplicate invoice number check for the vendor.  The system alerts you if the vendor invoice number is found so you can research the invoice. This function helps us to avoid duplicate payments. 11 PUBLIC Create a Service Invoice Vendor Master Data Vendor Invoice Default data Enter data A /P Invoice  Vendor number  Invoice number  Invoice date  Description  G/L Account  Total due  Vendor name  Invoice number  Invoice date  Description  Amount due  …  Vendor number  Vendor name  Address  Payment terms  Payment method  … Check for duplicate invoice numbers

---

## Diapositiva 12

When the system saves the invoice, the value updates the amount due to the vendor, the related expense account, and the related general ledger control account at the same time. 12 PUBLIC Create a Service Invoice Vendor Master Data Vendor Invoice Default data Enter data A /P Invoice  Vendor number  Invoice number  Invoice date  Description  G/L Account  Total due  Vendor name  Invoice number  Invoice date  Description  Amount due  …  Vendor number  Vendor name  Address  Payment terms  Payment method  … Check for duplicate invoice numbers

---

## Diapositiva 13

Sometimes services such as rent or maintenance are supplied on a regular basis with a periodic standard fee.  In these cases you can use recurring transactions. This functionality allows you to automatically generate purchasing, sales or inventory documents on a regular basis. Just set up a template where you select the frequency, date range and document type for the recurring transaction. Recurring transactions are also available for inventory documents as well as purchasing and sales marketing documents. In our business example, we have agreed with a vendor to lease some commercial space for one year. We set up the template to generate an A/P invoice for paying the lease amount each month. When we execute the template, the documents for the period are created. At the end of the period, a total of 12 invoices will have been triggered. 13 PUBLIC Recurring Transactions Agreement with vendor requiring monthly payments Create a template Recurring transactions template Template Name Transaction Type Recurrence Period Start Date Valid Until Lease A/P Invoice Monthly January 2020 December 2020 ...12 Invoices will be triggered during the period Execute Transactions

---

## Diapositiva 14

 For purchasing services, the A/P invoice is the only mandatory document in purchasing.  You have the option of using a purchase order to specify services required to the vendor.  Setting up item master data for a service can be useful for services you regularly buy or sell. Service items are entered on item-type marketing documents.  Using an item master allows you to track quantities used in regular purchasing and sales analysis, as well as eliminate data-entry errors.  A recurring transaction template can be useful for generating purchasing documents on a periodic basis. 14 14 PUBLIC Summary Here are some key points: For purchasing services, the A/P invoice is the only mandatory document in purchasing. You have the option of using a purchase order to specify services required to the vendor. Setting up item master data for a service can be useful for services you regularly buy or sell.  Service items are entered on item-type marketing documents. Using an item master allows you to track quantities used in regular purchasing and sales analysis, as well as eliminate data-entry errors. A recurring transaction template can be useful for generating purchasing documents on a periodic basis.

---

## Diapositiva 15

16 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

