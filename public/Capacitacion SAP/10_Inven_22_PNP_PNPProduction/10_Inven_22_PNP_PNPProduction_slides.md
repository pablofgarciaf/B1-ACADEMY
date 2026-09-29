# Transcripción por Diapositiva: 10_Inven_22_PNP_PNPProduction

## Diapositiva 1

PUBLIC Items and Inventory: Picking Goods in the Production Process SAP Business One Version 10.0 Welcome to the Picking Goods in the Production Process course. You should take the Pick and Pack in the Sales Process course and have a good knowledge of the production process before proceeding with this training. 1

---

## Diapositiva 2

2 PUBLIC Objectives At the end of this topic, you will be able to:  Describe the use of the Pick Pack and Production Manager tool in the production process. After completing this topic, you will be able to describe the use of the Pick and Pack tool in the production process.

---

## Diapositiva 3

OEC Computers resells computers and electronic equipment to retailers in the UK. In addition, OEC Computers also assembles computers that are combined from different components like hard disks, memory cards and cases. OEC has a few production areas to produce different types of computers and other equipment. George is the warehouse manager of OEC Computers. He and his SAP Business One consultant, have already implemented picking processes in the company. Now, George wants to also include picking processes for production. He would like to create pick lists for the components required for production. In addition to creating pick lists, he also wants to handle picking components for production from the warehouse and enter the produced item in the warehouse. The consultant shows George how he can leverage the Pick Pack and Production Manager as a workbench to create the relevant production documents. 3 PUBLIC OEC Computers resells computers and electronic equipment to retailers in the UK. In addition, OEC Computers also assembles computers that are combined from different components like hard disks, memory cards and cases. OEC has a few production areas to produce different types of computers and other equipment. George is the warehouse manager of OEC Computers. He and his SAP Business One consultant, have already implemented picking processes in the company. Now, George wants to also include picking processes for production. He would like to create pick lists for the components required for production. In addition to creating pick lists, he also wants to handle picking components for production from the warehouse and enter the produced item in the warehouse. The consultant shows George how he can leverage the Pick Pack and Production Manager as a workbench to create the relevant production documents. Business Scenario

---

## Diapositiva 4

4 PUBLIC Pick and Pack in the Production Process - Concept Pick Pack and Production Manager Receipt from Production Production Order Pick Pack and Production Manager To start production: Release production order In the Pick Pack and Production Manager: Select production order rows and create a pick list In the Pick Pack and Production Manager, after picking: Create issue for production After production: Add receipt from production In the image you can see a general description of the pick and pack process used for production at OEC Computers. OEC Computers can generate pick lists to pick items needed for their production process. Once a day, George opens the Pick Pack and Production Manager, selects the production order rows and creates pick lists. The components are then picked and taken to the shop floor area. Then, the warehouse manager creates an Issue for Production document, from the Pick Pack and Production Manager, in order to consume the components in production from inventory. Finally, after production is complete, the warehouse manager adds a Receipt from Production document to add the final product to inventory. Note that for component items using the backflush method, the process does not include creating an Issue for Production document. Also note that this is just one scenario. Some companies may prefer to create pick lists in the same run for different types of base documents. For example, they may run the Pick Pack and Production Manager for both production orders and sales orders simply because their picking process is the same or done by the same employees. 4

---

## Diapositiva 5

George runs the Pick Pack and Production Manager for all production orders in the Lab shop floor. OEC Computers have added a user-defined field in the Production Order document to indicate which shop floor will be used because they have three different shop floors. George wants to see only production orders designated for the Lab shop floor. When George chooses the OK button to open the Pick Pack and Production Manager, he sees a list of production order rows for the Lab shop floor. 5 5 PUBLIC Pick Pack and Production Manager - Selection Criteria Inventory Pick and Pack Pick and Pack Manager

---

## Diapositiva 6

6 PUBLIC Creating an Issue for Production from the Pick Pack and Production Manager 1 2 3 The image demonstrates the following steps: The first step in the process is to create a pick list by choosing the Release to Pick List button. This process is similar to the one covered in the Pick and Pack Sales Process course. The warehouse employee uses the pick list to pick the items for production. In order to consume the components for production an Issue for Production document should be generated. In step 2, once the pick list is generated, George enters the Released drawer and chooses all Production Order rows he wishes to send to production. Then, in step 3, he chooses the Create button and then enters the Issue for Production option. 6

---

## Diapositiva 7

After production is finished the produced items should be entered in the warehouse. This is done in the Receipt from Production document. This document, much like the Issue for Production, can be generated from the Pick Pack and Production Manager. George opens the Picked drawer to find the same production rows that were already picked and issued for production.  He selects the rows, chooses Create and then chooses the option that adds a Receipt from Production. 7 7 PUBLIC Creating a Receipt from Production in the Pick Pack and Production Manager

---

## Diapositiva 8

Much like item rows, resource rows can be processed in the Pick Pack and Production Manager. When needed, George can filter the type of the production order rows, resource or item, in the selection criteria window. In the Pick Pack and Production Manager, he uses row type indication to distinguish between items and resources. Even though resources are not actually being picked, including them in the Pick Pack and Production Manager enables processing the entire production order rows. This way the Pick Pack and Production Manager can truly be a workbench from which the entire production process can be done. This procedure is very similar to the non-inventory items procedure we saw in the Pick and Pack Sales Process course. 8 8 PUBLIC Handling Resource in the Pick and Pack Procedure Filtering option in the selection criteria according to the row type in the Production Order Resource rows can be copied along with the item rows to production documents from the Pick Pack and Production Manager Create button. This enable copying the entire Production Order to its destination documents. A Type column for resource/ item indication

---

## Diapositiva 9

9 PUBLIC Picking Goods in a Production Process with Routing Scenario In production orders with routing, the production process in the order is divided by stages called route sequences. These route sequences are organized in a certain order where each one has its own start date and end date. The Pick Pack and Production Manager displays routing related fields in order to provide all information needed for creating production related documents like pick lists, Issue for Production and Receipt from Production. Look at the image, the highlighted columns are fields that display routing related information. The Start Date and Delivery/Due Date columns represent the start date and end date of a stage. The Route Sequence and Route Stage columns also display information about production orders with routing. All this information enables the user to sort or even filter (in the selection criteria) production order rows according to the process needs. For example filtering rows by their due date (end date) to meet deadlines when issuing them for production. Two columns provides information for all types of production orders: • Product No. - the produced item code and • Production Priority - allows sorting production order rows by the production order priority. 9

---

## Diapositiva 10

Here are some key points to take away from this session:  The process of picking items via the Pick Pack and Production Manager for production is similar to the one in the sales process.  The Pick Pack and Production Manager can be used as a workbench for managing a production process including creating an Issue for Production and Receipt from Production documents.  Resource production order rows are also available to choose in the Pick Pack and production Manger in order to create destination documents for both item and resource rows.  The Pick Pack and Production Manager also supports processing production orders with routing. Information like start and end dates and route stage and sequence enable sorting and filtering by this information. 10 10 PUBLIC Summary Key points from this topic: The process of picking items via the Pick Pack and Production Manager for production is similar to the one in the sales process. The Pick Pack and Production Manager can be used as a workbench for managing a production process including creating an Issue for Production and Receipt from Production documents. Resource production order rows are also available to choose in the Pick Pack and production Manger in order to create destination documents for both item and resource rows. The Pick Pack and Production Manager also supports processing production orders with routing. Information like start and end dates and route stage and sequence, enable the processing of production orders with routing scenarios.

---

## Diapositiva 11

11 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

