# Transcripción por Diapositiva: 10_FixedAsset_32_WorkingProcessFA_Depreciation_Adjustments

## Diapositiva 1

PUBLIC Fixed Assets: Depreciation and Adjustments SAP Business One Version 10.0 Welcome to the Depreciation and Adjustments topic. 1

---

## Diapositiva 2

2 PUBLIC At the end of this course, you will be able to:  Generate documents to reflect the fixed asset value. Note!  You need to make decisions about legal and industry requirements together with the client accountant. Objectives At the end of this course, you will be able to generate documents to reflect the fixed asset value. Note! You need to make decisions about legal and industry requirements together with the client accountant.

---

## Diapositiva 3

3 PUBLIC Business Example  In order to present the updated trucks’ value in the company financial reports, they need to document the transactions affecting the vehicles’ value during their useful life.  Use the depreciation option to write off the cost of an asset over its useful lifetime.  OEC Computers utilizes a small fleet of delivery trucks.  After purchasing the trucks, they defined them as fixed assets in SAP Business One. OEC Computers For adjustments - utilize additional fixed assets documents: Transfer, Manual Depreciation, and Asset Revaluation OEC Computers • OEC Computers utilizes a small fleet of delivery trucks. • After purchasing the trucks, they defined them as fixed assets in SAP Business One. • In order to present the updated trucks’ value in the company financial reports, they need to document the transactions affecting the vehicles’ value during their useful life. • You are a consultant implementing fixed assets and you show them the Fixed Assets functionality and working process in SAP Business One. • Use the depreciation option to write off the cost of an asset over its useful lifetime. • For adjustments - utilize additional fixed assets documents: Transfer, Manual Depreciation, and Asset Revaluation.

---

## Diapositiva 4

4 PUBLIC Depreciation Type Asset Class Depreciation Type Method: Straight Line 6000 / 36 months of useful life = 166.67 per month. 12 Months * 166.67 = 2000 yearly depreciation. Depreciation value per year: Depreciation OEC Computers • Depreciation is used to write off the cost of an asset over its useful lifetime. • It represents the reduction in the book value of an asset for both tax and accounting purposes. • SAP Business One allows you to set up depreciation types using several pre-defined depreciation methods. • The depreciation method sets the depreciation value calculation. • In our example we choose the Straight Line method which is the most common method and attached it to the Motor Vehicles asset class. • In the Calculation Method field, under the Calculation tab, we choose the first option Acquisition Value /Total Useful Life. • So, if we look at our truck, its acquisition value was 6000 and the useful life defined for the asset class is 3 years, that is 36 months. • The calculated depreciation value for one year will be 2000 according to the following calculation: ─The monthly rate will be 6000/ 36 months of useful life = 166.67 ─And then the yearly depreciation is calculated: 12 Months * 166.67 = 2000. 4

---

## Diapositiva 5

5 PUBLIC Fixed Assets Depreciation - Asset Net Book Value 6000 Useful Life : 3 years 4000 Value Date: January 1st December 31st 2000 December 31st 0 December 31st Depreciation Method: Straight Line • In our example when we define the new truck that OEC Computers purchased, we define the asset Useful Life - a period during which an asset is expected to be usable for the purpose for which it was acquired. Useful life may, or may not, correspond with the asset's actual physical life, or economic life. Before the end of an asset’s useful life, the asset should be written off completely. We define the truck useful life as 3 years. • Every period the company calculates the depreciation on the asset. Depreciation would be included with the company expenses. • As was mentioned in the previous slide, the truck is planned to reduce its value by 2000 each year. • During the asset’s useful life the system also calculates the asset Net Book Value - the value of an asset in the accounting books which is calculated using the historical cost of the asset less any accumulated depreciation. So in our case, after the first year the truck value will be 4000, then after the second year 2000 and until 0 value at the end of its useful life. • The asset Net Book Value calculation appear in the Asset Master Data. 5

---

## Diapositiva 6

6 PUBLIC Depreciation Run – Depreciation Area Asset Class Depreciation Area OEC Computers • Remember, that the accounts and the amounts in the depreciation process derive from the Asset Master Data definition. • In the truck example the defined asset class is attached to the GAAP area as the main area and posting to G/L. • If the type of depreciation area is posting to G/L, in addition to posting the depreciation for each asset, there is financial posting. • In the Posting of Depreciation field, if we define the Direct Posting, the system will post the depreciation directly to the asset balance sheet account specified for the asset. • In Indirect Posting, the system uses the accumulated depreciation account to post the depreciation. • In this option, the asset balance sheet account is affected only when the asset is purchased or retired. 6

---

## Diapositiva 7

7 PUBLIC Fixed Asset Transactions Fixed Asset Sub Ledger Fixed Asset Transaction Let us talk a bit more about the connection between the depreciation area and the transactions that the asset registers.  The Asset Master Data cannot be defined as an Inventory Item.  Therefore, it does not register inventory transactions.  The system does register fixed asset transactions.  Depending on the asset class attached to the fixed asset, one or more areas are defined for the asset master data record.  In the presented example, two depreciation areas are defined for the truck asset master data. These are the two depreciation areas that OEC Computers defined in their system  The GAAP areas (that is, Local Generally Accepted Accounting Principles), is the main depreciation area and defined as Posting to G/L – meaning, it posts financial transactions to the fixed assets sub-ledger in addition to fixed asset transactions.  The IFRS (that is International Financial Reporting Standards) is the additional area and hence will not post financial transactions to the general ledger.  Although the additional area does not register transactions to the general ledger it will affect the values in the asset master data and in different reports.  In the presented example you can see that depreciation amounts were posted according to both the GAAP and the IFRS areas.  The GAAP area also registered journal entries to the accounts assigned to the asset master data.  The IFRS area posted depreciation transaction with no effect on accounts.  This information is stored in the asset master data allowing the user to analyze both dimensions. 7

---

## Diapositiva 8

8 PUBLIC Depreciation Run Financials Fixed Assets Depreciation Run • Execute the Depreciation Run option to update the value with the actual depreciation. • Choose Financials Fixed Assets Depreciation Run. • You execute the Depreciation Run for each Depreciation Area. In the presented example we execute the depreciation run for the main depreciation area, that is, the GAAP area. • Every time you run the Depreciation Run you can see the previous runs. • To execute a new run, choose the Preview button. 8

---

## Diapositiva 9

9 PUBLIC Depreciation Run – Preview • In the Depreciation Run - Preview window, the financial postings are grouped by the asset class. • Only when you execute the depreciation run does the system carries out all depreciations planned up to the specified date. • In order to trigger the posting of a planned depreciation it is usually sufficient to start one depreciation run for several posting periods. • However, it is possible to execute several depreciation runs for the same depreciation period. • In depreciation runs, un-posted planned depreciation is posted using a catch-up method. • In the catch-up method, the system gathers any planned depreciation that has not been posted yet for the entire depreciation period and then creates a collective posting. Therefore, the resulting posting can also include planned depreciation from several periods. • Note! ─If you want to include in the current year the depreciation posting from previous fiscal years, you need to first run the Fiscal Year Change. This action will carry over the values from previous years to the current fiscal year. We will refer to the Fiscal Year Change later on in this course. ─A depreciation run can be repeated as often as necessary, provided no depreciation run has been executed for later periods. That is, the current depreciation run cannot be earlier than any runs which had been already executed for a selected depreciation area. • A repeat depreciation run may be necessary, if the asset values have changed once again after posting planned depreciation. When repeating a depreciation run, only the value differences to the postings of the last depreciation run are considered. • To register the depreciation amounts to the general ledger choose the Execute button. 9

---

## Diapositiva 10

10 PUBLIC Depreciation Run – Journal Entries • Here is an example of a journal entry created by the depreciation run. • As was mentioned before, the financial postings are grouped by an asset class. • The system will credit the balance sheet asset account (in the Direct Posting option) and debit the depreciation account. • In Indirect Posting, the system uses the accumulated depreciation account in the credit side. • In this option, the asset balance sheet account is affected only when the asset is purchased or retired. • In the debit amount you can see that depreciation is included within the company expenses. • The user can choose to split the asset balance sheet account by assets in the journal entry. • You define the split in Administration System initialization Document Settings  Per Document Depreciation Run. The default value is not split. 10

---

## Diapositiva 11

11 PUBLIC Depreciation Run - Status • In the Motor Vehicles asset class example we defined the GAAP area and the IFRS area with the GAAP area defined as the main area and posting to G/L. • If the type of depreciation area is posting to G/L, besides posting the depreciation for each asset, there is a financial posting. • The IFRS area, in our example was defined as the Additional Area and therefore does not post journal entries. • Still, you can post depreciation amounts to this depreciation area to be used in reports. • Therefore, in the third run you can see that for the IFRS area the status No Depreciation Posted appears. 11

---

## Diapositiva 12

12 PUBLIC Asset Accounts in the Company Balance Sheet Asset Balance Sheet Account Direct Posting 6000 -2000 4000 Capitalization Depreciation Net Book Value D Balance Sheet C Fixed Asset Account 4000 • Let us discuss the fixed asset effect on the company financial reports. • The Balance Sheet of a company contains the asset accounts. • As we have seen in this course, the Capitalization document debits the asset balance sheet account specified for the asset. • When using the direct posting method, the Depreciation document credits the same asset balance sheet account. • Therefore, the net book value of the asset is reflected in the account balance. 12

---

## Diapositiva 13

13 PUBLIC Asset Accounts in the Company Balance Sheet D Balance Sheet C Fixed Asset Account 6000 Accumulated Depreciation Account -2000 Accumulated Depreciation Account Indirect Posting Asset Balance Sheet Account 6000 -2000 4000 Capitalization Depreciation Net Book Value • In indirect posting, the system uses the accumulated depreciation account to post the depreciation. • In this option, the asset balance sheet account is affected only when the asset is capitalized or retired. • Therefore, the net book value of the asset will be reflected in the sub-total display of the Balance Sheet. 13

---

## Diapositiva 14

14 PUBLIC Adjustments and the Fiscal Year Change  During the life cycle of a fixed asset, additional documents support the need for adjustments, if necessary: ─ Transfer. ─ Manual Depreciation. ─ Asset Revaluation.  Fiscal Year Change: ─ In fixed asset management, you must execute a fiscal year change when a fiscal year ends. Adjustments • During the life cycle of a fixed asset, additional documents support the need for adjustments, if necessary. The documents are: Transfer, Manual Depreciation, and Asset revaluation. • Note! In order to decide which of the adjustment documents to use, you need to verify, together with the client accountant, what are the legal and industry requirements. • For all documents, go to Financials Fixed Assets. In the next slides we review the different documents. • The accounts required for the different adjustment documents are defined in Account Determination setup attached to the fixed asset chosen in the relevant document. • In fixed asset management, you must execute a fiscal year change when a fiscal year ends. With the change, SAP Business One transfers all the asset depreciations and balances from the current fiscal year to the new fiscal year. 14

---

## Diapositiva 15

15 PUBLIC Transfer You can transfer an asset or part of an asset to a different asset. This may be necessary when: 1. The value was activated to wrong Asset Master Data and you need to transfer it to the right one. 2. The asset was activated to the wrong Asset Class and depreciations have been already created. 3. The asset is on hold. For example, the asset is under constructions. When it is finished, it will be moved to the corrected asset class. • We start with the Transfer document. • You can transfer an asset or part of an asset to a different asset. This may be necessary when: 1. The value was activated to wrong Asset Master Data and you need to transfer it to the right one. 2. The asset was activated to the wrong Asset Class and depreciations have been already created. 3. The asset is on hold. For example, the asset is under constructions. When it is finished, it will be moved to the corrected asset class. • According to the different uses of the Transfer document, it includes two transactions types: Asset Transfer and Asset Class Transfer. • Once you choose a transaction type, the table structure changes accordingly. 15

---

## Diapositiva 16

16 PUBLIC Manual Depreciation In some cases you may want to manually depreciate certain assets: • There is an unexpected permanent reduction in the value of the asset, for example caused by an accident. • There are special depreciations that you want to use partially. • You are using unit-of-production depreciation and want to manually plan depreciation. • You can also appreciate the fixed asset value to reverse an unplanned depreciation. • In a regular work, the system uses the saved depreciation types to automatically determine the planned depreciation for the current fiscal year. • In some cases however, you may want to manually depreciate certain assets: 1. There is an unexpected permanent reduction in the value of the asset, for example caused by an accident. 2. There are special depreciations that you want to use partially. 3. You are using unit-of-production depreciation and want to manually plan depreciation. 4. You can also appreciate the fixed asset value to reverse an unplanned depreciation. ─For example: the Gas and Oil corporation has built a new gas station with 10 filling dispenser close to a major city. ─The revenue in the first 2 years was only 80% of the expected amount before starting the new business. ─As the installation of 10 filling dispenser was overestimated and 8 would have been enough, a special depreciation can be done to reflect the real value of the gas station at the end of the second year. ─In the third year a new by-pass road was opened close to the gas station and the revenue suddenly increased to the original expected amount. The reason for the special depreciation is no longer valid and an appreciation needs to be done. • According to the different uses of the Manual Depreciation document, it includes four document types: Ordinary Depreciation, Unplanned Depreciation, Appreciation and Special Depreciation • The default value is Ordinary Depreciation. 16

---

## Diapositiva 17

17 PUBLIC Asset Revaluation With the Asset Revaluation option you can write an increase or decrease in the book value of an asset in order to reflect its current fair market value. • With the Asset Revaluation option you can write an increase or decrease in the book value of an asset in order to reflect its current fair market value. • Fair value accounting requires that revaluations are carried out whenever there is a difference between the current market value of an asset and the value on the balance sheet. • The revaluation is based on one depreciation area. Once the user chooses a different depreciation area, the table is cleared. • Note! ─You need to verify, together with the client accountant if this document is allowed in your localization. ─The difference will increase the asset value but will be also posted against the revaluation reverse account. 17

---

## Diapositiva 18

18 PUBLIC Fiscal Year Change  SAP Business One transfers all the asset depreciations and balances from the current fiscal year to the new fiscal year.  Go to Financials Fixed Assets Fiscal Year Change. • In fixed asset management, you must execute a fiscal year change when a fiscal year ends. With the change, SAP Business One transfers all the asset depreciations and balances from the current fiscal year to the new fiscal year. • Go to Financials Fixed Assets Fiscal Year Change. • When you change a fiscal year, SAP Business One performs the following calculations for each asset: ─Calculates the year-end values of all asset transactions. These values are saved in the asset master data and serve as start values for the new fiscal year. ─Recalculates the planned depreciation for the new fiscal year. • Note! If the next fiscal year, to which you want to change, is not yet defined in SAP Business One, you receive an error message. 18

---

## Diapositiva 19

19 PUBLIC Summary Here are some key points to take away: Depreciation is used to write off the cost of an asset over its useful lifetime. You can set up depreciation types using several pre-defined depreciation methods. Define the asset Useful Life. Before the end of an asset’s useful life, the asset should be written off completely. The system registers fixed asset transactions. The accounts and the amounts in the depreciation process derive from the Asset Master Data definition. • Here are some key points to take away: • Depreciation is used to write off the cost of an asset over its useful lifetime. • SAP Business One allows you to set up depreciation types using several pre-defined depreciation methods. • We define the asset Useful Life - a period during which an asset is expected to be usable for the purpose for which it was acquired. Before the end of an asset’s useful life, the asset should be written off completely. • The system registers fixed asset transactions. • The accounts and the amounts in the depreciation process derive from the Asset Master Data definition.

---

## Diapositiva 20

20 PUBLIC Summary – cont. Execute the Depreciation Run option to update the value with the actual depreciation. You execute the depreciation run for each Depreciation Area. If the type of depreciation area is posting to G/L, besides posting the depreciation for each asset, there is a financial posting. During the life cycle of a fixed asset, additional documents support the need for adjustments, if necessary. The documents are: Transfer, Manual Depreciation, and Asset revaluation. In fixed asset management, you must execute a fiscal year change when a fiscal year ends. SAP Business One transfers all the asset depreciations and balances from the current fiscal year to the new fiscal year. • Execute the Depreciation Run option to update the value with the actual depreciation. • You execute the depreciation run for each Depreciation Area. If the type of depreciation area is posting to G/L, besides posting the depreciation for each asset, there is a financial posting. • During the life cycle of a fixed asset, additional documents support the need for adjustments, if necessary. The documents are: Transfer, Manual Depreciation, and Asset revaluation. • In fixed asset management, you must execute a fiscal year change when a fiscal year ends. With the change, SAP Business One transfers all the asset depreciations and balances from the current fiscal year to the new fiscal year.

---

## Diapositiva 21

22 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

