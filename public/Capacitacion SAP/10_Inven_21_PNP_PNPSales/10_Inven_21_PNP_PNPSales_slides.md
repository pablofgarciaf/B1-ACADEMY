# Transcripción por Diapositiva: 10_Inven_21_PNP_PNPSales

## Diapositiva 1

PUBLIC Items and Inventory: Picking Goods in the Sales Process SAP Business One Version 10.0 Welcome to the Pick and Pack in the Sales Process course topic. In this training we will learn how to work with the Pick Pack and Production Manager, learn how to produce Pick Lists and go through a pick and pack sales process. 1

---

## Diapositiva 2

After completing this topic, you will be able to:  Use the Pick and Pack Manager in a sales  process to create pick lists and sales documents.  Generate pick lists directly from documents. 2 INTERNAL At the end of this topic, you will be able to:  Use the Pick Pack and  production Manager in a sales  process to create pick lists and sales documents.  Generate pick lists directly from documents. Objectives

---

## Diapositiva 3

3 INTERNAL Introducing the Pick and Pack Module Create pick lists in sales process  Pick ordered items from the warehouse to deliver to the customer Create Pick list in Production process  Pick component items for production Create Pick list for inventory transfer  Pick items to be transferred from one warehouse or location to another Create documents in the picking Process: Delivery Invoice Issue for Production Receipt from Production Inventory Transfer Request Inventory Transfer The main purpose of the Pick and Pack module is to assist in picking goods in the warehouse The main purpose of the Pick and Pack module is to assist in picking goods in the warehouse. One of the main features of this module is the pick list. The warehouse employee can use the Pick List to collect the different items needed and mark them as picked. The Pick List can be used in: The sales process, when delivering goods to customers. The production process, when picking component items for production. And when items are to be transferred to another location or warehouse. In addition to creating pick lists, in the Pick and Pack Manager, we can also issue different documents relevant for the sales process, production process and inventory transfer. The main benefits deriving from these features are: Generating a batch of pick lists and documents in just a few clicks. Making the picking process easy, fast and accurate. Using the Pick and Pack Manager as a workbench from which the user can create sales, production and inventory transfer documents and thus minimizing the need to go into different modules in the system. 3

---

## Diapositiva 4

 OEC Computers resells computers and electronic equipment to retailers.  George is the warehouse manager of OEC Computers. He and his SAP Business One consultant, are about to implement the Pick and Pack module in the company. George wants to incorporate the Pick and Pack Manager in the sales process. He would like to create pick lists for items in sales orders that are about to be delivered to the customers. He would also want to create a packing slip to attach to the packages delivered.  You explain to George how to work with the Pick and Pack Manager in order to create pick lists. In addition you show how to leverage the Pick and Pack Manager to create deliveries and invoices based on the processed sales. 4 INTERNAL OEC Computers resells computers and electronic equipment to retailers. George is the warehouse manager of OEC Computers. He and his SAP Business One consultant, are about to implement the Pick and Pack module in the company. George wants to incorporate the Pick and Pack Manager in the sales process. He would like to create pick lists for items in sales orders that are about to be delivered to the customers. He would also want to create a packing slip to attach to the packages delivered. You explain to George how to work with the Pick and Pack Manager in order to create pick lists. In addition you show how to leverage the Pick and Pack Manager to create deliveries and invoices based on the processed sales. Business Example

---

## Diapositiva 5

5 INTERNAL Pick and Pack Sales Process in OEC Computers Create Sales Orders Pick the items for delivery and create Pick Lists Create a Delivery or Invoice based on chosen Sales Order rows In the Pick and Pack manager:  The image illustrates a common sales process in OEC computers up to the item delivery stage. A big part of this process can be done in the Pick and Pack Manager.  When Sales Orders are created, new records for the item rows of these documents are added in the Pick and Pack Manager.  Then, when delivery time arrives, the warehouse employee generates pick lists for the items about to be delivered to the customer.  After the items are collected, the warehouse employee can create a Delivery document for the picked items.  Note that the same process can be applied for Reserved Invoices in addition to Sales Orders. 5

---

## Diapositiva 6

6 INTERNAL Pick and Pack Manager Inventory Pick and Pack Pick and Pack Manager Let us get to know the Pick and Pack Manager. The first step in the Pick and Pack Manager is to filter the relevant data in the Selection Criteria window. Here we can choose the base documents for which the pick lists will be generated. Then, we can filter the base documents according to different filtering criteria such as document date, certain items or even a user-defined field (UDF) that was added to the base document. Filter options vary according to the base document chosen. In some cases, George filters the sales orders by delivery date to pick only the documents planned to deliver that same day. In addition, OEC Computers manage a UDF for distribution areas, and in order to deliver documents per area, George also filters by this field. In this case George wants to see all Sales Orders and Reserve invoices document rows. Note the Open status means rows that were not picked yet, nor released to pick list. Once he choses OK, the Pick and Pack Manager opens and displays 3 drawers: Open, Released and Picked. Let us go to the next slide to understand what kind of data we can find in each drawer. 6

---

## Diapositiva 7

7 INTERNAL The Pick and Pack Manager Drawers Open Released Picked Open document rows before creating pick lists. Open document rows that were released to pick lists but were not picked yet. Open document rows that were already picked.  The Open drawer - contains all open document rows that were not picked yet.  The Released drawer - contains all open document rows that were already copied to pick lists but have not been picked yet.  The Picked drawer – contains all open document rows that were already marked as picked in the pick list.  The drawers are ordered from left to right, according to the traditional sales process but each drawer can be accessed at any time. 7

---

## Diapositiva 8

8 INTERNAL Pick and Pack Manager Information  Inside each drawer we can see various information about the document rows.  In addition to the rows information like the item details and customer details we can also see here other important information needed in the picking process, for example the open quantity to be picked.  The open quantity is copied into the To Release column. This allows you to release a smaller quantity to the pick list if you choose.  The Available to Release column displays the cumulative quantity of what is available in the warehouse. Notice that each row is dependent on the amounts proposed for picking in prior rows. This column allows you to double-check available quantities in the warehouse. 8

---

## Diapositiva 9

9 INTERNAL Release to Pick List  Let us go back to our process. George chooses the sales order rows to be released and then chooses the Release to Pick List button. This button triggers a two step wizard. In step 1, we can choose whether to create one pick list for all order rows or to split the rows to multiple pick lists according to parameters you choose. Some examples of parameters are business partners, documents, item groups or warehouses.  George decides to create one pick list for each customer, so he splits the pick lists by business partners. In this case, since two customers are involved in the sales orders, two pick lists will be generated, and later on, two pickers will be assigned, one for each pick list. 9

---

## Diapositiva 10

10 INTERNAL Generate Pick List from the Pick and Pack Manager In Step 2 of the wizard, the user can change data to specify a picking day, change the picker’s name or enter remarks for the pick list  In step 2 we see the pick lists about to be generated.  In our case we see three. George manually assigned the first pick list to Bill and the other two to Betty. In addition he added a remark for the first pick list indicating this order should be picked ASAP.  George chooses the Generate button and thus creating three pick lists. We will see them in the next slide.  Sales Order rows that were released to pick lists and were not picked yet, appear in the Released drawer in the Pick Pack and Production Manager.  Note: when working with bin location managed warehouse, the Pick List Generation Wizard includes another step. 10

---

## Diapositiva 11

11 INTERNAL The Pick Lists Inventory Pick and Pack Pick List  Here are the two pick lists that were generated, one for each customer. Note that the pick list on the right (No. 9) contains two sales orders for the same customer. Later on these items can be packed and shipped together. Bill and Betty, each received a pick list. Looking at Bill’s pick list image, we can see that she managed to pick all items and indicated that manually in the picked column. In addition the status of the pick list is Picked. We can also see the remarks George added to Betty’s pick list, previously in the Pick List Generation Wizard.  In the pick list rows, we can see, for each order row, the ordered quantity, the released/Picked quantity and the available quantity in inventory.  The pick lists can be found in the Inventory Pick and Pack Pick List menu entry. 11

---

## Diapositiva 12

12 INTERNAL Creating Documents from the Pick and Pack Manager  Let us go back to the Pick and Pack Manager to continue with the sales process.  George opens the Picked drawer to make sure orders were picked and to create Delivery documents for the picked sales order rows. He does that by choosing the Create button which appears in all drawers.  There are several options for creating documents from the pick list. The types of documents available depend on the base document. Since our example pick list contains Sales Orders rows, only a Delivery or an A/R Invoice can be created.  When choosing the Manual Delivery option, a Delivery document is opened in Add mode, already containing all information needed. This information can be edited if needed and then added to the system. George chooses the Automatic Delivery option since he doesn’t wish to change any data. In this case, deliveries will be created per customer, behind the scenes (as long as all conditions for creating the delivery exist).  Other creation options will be discussed in the next Pick and Pack course topics. Furthermore, in the appendix you can find different creation options for different base documents. 12

---

## Diapositiva 13

13 INTERNAL Packing slip From the context menu of an existing Delivery or Invoice, choose: Packing Slip  Before shipping the goods to the customer, a Packing Slip can be generated and printed for a Delivery or an A/R Invoice.  The Packing Slip is generated from the context menu of the Delivery or Invoice.  In the Packing slip, the warehouse employee chooses the relevant package from the list of package types, that was already defined in Administration Setup Inventory  Package type.  Then, the warehouse employee moves the Available Items from the left of the Packing Slip to the Package Contents on the right, using the arrow.  This employee prefers to update the slip while physically packing the items. When this process is done, the warehouse employee updates the Packing Slip, prints it and attaches it to the package.  Note that a total weight is calculated only when managing weight for the items in the Item Master Data. 13

---

## Diapositiva 14

14 INTERNAL Generating Pick List Directly from a Document  A pick list can be generated directly from a Sales Order, a Reserve Invoice, a Production Order and an Inventory Transfer Request.  This is done by choosing the option Generate Pick List from the context menu.  It is also possible to view the existing pick lists related to the specific document. Generating a pick list directly from a specific document can be a quick option to handle the picking of that one document. This functionality is available to all base documents that are available in the Pick Pack and Production Manger: Sales Orders, Reserve Invoices, Inventory Transfer Requests and Production Orders. Open the context menu and choose one of the following options: Generate Pick List  - this option generates and opens a pick list for the open document quantity if there is a single picking choice for that quantity (e.g. when all items are in a single bin location). Otherwise the Pick and Pack Manager is opened. View Pick Lists – this option opens any already existing pick lists related to that document. In our business scenario, George uses this option when a pick list is needed urgently instead of using the Pick and Pack Manager. After the Sales Order is added, George generates a pick list directly from the document. All relevant data from the document is then copied to the pick list. Then he reviews the content of the pick list and adds it. 14

---

## Diapositiva 15

15 INTERNAL Processing Documents With Non-Inventory Items • Non inventory item rows can be processed in the Pick and Pack Manager and therefore can be used in document creation • Including non-inventory items in the Pick Pack and Production Manager, endure these items are invoiced. It is also possible to process document rows with non-inventory items in the Pick Pack and Production Manager. In real life, non-inventory items such as technician or support fees, often appear in sales documents. Non-inventory item document rows can be processed in the Pick Pack and Production Manager as well. These document rows can be included in pick lists and can be copied to a delivery or invoice via the Create option. Note that non-inventory items cannot be copied to an inventory transfer document. Also note that production resources can also be copied to a pick list. We will further discuss it in the Pick and Pack in Production course topic. Including non-inventory items and production resources in the Pick Pack and Production Manager is a great way to ensure they are invoiced or consumed. 15

---

## Diapositiva 16

16 INTERNAL Key Points – Page 1 Key points from this topic: The Pick Pack and Production Manager supports different processes in the system including: Sales, Production and Inventory transfer. The Pick Pack and Production Manager enables mass creation of pick lists and also generation of documents. The Pick Pack and Production Manager has three drawers to display different document row statuses: open, released and picked. When releasing the items for picking, a 2-steps wizard is opened, offering different options for the pick list creation such as splitting pick lists and changing mass data. The picked quantity is updated in the pick list and thus transforms the items row’s status to Picked. Here are some key points to take away from this session:  The Pick Pack and Production Manager supports different processes in the system including: Sales, Production and Inventory transfer.  The Pick Pack and Production Manager enables mass creation of pick lists and also generation of documents.  The Pick Pack and Production Manager has three drawers to display different document row statuses: open, released and picked.  When releasing the items for picking, a 2-steps wizard is opened, offering different options for the pick list creation such as splitting pick lists and changing mass data.  The picked quantity is updated in the pick list and thus transforms the items row’s status to Picked. 16

---

## Diapositiva 17

17 INTERNAL Key Points – Page 2 Key points from this topic: Different documents such as Deliveries and Invoices can be created from the Pick Pack and Production Manger for Sales Order rows, thus allowing the user to work from one window. Packing slips can be made for a delivery or invoice from the context menu of the document. Instead of opening the Pick Pack and Production Manager, a user can quickly create a pick list for an individual document from the context menu of any sales order, A/R reserve invoice, production order or inventory transfer request. Non-inventory items can also be copied to pick lists and target documents, thus allowing an all-inclusive sale process from the Pick Pack and Production Manager.  Different documents such as Deliveries and Invoices can be created from the Pick Pack and Production Manger for Sales Order rows, thus allowing the user to work from one window.  Packing slips can be made for a delivery or invoice from the context menu of the document.  Instead of opening the Pick Pack and Production Manager, a user can quickly create a pick list for an individual document from the context menu of any sales order, A/R reserve invoice, production order or inventory transfer request.  Non-inventory items can also be copied to pick lists and target documents, thus allowing an all-inclusive sale process from the Pick Pack and Production Manager. 17

---

## Diapositiva 18

18 INTERNAL Appendix Document Creation Options – Mapping Table Base document rows (Existing documents) Create Option (New documents to be created) Sales Orders, Reserve Invoices Manual + Auto Delivery Sales Orders Manual Invoice Production Orders* Issue for Production Production Orders Receipt From Production All document type rows except for Inventory Transfer Request Inventory Transfer Request All document type rows Items/ Components Transfer Inventory Transfer Request Inventory Transfer * Excluding Backflush items  The options from the Create button in the Pick Pack and Production Manager drawers are context sensitive.  The table shown here lists the options available for document creation for each type of base document rows.  Not all rows need to go to the same document. You can choose the rows you want to be included in each document you create.  For example, you can create an Issue for Production based on production order rows only. The user can only choose rows that are not set as backflush items.  If you try to create new documents based on document rows that are not relevant for a certain type of document, the system displays a relevant error message.  The Items/ Components Transfer create option, generates an Inventory Transfer document. The main difference between the Items/ Components Transfer option and the Inventory Transfer option is the purpose of each created document. The purpose of an Inventory Transfer is to complete the process initiated by the inventory transfer request. The purpose of the Items/ Components Transfer option is to transfer goods to a picking area.  Note that when creating an Inventory Transfer from any document other than Inventory Transfer Request, the warehouse and bin location information is copied to both the from and to warehouse and bin location fields. The user can then change the content of these fields manually. 18

---

## Diapositiva 19

19 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

