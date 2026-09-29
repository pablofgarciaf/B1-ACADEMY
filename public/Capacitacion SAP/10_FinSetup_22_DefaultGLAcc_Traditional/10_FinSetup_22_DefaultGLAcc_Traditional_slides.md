# Transcripción por Diapositiva: 10_FinSetup_22_DefaultGLAcc_Traditional

## Diapositiva 1

PUBLIC Financial Setup: Default G/L Accounts Traditional Solution SAP Business One Version 10.0 Welcome to the Default G/L Accounts – Traditional Solution topic. 1

---

## Diapositiva 2

In this session, we will discuss how to implement the G/L Account Determination – Traditional Solution. 2 PUBLIC At the end of this topic, you will be able to:  Implement the G/L Account Determination – Traditional Solution. Objectives

---

## Diapositiva 3

Imagine that you are implementing SAP Business One at a new customer.  James, the CEO, tells you that in the Profit and Loss report, he wants to see what are the profits for each item group (for example, Printers).  He wants the system to automatically post journal entries to the relevant profit and loss accounts. 3 3 PUBLIC Business Scenario You are implementing SAP Business One at a new customer, OEC Computers.  James, the CEO, tells you that in the Profit and Loss report, he wants to see what are the profits for each item group (for example, Printers).  He wants the system to automatically post journal entries to the relevant profit and loss accounts.

---

## Diapositiva 4

Here is a reminder for the traditional solution.  According to the traditional solution there are three options to define a default G/L method for an item: warehouse level, item group level, and item level. Each item will have one method defined for it. You can set the method in advance for all new items. You can then change the method per item.  The values that you define under the tabs in the G/L Account Determination window are defaulted into all 3 levels. You can then change the default accounts for any of the levels. For example, you can manage different inventory accounts for each warehouse the company owns.  Whenever you add a document that posts a journal entry, an A/R Invoice for example, the system looks at each item in the document to determine the level set for that item and then finds the associated G/L accounts to use from the default accounts. 4 PUBLIC  Advanced G/L Account Determination  Traditional Solution – Default G/L method for an item  At the warehouse level  At the item group level  At the item level Reminder: what is the traditional solution option for defining default G/L accounts? Default G/L accounts For Items Used in Documents  G/L Account Determination Window  Sales  Purchasing  General (for example, Period End Closing)  Inventory  Resources and WIP Mapping

---

## Diapositiva 5

Let us review the set-up of the traditional solution for G/L Account Determination. The company default accounts under the G/L Account Determination window default to all 3 levels (warehouse level, item group level, and item level). Then, you define the accounts at each required level. In the presented example, we define the accounts for each item group (this is step 1 in the graphic). This means that when an item using the item group level is chosen in a document, the system will automatically retrieve the accounts from the definition of the item group to which the item belongs. Where are these default accounts set?  For the item group level, the default accounts are set in the definition of each item group. The place to define an item group is found in the inventory setup area of the Administration module. Default accounts are maintained on the Accounting tab for the item group.  Similarly, for the warehouse level, default accounts are set on the Accounting tab in the definition of each warehouse. Defining a warehouse is also done in the inventory setup area.  If you set an item to be controlled at the item level, you set the G/L accounts directly in the item master. 5 PUBLIC Default G/L accounts The Setup for the Traditional Solution 1

---

## Diapositiva 6

Once you have set the default accounts, you should also choose the default G/L method for new items in the General Settings on the Inventory tab. On the sub-tab for items, you will find the Set G/L Accounts By field. (This is step 2 in the graphic). In our example, the default G/L method for new items was set to item group. Therefore, the default in any new item is the Item Group Level (as presented in step 3) and the accounts assigned to the item master data derive from the item group defined for this item (step 4). 6 PUBLIC Default G/L accounts The Setup for the Traditional Solution 1 3 2 4

---

## Diapositiva 7

These are the three options for choosing a default account set presented from the item point of view. Each item can have one method defined for it. In the warehouse and item group levels the accounts are derived from the warehouse or the item group and the user cannot change them. In the item level the user enters the accounts manually into the item master. Note that although you specify one default G/L method for new items, you can manage different items with different methods if this scenario is necessary in your company. Just change the default level in the item master as needed. Note! After the warehouse or the item group level is defined in an item, you can switch to the item level method and assign different G/L Accounts to be used in the monetary transactions. 7 PUBLIC Set G/L Accounts by Warehouse Set G/L Accounts by Item Group Set G/L Accounts by Item Level # WH Code WH Name Accounts Types 1 01 General Warehouse 2 02 Drop Shipment 3 03 Consignation Accounts from Warehouse Definition # WH Code WH Name Accounts Types 1 01 General Warehouse 2 02 Drop Shipment 3 03 Consignation Accounts from Item Group Definition # WH Code WH Name Accounts Types 1 01 General Warehouse 2 02 Drop Shipment 3 03 Consignation Accounts Entered Manually Default G/L accounts in the Item Level The Setup for the Traditional Solution

---

## Diapositiva 8

Here are some key points: In the G/L Account Determination window, you define the default G/L accounts to be used in transactions. The traditional solution allows you to define default G/L method for an item. There are three options to define a default G/L method for an item:  Warehouse level  Item group level  Item level 8 8 PUBLIC Summary Here are some key points: In the G/L Account Determination window you define: • Default G/L accounts to be used in transactions. The traditional solution allows you to define: • Default G/L method for an item. There are three options to define a default G/L method for an item: • Warehouse level • Item group level • Item level

---

## Diapositiva 9

10 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epxfor additional trademark information and notices.

---

