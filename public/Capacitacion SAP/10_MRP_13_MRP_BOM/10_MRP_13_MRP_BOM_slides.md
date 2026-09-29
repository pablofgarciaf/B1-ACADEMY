# Transcripción por Diapositiva: mal 10_MRP_13_MRP_BOM

## Diapositiva 1

PUBLIC Production and MRP Bill of Materials (BOM) Scenario SAP Business One Version 10.0 Welcome to the Bill of Materials topic in Materials Requirements Planning. This is an advanced topic within Materials Requirements Planning so we recommend you take the Introduction to Materials Requirements Planning first. In this course topic we frequently refer to a Bill of Materials with the acronym BOM and to Materials Requirements Planning as MRP. 1

---

## Diapositiva 2

2 PUBLIC At the end of this topic, you will be able to:  Run the MRP wizard for items with a bill of materials  Explain MRP results for BOM items Objectives At the end of this topic, you will be able to: Run the MRP wizard for items with a bill of materials. Explain the results that occur with different scenarios due to cumulative lead times, non-included warehouses and the inclusion of sales or assembly bills of materials.

---

## Diapositiva 3

3 PUBLIC Business Scenario  OEC Computers produces some of their items in-house.  These items have a bill of materials composed of inventory items, labor and resources  Some items they sell are kits based on an assembly bill of materials.  The procurement manager, would like to be able to plan ahead for sales demand and item availability using MRP for all these items.  OEC Computers produces some of their items in-house.  These items have a bill of materials composed of inventory items, labor and resources  Some items they sell are kits based on an assembly bill of materials.  The procurement manager, would like to be able to plan ahead for sales demand and item availability using MRP for all these items. 3

---

## Diapositiva 4

4 PUBLIC Contents  Using MRP for BOMs: Basics  Effects of Cumulative Lead Time  Effects of Excluding Warehouses  MRP for Sales or Assembly BOMs • Concepts and Basic Scenario for using MRP with Bills of Materials • Effects of Cumulative Lead Time • Effects of Excluding Warehouses • MRP for Sales or Assembly BOMs 4

---

## Diapositiva 5

MRP for BOMs: Basics 5

---

## Diapositiva 6

6 PUBLIC Example Bill of Materials BOM SKETCH Keyboard PC Labor resource (X2) Mother board Hard disk Memory card (X2) Parent Item (make): Child Items (make\buy): Grandchild Items (buy): Server Case Labor resource (X3) This graphic displays bill of materials we use in our basic scenario. This is a production BOM of a server. The top-level parent item is the server item. It is defined as a Make item in the Item Master Data window. The server is composed of a keyboard, a desktop PC and labor hours. The keyboard is defined as a Buy item. Labor is defined as a resource in the system in order to easily manage working hours quantity and costs. The resource item is not an inventory item so it is excluded from the MRP run. The PC item is defined both as a Make item and as a BOM in the system. The bill of materials is composed from the following items: a motherboard, a hard disk, 2 memory cards, a case and 3 labor hours. All these item are defined as Buy items. 6

---

## Diapositiva 7

7 PUBLIC Basic Concepts for Using MRP for BOMs Demand for a BOM item MRP run When we run MRP for an item with a production bill of materials, demand for the parent item generates requirements for the child items in all BOM levels MRP generates 3 types of recommendations for the child items:  Production Orders  Purchase Requests or Purchase Orders  Inventory Transfer Requests • Materials Requirements Planning (MRP) can be run for items produced in-house. These items are composed of items in a bill of materials that may also be produced in-house or purchased. • When we run MRP for an item with a production bill of materials, MRP calculates gross requirements for the highest BOM level by carrying down the parent demands through the BOM structure, to its lowest levels. This means that demand for the parent item generates requirements for the children items, for all BOM levels. • For any inventory items in the bill of materials, we can receive 3 types of recommendations: Production orders for produced items, Purchase documents for purchased items, and Inventory transfer requests for both kinds of items (assuming we chose to receive inventory transfer request recommendations and inventory is available in other warehouses) 7

---

## Diapositiva 8

8 PUBLIC Running MRP for the Parent Item parent item MRP Report Step 3 of the wizard child items When we run MRP for the parent item, it will automatically produce recommendations for all the items in the bill of materials in addition to the top level item. This behavior is due to the fact that once a demand exists for the parent item, another demand is generated for the child item for every level of the BOM. In our example, only the parent item was chosen in Step 3 of the MRP Wizard. However, all the child items appear in the MRP report along with the parent item. 8

---

## Diapositiva 9

9 PUBLIC Child Item Recommendations When an MRP run includes a child item, all demand for the item is presented. MRP Report BOM requirement Requirement not related to the BOM • When MRP includes a child item, all demand for the item is presented including direct demand for the item, not coming from its parent item. Recommendations will be given to all types of demand. • Here in the graphic we see that Week 5 demand for the PC Set includes not only the MRP requirement from the parent but also sales order demand for the PC set item. 9

---

## Diapositiva 10

10 PUBLIC Running MRP for a child item BOM requirement Requirement not related to the BOM Demand MRP Report for Hard Disk Child Item Pegging Information – Hard Disks • You may have items that you stock both for sale and as a child item in a bill of materials. • If you run MRP for an item one of these items, the MRP run will also consider not only the demand generated directly for the object but also demand from its inclusion in a bill of materials. • Here we see an MRP run for the hard disk child item.  Even though the parent item was not chosen in Step 3, we still see the demand derived from the parent item. • In the next section we will look at how lead times for child items can affect production of the parent item. 10

---

## Diapositiva 11

Effects of Cumulative Lead Time 11

---

## Diapositiva 12

12 PUBLIC Lead Time Definition Lead Time  Defined as time from when an item is ordered until received  Based on either time to manufacture or time to purchase  Used by MRP to schedule recommendations for child items  Specified in Days in Item Master Planning Data Item Master Data Planning Method MRP Procurement Method Buy Lead Time 2 Days • Lead time is the amount of time from when an item is ordered to when it is received into inventory, based on either the time to manufacture or the time to purchase. MRP uses lead time specified in the item master to determine when to schedule recommendations for child items. • Lead time is set in the item master on the Planning Data tab. 12

---

## Diapositiva 13

13 PUBLIC Cumulative Lead Time Concept M 1 T 2 W 3 Th 4 F 5 S 6 Su 7 M 8 T 9 Item Item Cumulative Number Description Lead Time S10001 Server 2+2+2 P10009 PC 2+2 C00999 Hard disk 2 C00009 Memory Card 2 C00098 Case 2 Time needed to purchase Time needed to build Time needed to receive components • In our example, we need the server to be shipped to the customer on Sunday morning, so we need to receive it into stock on Saturday. Once all the components are available, the server takes 2 days to build. Therefore we need to begin to assemble the PC on Friday. • Most components for the server are in stock, but the PC child item will need to be manufactured.  The PC will take 2 days to manufacture once its components are available.   Therefore, manufacturing the PC should begin on Wednesday. • The PC has 3 child items, all of which take 2 days to procure.  Therefore we need to send a purchase order to the vendor on Monday. • When we look at the chart, we see that the cumulative lead time for the server is 6 days.   2 days for the child components of the PC, 2 days to manufacture the PC, and 2 days to assemble the server. 13

---

## Diapositiva 14

14 PUBLIC Options Affecting Lead Time In Step 2 of the MRP Wizard, you have options that affect lead time:  Consider holidays  Ignore Cumulative Lead Time • In Step 2 (Scenario Details) of the MRP Wizard, you have a couple of options that affect lead time. • You can decide whether to consider holidays or not.  For example, you could decide to consider holidays for both production and purchase items if no production takes place during holidays and most deliveries from suppliers are also delayed due to local holidays. • Holidays are set up from a link in the Company Details window. • Another important definition is the Ignore Cumulative Lead Time check box. This definition is relevant for BOM items. If this checkbox is selected then the lead time will be taken from the lead time defined in the item master data. Otherwise, the lead time will be the cumulative lead times of all the recommended BOM components as shown in the previous slide. • In the next slide, we look at what happens when you choose the option to ignore cumulative lead time. 14

---

## Diapositiva 15

15 PUBLIC Option: Ignore Lead Time M 1 T 2 W 3 Th 4 F 5 S 6 Su 7 M 8 T 9 Item Item Cumulative Number Description Lead Time S10001 Server 2+2+2 P10009 PC 2+2 C00999 Hard disk 2 C00009 Memory Card 2 C00098 Case 2 Time to purchase Time to build Time to receive components • If you choose to ignore cumulative lead time in  step 2 of the MRP Wizard, the parent item lead time is the lead time defined for it in the Item Master Data. • In the image we see there is no dependencies between the different BOM levels and all items have a lead time of 2 days – as defined in the Item Master Data. • Note that since the production of any parent item is dependent on the child item lead time, it is recommended not to ignore the cumulative lead time 15

---

## Diapositiva 16

16 PUBLIC Report Item Number Item Description March 29 March 29 March 30 March 31 Future Data S10001 Server Initial Inventory Supply Demand Final Inventory P10009 PC Set C00097 Hard Disk Effect of Lead Times on Future Demand MRP Results Planning Horizon:  March 1 to March 30 10 10 10 10 10 • Sometimes future parent demand creates MRP item component requirements within the MRP planning horizon. This can happen when the lead times cause item component demand to be within the planning horizon. In those circumstances, the parent item demand will appear in the Future Data Column. • Recommendations that appear in the Future Data column are called theoretical recommendations.  These types of recommendations only exist for items with the procurement method “make”. • Here is an example: • The server is a parent item of a PC set and has requirements for April 2. • In the demand row of the server we see a demand for 10 server units within the future data period. • This demand created a recommendation within the Future Data column. In the next slide we will see how the cumulative lead time of the PC and Hard disk child items caused the recommendations to appear in the Future Data column. 16

---

## Diapositiva 17

17 PUBLIC Theoretical Recommendation: Lead Time Example The demand for the server is on April 2 MRP horizon is until March 31 Defined lead time = 1 day for each item Lead times are used to calculate when the first component (the hard disk) must be available to produce the PC and finally the server Item March 30 March 31 Future Data Server (parent) Demand + Theoretical Recommendation PC (2nd level parent) Recommendation Demand (MRP Requirement) Hard Disk (child) Recommendation Demand (MRP Requirement) Let’s look at how the demand for the server and the component lead times drive the requirements for the child items.  The demand for the server is on April 2, outside of the MRP run’s horizon. That’s why the demand for the server appears in the Future Data column.  Defined lead time = 1 day for each item  To have the server available on April 2, MRP generates demand for the PC for April 1 (which is also in the future).  To produce the server by April 2, MRP recommends to start by purchasing the hard disk on March 30.  Then we need to start building the PC on March 31.  Finally we need to manufacture the server on April 1 so it will be available April 2. 17

---

## Diapositiva 18

18 PUBLIC Pegging Information for Theoretical Recommendations Report Item Number Item Description  March 30   March 31   Future Data S10001 Server Initial Inventory Supply Demand Final Inventory P10009 PC Set C00097 Hard Disk MRP Results Planning Horizon:  March 1 to March 30 10 10 Pegging Information - BOM Item S10001 Supply Details: Type: Production Order Due Date:  April 2 Quantity: 10 Remarks: Theoretical Recommendation Pegging Information - BOM Item S10001 Supply Details: Type: Production Order Due Date:  April 2 Quantity: 10 Remarks: Supply from Theoretical Recommendation 10 10 10 We can see this within the MRP results by viewing the pegging information of the supply and recommendation values shown in the Future Data column. In each of the pegging information windows, we can see a remark indicating this is a theoretical recommendation. The purpose of this recommendation is to balance the future demand (instead of showing negative quantity). In the image we can see that the final inventory of the server parent item is clear. 18

---

## Diapositiva 19

Effects of Excluding Warehouses 19

---

## Diapositiva 20

20 PUBLIC BOMs and Excluding Warehouses in MRP Keyboard PC Labor Mother board Hard disk Memory card (X2) Server Case Labor  You can exclude a warehouse in Step 4 of the MRP Wizard.  Remember to ensure all child items are available in the included warehouses. When running the MRP wizard, you may wish to exclude a certain warehouse due to the warehouse location or other logistical considerations. In step 4 of the wizard you can choose which warehouse to include in the wizard run. When choosing this option, it is important to ensure that all child items in a BOM are available in the included warehouses. 20

---

## Diapositiva 21

21 PUBLIC System Message Example: BOM and Excluding a Warehouse Hard disk item is taken from warehouse 02 in the BOM definition Warehouse 02 is not included in the scenario No recommendation is generated Let us examine a scenario where the warehouse defined for the child item in the BOM definition is not included in the MRP scenario. In the upper image we see the PC set BOM definition. Look at the hard disk child item, it is taken from warehouse 02. Next look at the image of step 4 of the wizard. Note that we run the wizard by warehouse and that warehouse 02 is not included. With this scenario, when we run the wizard, before receiving recommendations, we receive an warning message saying no recommendations will be given to the BOM item since it cannot be produced. 21

---

## Diapositiva 22

MRP for Sales or Assembly BOMs 22

---

## Diapositiva 23

23 PUBLIC MRP for Sales / Assembly BOMs  You can run MRP for a Sales or Assembly BOM  Since the parent is not an Inventory item, it will not generate MRP recommendations  Recommendations are given for child items only  A compensating supply entry is added to the MRP report to balance the demand Phone Headphones Parent Item (non-inventory item) Child Items (inventory items) Media Kit • In addition to production BOMs, we can also run MRP for sales and assembly BOMs. • When running the wizard for a sales or assembly BOM (that is not an inventory item), SAP Business One does not issue an actual recommendation for the parent item. It issues only the requirements for its child items (either production or purchase documents, according to the procurement method of the child items). • Instead MRP generates a compensating entry in the supply row of the item to balance the demand and clear the final quantity. • Recommendations for the child items are issued in the regular manner, similar to child items in a production BOM. 23

---

## Diapositiva 24

24 PUBLIC Phone MRP Report for Sales and Assembly BOMs Recommendations are given to the child item No recommendations are given for the parent To view the parent item, select option on MRP Step 2 : • Here we see the MRP Report for our media kit. • As we saw in the BOM hierarchy on the previous slide, the media kit is an assembly BOM with 2 items: phone and headphones. • We do not manufacture the parent item but we want to make sure we have the media kit components on hand in time to meet the demand. • Our sales forecast predicts that we will sell 20 media kits each month. • However, when we run MRP we do not see recommendations for the Media Kit, only for the child items. • Because no recommendations are given for the media kit, it will only appear in the report if we select the option in MRP Step 2 to display items with no requirements. 24

---

## Diapositiva 25

25 PUBLIC Assembly Sales/BOM Pegging Information Demand came from forecasts for the parent item. The supply came from the child items in the assembly BOM. • To understand the process better we can open pegging information for the supply and demand of the media kit. • The pegging information for the demand tells us the demand was generated from a forecast. • To balance the demand the system created a supply entry for 20 units but no recommendation. • Look at the Type column of the supply pegging information. It says: Assembly Tree Balancing. 25

---

## Diapositiva 26

26 PUBLIC Summary  Three types of recommendations are possible for items with a bill of materials Production Orders for produced items (parent items) Purchase Documents for purchased items (child items) Inventory Requests for both types of items  When running MRP for a parent item, demand is displayed for all child items with bills of materials  When running MRP for a child item, demand is displayed for the item, including demand derived from the parent item  Cumulative lead time is the total time needed to produce a bill of materials, considering the lead time of all components  Recommendations in the Future Data column are called theoretical recommendations  When running the wizard by warehouse level, SAP Business One does not generate recommendations when the warehouse defined for the child item is excluded from the run  Sales and assembly BOMs can be planned with MRP but no recommendations are given for the parent item Here are some key points to take away from this course:  Three types of recommendations are possible for items with a bill of materials:  Production Orders for produced items (parent items)  Purchase Documents for purchased items (child items)  Inventory Requests for both types of items when they are coming from another warehouse.  When running MRP for a parent item, demand is displayed for all child items with bills of materials.  When running MRP for a child item, demand is displayed for the item, including demand derived from the parent item.  Cumulative lead time is the total time needed to produce a bill of materials, considering the lead time of all components.  Recommendations that appear in the Future Data column are called theoretical recommendations.  These types of recommendations only exist for items with the procurement method “make”.  When running the wizard by warehouse level, SAP Business One does not generate 26

---

## Diapositiva 27

recommendations when the warehouse defined for the child item is excluded from the run.  Sales and assembly BOMs can be planned with MRP but no recommendations are given for the parent item. 26

---

## Diapositiva 28

27 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and/or platform directions and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

