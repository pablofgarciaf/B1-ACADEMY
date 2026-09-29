# Transcripción por Diapositiva: 10_BinLoc_13_Process_Process

## Diapositiva 1

PUBLIC Bin Location Allocation Processes SAP Business One Version 10.0 Welcome to the course: Allocation Process in Bin Locations. This course is one of a series of courses available for the bin location subject. 1

---

## Diapositiva 2

At the end of this module, you will be able to:  Allocate items manually and automatically in the business processes: – Sales and Purchasing – Inventory – Pick and Pack – And Production 2 PUBLIC At the end of this topic, you will be able to:  Allocate items manually and automatically in the business processes:  Sales and Purchasing  Inventory  Pick and Pack  Production Objectives

---

## Diapositiva 3

This is the agenda for the current course. We will start by shortly reviewing the setup process we discussed in the Setup course of bin locations. Then, we will see how to perform manual allocation of incoming and outgoing transactions. After that, we will learn the different automatic allocation methods. After we get familiar with the automatic methods we will see how the system allocates items according to these methods. We will also examine different scenarios involving bin locations like making a change in the allocation made, copying and canceling a document, using drafts and more. Later on we will allocate items in inventory transactions. And finally we will see how the Pick and Pack and the Production processes are affected by the Bin Locations solution. But first, let us go over a short business example about OEC Computers and go over their Warehouse structure. 3 3 PUBLIC Agenda Business example Manual allocation processes  Incoming allocations  Outgoing allocations Automatic allocation processes  Incoming allocations  Outgoing allocations Additional Scenarios Bin Locations in inventory documents Allocations in Pick Pack and Production module Allocations in the Production process

---

## Diapositiva 4

You have just finished configuring the bin location setup at OEC Computers. You now proceed with the implementation of the bin locations module. OEC Computers buy goods from different manufacturers and distributers and then sell them to their customers. During these logistics processes, goods are allocated to and from bin locations. You advise the warehouse manager and his team on how to create manual allocations. In addition, you show the warehouse manager how to define the rules for automatic allocations, and how the rules are used in the business process. 4 4 PUBLIC Business Scenario You have just finished configuring the bin location setup at OEC Computers. You now proceed with the implementation of the bin locations module. OEC Computers buy goods from different manufacturers  and distributers and then sell them to their customers. When doing so, goods are allocated to and from bin locations. You advise the warehouse manager and his team on how to create manual allocations. In addition, you show the warehouse manager how to define the rules for automatic allocations, and how the rules are used in the business process.

---

## Diapositiva 5

To set up bin locations at OEC Computers, we first need to examine the structure of the warehouse. In the image, we can see the main warehouse of OEC Computers. The warehouse is a big hangar divided into aisles. Each aisle has shelves stretching along the sides and each shelf is divided into levels, as shown in the image. 5 5 PUBLIC Business Scenario OEC Computers Warehouse Structure Shelf  Shelf  Shelf Shelf

---

## Diapositiva 6

Let us get to know the sublevel structure of a warehouse managed by bin locations, so we understand how to define bin locations in OEC Computers’ warehouse. A warehouse structure often consists of a combination of different levels, such as an aisle, shelf, or floor. One area type can be a sublevel area of another type. At OEC Computers, for example, a shelf is a sublevel of an aisle. This means an aisle contains several shelves. SAP Business One supports up to 4 warehouse sublevels. A combination of the warehouse code and warehouse sublevels codes defines the unique bin location code. An example in the graphic can be the bin location code 05-A1-S2-L1. The same warehouse sublevel code can be used in many bin location codes. We can see that level L1 is connected to shelf S1 and shelf S2. 6 6 PUBLIC Warehouse Sublevels Structure Bin Location Code Composition - Example Warehouse 05 A1 S1 S2 L1 L2 L1 L2 Bin Locations Code A2 Warehouse Level Warehouse Sublevel 1 - Aisle Warehouse Sublevel 2 - Shelf Warehouse Sublevel 3 - Level A unique combination of the warehouse code and the warehouse sublevel codes

---

## Diapositiva 7

Now , let us see an example of a bin location code structure. We can see that the bin location code is a combination of the warehouse and warehouse sublevel codes. 7 7 PUBLIC OEC Computers: Bin Location Code Structure 01     – A4    – S2     – L9 Warehouse  - Sublevel1  - Sublevel2  - Sublevel3 Warehouse 01 – Aisle 4    - Shelf 2   - Level 9 Sublevel structure Bin Location Code in OEC Computers Details

---

## Diapositiva 8

Let us see how a manual allocation is made and get to know the allocation window. 8 8 PUBLIC Agenda Business example Manual allocation processes  Incoming allocations  Outgoing allocations Automatic allocation processes  Incoming allocations  Outgoing allocations Additional Scenarios Bin Locations in inventory documents Allocations in Pick Pack and Production module Allocations in the Production process

---

## Diapositiva 9

In marketing documents, inventory transactions, Pick and Pack procedure and production process you can allocate items to and from bin locations. The allocation occurs when issuing documents that create inventory transactions (including inventory counting process). Therefore, the bin location allocation option does not exist in documents like orders. In the following slides, we will follow a manual allocation process done in marketing documents for issuing goods from bin locations and receiving goods to bin locations. Let us  start with a short demonstration of the allocation made in a Delivery document. 9 9 PUBLIC Usage in Documents Marketing Documents Pick & Pack Production Inventory Transactions Bin Locations

---

## Diapositiva 10

Every inventory receiving document that involves a bin locations managed warehouse, requires allocation to specific bin locations. This allocation can be manual or automatic. We will start by learning about manual allocation in order to better understand the allocation mechanism. The allocation is made per document row in the Bin Location Allocation window. Before allocating, make sure the correct quantity and correct warehouse code are updated in the row. In order to manually allocate the quantity of the item in the row, choose the link arrow in the Bin location allocation field to open the allocation - receipt window. In the header of this window you can see information taken from the original document row like Document Number, Row Number, Warehouse Code and Item Number. You can also see the allocation quantity. In the matrix at the bottom of the screen, allocate the row quantity to the desired bin locations. You may choose a bin location code from a list or enter it manually. You may split the allocated quantity to many bin location codes. Use the CTRL+B keyboard combination to enter the remaining quantity in the Allocated field. The quantity allocated can not exceed the row quantity. You can clear the quantities allocated by choosing the Clear Allocation button. Note, you can access the Bin Location Allocation window also from the context menu. 10 10 PUBLIC Original row quantity Incoming Transaction Warehouse Manual allocation processes Incoming Allocations

---

## Diapositiva 11

 The Bin Location Allocation windows (receipt and issue) will open only when all of the following data exists in the chosen row: Item No., Quantity and Warehouse Code.  The quantity entered in the Allocated field, in the Bin Location Allocation window, is always positive, even if the line quantity in the document is negative. We will see negative quantity allocation in the next slides.  It is possible to have multiple warehouses in one document: bin location managed warehouses and regular warehouses.  After the document is added, choosing the link arrow in the Bin Location Allocation column, opens up the Inventory Posting List report, filtered for the transactions related to the relevant document line. This report can be very useful when receiving goods. The warehouseman can physically allocate items in their bin locations according the issued report. 11 11 PUBLIC Manual allocation processes Important Notes Mandatory information before allocation: Item Number, Quantity and Warehouse code. Allocation quantity is always positive. It is possible to have multiple warehouses in one document: bin location managed warehouses and regular warehouses. After the document is added, the link arrow of the Bin Location Allocation column opens the Inventory Posting List.

---

## Diapositiva 12

Now, we will see how automatic allocations are made. First we will examine the goods receiving process. We will learn the two automatic issuing methods for receiving goods and see how the allocation is done automatically. Then, we will examine the goods issuing process. We will go over the five automatic receiving methods and see an example for each one. We will also see what happens when allocation quantity is missing and what happens when changing the row details after allocation was made. But first, let us remember the two automatic allocation methods for receiving goods. 12 12 PUBLIC Agenda Business example Manual allocation processes  Incoming allocations  Outgoing allocations Automatic allocation processes  Incoming allocations  Outgoing allocations Additional Scenarios Bin Locations in inventory documents Allocations in Pick Pack and Production module Allocations in the Production process

---

## Diapositiva 13

In the Setup course topic we were introduced with the two automatic allocation on receipt methods:  The first method is to choose an automatic allocation strategy. There are different automatic allocation strategies. The strategy can be to choose a certain Default bin location or to allocate to the current or historical bin locations of the item.  The second method is to define certain  bin locations as Receiving bin locations. The Receiving bin location in SAP Business One can be a transit bin location that is used as an inspection area for quality checks or any other receiving procedures. The graphics demonstrated the two suggested process of allocating items received in the warehouse. On the left, we can see a process that can be used in a warehouse that work with automatic allocation strategies. In this process items are allocated directly to the storage bin locations. On the right, we can see a process that can be used in a warehouse that work with the Receiving bin locations method. In this process the items are allocated to a Receiving bin location. In the receiving bin location the items go through a goods receipt procedure. Then, the items are moved to the storage bin location. Let us take a closer look at these two options in the next slides. 13 13 PUBLIC Auto. Allocation Strategies Vs. Receiving Bin Locations Working with Auto. Allocation Strategies Working with Receiving Bin Locations Receipt procedure of the goods in the  Receiving bin location Storage Bin Locations Items are automatically allocated to the storage bin locations Inbound allocation documents Only purchasing documents Items are automatically allocated to the Receiving bin locations Inventory transfer to storage Bin Location

---

## Diapositiva 14

One main strategy in the list of the automatic allocation strategies is the Default bin location. These defaults, in contrast to the Receiving bin locations, are the storage bin location and not a temporary location. Default bin locations can be defined on a Warehouse, Item Group or Item level. An incoming transaction involving a Warehouse, Item Group or Item with a Default bin location, will be automatically updated with the Default bin location code defined in these entities (According to certain priority rules). This automatic allocation occurs once selecting an item in the document row, as long as the Quantity and Warehouse columns are defined. Default bin locations can be enforced at any level. Enforcing a Default bin location means allocation can not be done to any other bin location, even if another automatic allocation strategy was chosen in the Warehouse - Setup window. 14 14 PUBLIC Incoming Allocations Automatic Allocation Strategies - Default Bin Locations Priority 1: Item Level Default Priority 2: Item Group Level Default Priority 3: Warehouse Level Default  Regular storage bin location  Can be defined by the item, item group or warehouse level

---

## Diapositiva 15

In order to explain the other three strategies, we use an example. Look at the table displayed here. There are three bin locations. Bin_1 and Bin_2 currently have a non-zero quantity of item A. The quantity of Bin_1 was last entered on July 1st and the quantity of Bin_2 was entered on June 1st. Bin_3 has no current quantity of item A but on May 1st there was an inbound transaction of the item. The item was later sold and therefore the quantity in this bin location is currently zero. The Last Bin Location Used That Received Item strategy allocates the item automatically to the last bin location used in an inbound transaction to store the specific item in the specific warehouse. In our example, the system looks for the latest entry and therefore the item is allocated to Bin_1. In the Item’s Current Bin Location strategy the system allocates the item to a bin location that currently contains the item and according to the bin location code sequence. In our case there are two bin locations that currently contain this item: Bin_1 and Bin_2. The system chooses Bin_2 since the bin location code of Bin_2 appears before that of Bin_1 in an alpha-numeric sort order. When using the Item’s Current and Historical Bin Locations, the system allocates to Bin_3. In this strategy, the system looks for the first bin location code in an alpha- numeric sort order among all bin locations that ever received item A. A useful option SAP Business One provides in all automatic allocation strategies, is the ability to automatically allocate quantity up to the maximum defined for the bin location. In order to activate this option go to the Warehouse - Setup window and choose the checkbox: Receive Up to Maximum Quantity. In addition, if the allocation is done manually and the quantity exceeds to maximum defined, then a warning message is provided asking to approve this allocation. 15 15 PUBLIC Incoming Allocations Automatic Allocation Strategies – More Strategies Bin # Bin Location Code Current QTY of Item A Date of last entry of item A in the bin location Appears as first choice in the following method: Bin_1 01-A4-S1-L1 10 July 1st Last Bin Location That Received Item Bin_2 01-A1-S4-L3 12 June 1st Item’s Current Bin Location Bin_3 01-A1-S1-L4 0 May 1st Item’s Current and Historical Bin Locations

---

## Diapositiva 16

Let us get to know the second method of automatic allocation – working with Receiving bin locations. The Receiving bin location is a transit bin location that can be used as an inspection area for quality check or any other receipt procedures. Another reason for using Receiving bin locations can be to allow the receiving of goods to the warehouse even if the warehouseman does not know yet where to physically allocate the goods received. When working with Receiving bin locations, all incoming transactions are placed in the Receiving bin locations unless alternative bin locations are chosen manually in the document. The automatic allocation in the document occurs when adding the document. If the row quantity is not fully allocated, when trying to add the document, the system raises a message suggesting allocating to the Receiving bin location. When approving this message, the system will allocate the un-allocated quantity to the bin location defined as Receiving in the Bin Location Master Data window. After completing the receipt, the items received can be transferred, using an Inventory Transfer document, to a storage bin locations. Please note that companies may choose to use the Receiving bin location as a regular storage bin. In this case, the items will not be transferred to another bin location. Please also note that the Receiving bin location functionality is active only for purchasing document and not for inventory documents including: Good Receipt, Inventory Transfer, Receipt From Production and any incoming assembly BOM transactions. 16 16 PUBLIC Incoming Allocations Receiving Bin Locations  A transit bin location that is used as an inspection area for receipt procedures  After the receipt procedure the items are transferred to their regular storage bin location

---

## Diapositiva 17

This table summarizes the difference between the two different types of automatic allocation: When using one of the automatic allocation strategies, the bin locations are populated automatically in the document rows before adding the document. On the other hand, the Receiving bin locations are populated only after adding the document. In our example we use the automatic allocation strategies to allocate goods to the main storage bin location and the Receiving bin location as the in transit, reception area. In addition, in contrast with the automatic allocation strategies, after allocating to a Receiving bin location, we may transfer the items to the main storage bin. Finally, look at the last row. In purchasing marketing documents, when both automatic allocation strategy and Receiving bin locations apply for the document row then:  The system does not automatically allocate the item according to the automatic allocation strategy. This is also true when a Default bin location was enforced.  When adding the document, if no manual allocation has been made, the system suggests to allocate the unallocated quantity to the Receiving bin location. 17 17 PUBLIC Incoming Allocation Automatic Allocation Strategies Vs. Receiving Bin Locations Method 2 - Receiving bin locations Method 1 – Automatic allocation strategies After choosing the Add button After entry of item code, quantity and warehouse Automatic allocation occurs: Receiving Bin Location Main storage bin location Possible Target bin location: Transfer items to the main storage bin location None needed Possible Process after allocation: Allocation to Receiving bin location is suggested Allocation will not occur When both methods are defined:

---

## Diapositiva 18

 Here are some important notes concerning automatic incoming allocation:  When a Default bin location is enforced, then no matter which automatic allocation strategy is currently defined in the Warehouse – Setup window, the allocation is done to the Default bin location.  It is also important to know that in case you want to avoid any automatic allocation, just make sure the Default bin location allocation strategy is chosen and that there is no Default bin location defined in the warehouses, item groups and items.  And finally, note that in the Form Settings window you may choose another bin location for allocation, for the whole document. In this way you can override the automatic allocation strategy defined if necessary (unless Default bin location was enforced). Since this change affects all rows in the document, this action may be used to allocate items to a transit bin location from which the items will later be transferred to the main storage bin locations.  You may also want to refer to the Setup course unit for more details about the definitions needed for the automatic allocation on receipt. 18 18 PUBLIC Automatic Incoming allocation Important Notes An enforced Default bin location overcomes any automatic allocation strategy that is currently defined in the Warehouse – Setup window. To avoid any automatic allocation, just make sure the Default  Bin Location allocation strategy is chosen and that no Default bin location was defined. Allocation to a bin location can be done for the whole document in the Form Setting window.

---

## Diapositiva 19

After we covered the automatic incoming allocation methods let us discuss the automatic outgoing allocation methods. Allocation of items from bin locations can be done automatically when issuing documents that create outgoing inventory transactions. The quantity to allocate can be chosen from different bin locations in a certain order. The definition for this automatic allocation is done in the Warehouse – Setup window. This definition will apply to all issuing transactions. Having said that, it is also possible to manually change the automatic allocation method per outgoing transaction. We will learn how to do that in the following slides. Let us first go through the different automatic methods for issuing items from bin locations. 19 19 PUBLIC Setup Inventory Warehouse Outgoing Allocations Automatic Allocation on Issue Definition

---

## Diapositiva 20

In the table we see all issuing methods along with a short description. • The Single Choice method means that Automatic allocation only occurs when there is only one possible allocation option. • The Bin Location Code Order method means that items are allocated according to the alphanumeric order of the bin location codes. • The Alternative Sort Code Order method means that items are allocated according to the alphanumeric order of the Alternative Sort codes. • The Descending Quantity method means that items are allocated according to the descending bin location quantities. • The Ascending Quantity method means that items are allocated according to the ascending bin location quantities. • The Ascending Quantity  - Single Bin Preferred method means that items are allocated to the first bin location that contains the entire quantity in the list of ascending quantity. • Both FIFO and LIFO methods mean that items are allocated according to the order of the entrance date of the item in the bin location. In FIFO, the allocation starts from the earliest date and in LIFO from the latest. Let us explain each method with an example. 20 20 PUBLIC Outgoing Allocations Automatic Allocation Issuing Methods Description Issuing Method Automatic allocation occurs when there is only one possible allocation option. Single Choice According to the alphanumeric order of the Bin Location codes. Bin Location Code Order According to the alphanumeric order of the Alternative Sort codes. Alternative Sort Code Order According to the descending Bin Location quantities. Descending Quantity According to the ascending Bin Location quantities. Ascending Quantity Allocation is done to the first bin location that contains the entire quantity in the list of ascending bin location quantities. Ascending Quantity - Single Bin Preferred According to the entrance date of the item in the bin location, starting from the earliest. FIFO According to the entrance date of the item in the bin location, starting from the latest. LIFO

---

## Diapositiva 21

The first option in the list is Single Choice. Businesses may choose to work with this method if they want to carefully control the allocation process. This method will only trigger automatic allocation when one option of allocation is possible. Let us have a look at the examples illustrated here. In the table illustrated here we see three bin locations. In each bin location we see the stored quantity of item A. In addition, we see the Alternative Sort code of each bin location. In example 1 we need to allocate a quantity of 7 in the document row. In this case it is clear we need to allocate the whole quantity from each bin location. There is no other option for allocation. In example 2 we need to allocate a quantity of 3. This can be done by allocating quantity of 2 from Bin_1 + quantity of 1 from Bin_2. Another option for allocation is to issue a quantity of 3 from Bin_3. When SAP Business One recognizes there is more than 1 option of allocation, then no automatic allocation will be made. In this case a manual allocation is needed. 21 21 PUBLIC Automatic Allocation Issuing Methods Single Choice Bin # Bin Location Code Stored QTY of Item A Bin_1 01-A4-S1-L1 2 Bin_2 01-A1-S4-L3 1 Bin_3 01-A3-S1-L4 4 Example 1 Automatic allocation will occur Example 2 Automatic allocation will not occur Row quantity = 7 Bin_1 Bin_2 Bin_3 Row quantity = 3 Bin_1 Bin_2 Bin_3

---

## Diapositiva 22

The second and third methods perform allocation according to an alphanumeric order. An automatic allocation will be made whenever there is quantity available to allocate in any bin location. The Bin Location Code Order method will allocate quantity from bin locations according to the alphanumeric order of their bin location codes. Let us go back to our example table, this time we need to allocate a quantity of 3 of item A. On the left we see how the system allocates items to Bin Locations when using the Bin Location Code Order method.  SAP Business One looks for the first bin location code in an alphanumeric order – Bin_1.  The system allocates a quantity of 2 from this bin location and moves on to the next bin location in the list.  The second bin location codes in the alphanumeric order is Bin_2.  The system allocates the remaining quantity of 1 from this bin location. The Alternative Sort Code order method allocates quantity from bin locations according the alphanumeric order of their Alternative Sort code. As apposed to the bin location code, the Alternative Sort Code of the bin locations can be edited to form a different order of bin locations to allocate items from. The allocation logic is the same as we previously saw. On the right we see an example of using the Alternative Sort Code Order method.  SAP Business One looks for the first alternative sort codes using alphanumeric order.  In this case Bin_2 first because its alternative sort code is 00010. The system allocates a quantity of 1 from this bin location.  The second bin location in the Alternative Sort code order is Bin_3. The system allocates the remaining quantity of 2 from this bin location. 22 22 PUBLIC Automatic Allocation Issuing Methods Bin Location Code Order and Alternative Sort Code  Order Row quantity = 3 Quantity of 2 from Bin_1 Quantity of 1 from Bin_2 Bin Location Code Order Alternative Sort Code  Order Row quantity = 3 Quantity of 1 from Bin_2 Quantity of 2 from Bin_3 Bin # Bin Location Code Stored QTY of Item A Alternative Sort Code Bin_1 01-A4-S1-L1 2 00065 Bin_2 01-A1-S4-L3 1 00010 Bin_3 01-A3-S1-L4 4 00050

---

## Diapositiva 23

The fourth and fifth methods perform allocations according to the order of quantity of the item in each bin location. An automatic allocation is made whenever there is available quantity to allocate in any bin location. The Descending Quantity method allocates quantity starting with the bin location containing the largest quantity of the item. As before, we have a table with three bin locations. This time however, the three bins contain a total quantity of 5 of item A. On the left we see how the system allocates according to the Descending Quantity method. Using this method SAP Business One looks for the bin location with the largest quantity of item A. • The system allocates a quantity of 4 from Bin_3. • Then the system looks for the bin location with the next largest quantity of the item. That will be Bin_1. Therefor, the system allocates the remaining quantity of 1 from Bin_1. Now, let us look at the Ascending Quantity method example. The Ascending Quantity method allocates quantity starting with the bin location containing the smallest quantity. In the example on the right hand of the screen: • SAP Business One looks for the bin location with the smallest quantity of item A. • The system allocates a quantity of 1 from Bin_2. • Then the system looks for the next bin location with the smallest quantity of the item. • That will be Bin_1 from which the system allocates a quantity of 2. • Bin_3 will be the next in line to allocate the remaining quantity of 2. When considering which of these two methods to choose, you should keep in mind the following:  The Descending Quantity method involves the least number of bins possible for each transaction and therefore involves the minimum number of picks.  The Ascending Quantity method eventually reduces the number of bins used for an item since the bins with the smallest quantities are emptied first. 23 23 PUBLIC Automatic Allocation Issuing Methods Descending Quantity and Ascending Quantity Descending Quantity Ascending Quantity Row quantity = 5 Row quantity = 5 Quantity of 4 from Bin_3 Quantity of 1 from Bin_1 Quantity of 1 from Bin_2 Quantity of 2 from Bin_1 Quantity of 2 from Bin_3 Bin # Bin Location Code Stored QTY of Item A Bin_1 01-A4-S1-L1 2 Bin_2 01-A1-S4-L3 1 Bin_3 01-A3-S1-L4 4

---

## Diapositiva 24

When setting the FIFO or LIFO methods, the system checks the date of the last inbound transaction made in each single bin location. We can demonstrate this principle by looking at the example shown here. Look at the FIFO example on the left side.  The system looks for the earliest date out of the last inbound transaction dates of each bin location. This is why the system allocates from Bin_2. June 1st is earlier than July 1st.  Since no quantity was left to allocate in Bin_2 the system looks for the next bin location, in our example it is Bin_1. In the LIFO method the system looks for the latest date out of the last inbound transaction dates of each bin location, in our example it is Bin_1. The system can allocate the whole quantity from Bin_1. 24 24 PUBLIC Row quantity = 2 Automatic Allocation Issuing Methods FIFO and LIFO Bin # Bin Location Code Stored QTY of Item A Entrance date of the item to the bin location Bin_1 01-A4-S1-L1 2 Qty of 1 – 1.7 Qty of 1 – 1.5 Bin_2 01-A1-S4-L3 1 Qty of 1 – 1.6 FIFO LIFO Quantity of 1 from Bin_2 Quantity of 1 from Bin_1 Row quantity = 2 Quantity of 2 from Bin_1

---

## Diapositiva 25

No matter what method you have defined in the Warehouse Setup window, you can still change the issue method of the document and the document row before adding the document. To change the allocation method of the whole document, enter the Form Settings  Document Table tab and choose the automatic allocation method desired. You can also change the allocation method in the row, just enter the Bin Location Allocation – Issue window and choose the Automatic Allocation button. There you can choose the method desired from a list. In the example demonstrated here, we chose the Bin Location Code Order method. Once the option was chosen, the system automatically allocates the quantity. The table is sorted by the bin location code and the first bin location has only one unit of the item. For this reason, the system allocates a quantity of 1 from the first bin and another 1 from the second bin. In our business example, OEC Computers defined the Ascending Quantity method as the default in the New York warehouse because this method minimizes the number of bin locations for each item in the warehouse. However, when many bin locations are used for one item, it is more useful to use the Descending Quantity method.  With those items, the warehouse personnel can go to the Bin Location Allocation window, and choose this method from the Automatic Allocation drop down list. 25 25 PUBLIC Outgoing Allocation in Marketing Documents Changing allocation method in the document

---

## Diapositiva 26

The first option in the dropdown list for automatic allocation is Remaining. This option is not one of the methods defined in the Warehouse Setup window. Instead it is a way to control the order of allocation according to multiple parameters. The Remaining method allows you to use additional parameters that are not covered by the standard allocation methods. Using this method, you can prioritize the picking order of a delivery based on the order of additional fields that you add to a form. As you can see in the graphic, a number of additional fields are available in the Form Settings window. For example, OEC Computers can use the Remaining option to sort the allocation grid by Aisle, then Areas, and then Rows.  In this way, they can narrow down the picking area.  Bin Locations will appear in the allocation table, sorted by both their available quantity and by their physical location.  This is because the allocation is done in the order that bin locations appear in the table. In the example in the graphic, we see that the bin locations appear sorted by floor, area and then row. The system will allocate the quantity needed up to the maximum available in each bin and then move to the next bin on the list. 26 26 PUBLIC Outgoing Allocation in Marketing Documents Remaining method

---

## Diapositiva 27

We can conclude and say that the system allocates automatically whenever quantity exists in the warehouse used in the document row. In addition, when working with the Single Choice method, the system allocates automatically only when one allocation option exists. In all other cases you can choose to do one or more of the following:  Allocate manually.  Choose another automatic allocation for the whole document or document row.  Choose the Remaining option to allocate the items by the order you set. 27 27 PUBLIC Outgoing Allocation Process Conditions for automatic allocation The system allocates automatically when the following condition exists: Quantity exists in the warehouse Single Choice with one allocation option Any method but Single Choice AND ( OR )

---

## Diapositiva 28

Now that we are familiar with both automatic and manual allocation procedures, we are facing the question: when should we use each procedure. The general recommendation is to use automatic allocation when automatic methods meet business requirements. Automatic allocation saves time, prevents human mistakes and assures allocation is made according to the allocation rules defined. On the other hand manual allocation is flexible and allows a full manual control of each allocation. A good example when automatic allocation is useful will be when the same bin location is used regularly for a specific item. Then it make sense to set a Default bin location for this item. But, let us say, that the physical allocation to the bin locations is done first by the warehouseman, with no pre-defined rules, then, to match the actual allocation, we need to manually allocate the items in the document. In some cases we use automatic methods that combine manual allocation. For example, when using the Single Choice method for outgoing allocation, the system automatically allocates only when there is one allocation option. If that is not the case, we need to allocate the item manually. Remember that when automatic allocation rules are set, we can always change the allocation made before adding the document. 28 28 PUBLIC Automatic Allocation Vs. Manual Allocation Automatic Allocations  Fast process  No human mistakes  Optimize allocation according to allocation rules Manual Allocations  Flexible  Full manual control  Handle exceptions in automatic processes

---

## Diapositiva 29

In the additional processes we will see what happens when saving a document as draft and when cancelling it. 29 29 PUBLIC Agenda Business example Manual allocation processes  Incoming allocations  Outgoing allocations Automatic allocation processes  Incoming allocations  Outgoing allocations Additional Scenarios Bin Locations in inventory documents Allocations in Pick Pack and Production module Allocations in the Production process

---

## Diapositiva 30

The procedure described in the former slides was based on the assumption that there is a sufficient quantity to allocate. But what happens if there is not enough quantity to allocate? When there is insufficient quantity available in the warehouse, the available quantity is automatically allocated and the partial allocated quantity is displayed in red in the Bin Location Allocation field. We can see this in the image shown here. In the first row of the delivery – there is no quantity available to allocate for the item and therefore we see a zero in the field. In the second row there is only one unit available in the warehouse. When we enter the Bin Location Allocation – Issue window we can see that the quantity needed is 2 but the available quantity is only 1. Note, in this case, if there is available quantity in other warehouses, you may change the warehouse in the rows to fully allocate the quantity. Changing the warehouse in the row triggers the automatic allocation again. In case you add a document and you do not notice that the quantity was not fully allocated, the system opens the Bin Location Allocation – Issue window automatically to allow you to complete the missing allocation. 30 30 PUBLIC Insufficient Quantity in Outgoing Allocation Partial quantity available No quantity available

---

## Diapositiva 31

In some cases, in OEC Computers, the warehouse worker issues a Delivery document for items that are still located in the receiving area. This happens when, due to workload, the warehouse worker did not manage to enter an Inventory Transfer yet to the regular storage bin. Since the inventory transfer will be added eventually, the worker issues a Delivery document from the regular storage bin of the item. This transaction may lead to a negative quantity of the item in the storage bin. In situations where the quantity needed for allocation exceeds available quantity, you have an option to allow negative quantity.  To do this, you need to add the column Allow Negative Inventory. We see an example of this in the image. The total quantity needed to allocate is 3, but there are only 2 units available. After checking the Allow Negative Inventory box, we can allocate the full quantity. Note the available quantity left in this bin location after the allocation shows as -1 units. 31 31 PUBLIC Allow Negative Inventory in Outgoing Allocation

---

## Diapositiva 32

Sometimes, you may want to make changes to the row details after an allocation is made. For example, if you need to increase or decrease the quantity needed, or substitute a different item on the row. If you change the item or warehouse in the row, the system clears the allocation. The system will try to automatically allocate items if possible. This flow chart demonstrates what happens when the user changes the quantity in a row. If the original allocation was automatic, then an automatic allocation will occur for the new values. If you alter the quantity for a manual allocation, the system gives you the option to allocate manually or automatically. This behavior was designed with the assumption that if you originally made a manual allocation for this row, you may want to do it again. 32 32 PUBLIC Outgoing Allocation in Marketing Documents Process Making  a Change in the Row Details

---

## Diapositiva 33

When saving a document as a draft, all manual allocations are saved with it. Automatic allocations however, are not saved. Note, any update made in the Bin Location Allocation – Issue/Receipt window, causes the allocations to be considered as manual.  This is true even for updates that change an automatic allocation. 33 33 PUBLIC Automatic Allocation Working with Drafts  When saving a document as a draft, manual allocations are saved with it.  Automatic allocations are not saved.  Any update made in the Bin Location Allocation – Issue/Receipt window, causes the allocation to be considered as manual allocation.

---

## Diapositiva 34

There are two cancelation options of marketing documents:  The first is to copy the document to a reverse document (for example copy a Delivery to a Return document). When copying the document, all automatic processes for incoming and outgoing allocations apply in the normal way.  The second option is to choose the Cancel option from the context menu. – In this case a new document of the same type opens in Add mode and the items should be allocated again. – The allocations made in the original document are copied to the cancellation document. Automatic allocation processes also apply to documents that create inventory transactions and are copied from other base documents. 34 34 PUBLIC Cancel and Copy Marketing Documents Right click the document to enter the context menu

---

## Diapositiva 35

 When the line quantity is negative, for incoming transactions, the Bin Location Allocation – Issue window opens.  The Bin Location Allocation – Receipt window  opens for outgoing transactions with negative quantity. 35 35 PUBLIC Allocating Negative Quantities For negative quantity in an incoming allocation document,  the Bin Location Allocation – Issue window opens. For negative quantity in an outgoing allocation document, the Bin Location Allocation – Receipt window opens.

---

## Diapositiva 36

Let us see how allocations are made in inventory documents. 36 36 PUBLIC Agenda Business example Manual allocation processes  Incoming allocations  Outgoing allocations Automatic allocation processes  Incoming allocations  Outgoing allocations Additional Scenarios Bin Locations in inventory documents Allocations in Pick Pack and Production module Allocations in the Production process

---

## Diapositiva 37

Allocation procedures in Goods Receipt and Goods Issue are similar to those of the incoming and outgoing marketing documents respectively with one exception: In inventory documents, there is no automatic allocation to Receiving bin location. 37 37 PUBLIC Automatic Allocation in Goods Receipt and Goods Issue Incoming Transaction Warehouse Outgoing Transaction Warehouse

---

## Diapositiva 38

In our example, OEC Computers works with Receiving bin location. They then transfer the goods received, from the receiving area to the storage bin locations. Therefore, George enters several Inventory Transfers a day to transfer inventory from the Receiving bin location to the storage bin location. The Inventory Transfer document supports transfer between bin locations within a warehouse or between different warehouses. The From Warehouse, To Warehouse and To Bin Location fields in the header holds the default values for the fields in the grid. The inventory transaction will be made according to the values indicated in the rows. In the image we see another column called First Bin Location. Here we see the bin location without drilling down into the Bin Location Allocation window. In case multiple bin location were used, the system displays the first bin location used according to the allocation order. This structure allows the Inventory Transfer document to be created for multiple originating warehouses simultaneously. This ability is available even when bin location functionality is not activated for any warehouse. In any row where an originating or receiving warehouse does not manage bin locations, the respective from/to bin locations field is grayed out. 38 38 PUBLIC Allocation in Inventory Transfer (1/2) Warehouse Incoming Transaction Outgoing Transaction These fields contain the default values for the fields in the grid

---

## Diapositiva 39

Note, the inventory transfer creates the two kinds of allocations - incoming and outgoing allocations.  Choosing the From Bin Locations field link arrow opens the Bin Location Allocation – Issue window  Choosing the To Bin Locations field link arrow opens the Bin Location Allocation – Receipt window. 39 39 PUBLIC Allocation in Inventory Transfer (2/2)

---

## Diapositiva 40

You may choose to cancel or reverse an existing Inventory Transfer. In both cases, the system creates another Inventory Transfer document with opposite signs for the quantities. When canceling an Inventory Transfer, a cancellation Inventory Transfer is added automatically. When reversing an Inventory Transfer , a new Inventory Transfer document opens automatically in Add mode and can be changed manually before it is saved. In the new document:  The assignment of the From Bin Locations and To Bin Locations fields are reversed. The From Warehouse and To Warehouse fields are also reversed. Note the Reverse functionality is available even if bin location functionality has not been activated. 40 40 PUBLIC Cancelation and Reverse of Inventory Transfer Right click anywhere to receive the context menu

---

## Diapositiva 41

Let us go over the Pick Pack and Production module allocations procedure 41 41 PUBLIC Agenda Business example Manual allocation processes  Incoming allocations  Outgoing allocations Automatic allocation processes  Incoming allocations  Outgoing allocations Additional Scenarios Bin Locations in inventory documents Allocations in Pick Pack and Production module Allocations in the Production process

---

## Diapositiva 42

In the Pick Pack and Production Manager we create outgoing allocations for the Pick List. In the Open draw, choose the Release to Pick List button to enter the Pick List Generation Wizard.  In the first step you can filter the warehouse sublevels and attributes of bin locations you want to pick from.  Then, in the second step, you can indicate if you want to create several pick lists by splitting the order rows by a warehouse, warehouse sublevel or attributes and also choose the automatic allocation method.  Note, since this wizard can run for several warehouse simultaneously, the allocation method is not copied from the Warehouse Setup window. Therefore, the default method is set to Bin Location Code Order.  In the third step you can see and edit the list of the proposed pick lists about to be generated. In the grid, the system displays a column for each Warehouse Sublevel or Attribute chosen in the second step.  Choosing the Generate button creates the pick lists that appear in the table. A two steps wizard is provided for picking items from a-non bin location activated warehouse. Note, In some cases we will pick items from different rows, related to different warehouses, while some are bin locations managed and some are not. When doing so, a single pick list will be generated for all the document rows related to the non-bin location warehouses. The Pick Pack and Production Manager also allows you to create deliveries and invoices. The documents created are subject to the automatic allocation rules we covered earlier. Let us look at a business example. 42 42 PUBLIC Allocation in Pick and Pack Releasing Orders Outgoing Transaction Warehouse

---

## Diapositiva 43

Let us go back to our business example. In OEC Computers’ New York three-story warehouse, preparing a shipment for a delivery previously was a difficult task.  During the implementation, a decision was made to include the following steps to improve the process: First, George, the warehouse manager, nominated a warehouse worker for each floor. Second, from now on, when creating the pick lists, George creates a separate Pick List for each Floor by splitting the pick list in the Pick List Generation Wizard by the Floor warehouse sublevel. In addition, in the pick list, for each Floor, George indicates the picker’s name. For big shipments, George occasionally split the pick list also by the Area sublevel and assigns different pickers for different areas. George assesses the workload anticipated by looking at Number of Picks and Total Released quantity columns in the third step of the wizard. If needed George goes back one step to split the pick lists by another sublevel. 43 43 PUBLIC Pick and Pack Allocation – Business Example

---

## Diapositiva 44

There is an opportunity to make changes to allocations in the Released drawer. When you open the list of released rows, you can choose any link arrow in the Bin Location Allocation column to open the Bin Location Allocation – Issue window.  From there, you can reallocate row quantities or fill in missing quantities for allocations. A re-allocation is possible also for warehouse sublevels or Attributes that were not included in the Pick List Generation Wizard. For example, let us say that in the Pick List Generation Wizard I chose only Aisle A1. The system will automatically allocate only 6 items but I can still enter the Bin Location Allocation – Issue window and allocate another 4 items from Aisle A2. When choosing the Create button in the Released draw, you can create a Delivery or Invoice including the allocations made. 44 44 PUBLIC Pick and Pack – Released Drawer Choosing the link arrow opens the Bin Location Allocation – Issue window, there you can change the automatic allocation made

---

## Diapositiva 45

In the Pick List we see one row per bin location per Sales Order row. Before items are picked, you can still reallocate them. From the context menu select the Bin Location Allocation option. The Bin Location Allocation – Issue window appears and there you can change the allocations for this item. Note, reallocation is made per item per original document row, even if the item is allocated from several bin locations (and there for several rows in the Pick List). This means that quantity from several rows in the Pick List may be allocated in one Bin Location Allocation – Issue window. In the image we see a pick list containing 2 rows for the same item.  The item is split because the bin location in the first row is different than the bin location in the second row. SAP Business One allows you to save time by reallocating items directly in the Pick List rather than having to navigate back to the list of released items. This is useful because sometimes a picker may select items from different bins than those that were originally chosen in the Pick Pack and Production Manager. 45 45 PUBLIC Pick List Right click to enter the Allocation window

---

## Diapositiva 46

A Pick List can be created also directly from the sales order. Instead of generating a Pick List via the Pick and Pack Wizard, just right click the Sales Order and choose the option Generate/ View Pick Lists from the context menu. When doing so, a new Pick List is opened already containing the relevant items, warehouses and bin locations (according to the automatic allocation rules). This solution also supports companies that pick the goods of each sales order separately. You may follow this suggested process:  Issue the Open Items List report.  From the report, enter each sales order to be delivered.  Right click the order to generate the Pick List.  Assign the pick list to the pickers in the warehouse. Alternatively, you may issue a Sales Analysis report to receive a list of sales orders already filtered by certain items, customers, groups etc. Note that an automatic generation of the pick list will be done only if items can be fully allocated to bin locations. If not fully allocated then the first step of the Pick Pack and Production Wizard opens, already containing the sales order rows. Further more, the direct pick list option is available for both bin location and non-bin location managed warehouses and can also be issued from a Reserve Invoice. 46 46 PUBLIC Pick List from Sales Order Sales Order Pick List Delivery A\R Invoice

---

## Diapositiva 47

Finally we will see how the Production order was impacted by the Bin Location solution 47 47 PUBLIC Agenda Business example Manual allocation processes  Incoming allocations  Outgoing allocations Automatic allocation processes  Incoming allocations  Outgoing allocations Additional Scenarios Bin Locations in inventory documents Allocations in Pick Pack and Production module Allocations in the Production process

---

## Diapositiva 48

In the production process, bin locations can be specified in the Receipt from Production and Issue for Production documents. Automatic allocation rules apply to the allocation of the parent product to bin location and the allocation of its components from bin locations. When working with the Backflush method the component items are automatically allocated from bin locations.  In case automatic allocation rules do not apply (when working with Single Choice for example), then the system will allocate the components from the Default bin location.  If no Default bin location was defined then the allocation is made from the System Bin Location  (Read more about the System Bin Locations in the Setup unit). This allocation will probably cause a negative quantity in the System Bin Location since in most cases this bin location will not contain any quantity.  To complete the production procedure, and to clear the negative quantity created in the System Bin location, a manual Inventory Transfer is needed to allocate the components from their actual bin locations. Let us see in the next slide, the solution SAP Business One provides to override the need of a manual Inventory Transfer from the System Bin Location. 48 48 PUBLIC Production Process

---

## Diapositiva 49

This solution creates an Inventory Transfer to a production area warehouse. In order to use this solution you first need to define a warehouse for the production area. Then, add a Production Order and indicate the new production warehouse in the rows. After adding the Production Order, open the context menu to choose the Transfer Components option. A new Inventory Transfer opens, and the components from the Production Order appear in the rows. The To Warehouse is automatically populated with the production warehouse that was specified in the production order. When you add the Inventory Transfer, the items are then transferred to the production warehouse. Note that all component items are fully copied to the Inventory Transfer, even if the production order was partially manufactured. 49 49 PUBLIC Production Process Transfer Components Right click to enter the Component Transfer

---

## Diapositiva 50

This solution creates an Inventory Transfer to a production area warehouse. In order to use this solution you first need to define a warehouse for the production area. Then, add a Production Order and indicate the new production warehouse in the rows. After adding the Production Order, open the context menu to choose the Transfer Components option. A new Inventory Transfer opens, and the components from the Production Order appear in the rows. The To Warehouse is automatically populated with the production warehouse that was specified in the production order. When you add the Inventory Transfer, the items are then transferred to the production warehouse. Note that all component items are fully copied to the Inventory Transfer, even if the production order was partially manufactured. 50 50 PUBLIC Production Process Transfer Components

---

## Diapositiva 51

Here are some key notes:  In marketing documents, inventory transactions, Pick and Pack procedure and production process you can allocate items to and from bin locations.  Bin location allocation can be done manually or automatically by defining allocation rules.  There are two types of automatic incoming allocation:  Receiving bin locations – designated bin locations usually defined as a transit area.  Allocation strategies – different automatic strategies like default or current bin location. • There are several automatic outgoing allocation strategies like a certain bin location code order or according to the entrance date of the items to the bin location. • The Pick Pack and Production Wizard:  can be filtered and split by warehouse sublevel or attribute.  Shows the list of suggested pick list organized by warehouse sublevel and number of picks.  Items can be reallocated in a pick list according to the actual picking made. 51 51 PUBLIC Summary 1/2 Key notes:  In marketing documents, inventory transactions, Pick and Pack procedure and production process you can allocate items to and from bin locations.  Bin location allocation can be done manually or automatically by defining allocation rules.  There are two types of automatic incoming allocation: Receiving bin locations – designated bin locations usually defined as a transit area. Allocation strategies – different automatic strategies like default or current bin location. • There are several automatic outgoing allocation strategies like a certain bin location code order or according to the entrance date of the items to the bin location. • The Pick Pack and Production Wizard: can be filtered and split by warehouse sublevel or attribute. Shows the list of suggested pick list organized by warehouse sublevel and number of picks. Items can be reallocated in a pick list according to the actual picking made.

---

## Diapositiva 52

 In the production process:  Bin locations can be specified in the Receipt from Production and Issue for Production documents.  When working with the Backflush method the component items are automatically allocated from bin locations.  In case automatic allocation rules do not apply (including default bin location), the allocation is made from the System Bin Location.  To move inventory allocation from the system bin location to a designated production warehouse issue an Inventory Transfer document from the Production Order. 52 52 PUBLIC Summary 2/2 Key notes:  In the production process: Bin locations can be specified in the Receipt from Production and Issue for Production documents. When working with the Backflush method the component items are automatically allocated from bin locations. In case automatic allocation rules do not apply (including default bin location), the allocation is made from the System Bin Location. To move inventory allocation from the system bin location to a designated production warehouse issue an Inventory Transfer document from the Production Order.

---

## Diapositiva 53

53 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distr ibutors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be constr ued as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this docume nt or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies a t any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forwa rd-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undu e reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trade marks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companie s. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

