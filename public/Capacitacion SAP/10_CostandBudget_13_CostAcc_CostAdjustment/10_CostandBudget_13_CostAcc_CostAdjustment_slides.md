# Transcripción por Diapositiva: 10_CostandBudget_13_CostAcc_CostAdjustment

## Diapositiva 1

PUBLIC Cost Accounting and Budget: Cost Accounting Adjustment SAP Business One Version 10.0 Welcome to the Cost Accounting Adjustment topic. 1

---

## Diapositiva 2

In this topic, we will look at how to reallocate costs between cost centers. 2 PUBLIC Objectives At the end of this topic, you will be able to:  Reallocate costs between cost centers

---

## Diapositiva 3

3 PUBLIC Cost Accounting Adjustment – Business Example OEC Computers distributes its catering expense based on the number of employees in each department. This month however, some support consultants were pulled into the development team to help in some testing tasks. Management would like to ensure that the costs are correctly reflected in the different cost centers by making a month end cost accounting adjustment posting. Cost Center 2 Support Cost Center 3 Development Catering G/L Account Distribution Rule X Employees Journal Entry 1000 Heating Costs Distr. Rule     area Journal Entry 2500 Employees Catering Bill Distr. Rule Cost Center 1 Sales Cost Center Z Sales OEC Computers distributes its catering expense based on the number of employees in each department. This month however, some support consultants were pulled into the development team to help in some testing tasks. Management would like to ensure that the costs are correctly reflected in the different cost centers by making a month end cost accounting adjustment posting. 3

---

## Diapositiva 4

4 PUBLIC Journal Entry for Cost Accounting Adjustment Access the Journal Entry for Cost Accounting Adjustment window via:  SAP Business One look up menu.  Cost Accounting Adjustment button in:  Distribution Report  Distribution Rules window  Table of Cost Centers and Distribution Rules window.  Journal Voucher - add a cost accounting adjustment entry. In all of these options a dedicated journal entry with a default numbering series for cost accounting adjustment will be posted. Use the Journal Entry for Cost Accounting Adjustment window to issue cost accounting adjustment postings. This function can be accessed via:  SAP Business One look up menu.  The Cost Accounting Adjustment button that opens the Journal Entry for Cost Accounting Adjustment window is available in: • The Distribution Report. • Also, in the Distribution Rules window and in the Table of Cost Centers and Distribution Rules window.  If the cost accounting adjustment needs to be reviewed before submitted it, add a cost accounting adjustment entry to a new journal voucher. In all of these options a dedicated journal entry with a default numbering series for cost accounting adjustment will be posted. 4

---

## Diapositiva 5

5 PUBLIC Cost Accounting Adjustment via Reports Cost Centers Development Support Sales Center z Total costs Distribution Rule 400 400 Sales 520 520 Support 950 950 Development 4800 4800 2400 12000 Area 750 1000 500 250 2500 No. of employees 6500 6320 3300 250 16370 Total Distribution Report Cost Accounting Adjustment Let’s look at the Distribution Report option. After issuing the report, highlight the distribution rule row for which you would like to issue an adjustment posting, Development in our example. Then, choose the Cost Accounting Adjustment button at the bottom of the screen. 5

---

## Diapositiva 6

6 PUBLIC Journal Entry for Cost Accounting Adjustment Distribution rule Credit Debit G/L Account Development* 200 Cost Accounting Adjustment Account Support* 200 Cost Accounting Adjustment Account Journal Entry for Cost Accounting Adjustment * Direct allocation distribution rule  Dedicated journal entry for cost accounting adjustment with:  Default numbering series.  Default G/L account.  In each row, choose the direct allocation distribution rule of each cost center. The Journal Entry for Cost Accounting Adjustment window appears. This is a dedicated journal entry with a default numbering series for cost accounting adjustments. In the first row of the journal entry the default account for cost accounting adjustment appears. This is an interim account defined as Cost Accounting Adjustment Only in the G/L Account Details window. You transfer amounts between cost centers by choosing the direct allocation distribution rule of each cost center in the journal entry rows. When posting the adjustment journal entry from a report like in our example, the first journal entry row automatically includes the distribution rule you chose in the report, Development direct allocation distribution rule in this example. Enter the amount to be transferred. In our example, you decrease the expense amount from the support team cost center and increase the development cost center amount. In the second row, choose the default account again and the Support direct allocation distribution rule . 6

---

## Diapositiva 7

7 PUBLIC Settings for Cost Accounting Adjustment Define a default journal entry series for cost accounting adjustments. Check the Cost Accounting Adjustment Only box. Series- Journal Entries - Setup To allow cost accounting adjustment postings you should define a default journal entry series. In the Document Numbering – Setup window, double click the Journal Entries row and define a new series. Check the Cost Accounting Adjustment Only box for this new series. 7

---

## Diapositiva 8

8 PUBLIC Create a default G/L account. Settings for Cost Accounting Adjustment In the Account Details, check the Cost Accounting Adjustment Only box. Also, create a default G/L account in the chart of accounts – choose the Account Details button and check the Cost Accounting Adjustment Only box. 8

---

## Diapositiva 9

9 PUBLIC Link the default series and G/L account to the General Settings. Both the default series and the G/L account will be used in cost accounting adjustments journal entries only. Settings for Cost Accounting Adjustment Then link the default series and G/L account you have defined to the General Settings window - Cost Accounting tab, under the Cost Accounting Adjustment Settings section. Both the default series and the G/L account will be used in cost accounting adjustments journal entries only. 9

---

## Diapositiva 10

10 PUBLIC Summary  Cost accounting adjustments allow you to reallocate costs between cost centers when required. This ensures that the costs are correctly reflected in the different cost centers.  Issue a cost accounting adjustment transaction using the Journal Entry for Cost Accounting Adjustment window.  This dedicated journal entry uses a default numbering series and a default account for cost accounting adjustments.  Use this interim account in both journal entry’s rows.  Choose the direct allocation distribution rule of each cost center to transfer amounts between cost centers.  Settings for Cost Accounting Adjustment:  Define a default journal entry series for cost accounting adjustments.  Create a default G/L account.  Link the default series and G/L account to the General Settings. Here are some key points:  Cost accounting adjustments allow you to reallocate costs between cost centers when required. This ensures that the costs are correctly reflected in the different cost centers.  Issue a cost accounting adjustment transaction using the Journal Entry for Cost Accounting Adjustment window.  This dedicated journal entry uses a default numbering series and a default account for cost accounting adjustments.  Use this interim account in both journal entry’s rows.  Choose the direct allocation distribution rule of each cost center to transfer amounts between cost centers.  Settings for Cost Accounting Adjustment:  Define a default journal entry series for cost accounting adjustments.  Create a default G/L account.  Link the default series and G/L account to the General Settings. 10

---

## Diapositiva 11

12 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

