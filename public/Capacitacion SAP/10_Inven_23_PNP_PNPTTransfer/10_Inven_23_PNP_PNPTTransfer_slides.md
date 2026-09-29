# Transcripción por Diapositiva: 10_Inven_23_PNP_PNPTTransfer

## Diapositiva 1

PUBLIC Items and Inventory: Pick and Pack in the Inventory Transfer Process SAP Business One Version 10.0 Welcome to the Pick and Pack in the Inventory Transfer Process course. In this training we will see how we can use the Pick Pack and Production Manager in the process of picking items for transfer. In order to take this course, you first need to complete the Pick and Pack in the Sales Process course topic. 1

---

## Diapositiva 2

After completing this topic, you will be able to: Run the Pick Pack and Production Manager to create Pick Lists and documents for inventory transfer. 2 PUBLIC At the end of this topic, you will be able to:  Run the Pick Pack and Production Manager to create Pick Lists and documents for inventory transfer. Objectives

---

## Diapositiva 3

OEC Computers manages multiple warehouses.  From time to time, they need to replenish the distribution warehouses from their main production warehouse. OEC has already implement pick and pack processes for sales and production in their warehouses. Now they would like to add functionality for picking items for transfers between warehouses. Their Business One consultant shows them how to use the Pick Pack and Production Manager to create pick lists and record inventory transfers. 3 PUBLIC OEC Computers manages multiple warehouses.  From time to time, they need to replenish the distribution warehouses from their main production warehouse. Business Example OEC has already implement pick and pack processes for sales and production in their warehouses. Now they would like to add functionality for picking items for transfers between warehouses. Their Business One consultant shows them how to use the Pick Pack and Production Manager to create pick lists and record inventory transfers.

---

## Diapositiva 4

4 PUBLIC Pick and Pack for Inventory Transfer Process – Concept and Scenario Create pick lists for the Inventory Transfer Request Create an Inventory Transfer from the Pick Pack and Production Manager Creating a pick list based on an Inventory Transfer Request: Create an Inventory Transfer Request In the distribution warehouse In the main warehouse In the main warehouse OEC Computers has integrated the pick and pack process for inventory transfers. When the inventory in the distribution warehouse is about to be depleted, the warehouse employee creates an Inventory Transfer Request, to transfer the goods from the main warehouse. The employee in the main warehouse opens the Pick Pack and Production Manager, selects the inventory transfer request rows and creates pick lists. After the goods are picked, the main warehouse employee creates an Inventory Transfer document from the Pick Pack and Production Manager, based on the picked rows from the inventory transfer request. In the next slides we will see how it is done in the system. 4

---

## Diapositiva 5

5 PUBLIC Inventory Transfer in the Pick Pack and Production Manager 1/2 Inventory Pick and Pack Pick Pack and Production Manager The main warehouse employee runs the Pick Pack and Production Manager to generate the pick lists for the Inventory Transfer Requests. In the Pick Pack and Production Manager - Selection Criteria window he chooses Inventory Transfer Requests. Then he chooses OK to enter the Open drawer. Next, he checks all Inventory Transfers Request rows and chooses the Release to Pick List button. 5

---

## Diapositiva 6

6 PUBLIC Inventory Transfer in the Pick Pack and Production Manager 2/2 After pick lists are generated and items are picked, the main warehouse employee opens the Picked drawer to create an Inventory Transfer for the Inventory Transfer Request rows. 6

---

## Diapositiva 7

7 PUBLIC Additional scenario – Inventory Transfer Request as a Target Document Create Sales Orders Create Inventory Transfer Requests in the Pick Pack and Production Manager Pick items and create Inventory Transfer for the picked rows OEC Computers has a special packing area for deliveries of delicate or fragile items. This area is managed as a separate bin location in the warehouse, in order to track the items that are transferred to this packing area. To transfer the items, the warehouse employee uses the Create option from the Pick Pack and Production Manager. In this case the process would be: • Create sales orders • Then, in the Pick Pack and Production Manager, in the Open drawer, select the sales order rows and create Inventory Transfer Requests. • And then pick the items and create the Inventory Transfer documents as explained in the previous scenario. 7

---

## Diapositiva 8

8 PUBLIC Summary Key points from this topic:  In the Pick Pack and Production Manager you can process Inventory Transfer Requests. This means you can create pick lists to collect the items and then create an Inventory Transfer document that is based on the request.  In addition, you can use the Pick Pack and Production Manager to create Inventory Transfer Requests, based on Sales Orders, Reserve Invoices or Production Orders. Here are some key points to take away from this session:  In the Pick Pack and Production Manager you can process Inventory Transfer Requests. This means you can create pick lists to collect the items and then create an Inventory Transfer document that is based on the request.  In addition, you can use the Pick Pack and Production Manager to create Inventory Transfer Requests, based on Sales Orders, Reserve Invoices or Production Orders. 8

---

## Diapositiva 9

9 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

