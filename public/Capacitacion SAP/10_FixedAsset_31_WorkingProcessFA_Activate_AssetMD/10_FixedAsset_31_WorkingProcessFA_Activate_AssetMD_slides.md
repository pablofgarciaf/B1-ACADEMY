# Transcripción por Diapositiva: 10_FixedAsset_31_WorkingProcessFA_Activate_AssetMD

## Diapositiva 1

PUBLIC Fixed Assets: Activate the Asset Master Data SAP Business One Version 10.0 Welcome to the Activate the Asset Master Data topic. 1

---

## Diapositiva 2

2 PUBLIC At the end of this course, you will be able to: • Activate the Asset Master Data. Objectives At the end of this course, you will be able to activate the Asset Master Data.

---

## Diapositiva 3

3 PUBLIC Business Example  In order to present the updated trucks’ value in the company financial reports, they need to document the transactions affecting the vehicles’ value during their useful life.  You are a consultant implementing fixed assets and you show them the Fixed Assets functionality and working process in SAP Business One.  OEC Computers utilizes a small fleet of delivery trucks. After purchasing the trucks, they defined them as fixed assets in SAP Business One. OEC Computers OEC Computers • OEC Computers utilizes a small fleet of delivery trucks. • After purchasing the trucks, they defined them as fixed assets in SAP Business One. • In order to present the updated trucks’ value in the company financial reports, they need to document the transactions affecting the vehicles’ value during their useful life. • You are a consultant implementing fixed assets and you show them the Fixed Assets functionality and working process in SAP Business One.

---

## Diapositiva 4

4 PUBLIC A/P Invoice Fixed Assets Activation - Documents Capitalization OEC Computers Acquisition and Production Cost = 6000 • The Capitalization is the process of recording the acquisition and production cost (APC) as a fixed asset. • In our example, the acquisition value of the truck is 6000. • The user can purchase a fixed asset using an A/P Invoice. • The A/P Invoice automatically generates the Capitalization document for each A/P Invoice that includes fixed asset master data. • The user can choose whether to generate the Capitalization document directly, or to automatically generate it from the A/P Invoice. Note that this is also relevant for A/P Reserve Invoice • You can find the Capitalization document at FinancialsFixed Assets  Capitalization. • In both options the Asset Master Data is activated. • Note! you can choose an asset master data record in the A/P Invoice and you can create a new one from within the A/P Invoice. In order to do so, go to Administration Setup  General User Defaults under the Defaults tab, check the Allow Creating Fixed Assets in Marketing Documents. 4

---

## Diapositiva 5

5 PUBLIC Asset Value Date A/P Invoice Capitalization • When you issue the A/P Invoice, the Asset Value Date (under the Accounting tab) is set by default to be the same as the A/P Invoice Posting Date. This date can be changed before adding the A/P Invoice to update the Asset Value Date in the Capitalization document. • The asset value date can be different from the posting date and document date, but it must be within the same period as the posting date. • In our example, the truck Asset Value Date was set to the 1st of January. • The Asset Value Date sets the Capitalization Date in the Asset Master Data. 5

---

## Diapositiva 6

6 PUBLIC Fixed Assets Set of Definitions Asset Class Asset master Data Truck Depreciation Type Account Determination Depreciation Area Main Depreciation Area: GAAP Method: Straight Line Code: Motor Vehicles Code: Motor Vehicles • Let us refresh our memory with the fixed asset set of definitions. • In our example, we have the new truck that OEC Computers purchased. • We define a set of definitions relevant to this kind of asset, the Heavy Vehicles set of definitions. • Then, we define this truck as an Asset Master Data record under Financials Fixed Assets Asset Master Data and attach the Motor Vehicles set of definitions to this master data record. • The main definition in the Asset Master Data is the Asset Class which includes the association to the other definitions: Depreciation Area, Account Determination and Depreciation Type. • For more details about the fixed assets set of definitions, refer to the initial settings topic. 6

---

## Diapositiva 7

7 PUBLIC Activation – Accounts Determination Asset Balance Sheet Account 6000 Acquisition and Production Cost = 6000 Asset Class Account Determination Code: Motor Vehicles Code: Motor Vehicles OEC Computers • The Account Determination definition enables the system to automatically select the relevant G/L accounts for assets accounting. • In our example we defined the Motor Vehicles set of accounts. Then, we attached this definition to the Motor Vehicles asset class. • The asset class will be selected for heavy vehicles assets for example the truck that the company owns. • Therefor, all transactions involving the truck will automatically register entries to the Motor Vehicles set of accounts. • So, in our example, the Capitalization document will debit the Asset Balance Sheet Account defined in the Motor Vehicles set of accounts with the acquisition cost of 6000. • Let us talk a bit more about the created journal entries. 7

---

## Diapositiva 8

8 PUBLIC Fixed Assets Activation - Journal Entries A/P Invoice Capitalization Debit Credit Vendor 6000 Acquisition Clearing Account 6000 Debit Credit Acquisition Clearing Account 6000 Asset Balance Sheet Account 6000 • The graphic shows the automatic journal entries created during the activation process including the involved accounts. • If a vendor is not involved, then the user can generate a Capitalization document directly. In this case, only the capitalization journal entry will be created and therefore the clearing account will appear as an obligation in the Balance Sheet. 8

---

## Diapositiva 9

• When your company needs to purchase identical fixed assets in large quantities for internal use, create a virtual item representing the fixed asset. In the A/P Invoice choose this template item and enter a certain quantity in the item row. • Optionally, you can manage serial numbers for the generated virtual fixed assets. • You can use the virtual item definition for cases where the company purchases identical assets for office usage, such as laptops, mobile phones or chairs. • Note that virtual items can be capitalized by A/P invoices only. • The quantity of the automatically created asset master data is the same as the quantity you have specified in the A/P invoice. • The item numbers are automatically assigned to newly created asset master data, according to the rules you have defined for the series used in the master data of the virtual fixed asset. • In our example, when OEC Computers enter a quantity of 9 mobile phones in the A/P Invoice row, the system automatically creates 9 asset master data, one for each mobile phone. • The information in the asset master data of the virtual fixed asset is copied to the newly created asset master data, except the Virtual Item checkbox which stays unselected. • The assets created are regular fixed assets with monetary values. The virtual item functions as a template and therefore will not have any values under the Fixed Assets tab. 9 PUBLIC Capitalizing Virtual Fixed Assets

---

## Diapositiva 10

• A Capitalization document including the created assets is issued automatically as well as a journal entry against the asset account. • Note that you can include multiple virtual fixed assets in the same A/P invoice, but you cannot include both virtual fixed assets and normal fixed assets in the same A/P invoice. 10 PUBLIC Capitalizing Virtual Fixed Assets

---

## Diapositiva 11

• When issuing an A/P invoice, to facilitate spotting a virtual item out of the list of items and fixed assets, modify the list of items settings and display the Virtual Asset Item field. • To do that, after opening the List of Items window, choose the Form Setting icon from the upper menu bar to modify the list display. 11 PUBLIC List of Items Capitalizing Virtual Fixed Assets List of - Settings

---

## Diapositiva 12

12 PUBLIC Summary Here are some key points to take away:  The Capitalization is the process of recording the acquisition and production cost (APC) as a fixed asset.  The A/P Invoice automatically generates the Capitalization document for each A/P invoice that includes fixed asset master data. The user can generate the Capitalization document directly. In both options the Asset Master Data is activated.  The account determination definition enables the system to automatically select the relevant G/L accounts for assets accounting.  Virtual items can be capitalized by A/P invoices only. A Capitalization document including the created assets is issued automatically as well as a journal entry against the asset account.  The assets created are regular fixed assets with monetary values. The virtual item functions as a template and therefore will not have any values under the Fixed Assets tab.  You can include multiple virtual fixed assets in the same A/P invoice, but you cannot include both virtual fixed assets and normal fixed assets in the same A/P invoice. • The Capitalization is the process of recording the acquisition and production cost (APC) as a fixed asset. • The A/P Invoice automatically generates the Capitalization document for each A/P Invoice that includes fixed asset master data. The user can generate the Capitalization document directly. • In both options the Asset Master Data is activated. • The Account Determination definition enables the system to automatically select the relevant G/L accounts for assets accounting. • Virtual items can be capitalized by A/P invoices only. A Capitalization document including the created assets is issued automatically as well as a journal entry against the asset account. • The assets created are regular fixed assets with monetary values. The virtual item functions as a template and therefore will not have any values under the Fixed Assets tab. • You can include multiple virtual fixed assets in the same A/P invoice, but you cannot include both virtual fixed assets and normal fixed assets in the same A/P invoice.

---

## Diapositiva 13

14 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

