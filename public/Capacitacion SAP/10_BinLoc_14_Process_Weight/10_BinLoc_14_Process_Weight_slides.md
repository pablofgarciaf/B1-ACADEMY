# Transcripción por Diapositiva: 10_BinLoc_14_Process_Weight

## Diapositiva 1

PUBLIC Bin Location Allocation with Weight Restriction SAP Business One Version 10.0 Welcome to the Allocation with Weight Restriction in Bin Locations course topic. You must have a good knowledge of inventory, UoM and bin location management in order to fully understand the content of this course. 1

---

## Diapositiva 2

After completing this training, you will be able to:  Assign and track weight for items and bin locations  Enabling allocation to bin locations according to weight restriction 2 PUBLIC At the end of this topic, you will be able to: Assign and track weight for items and bin locations Enable allocation to bin locations according to weight restriction Objectives

---

## Diapositiva 3

 OEC Computers resell computer and electronic equipment to retailers in the UK.  OEC Computers have already implemented the bin locations and UoM solution in the company.  George, the warehouse manager, would like to start manage weight for the items in the warehouse. A weight indication per item will allow him to monitor the weight of items in storage and limit the weight for carrying and loading goods up to the standard allowed.  George, has asked you, his SAP Business One consultant, to help him manage weight for items and bin locations in the warehouse. 3 3 PUBLIC Business Scenario  OEC Computers resell computer and electronic equipment to retailers in the UK.  OEC Computers have already implemented the bin locations and UoM solution in the company.  George, the warehouse manager, would like to start manage weight for the items in the warehouse. A weight indication per item will allow him to monitor the weight of items in storage and limit the weight for carrying and loading goods up to the standard allowed.  George, has asked you, his SAP Business One consultant, to help him manage weight for items and bin locations in the warehouse.

---

## Diapositiva 4

Let us start by looking at the Weight field in the Item Master Data. This is the weight of the inventory UoM of the item. In the image we can see the Printer Paper item. We can see that this item is related to the Paper group and that 1 Pack of Printer Paper equals 1 kilogram. Note that each time we update the Weight field of the Inventory Data, the system prompts a massage asking if we want to copy the inventory UoM weight to the sales and purchasing RUoM. The weight is then copied proportionally, according to the conversion rules defined between the different UoM codes in the UoM group. This functionality allows us to update all three weight field at once. 4 4 PUBLIC Weight Indicator in the Item Master Data

---

## Diapositiva 5

Setting the weight for the inventory UoM of the item allows us to monitor and track item weight in the warehouse. It can also be used to limit the weight lifted and carried for the warehouse employees or warehouse machinery. In the example shown here, we can see that the forklift has a weight limitation of 500 kg.  Since we manage weight for the inventory UoM of the item, we can easily calculate how many items we can load on the forklift without having to weigh the items each time.  1 pack of printer paper weighs 1 kg and this means that a forklift can carry 500 packs of printer paper. 5 5 PUBLIC Inventory UoM Weight Indicator – Business Example Monitor Inventory UoM weight to avoid overweight in carrying and loading goods  A forklift weight limitation = 500 kg  1 pack of paper = 1 kg  A forklift can carry 500 packs of printer paper

---

## Diapositiva 6

The bin location solution allows different automatic allocation rules. This solution includes an allocation restriction by weight. We can define for each bin location its weight capacity. We also already saw that we can define the weight of the inventory UoM of the item. These definitions enable performing a bin location allocation up to the maximum allowed for each bin. 6 6 PUBLIC Allocation by Maximum Weight - Concept Allocation by weight principles: We can define weight for the inventory UoM of the items We can define weight capacity for each bin location We can then choose to restrict item allocation according to the bin location weight capacity. 10 Kg

---

## Diapositiva 7

Look at the example demonstrated here. We want to allocate hard disk items. Each hard disk weighs 1 kg. We have 2 bin locations: Bin 1 and Bin 2. Each has a weight restriction of 100 kg. Bin 1 has already an existing inventory of 80 kg. Bin 2 is empty. There is also an allocation rule. According to this rule, allocation is done to Bin 1 first and then to Bin 2. We can see that when allowing weight restriction to a bin, the system will allocate only 20 kg to Bin 1 and the rest to Bin 2. 7 7 PUBLIC Allocation by Maximum Weight - Example Maximum weight defined = 100kg Existing inventory in the bin = 80kg  Maximum weight restriction for each bin = 100 Kg  50 hard disk units to allocate. Each hard disk weighs 1 kg =>  A total of 50 Kg to allocate Bin 1 Bin 2 Only 20 units are allocated to this bin All 80 units left are allocated to this bin Current bin Quantity Empty bin

---

## Diapositiva 8

In the Warehouse – Setup window we indicate if we want to use the rule of allocation up to the maximum weight. We can define this rule for both Receiving and regular non-Receiving bin locations. For regular bin locations we can add a weight validation in addition to any allocation rule on receipt. Note that this definition is relevant for both automatic and manual allocation. For Receiving bin location, we can add a validation for the maximum quantity, weight or quantity and weight. Both maximum weight and maximum quantity are defined in the Bin Location Master Data. Let us it in the next slide. 8 8 PUBLIC Warehouse Setup - Maximum Weight Allocation Definition Receiving Bin Locations Automatic allocation rules Set weight allocation rules in the Warehouse Setup window:

---

## Diapositiva 9

Look at the fields Item Weight and Maximum Weight in the Bin Location Master Data. The Item Weight field is an information field showing the total weight of the items currently stored in the bin location. This total weight is a calculation of the quantity of each item in the bin location multiplied by the weight defined for the inventory UoM of the item. The Maximum Weight field is the maximum weight allowed for this bin location. This information is entered by the user. Note:  If no value is entered in the Maximum Weight field, then there will be no weight restriction applied to this bin location.  In addition, if a weight restricted bin location contains an item without weight definition then this item will not be taken into account in the weight calculation of the bin location. 9 9 PUBLIC Weight Fields in the Bin Location Master Data Information only Defined by the user

---

## Diapositiva 10

 So what happens when an allocation is about to occur? For example when entering a Goods Receipt PO document and the maximum weight of a bin location is about to be exceeded.  When automatic allocation is done – no alert is given. The system allocates up to the maximum weight allowed. This may result in partial allocation and even an allocation of a fraction of a unit.  Alert is given for manual allocation only.  In manual allocation, when entering the Bin Location Allocation – Issue window, and the allocation is about to exceed from the defined weight, an alert message is prompted as shown in the image.  The user can then choose to allocate up to the maximum weight or to ignore the message. 10 10 PUBLIC Exceeding Maximum Weight  Warnings are provided for manual allocation only  When using automatic allocation, the allocation is done even for a fraction of an item

---

## Diapositiva 11

Here are some key points to take away from this course:  Weight can be managed for the item inventory UoM.  The Item Weight field in the Bin Location Master Data, indicates the total weight of items currently stored in the bin location.  The Maximum weight field indicates the weight limitation of the bin location.  A weight restriction can be set for automatic and manual allocation, based on the bin location current weight and weight limitation. 11 11 PUBLIC Summary Here are some key points:  Weight can be managed for the item inventory UoM.  The Item Weight field in the Bin Location Master Data, indicates the total weight of items currently stored in the bin location.  The Maximum weight field indicates the weight limitation of the bin location.  A weight restriction can be set for automatic and manual allocation, based on the bin location current weight and weight limitation.

---

## Diapositiva 12

12 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

