# Transcripción por Diapositiva: 10_BinLoc_16_Serial_Serial

## Diapositiva 1

PUBLIC Bin Location Serial Numbers and Batches SAP Business One Version 10.0 Welcome to the course: Managing Serial Numbers and Batches in Bin Locations. This course is a part of a series of courses available for the Bin Locations topic. In this course we will cover the processes of purchasing, selling and managing serial number or batch managed items in a bin location managed warehouse. 1

---

## Diapositiva 2

At the end of this course, you will be able to describe how to allocate bin locations for serial numbers and batches in the sales and purchasing processes. 2 PUBLIC At the end of this topic, you will be able to:  Describe how to allocate bin locations for serial numbers and batches in the sales and purchasing processes. Objectives

---

## Diapositiva 3

This is the agenda for this course. Let us start with a business example. 3 3 PUBLIC Agenda  Business example  Purchasing process  Sales process  Differences in Batches

---

## Diapositiva 4

You have finished configuring the bin location setup at OEC Computers. You have also guided OEC Computers employees through performing allocation processes and executing inventory reports for bin locations. Since OEC Computers purchases and sells many items managed by serial numbers and batches, you explain George, the warehouse manager, and his employees, about the allocation process of these items. 4 4 PUBLIC Business Scenario  You have finished configuring the bin location setup at OEC Computers.  You have also guided OEC Computers employees through performing allocation processes and executing inventory reports for bin locations.  Since OEC Computers purchases and sells many items managed by serial numbers and batches, you explain George, the warehouse manager, and his employees, about the allocation process of these items.

---

## Diapositiva 5

In this course we will look at some typical business scenarios in OEC Computers. These scenarios include purchasing, selling and picking items managed by serial numbers in a bin location managed warehouse that can be implemented at OEC Computers. We will start by adding a Goods Receipt PO for tablet devices which are also managed by serial numbers. In the Goods Receipt PO we will allocate the tablets to the desired bin locations and update their serial numbers. After that, we will create three sales scenarios and examine different issue methods:  In scenario 1, we will issue a Delivery document that is not based on another sales document.  In scenario 2, we will see what happens when the Delivery document is based on a Sales Order.  In scenario 3, we will see how the pick and pack process is influenced by the issue method. Please note,  To simplify the explanations in this course, the scenarios refer to serial numbers and not to batches throughout the training. Nevertheless, most explanations are relevant also to batches. We will however cover the key differences between serial and batch related processes.  In addition the scenarios in this training refer to Goods Receipt PO and Delivery documents. However, the majority of the incoming and outgoing inventory processes are the same as with the Goods Receipt PO and the Delivery documents respectively. 5 5 PUBLIC Business Example Business Process integrated with Bin Locations and Serial Numbers Goods Receipt PO Allocation to Bin Location Complete/ Update S/N Purchasing Pick & Pack Delivery Allocation from Bin Locations Select S/N Sales Sales Order Sales Order Scenario 1 Scenario 2 Scenario 3 Delivery

---

## Diapositiva 6

Let us examine a short purchasing process that demonstrates allocation of items managed by serial numbers in bin locations. 6 6 PUBLIC Agenda  Business example  Purchasing process  Sales process  Differences in Batches

---

## Diapositiva 7

This is a general schema of the working processes for incoming bin location allocation of serial numbered items. As you are likely familiar, all items managed by serial numbers or batches have a management method assigned. The management method controls when serial numbers or batches are required. The two methods are: On every transaction and Release Only. As the graphic shows, the first method “On every transaction” will require you to assign a serial number when items are received into stock. When you create a goods receipt for the serial numbered item, the Serial Number – Setup window opens. There you assign the serial numbers and then the bin locations. When you have a serial numbered item that is managed by Release Only, there is no requirement to enter a serial number when the item is received into stock.  Therefore, when you create a Goods Receipt PO, you do not have to open the Serial Number – Setup window. Instead, you will use the Bin Location Allocation window, as you would with any other item not managed by serial numbers. If you do decide to add serial numbers when receiving an item managed by Release Only you can manually open the Serial Number – Setup window to enter serial numbers. Note, This is a general process only. The detailed working processes are affected when automatic allocations rules apply. In addition the Automatic Serial Creation definition in the Item Master Data, also affect working processes. Let us examine these working processes in the next slides. 7 7 PUBLIC Serial Numbers in Incoming Bin Location Allocation Method 2- Release only (Serial numbers are not mandatory) Method 1 – On every transaction (Serial numbers are mandatory) First Step • Go to the Serial Numbers - Setup window Second Step • Enter serial numbers Third Step • Allocate items to Bin Locations First Step • Go to the Bin Location Allocation window Second Step • Allocate to bin locations

---

## Diapositiva 8

In the graphic we see an item which has the serial number management method On Every Transaction. When this item is added to a Goods Receipt PO, we no longer have the option to open the Bin Location Allocation – Issue/Receipt window, like we would normally do with other items. As mentioned previously, we need to enter the allocation for the bin location from the Serial Number – Setup window, after entering the mandatory serial numbers. However, after serial numbers are assigned and the allocation is made, we will be able to change the allocation by using the link in the Bin Location Allocation field to open the Serial Number – Setup window. Let us see how the allocation process is done in the next slide. 8 8 PUBLIC Serial Numbers in Incoming Bin Location Allocation Method 1 - On Every transaction (1/2) In Method 1 - Bin location allocation is  done only via the Serial Number - Setup window

---

## Diapositiva 9

The image shows the two steps needed when receiving items with the management method On Every Transaction. For every row of the document with an item requiring serial numbers, you enter the Serial Number – Setup window. First, you enter the serial numbers. Once serial numbers are assigned, the system allocates a bin location automatically (assuming automatic allocation rules apply). You can also allocate a bin location manually. Note,  Documents may contain several rows. Some may be serials and some may not. When entering the Serial Numbers – Setup window, we see only the serial managed items.  Further more, when choosing a non-bin location managed warehouse in the document row, none of the bin location related fields or buttons are visible in the window. 9 9 PUBLIC Serial Numbers in Incoming Bin Location Allocation Method 1 - On Every transaction (2/2)  Bin location allocation First Step Second Step  Enter a serial number Step Step Method: On Every Transaction 1st 2nd

---

## Diapositiva 10

For serial numbered items with the management method Release Only, you can assign numbers either in the usual way in the Bin Location Allocation window or when assigning the optional serial number through the Serial Numbers – Setup window. If the Serial Number Management field in the Item Master Data record is set to On Release Only and the Automatic Serial Number Creation On Receipt box is checked, the system will automatically assign a bin location when adding the document, assuming automatic allocation rules apply. If no automatic receipt allocation rules apply then the incoming item is assigned to the system bin location. 10 10 PUBLIC Serial Numbers in Incoming Bin Location Allocation Method 2 – Release Only Do you want to set up serial numbers? Set up serial numbers and allocate bin locations via the allocation window or the serial numbers window Allocate bin location in the allocation window Yes No

---

## Diapositiva 11

Sometimes a large quantity of an item is received and you would like to redistribute the quantity into multiple bin locations. In the Serial Numbers – Setup window there is a way to distribute items from the Created Serial Numbers grid into bin locations. Choose the Reallocate Bin Locations button to open the Bin Location Reallocation for Serial Numbers window. The list of items is then copied to this window. To trigger the reallocation, just select the serial numbers to reallocate and choose the target bin in the Reallocate to Bin Location field. After update, the new bin locations appear in the Serial Numbers – Setup window. OEC Computers purchases large quantities of a tablets. Each tablet has a unique serial number and the quantity is too large for just one bin location. The warehouse employee opens the Serial Numbers – Setup window and updates the serial numbers for the whole quantity. When he finishes, he chooses the Reallocate Bin Locations button to open the Bin Location Reallocation for Serial Numbers window. Here he selects about 20 units and allocates them to a bin location. Then he selects another 20 and allocates them to another bin. The employee repeats this action until everything is allocated. This is an easy way to allocate large quantities of the same item rather than choosing the bin location in every serial row in the Created Serial Numbers grid. Note, reallocation is possible both for items which were already allocated and for those which were not allocated yet. 11 11 PUBLIC Serial Number Setup Reallocate Bin Locations Reallocation

---

## Diapositiva 12

As always with receiving serialized items, you have the option to have the system generate serial numbers for incoming items so that you do not need to enter the numbers manually. To do this, choose the Automatic Creation button to open the Automatic Serial Numbers Creation window. The Bin Location field allows selecting a bin location from a list filtered by the Warehouse field. Entering data in this field is optional. If it is populated then the same bin location code will be applied to all serial number rows created by this window. The Bin Location field will be updated automatically with the Default bin location if one exists. 12 12 PUBLIC Serial Number Setup Automatic Serial Number Creation

---

## Diapositiva 13

Some items that OEC purchases, such as tablet computers, are received into the warehouse without serial numbers. However, the company likes to assign serial numbers to them shortly after, for tracking purposes. In those cases, the items are set up with the management method On Release Only and received without serial numbers into bin locations. Later, George assigns serial numbers to these items using the Serial Number Management – Complete window. This window is accessed from the Serial Numbers Management window. We can see an example of this is the image. A Goods Receipt PO number 756 was created for 2 tablet units. Those 2 tablets were allocated to 2 different bins. The next step is to complete the serial numbers for the items and relate each serial to the relevant bin. In the Serial Number Management – Complete window, in the Created Serial Numbers grid, we first enter the serial number and then we can choose the relevant bin location from the list of bins entered for the item in the Goods receipt PO. When only one bin is chosen in the Goods Receipt PO for the whole quantity, then this bin is updated automatically in the Bin Location column of the Created Serial Numbers grid. 13 13 PUBLIC Complete Serial Numbers Inventory Item management Item serial Numbers Serial Number management  Complete Mode From the incoming inventory document Available bins to choose from

---

## Diapositiva 14

Changes or updates to existing serial numbers created can be done in the Update mode of the Serial Number Management window. The bin location code however can not be changed. The read only Bin Location column allows you to view in which bin location each serial is located. 14 14 PUBLIC Update Serial Numbers

---

## Diapositiva 15

Let us see the changes made in the sales processes. 15 15 PUBLIC Agenda  Business example  Purchasing process  Sales process  Differences in Batches

---

## Diapositiva 16

In OEC Computers, some items are picked according to their serial numbers and not according to their bin location. For example, OEC Computers resells custom-made servers according to special configuration ordered by the customer. All these servers have the same item code and every unique server is identified by its serial number. When the server is delivered to the customer, the server is picked according to its serial number. In SAP Business One, we can identify the picking method needed for these items by indicating the appropriate issuing method on the item master data record:  Method 1 – Issue Primarily By Bin Locations. In this method you first choose the bin location to allocate from and then choose a specific serial item stored within the chosen bin.  Method 2 - Issue Primarily By Serial and Batch Numbers. In this method you choose the serial number and then consequently the bin location the item is stored in. In OEC Computers, almost every item issue method is set to method 1 – Issue Primarily by Bin Locations, due to the following reasons:  First, in most cases when selling products, it does not matter to the customer nor to OEC Computers which exact serial number to issue.  Second, this method allows easy and fast picking because there is no need to look for a specific serial number.  In addition, this method enables maximum control of the storage arrangement in the different bin locations. Note that these two methods also affect scenarios where serial number selection and bin location allocation are not performed in the same document. For example, issuing a Sales Order with serials and then copying it to a Delivery where the bin location allocation is done. We will explore this scenario and another scenario involving the Pick and Pack procedure later on in this training. 16 16 PUBLIC Priority of Number or Bin Location Selection Introducing the Issuing Methods Method 1- Issue Primarily By: Bin Locations Method 2 - Issue Primarily By: Serial and Batch Numbers Choose the serial number The related bin is chosen First Step • Choose a Bin Location Second Step • From the chosen bin choose a serial number

---

## Diapositiva 17

Let us see how we define the issue method in the system. the issue method is defined in the Item Master Data and can be changed manually. The value in this field is defaulted from the General Settings Inventory Items Issue Primarily By field. Note, the settings of the field in Item Master Data cannot be changed if open sales orders with serial or batch allocations exist. In the next slides we will examine 3 scenarios: • Scenario 1 - a delivery not based on a sales order • Scenario 2 – a delivery based on a sales order • Scenario 3 – Pick and Pack procedure 17 17 PUBLIC Priority of Number or Bin Location Selection Definitions

---

## Diapositiva 18

Let us go back to OEC Computers. In the first scenario we issue a delivery not based on a sales order. OEC Computers sell their customer, Parameter Technology, two items. The first is a custom-made server that is issued primarily by serial numbers. The second item is a tablet item which is also managed by serial numbers but with an issue method primarily by bin locations. Let us see the differences in the allocation processes of these items. Look at the server item row. The Bin Location column is blocked and the only way to allocate the item from a bin location is by entering the Serial Number Selection window through the Quantity field. In contrast, the tablet item can be allocated from a bin location also by choosing the link arrow in the Bin Location Allocation column. It can also be allocated automatically assuming automatic allocation rules apply. In the image we see the tablet item was already allocated automatically. Note that when working with issue method Primarily By Serials and Batches, you need to first choose the serial numbers and then the associated bins will be allocated as well. In the next slide we will see how the allocation is made for each item. 18 18 PUBLIC Scenario 1 – Issuing a Delivery Not Based on a Sale Order

---

## Diapositiva 19

The Serial Number Selection window supports allocating bin locations for both issue methods. In the Available Serial Number grid, we can display the different sub level codes, bin location attributes and alternative sort code. The primary purpose of these fields is to assist the Auto Select functionality. The Auto Select simply selects serial numbers for the quantity required according to the current sort order of the Available Serial Numbers grid. The serial number selection can be managed by bin location sort sequences or attributes, even for an item which is set to issue primarily by serial number. The different functionalities available in the window behave differently according to the issue method of the item chosen in the Rows from Documents grid. In the image the server item is chosen which is issued primarily by serial numbers. Look at the available serial numbers for the server. The Serial Number column is displayed followed by the Bin Location Column. There are Filter and Find functions in the Available Serial Numbers header that allow selecting the relevant field to be filtered by and filtering the list displayed accordingly. The Filter By field supports the selection of the different serial number properties: Serial Number, Lot Number, Manufacturer Serial Number and System Number. When selecting the serial number the associated bin location is selected automatically. 19 19 PUBLIC Scenario 1 – Issuing a Delivery Not Based on a Sale Order Serial Numbers Selection Window – Issue Primarily By SN

---

## Diapositiva 20

Let us examine what happens to the Serial Number Selection window when choosing an item with the issue method Primarily by Bin Locations. In our example we have chosen the tablet item. Here, the Filter fields allow filtering by the bin location codes or warehouse sublevels. The Bin Location Column is displayed first followed by the serial Number column. Instead of the Auto Select button there is a Selection Method button. This button provides the regular bin location selection options in addition to the Auto Selection option. The Auto Select option selects bin locations according to their order of appearance in the Available Serial Numbers grid. 20 20 PUBLIC Scenario 1 – Issuing a Non-Based Delivery Document Serial Numbers Selection Window – Issue Primarily By Bin Locations

---

## Diapositiva 21

In the second scenario, a delivery is issued based on a sales order. In most cases, the process for allocating bin locations in a delivery will remain the same whether or not the delivery is based on the sales order. However there can be circumstances that affect allocation in the delivery. First let us look at issuing items primarily by bin locations. It is not possible to select serial numbers in a sales order for items set to this method. Therefore the allocation process in a Delivery document based on the sales order remains the same as described in the former slides. For items that are issued primarily by serial numbers, it is possible to select the serial numbers in the sales order. If serial numbers are not selected in the sales order, then the allocation process for the delivery remains the same as described in the former slides. However, if serial numbers were selected in the sales order, then the bin locations associated with the selected serial numbers are automatically allocated in the document. 21 21 PUBLIC Scenario 2 – Delivery Based on a Sales Order Issue Primarily by SN  and Batches Issue Primarily by Bin Locations Possible Not possible Serial selection in a Sales Order If serials were not selected  then select serials and the associated bin location If serials were selected in the Sales Order then the Bin Location is selected automatically in the document. Regular allocation according to the Issue Primarily by Bin Locations rules Allocation of serial numbers and bin locations in a delivery based on a sales order

---

## Diapositiva 22

The third scenario refers to the Pick and Pack process. This process changes according to the “Issue primarily by” method of each item involved in the process. The table displayed here lists the main differences between each issuing method in the pick and pack processes. For items issued primarily by serial numbers, all pick and pack functions can be performed only if serial numbers have been selected. For example, generating pick lists and creating a delivery is only possible when the serial numbers have already been specified in the sales order. If serials were not selected and the Release to Pick List button was chosen, then the system opens the Serial Number Selection window and thus enables selecting serials during the Pick and Pack procedure. For items issued primarily by bin locations, most pick and pack functions can be done in the regular way. It is not possible, however, to select serial numbers before a delivery document is created. Note that any differences that refer to creating deliveries are relevant also for creating invoices. 22 22 PUBLIC Scenario 3 - Serial Numbers in Pick and Pack Primarily By Bin Locations Primarily By Serial and Batch Numbers Function Not possible Possible Select Serials in the Pick and Pack Manager Generates pick list for all order lines Generates pick list only for orders lines already containing serials Generation wizard Subject to the regular wizard filtering Filter bin locations by selected serial numbers Generation wizard filtering Regular pick list behavior, without serial allocation Pick list cannot be edited or processed unless there is a full allocation of both SN and bin locations Released Qty field in the Released Drawer Serial numbers are selected when creating the Delivery Serial numbers should be selected first for the Sales Order Creating a Delivery based on a picked Sales Order Possible to open the Bin Location Allocation window and edit the bin location allocation Possible to open the Select Serial Number window and edit  the selection of both serial numbers and bin locations Bin location allocation changes in the pick list before the items are picked

---

## Diapositiva 23

Finally, we will go over the main differences in processes involving batch numbers instead of serial numbers. In addition we will examine a scenario for working with Batches using the FIFO allocation method. 23 23 PUBLIC Agenda  Business example  Purchasing process  Sales process  Differences in Batches

---

## Diapositiva 24

The purchasing and sales processes for batch-managed items in a bin location managed warehouse is similar to the processes of serial number managed items. In this section, we will review some of the differences between processes based on batch items and processes based on serial items. Look at difference number one. This is one of the more obvious differences. For batch managed items, the First Bin Location column is used instead of the Bin Location column. Since one batch number represents a group of items and not just a single item as in serial numbers. When choosing the link arrow of the First Bin Location, the Bin Location Content List opens filtered by the chosen batch. Look at difference number two. Since one batch can be stored in multiple bin locations, in the Batch - Setup window as well as in the Batch Complete and Update windows, the batch selection is done via the Bin Location Allocation – Receipt window. In the Batch Setup window, the link arrow in the Bin Location field opens the Bin Location Allocation – Receipt window. 24 24 PUBLIC Functionality Differences for Batch Related Items (1/2) First Bin Location column Batches Serials Bin Location column Batches are entered via the allocation window Serial numbers are entered directly in the setup window Difference No. 1 Difference No. 2

---

## Diapositiva 25

The last difference discussed in this training is the reallocation option in the setup window. The reallocation option we saw earlier in this training in the Serial Numbers – Setup window, does not exist in the Batches - Setup window. The main reason for this behavior is that unlike serial numbers, where each item purchased has its own serial number, a few batch numbers are usually associated with large quantity of items. For example, in OEC Computers, the Printer Label item is batch managed. The printer labels are purchased in dozens but each 10 units batch has one batch number. Therefor, in the example shown here, there are only five rows in the Created Batches grid and the allocation function is redundant. 25 25 PUBLIC Functionality differences for Batch related items (2/2) Batches Serials No Reallocation option Reallocation is possible Difference No. 3

---

## Diapositiva 26

In some cases, when working with batch managed items, there is a need to pick items by both issuing methods: bin location first and batch number first. Therefore a First Bin Location column exists also in the Available Batches table in the Batch Number Selection window – even for items which are primarily selected by batch and serial numbers. The First Bin Location column is also available in the Sales Order. Please note that this column is not visible by default. 26 26 PUBLIC First Bin Location in Batch Number Selection First Bin Location  First Bin Location column is available also for items managed by batch number first.  Enable choosing items by both batch number and bin location

---

## Diapositiva 27

In the Allocation processes in Bin Locations course, we were introduced to the FIFO-LIFO automatic allocation methods for outbound transactions. Companies that work mainly with items managed with batch numbers, can find these methods very useful. If the company’s policy is to issue the oldest items first then a good solution will be to use the FIFO allocation method. In the FIFO method the items are allocated according to the entry date of the item per bin location per batch or serial number. Let us examine the scenario demonstrated here. Item A is stored in two bin locations. Bin_1 contains two batches: batch_a and batch_b. Bin_2 contains batch_c. Let us say we need to issue a quantity of 2000 units of item A and we are using the FIFO method. The system looks for the batch with the earliest entry date. This will be Batch_b. Next, the system should allocate another 1,500 units and it looks for the batch with the next earliest date in sequence which is Batch_c. Even thought Batch_a is located in the same bin location as Batch_b the system knows how to trace the specific batch. 27 27 PUBLIC Using the FIFO Automatic Allocation Method with Batches Bin# Batch# Stored QTY of Item A Entrance date of the batch Bin_1 Batch_a 1000 1.7. Batch_b 500 1.5. Bin_2 Batch_c 2000 1.6. Row quantity = 2000 Quantity of 500 from Batch_b Quantity of 1500 from Batch_c

---

## Diapositiva 28

Here are some key points you can take away from this training: • With incoming allocation, when the management method of the serial or batch number is set to On Every Transaction – then bin locations can be allocated only in the Serial Numbers – Setup window. • In order to shorten a receipt process of serial or batch numbered items, you can first allocate the entire quantity to one bin location and then reallocate to different bin locations using the Bin Location Reallocation window. • In the Item Master data, define the Issue Primarily by method: bin locations or serial and batch numbers. Choose the second method if you need to choose a specific serial number or batch. • When the issuing method is set to Issue Primarily by Bin Locations, you cannot assign Serial or batch numbers in a sales order, only later on in a delivery or invoice. 28 28 PUBLIC Summary Here are some key points for working with serial numbers and batches in a bin locations managed warehouse: With incoming allocation, when the management method of the serial or batch number is set to On Every Transaction – then bin locations can be allocated only in the Serial Numbers – Setup window. In order to shorten a receipt process of serial or batch numbered items, you can first allocate the entire quantity to one bin location and then reallocate to different bin locations using the Bin Location Reallocation window. In the Item Master data, define the Issue Primarily by method: bin locations or serial and batch numbers. Choose the second method if you need to choose a specific serial number or batch. When the issuing method is set to Issue Primarily by Bin Locations, you cannot assign Serial or batch numbers in a sales order, only later on in a delivery or invoice.

---

## Diapositiva 29

• The same rule applies in the Pick and Pack process – selecting serial or batch numbers are available only when the issuing method is set to primarily by serial numbers and batches. • The issuing method also affect the pick list generation and the working procedures in the Pick Pack and Production wizard. • When working with batch numbers, since one batch contains several items, instead of the Bin Locations filed, the First Bin Location displays where the first item of the batch was allocated. • When choosing the link arrow of the First Bin Location in a document, the Bin Location Content List opens filtered by the chosen batch. • In the FIFO issuing method, the items are allocated according to the entry date of the item per bin location per batch or serial number and not just per bin location. This method assists in releasing older batches first. 29 29 PUBLIC Summary The same rule applies in the Pick and Pack process – selecting serial or batch numbers are available only when the issuing method is set to primarily by serial numbers and batches. The issuing method also affect the pick list generation and the working procedures in the Pick Pack and Production wizard. When working with batch numbers, since one batch contains several items, instead of the Bin Locations filed, the First Bin Location displays where the first item of the batch was allocated. When choosing the link arrow of the First Bin Location in a document, the Bin Location Content List opens filtered by the chosen batch. In the FIFO issuing method, the items are allocated according to the entry date of the item per bin location per batch or serial number and not just per bin location. This method assists in releasing older batches first.

---

## Diapositiva 30

30 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

