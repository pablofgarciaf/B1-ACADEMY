# Transcripción por Diapositiva: CSI08_Query_Practice

## Diapositiva 1

Case Study:  Query Practice SAP Business One 10.0, version for SAP HANA PUBLIC

---

## Diapositiva 2

PRACTICE: QUERIES                                                                                                                                PUBLIC 2 INTRODUCTION These practice exercises are designed to give you hands-on use in creating basic SQL queries for SAP HANA using the built-in query tools in SAP Business One. You will create the following queries: 1. A report showing a list of customers 2. A report that uses a parameter as selection criteria 3. A report based on multiple tables 4. A report with a running total that can be used with an alert to provide a worklist to a user 5. A query used in a dashboard widget PREREQUISITE: 1. Use the demo database for SAP Business One 10.0, version for SAP HANA 2. Credentials: User code: manager Use either of the SAP Business One query tools: Query Generator or Query Wizard. Note: the solutions are shown for the Query Generator only. All queries shown here use the HANA SQL syntax. Important note: The reports included in this case study show data from the UK localization database. The data you will see will obviously be different depending on your localization and the date you run the queries.

---

## Diapositiva 3

PRACTICE: QUERIES                                                                                                                                PUBLIC 3 Task 1 Create a Customer List Report This report displays a list of customers and balances from the OCRD Business Partners table. 1. Create a query using the following fields from the OCRD Business Partners table: CardCode, CardName, Address, City (Bill-to city), ZipCode, Balance, CntctPrsn. 2. Since the OCRD table also contains records for vendors and leads you need to filter customer records using the CardType = ’C’ condition. 3. In the query results, sort the results alphabetically by customer name and add a total to the account balances column. 4. Save the query in a new category called Sales and choose the Assign Group button to assign the category to the Saved Queries – Group No.1 authorization group. 5. Run the saved query from the Tools menu. Note: When using a HANA database, multi-case field names must be enclosed in double quote marks in the query. The query and the results should look something like this:

---

## Diapositiva 4

PRACTICE: QUERIES                                                                                                                                PUBLIC 4 Fine Tune the Results • You can sort the results according to any column by double-clicking in the header field of the column. • To include a total of the account balances, press Ctrl and click in the header field of the Account Balance column. The total will appear at the bottom of the column, as shown below.

---

## Diapositiva 5

PRACTICE: QUERIES                                                                                                                                PUBLIC 5 Task 2 Create a Report with a Parameter This report displays a list of customer invoices posted after a certain date. The date is entered as a parameter when the query is run. The report uses the OINV invoice table. Find Field Names To find out the field names for the report, use system information: Name in Document Database Field Name No. Customer Name Posting Date Total DocTotal Note: When you hold your mouse over the Total field, the field name does not display in system information. This is because this field holds the currency symbol as well as the amount. The database field name is DocTotal. Create the Query Select the fields from the OINV table that you identified using system information. Filter by open sales invoices and use the variable [%0] with the Greater than condition to filter only invoices posted later than a date entered by the user as a parameter: T0."DocStatus" = ‘O’ and T0."DocDate" > [%0] Run the Query Choose Execute. Select a date from the list. Note: if you are using the demo database the invoices you see may be very old, unless you have recently added invoices. To display the total for the invoices, choose Ctrl and double-click the Document Total column heading. Save this query with the name Invoice List in the Sales category.

---

## Diapositiva 6

PRACTICE: QUERIES                                                                                                                                PUBLIC 6 Task 3 Create a Report from Multiple Tables This query will display a list of open sales quotations summarized by customer and grouped by sales employee. The query will use two tables: ▪ Sales Quotation (OQUT) ▪ Sales Employee table (OSLP) The inner join will be provided for you by the query tool. Create the query Select the OSLP table and then select the SlpName field. Select the OQUT table and then select the CardCode and CardName fields. Calculate the total value of the sales quotations using the SUM function and provide a column heading in the report: SUM(T0."DocTotal") as “Total Value” Count the number of sales quotations for each customer using the COUNT function and provide a heading: COUNT(T0. "DocNum") as “No of Documents” Filter the query so that only open quotations are used: T0."DocStatus" = ‘O’ Sort by the SlpName field. Group by SlpName, CardCode and CardName fields. Run and save the query.

---

## Diapositiva 7

PRACTICE: QUERIES                                                                                                                                PUBLIC 7 Task 4 Create a Report as a Worklist for a User This report displays all the sales orders posted for today, organized by sales employee name.  The report uses the ORDR table and the OSLP table. The report is saved then can be later used with an alert to provide a daily worklist for a user. Preparation: Create 2-3 sales orders for customers, with today’s posting date. Select a discount % in each order. Create the query Select the ORDR and OSLP tables. Select the sales employee name, document number, card code, document total and discount. SUM the document total from each sales order, combined with the OVER clause to keep a running total for each sales employee. Only select sales orders for the current day: Execute the query Save the query in the Sales category with the name Today’s Sales Orders. INFORMATION: The report can be scheduled to run daily and sent to a user using the alert mechanism. This will be covered in the case study for alerts.

---

## Diapositiva 8

PRACTICE: QUERIES                                                                                                                                PUBLIC 8 Task 5 Create a Query for a Dashboard Widget Set up a count widget that counts the number of deliveries created each day. Create the query The query should select document numbers from the ODLN table where the document date (posting date) is the current date. Save and name the query Deliveries_Today. Test the Query Create a few deliveries (with the current date) so that you can test your query. Set up the Count Widget Tools > Cockpit → Count Widget Setup Switch to Add mode. Give the count widget a code, name and description. The name will appear on the widget so make it short and precise.  For example, name it Deliveries Today. Link the count widget to the query you just created. Choose Add. Add the Count Widget to your cockpit Choose the Pencil icon to make changes to your cockpit. Find the newly created widget in the Widget Gallery (choose Business Object Count in the dropdown box) and add it to the cockpit. Save the changes to the cockpit. Test the Count Widget You can test the count widget by adding more deliveries.  You can wait until the cockpit picks up the new deliveries or chose Refresh to see the count updated.

---

## Diapositiva 9

PRACTICE: QUERIES                                                                                                                                PUBLIC 9

---

## Diapositiva 10

No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. Please see http://www.sap.com/corporate-en/legal/copyright/index.epx#trademark for additional trademark information and notices. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP SE or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP SE or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and/or platform directions and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, which speak only as of their dates, and they should not be relied upon in making purchasing decisions. www.sap.com

---

