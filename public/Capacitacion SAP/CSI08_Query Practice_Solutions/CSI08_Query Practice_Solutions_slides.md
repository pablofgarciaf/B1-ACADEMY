# Transcripción por Diapositiva: CSI08_Query Practice_Solutions

## Diapositiva 1

Case Study Solution: Query Practice SAP Business One 10.0, version for SAP HANA PUBLIC

---

## Diapositiva 2

PRACTICE: SOLUTIONS FOR QUERIES                                                                                                  PUBLIC 2 INTRODUCTION These practice exercises are designed to give you hands-on use in creating basic SQL queries for SAP HANA using the built-in query tools in SAP Business One. You will create the following queries: 1. A report showing a list of customers 2. A report that uses a parameter as selection criteria 3. A report based on multiple tables 4. A report with a running total that can be used with an alert to provide a worklist to a user 5. A query used in a dashboard widget PREREQUISITE: 1. Use the demo database for SAP Business One 10.0, version for SAP HANA 2. Credentials: User code: manager Use either of the SAP Business One query tools: Query Generator or Query Wizard. Note: the solutions are shown for the Query Generator only. All queries shown here use the HANA SQL syntax. Important note: The reports included in this case study show data from the UK localization database. The data you will see will obviously be different depending on your localization and the date you run the queries.

---

## Diapositiva 3

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 3 Task 1 Create a Customer List Report This report displays a list of customers and balances from the OCRD Business Partners table. Create the query Choose Tools → Queries → Query Generator. Type OCRD in the highlig hted field at the top left of the window, then press Tab. Select fields for the report by double-clicking in the list: • CardCode • CardName • Address • City (Bill-to city) • ZipCode • Balance • CntctPrsn Note: When using a HANA database, multi-case field names must be enclosed in double quote marks in the query. Tip: Sort the Fields To make it easier to select fields, you can sort the list of fields alphabetically by double-clicking in the Name column header. Add a condition to the query Since the OCRD table holds records for leads and vendors as well as customers, you need to add a filter for customer master records: • Click in the Where area on the right. • Double-click to select the CardType field. • Type = ‘C’ to complete the Where clause (use the single quote character). The Where clause should now read: T0."CardType" = ‘C’

---

## Diapositiva 4

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 4 Choose Execute. Fine Tune the Results • You can sort the results according to any column by double-clicking in the header field of the column.  You can alternately add a sort to the query by entering a field in the Sort By area of the Query Generator window. • To include a total of the account balances, press Ctrl and click in the header field of the Account Balance column. The total will appear at the bottom of the column, as shown below.

---

## Diapositiva 5

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 5 Save the query for reuse In the Query Preview window, choose Save. In the Save Query window, choose Manage Categories. Enter a new category called Sales. Choose Add\Update.

---

## Diapositiva 6

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 6 Select the newly created Sales category and choose the Assign Group button to assign the category to the Saved Queries – Group No.1 authorization group. Choose Update then OK.

---

## Diapositiva 7

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 7 Back in the Save Query window, select the Sales category. Enter Customer Balance Report in the Query Name field. After that choose Save. Run the saved query Choose Tools → Queries → User Queries → Sales → Customer Balance Report.

---

## Diapositiva 8

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 8 Task 2 Create a Report with a Parameter This report displays a list of customer invoices posted after a certain date. The date is entered as a parameter when the query is run. The report uses the OINV invoice table. Find Field Names To find out the field names for the report, use system information: ▪ Open up a blank A/R invoice document and toggle on View > System Information. ▪ Hold your mouse over the following fields and write down the database field name that shows in the system information area: Name in Document Database Field Name No. Customer Name Posting Date Total DocTotal Note: When you hold your mouse over the Total field, the field name does not display in system information. This is because this field holds the currency symbol as well as the amount. The database field name is DocTotal. Create the Query In the Query Generator window, choose the X button to clear out the previous table selection. If you closed the Query Generator window, re-open it using the path Tools → Queries → Query Generator. Type OINV in the Table field and press Tab. Select the fields from the OINV table that you identified using system information. In the Where clause, add a filter for open documents (DocStatus = ‘O’). The Where clause should read: T0."DocStatus" = ‘O’ In the Where clause, type the word ‘and’ then select the document date field (DocDate). Then press the Conditions button to open the side window: • Double-click the Greater than condition • Double-click the first variable [%0].

---

## Diapositiva 9

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 9 The Where clause should now read: T0."DocStatus" = ‘O’ and T0."Docdate" > [%0] Run the Query Choose Execute. A popup window will appear. Choose the selection list icon in the popup window then select a date from the list of results. Note: if you are using the demo database the invoices you see may be very old, unless you have recently added invoices. Choose OK to run the query. The system displays the result. Notice the orange drill-down arrows to the customer master data. To display the total for the invoices, choose Ctrl and double-click the Document Total column heading.

---

## Diapositiva 10

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 10 Save this query with the name Invoice List in the Sales category.

---

## Diapositiva 11

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 11 Task 3 Create a Report from Multiple Tables This query will display a list of open sales quotations summarized by customer and grouped by sales employee. The query will use two tables: ▪ Sales Quotation (OQUT) ▪ Sales Employee table (OSLP) The inner join will be provided for you by the query tool. Create the query Clear the previous table from the query window. Enter each table name in upper left box and press Tab each time. Notice the inner join is made for you in the query generator window. Select the OSLP table and then select the SlpName field. Select the OQUT table and then select the CardCode and CardName fields. Calculate the total value of the sales quotations using the SUM function and provide a heading in the report: SUM(T0."DocTotal") as “Total Value” Count the number of sales quotations for each customer using the COUNT function and provide a heading: COUNT(T0.”DocNum”) as “No of Documents” Important: Make sure you do not forget the closing parenthesis for the SUM and COUNT functions.

---

## Diapositiva 12

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 12 Enter the following condition in the Where clause so that only open quotations are used: T0."DocStatus" = ‘O’ Click in the Sort by area and select the SlpName field. Click in the Group by area and select SlpName, CardCode and CardName fields so that the results are grouped by sales employee and customer. Run the Query Choose Execute. The results show for each sales employee a count of open sales quotations for each customer and the total value of the quotations. For example:

---

## Diapositiva 13

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 13 Save the Query.

---

## Diapositiva 14

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 14 Task 4 Create a Report as a Worklist for a User This report displays all the sales orders posted for today, organized by sales employee name.  The report uses the ORDR table and the OSLP table. The report is saved then can be later used with an alert to provide a daily worklist for a user. Preparation: Create 2-3 sales orders for customers, with today’s posting date. Select a discount % in each order. In the Query Generator, select the ORDR table, press Tab, then select the OSLP table and press tab. Enter the SQL as shown below in the Select area. Select each table before selecting the fields. Note the query uses the SUM expression to total the sales orders combined with the OVER clause to maintain a running total by sales employee. Enter the Where clause as shown below. Execute the query

---

## Diapositiva 15

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 15 Save the query in the Sales category with the name Today’s Sales Orders. INFORMATION: The report can be scheduled to run daily and sent to a user using the alert mechanism. This will be covered in the case study for alerts.

---

## Diapositiva 16

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 16 Create a Query for a Dashboard Widget Set up a count widget that counts the number of deliveries created each day. Create the query The query should select document numbers from the ODLN table where the document date (posting date) is the current date. As shown below: Save and name the query Deliveries_Today. Test the Query Create a few deliveries (with the current date) so that you can test your query. Sales – A/R → Delivery Here is an example delivery:

---

## Diapositiva 17

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 17 After creating a few deliveries, return to your query and choose Execute. The results show a list of delivery documents for today’s date. For example:

---

## Diapositiva 18

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 18 Set up the Count Widget Tools > Cockpit → Count Widget Setup Switch to add mode . Give the count widget a code, name and description. The name will appear on the widget so make it short and precise.  For example, name it Todays Deliveries. Link the count widget to the query you just created:  Select Choose Query. The Query Manager window opens.  Choose your query and select OK. When your query shows in the Count Widget – Setup window, Choose Add. Add the Count Widget to your cockpit Choose the Pencil icon to make changes to your cockpit. Use the + symbol to open the Widget Gallery.

---

## Diapositiva 19

PRACTICE SOLUTION: QUERIES                                                                          PUBLIC 19 Choose Business Object Count in the dropdown box. To choose the widget, click on the Plus sign below the widget.  It will change to a green checkmark. Choose the arrow in the top left to return to the cockpit. Use the icon shaped like a checkmark to save the changes to the cockpit. Test the Count Widget You can test the count widget by adding more deliveries.  You can wait until the cockpit picks up the new deliveries or chose Refresh to see the count updated. If you click on the number displayed, a window will open with the query results.

---

## Diapositiva 20

No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. Please see http://www.sap.com/corporate-en/legal/copyright/index.epx#trademark for additional trademark information and notices. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP SE or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP SE or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and/or platform directions and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, which speak only as of their dates, and they should not be relied upon in making purchasing decisions. www.sap.com

---

