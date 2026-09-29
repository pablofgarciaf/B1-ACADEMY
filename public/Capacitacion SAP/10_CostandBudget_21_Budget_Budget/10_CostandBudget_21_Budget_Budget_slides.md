# Transcripción por Diapositiva: mal 10_CostandBudget_21_Budget_Budget

## Diapositiva 1

PUBLIC Cost Accounting and Budget: Budget Management SAP Business One Version 10.0 Welcome to the Budget Management topic. 1

---

## Diapositiva 2

2 PUBLIC Objectives At the end of this topic, you will be able to:  Describe how to manage budget. In this topic, we will look at the budget module and see how it helps in managing and track company expenses.

---

## Diapositiva 3

3 PUBLIC Business Scenario  You are implementing SAP Business One at a new customer, OEC Computers.  Maria, the accountant says that in previous years they ended the fiscal year with much more expenses than expected.  They would like to be able to plan their expenses for a fiscal year and track them during the year. You are implementing SAP Business One at a new customer, OEC Computers. Maria, the accountant says that in previous years they ended the fiscal year with much more expenses than expected. They would like to be able to plan their expenses for a fiscal year and track them during the year. Note that you need to make decisions about accounting definitions together with the client accountant. 3

---

## Diapositiva 4

4 PUBLIC Budget Management Year forecast Expenses G/L account: Max Amount Flights 5000 Conferences 10000 Team outing 2500 … … January The Budget module helps you manage and track company expenses.  The purpose of budgeting is to provide a forecast of revenues and expenditures.  The actual financial operation of the business can be then measured against the forecast.  Enter the maximum amount that can be allocated to a particular G/L account. The Budget module helps you manage and track company expenses.  The purpose of budgeting is to provide a forecast of revenues and expenditures.  This way, the actual financial operation of the business can be measured against the forecast.  In SAP Business One a budget is based on the data you enter, which specifies the maximum amount that can be allocated to a particular G/L account.  In our example, OEC wants to control the expenses they exceeded last year.  Therefore, at the beginning of the fiscal year, Maria the accountant, enters amounts to the budget forecast for those expense G/L accounts.

---

## Diapositiva 5

5 PUBLIC Actual Amounts Expenses G/L account: Acc. Balance Flights 5000 Conferences 2000 Team outing 2000 … … September Purchasing order: Flight tickets 1200 This year forecast Expenses G/L account: Max Amount Flights 6000 Conferences 10000 Team outing 2500 … … Budget Management  You can block the creation of transactions for G/L accounts that exceed their budget limit.  In the course of routine work, the application checks the debit side of the transactions registered to G/L account for which a budget has been defined. If the budget is exceeded, the application either issues a warning or blocks the action, depending on the chosen setting.  In our example, Maria chose to block transactions that will exceed the budget amounts she defined.  In September, when a purchase order for flight tickets that exceeds the budget forecast amount is issued, the user is blocked by the system and will not be able to add the order.

---

## Diapositiva 6

6 PUBLIC Setup Budget 4 Define Budget Amounts 3 Define Budget Distribution Methods 2 Define the relevant to budget accounts 1 Initialize the budget functionality In order to setup the budget functionality you need to: Initialize the budget functionality in the company database. Define the G/L accounts that will be relevant for budget control. Define budget distribution methods that will automatically divide the budget amount among the months of year. And Finally, define budget amounts for the relevant G/L accounts. In the next slides we will review these steps. During this process we will discuss some concepts related to budget definition.

---

## Diapositiva 7

7 PUBLIC Step 1 - Initialize the Budget Functionality 1 Initialize the budget functionality * Subjected to authorization to confirm budget deviation First, the budget functionality has to be initialized. Go to Administration System Initialization General Settings, and on the Budget tab select the Budget Initialization checkbox. Then, you define what should happen when documents deviates from budget. Whether to block the creation of transactions that cause the budget to be exceeded. Or to present an alert when the budget is exceeded. The user can confirm and add the transaction, or cancel. In the Authorization window, under the Financials module, there is a Budget clause in which you can define authorizations for users to confirm budget deviation in case a G/L account exceeds the budget and an alert is displayed. When the Without Warning option is chosen, the user will be able to add, without any restriction or warning, transactions that exceed the budget. For Purchase Requests, Purchase Orders and Goods Receipt POs the check is made against the budget during the issuing of the document including all open documents and the current one. For the Accounting option a check is conducted during the issuing of an A/P invoice or any other accounting transaction that involves a G/L account relevant to the budget. You can manage the budget on an annual or monthly basis. We will discuss these two options in the next slides.

---

## Diapositiva 8

8 PUBLIC 2 Define the relevant to budget accounts Step 2 - Define the Relevant to Budget  Accounts After you initialize the budget functionality, and update the General Settings window, you have the option to mark all profit and loss accounts as budget accounts. By choosing Yes, the Relevant to Budget checkbox is selected in all your profit-and-loss G/L accounts. You can then find this checkbox in Financials → Chart of Accounts → Account Details pushbutton. Note that you can manually select non profit-and-loss G/L accounts to be relevant to the budget by selecting the Relevant to Budget checkbox for each G/L account.

---

## Diapositiva 9

9 PUBLIC Annual Versus Monthly Budget Year forecast Monthly Budget Flights 6000:12 = 500 Year forecast Annual Budget Flights 6000 You can manage the budget on an annual or monthly basis. With the annual option, the deviation from the budget forecast is measured against the actual balance of the G/L account for the current fiscal year. In our example, if OEC Computers will choose the annual budget option and enter a forecast amount of 6000 to the flight expense account, then the check for budget deviation would always be against this amount. For the monthly option, the system distributes the budget forecast amount for each G/L account among the months of the year. In each month the transactions that debit this G/L account are being compared against the distributed monthly amount. If OEC Computers will choose the monthly option and enter the same amount of 6000 as the forecast amount of the flight expense account, then the system would distribute this amount to 12, allocating a monthly budget of 500. The check for budget deviation would be against this distributed amount.

---

## Diapositiva 10

10 PUBLIC Annual Versus Monthly Budget Year forecast Monthly Budget Flights 6000:12 = 500 actual balance in the flight expense G\L account 5000 Year forecast Annual Budget Flights 6000 October Purchasing order: Flight tickets 600 Let us assume we are now in October, the actual balance in the flight expense G\L account is 5000, a purchase order for a flight ticket with a total amount of 600 is being issued. With the annual option, the budget check will approve this expense because 5600 is still within the year forecast amount of 6000. According to the monthly budget, the limit for expenses on flight tickets in each month is 500, so 600 is already a budget deviation and therefore the purchase order would be blocked. Note that if the warning option is chosen in the General Settings for budget, then the system would present an alert when the budget is exceeded. The user can confirm and add the transaction if an authorization to confirm budget deviation was defined for this user.

---

## Diapositiva 11

11 PUBLIC  Step 3 - Define Budget Distribution Methods * Not relevant for working with an annual budget. 3 Define Budget Distribution Methods In the example we have just seen, SAP Business One used the Equal budget distribution method to automatically divide the budget amount among the months of year. SAP Business One automatically defines the following 3 common budget distribution methods: The Equal one. Ascending Order – which distributes the budget amount in an ascending order and is used when you increase your budget expenses over the months of the year. For example, in January you use only a small proportion of your budget amount, in February you increase your expenses, and so on. Descending Order – that distributes the budget amount in a descending order and is used when you decrease your budget expenses over the months of the year. For example, in January you use the largest proportion of your budget amount, in February you use a little less, and so on. These methods cannot be revised. However, you can choose to add additional methods. Choose Financials Budget Setup Budget Distribution Methods. Note that later on, you can change the distribution of the budget amounts manually for each account. You can define a certain distribution method as the default method by choosing the Set as Default button. Also note that budget distribution methods are not relevant for working with an annual budget.

---

## Diapositiva 12

12 PUBLIC Budget Scenarios Optimistic Scenario Account 100000 Account 200000 Account 300000 Account 400000 Account 500000 Main Scenario Pessimistic Scenario Note that during routine work, deviation from the budget is checked against the main budget scenario only. The other scenarios are used for budget reports! Budget scenarios are used mainly for displaying budget reports. Using a scenario, you create an analysis of a particular situation for the company's budget and obtain information about what the budgetary balance would be according to the selected scenario. For example: an optimistic scenario versus a pessimistic scenario. When you set up a new company, the application provides a default scenario called Main Budget. This scenario cannot be edited. For each scenario the company uses, you should later enter budget amounts Note that in the course of routine work, deviation from the budget is checked against the main budget only. The other scenarios are used only for budget reports!

---

## Diapositiva 13

13 PUBLIC Budget Scenarios To define budget scenarios choose Financials Budget Setup Budget Scenarios. Select a fiscal year. Then, in the menu bar, choose Data Add Row or right-click in the window and choose Add Row. The first defined scenario will be the default main scenario and therefore cannot be deleted. In addition, the Based On and the Initial Ratio fields in the main scenario cannot be changed. In the next step we will enter budget amounts to this main budget scenario. The Import Scenario function lets you import budget scenario from other SAP Business One company into new budget scenario. Make sure during the operation that the G/L account codes in the source company match those in the target company. The Copy Scenario function lets you copy budget data from a budget scenario into a target budget scenario in the same company for the same fiscal year or for the next fiscal year.

---

## Diapositiva 14

14 PUBLIC 4 Define Budget Amounts Step 4 - Defining Budget Amounts Finally, you define budget amounts. Choose Financials Budget Setup Budget. Choose the scenario for which you want to define a budget and choose the required G/L accounts.

---

## Diapositiva 15

15 PUBLIC Defining Budget Amounts In the Local Debit / Credit  column specify an amount in local currency for each G/L account. Note that: You can define budget amounts only for G/L accounts which are defined as Relevant to Budget in the Chart of Accounts. SAP Business One checks the budget for deviations against the debit side of the transactions registered to the G/L account. Thus, alerts are only triggered for accounts with a budgeted amount in the Debit column. You can use the Credit field for sales accounts to set revenue targets which you can track with the budget report. When you create a new budget that includes accounts without previous budget definitions, the window does not display any accounts. In such a case, select the Display Accounts with no Budget checkbox. For each account, you can change the budget amount and the distribution method. You can also change the distribution of the budget amounts manually using the Budget Item Details window. Double-click the required row number in the table, or right-click the row and choose Row Details. If you change the budget amounts manually, the Method column in the Budget Scenarios – Setup window changes to Manual and is marked in red in the corresponding G/L account row.

---

## Diapositiva 16

16 PUBLIC Defining Budget Amounts The Actual column will present the balance in this account based on its journal entries. When you define a budget amount for a G/L account that already has a bookkeeping balance, SAP Business One displays a system message about existing transactions in the system and asks you if you want to restore the account accumulator. Choosing Yes Copies the current G/L account's bookkeeping balance for the chosen fiscal year to the Actual column. This means that SAP Business One considers the current bookkeeping balance as its starts to calculate the used budget amounts. Choosing No Ignores the G/L account's current bookkeeping balance and starts calculating the used budget as of this moment (zero budget amount used).

---

## Diapositiva 17

17 PUBLIC Purchasing order: Flight tickets 600 Getting Down to Work Now the budget is defined for the selected accounts, enabling you to perform an analysis by comparing the defined budget with the actual business activity. In the course of routine work, when you create a transaction against an expense G/L account which is relevant to budget, a check for deviation from the main budget scenario is executed, and if the budget is exceeded, an alert is issued. When the Warning option is chosen in the general settings for budget, the user can choose to continue and add the transaction, or cancel. Note that this is subjected to authorization to confirm budget deviation. If the Block Deviation from Budget option was defined, then the system will block the creation of the transaction that causes the budget to be exceeded.

---

## Diapositiva 18

18 PUBLIC Budget Report Choose Financials Financial Reports Budget Reports Budget Report. The Budget Report enables you to display the company’s budget data according to your requirements. This report analyzes the business activities that occur during a defined period, with reference to a selected budget scenario.

---

## Diapositiva 19

19 PUBLIC Financial Budget Reports Choose Financials Financial Reports Budget Reports The standard financial reports can be displayed along with the budget data: Balance Sheet, Trial Balance, Profit and Loss Statement. You can run the budget reports according to a preferred budget scenario.

---

## Diapositiva 20

20 PUBLIC Summary Here are some key points:  The purpose of budgeting is to provide a forecast of revenues and expenditures. This way, the actual financial operation of the business can be measured against the forecast.  After initializing the budget, you define what should happen when documents deviate from budget. Whether to block the creation of transactions that cause the budget to be exceeded. Or to present an alert. The user can confirm and add the transaction if an authorization to confirm budget deviation was defined for this user.  You have the option to mark all profit and loss accounts as budget accounts. Here are some key points: The purpose of budgeting is to provide a forecast of revenues and expenditures. This way, the actual financial operation of the business can be measured against the forecast. After initializing the budget, you define what should happen when documents deviate from budget. Whether to block the creation of transactions that cause the budget to be exceeded. Or to present an alert. The user can confirm and add the transaction if an authorization to confirm budget deviation was defined for this user. You have the option to mark all profit and loss accounts as budget accounts. 20

---

## Diapositiva 21

21 PUBLIC Summary – cont.  You can manage the budget on an annual or monthly basis. With the annual option, the deviation from the budget forecast is measured against the actual balance of the G/L account for the current fiscal year.  For the monthly option, the system distributes the budget forecast amount for each G/L account among the months of the year. The check for budget deviation would be against this distributed amount.  You define budget amounts to the budget scenario.  In the course of routine work, deviation from the budget is checked against the main budget only. The other scenarios are used for budget reports!  SAP Business One checks the budget for deviations against the debit side of the transactions registered to the G/L account. You can manage the budget on an annual or monthly basis. With the annual option, the deviation from the budget forecast is measured against the actual balance of the G/L account for the current fiscal year. For the monthly option, the system distributes the budget forecast amount for each G/L account among the months of the year. The check for budget deviation would be against this distributed amount. You define budget amounts to the budget scenario. In the course of routine work, deviation from the budget is checked against the main budget only. The other scenarios are used for budget reports! SAP Business One checks the budget for deviations against the debit side of the transactions registered to the G/L account. 21

---

## Diapositiva 22

23 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epxfor additional trademark information and notices.

---

