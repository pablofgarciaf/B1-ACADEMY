# Transcripción por Diapositiva: 10_Impl_31_ImportfromExcel

## Diapositiva 1

PUBLIC Implementation Tools: Import From Excel SAP Business One Version 10.0 In this course you will learn how to import data from Microsoft Excel. 1

---

## Diapositiva 2

2 PUBLIC Objectives Objective:  Using the Import from Excel utility, import multiple records for:  Business partner master data  Item master data  Price list data  Business partner catalogue numbers  Journal entries  Access the Import from Excel utility from the opening balances, batch and serial number setup, and journal entry windows. In this topic, you will see how to use the Import from Excel utility to import multiple records for business partner master data, item master data, price lists, business partner catalogue numbers, and journal entries. You can also access the Import from Excel utility from other windows in SAP Business One, to import opening balances, batch and serial numbers, and single journal entries. 2

---

## Diapositiva 3

3 PUBLIC Each month your distributors send you a Microsoft Excel spreadsheet with new and updated customer master data. You provide warranty support to these customers and therefore you need update this information in the company database. Solution: The Import from Excel utility provides an easy way to import data from a spreadsheet. Business Scenario In the business scenario shown here, your distributors send you a spreadsheet with new and updated customer master data. You want to import this data on a regular basis to provide warranty support. Many companies need to periodically import bulk master data, especially when dealing with distributors and other third parties. Often this data is in the form of a Microsoft Excel spreadsheet. The Import from Excel utility provides an easy way for companies to import data from a spreadsheet. 3

---

## Diapositiva 4

Overview 4

---

## Diapositiva 5

5 PUBLIC Import from Excel Utility Import from Excel can import the following categories of data: ▫Business partner master data ▫Item master data ▫Prices in a price list ▫Business partner catalogue numbers ▫Journal entries Note: A similar utility is available to import fixed asset master data. To access this utility, you must first enable fixed assets in the Company Details Administration > Data Import/Export > Data Import > Import from Excel Administration > System Initialization > Implementation Center > Implementation Tasks - Data Management tab The Import from Excel utility is accessible from the main menu using the path shown in the slide, or from the Data Management tab of the Implementation Tasks window. You can use the Import from Excel utility to import and update: • Business partner master data • Item master data • Prices in an existing price list • Business partner catalog numbers • Journal entries Note: a similar utility is available to import fixed asset master data. To access this utility, you must have enabled fixed assets in the Company Details window. 5

---

## Diapositiva 6

6 PUBLIC Overall Process Select data type and open spreadsheet file Prepare spreadsheet Choose an import method and run import (Save as *.txt file) (Close txt file) Map spreadsheet columns to the object’s fields by selecting from the dropdown list Note: not every field can be imported To use this utility, you first prepare the data in a Microsoft Excel spreadsheet.  Save this file as a Tab delimited txt file and close the file. In the Import from Excel window, select the data type (Business Partner, Items, Price List, Business Partner Catalog Numbers, Journal Entry) and browse for the saved spreadsheet file. Then map each of the spreadsheet columns (A, B, C, etc.) to a field in the object by selecting fields from the dropdown list. The fields are displayed according to the selected object; however, not every field for the object can be imported using this utility. To proceed with the import, choose an import method (the default method is automatically selected for the chosen data type), and run the import. 6

---

## Diapositiva 7

7 PUBLIC Documentation on Field Names  The Import from Excel utility uses the DI API interface to the database  To help you map the object fields, you can reference the Database Tables Reference (REFDB file)  Select an object in the Database Tables Reference to see field names, descriptions, default values, and constraints You can display the database table and field names by selecting the Display Database Field Name checkbox The Import from Excel utility uses the DI API interface to access the database. To help you map the object fields, you can reference the Database Tables Reference document. To access the Database Tables Reference, go to the installation folder for the SAP Business One server, and then follow the path SAP Business One SDK > Help. The REFDB file is in the Help folder. You can also access the same document from the help menu of the Data Transfer Workbench (DTW). Select an object (e.g., Business Partner), to see the table and field names for the object. Importantly you can see the constraints (permitted values) that are allowed in some fields. Remember that most objects are represented in more than one table, for example: OCRD and OCPR for business partner master data OJDT and JDT1 for journal entries The fields displayed in the Import from Excel window use the names from the Description column in the Database Tables Reference. You can display the database table and field names instead by selecting the Display Database Field Name checkbox. 7

---

## Diapositiva 8

8 PUBLIC Saving the Mapping  Option to save current mappings as a template file for later reuse  When you open the Import from Excel window, the system displays the mappings used in the previous import for the same object. To start a new mapping, choose the Clear Mapping button After you have mapped the fields to the spreadsheet order, you can save the mapping as a template, for later reuse. When you select an object, the system shows the mappings used for the previous import for the object. You can clear these mappings with the Clear Mapping button and start a new mapping for the object. 8

---

## Diapositiva 9

9 PUBLIC Spreadsheet Rules and Tips General rules:  Do not include a header row in the spreadsheet  Format the cells as Text to prevent any truncation  If the field has a default value, no need to enter it (for example, currency code, group code)  Comply with field constraints such as type, maximum length, and permitted values  Before you run the utility save the spreadsheet as a Tab delimited file (*.txt)  Close the text file. Failure to close the file before you run the import will result in an error. *.txt There are some general rules for creating the spreadsheet. • The spreadsheet should not contain a heading row, since the utility expects the data to start in the first row. • Generally it is a good idea to format the spreadsheet cells as text type. This prevents Microsoft Excel from truncating a field value. • There is no need to enter a field if the default value meets your needs, for example, the currency code, or the group code. Since your system may have additional default values in the setup for master data and items, for example, payment terms for business partners, you also need to be aware of these settings. The easiest way to see these default values is to create a master data record, using just the code. The default values will be inserted automatically into the new record. • You should comply with any field constraints, such as the maximum length for a field, or the required values for a field. • Before you run the import utility, you must save the spreadsheet as a text (Tab delimited) file. • You must also close the tab delimited file before you run the utility. Failure to close the file will result in an error. 9

---

## Diapositiva 10

10 PUBLIC Import Methods Import Method BP Master Data Item Master Data Journal Entries Price Lists BP Catalog Numbers o Add New Records and Update Existing Records   o Add New Records Without Updating Existing Records     o Update Existing Records Without Adding New Records    Import methods are selected in the Import from Excel window: • Add new records and update existing records. This method is available for business partner and item master data and will update records with matching keys. • Add new records without updating new records. This method is available for business partner and item master data, journal entries and BP catalog numbers. If a record already exists with the same key, data will not be imported. • Update existing records without adding new records. This method is available for business partner and item master data, and price list data. If a record does not exist with the same key the import will fail. 10

---

## Diapositiva 11

11 PUBLIC General Authorization General authorization required to access Import from Excel utility:  Users must be authorized to use the utility You can control which users can access the import utility, using general authorizations. The authorization is ‘Import from Excel.’ 11

---

## Diapositiva 12

Business Partner Master Data Import 12

---

## Diapositiva 13

13 PUBLIC Business Partner Master Data  Select Business Partner as the data type  Data can be entered in any order in the spreadsheet as you will map each column to a field in the master data Mapping To import business partner master data, select Business Partner as the data type. In the spreadsheet, the data can be entered in any order, and then you will map each column in the Import from Excel window to a field in the master data. The dropdown list shows the list of fields that can be imported for the business partner object – not all fields in the object can be imported. • Note that the values for the BP Type field are C, S and L for customer, vendor and lead (the default is customer). • The BP Currency is the currency code as specified in the Currencies table in SAP Business One. You only need to enter the currency if it differs from the local currency. • The Group Code is actually the name of the group. If you do not enter a group name, the business partner is automatically assigned to the first group in the system. If you enter a group name that does not exist in the Groups table, a new group will be created automatically. See the online help for the Import from Excel for an explanation of each field. 13

---

## Diapositiva 14

14 PUBLIC Business Partner - Contact Person Table • The contact fields are displayed in a fixed order and you must follow this order in the spreadsheet • Business partner contact information is held in the OCPR child table • To import contact data on the same row as header fields, in the spreadsheet, select the Contact Person… field The business partner object is composed of multiple tables. The main table OCRD covers the header fields and the fields on all tabs except for Contact Persons and Addresses tabs. Fields on the Contact Persons tab are held in the OCPR child table. You can add contact data on the same spreadsheet row as the header data. During field mapping, select the Contact Person… field from the dropdown list. The field is marked in blue to indicate it is the key to a table. When you select this field, several fields from the child table are displayed in a fixed order, and therefore you must make sure the spreadsheet follows this order. If you are not importing a contact field you must leave the cell empty in the spreadsheet in order to maintain the correct order of fields. 14

---

## Diapositiva 15

15 PUBLIC Importing Multiple Contacts for a Business Partner  To import multiple contacts, first import the header information for the business partners  Then prepare another spreadsheet for the child records: Enter the respective BP Code on each row (column A) In the other columns enter the required contact fields Select the import method Update Existing Records Without Adding New Records To import multiple contact persons for a business partner requires two steps. 1. First import the header information for the business partners. Select the Add New Records… import method. 2. Then prepare another spreadsheet for the child records. On each row of the spreadsheet enter the respective BP Code in column A. In column B enter the Contact ID field. In columns C onwards enter the contact fields in the required order as specified in the utility (leave fields empty if not used). Select the import method Update Existing Records Without Adding New Records when you run the import. Note: Column N holds the email-group code from the OEGP table. In previous systems, this is a required field (you can define a dummy e-mail group if needed). After patch 7 you can leave this column blank if you do not use e-mail groups for contacts. 15

---

## Diapositiva 16

16 PUBLIC Business Partner - Billing and Shipping Addresses • Address data is held in the CRD1 child table • To import a bill to or ship to address on the same row as the header data, select the Bill To or Ship To key field (marked in blue) • The address fields are then mapped for you in a fixed order – follow this order in the spreadsheet Import on header row Billing and shipping addresses are held in the CRD1 child table. You can import a bill to and a ship to address on the same spreadsheet row as the header data. To import this data, select either the Bill To Address… or Ship To Address… fields (marked in blue).  The fixed order of fields is mapped for you, and the spreadsheet should match this order, with unused fields left blank in the spreadsheet. Note: the Bill To/Pay To and Ship To Address columns contain a name to identify each address. 16

---

## Diapositiva 17

17 PUBLIC Business Partner – Multiple Billing and Shipping Addresses To import multiple shipping or billing addresses for a business partner: • First import the header data • Prepare another spreadsheet and reference the BP Code in column A • Select the Bill To/Pay To Address … and/or the Ship To Address … from the dropdown list (or both) • Choose the import method Update Existing Records Without Adding New Records • You can select both addresses on one row To import multiple records for a bill to or ship to address, follow the same process as for contact person data and import the child records separately: • First import the header data for the business partners • Prepare another spreadsheet and reference the BP Code in column A • In column C select either the Bill To/Pay To field from the dropdown list, or the Ship To Address field (you can import both on the same row) • Make sure the spreadsheet fields match the fixed column order for the addresses • Choose the import method Update Existing Records Without Adding New Records. 17

---

## Diapositiva 18

Item Master Data Import 18

---

## Diapositiva 19

19 PUBLIC Item Master Data Object  To import item master data, select Items as the data type  Fields can be entered in spreadsheet in any order then mapped in the Import from Excel window Mapping To import item master data, select Items as the data type in the import window. You can enter the spreadsheet fields in any order, then map the spreadsheet columns to the object’s fields in the import window. Item master data is held in the OITM table. For item master data: • Item Type is I for item, L for labor or T for travel.  Item Group is the name of the group, not the group code. If the group name does not exist, a group will be automatically created using the supplied name. • The Set G/L Accounts by field requires the values W, C, or L to indicate the level of the G/L account determination – warehouse, item group, or item level. If this field is not entered, the default setting from the system is used. • The valuation method for an item is A for moving average, S for standard, F for FIFO and B for serial/batch valuation method. • The serial number management method is A (on every transaction) or R (release only). 19

---

## Diapositiva 20

20 PUBLIC UOM Groups  All items are automatically imported with a Manual UoM Group  You cannot import a non- manual UoM Group using the Import utility All items are automatically imported with a default Manual UoM group. There is a restriction in that you cannot import a non-manual UoM Group for the item because the field (OITM.UgpEntry) is not exposed in the dropdown list. 20

---

## Diapositiva 21

21 PUBLIC Item Master Data with Unit Price The unit price for an item (ITM1) can be imported on the same row as the item details by selecting the Price List Code field (marked in blue) After you make the selection a fixed order of price list fields is displayed, and you must follow this order in your spreadsheet The price for an item is held in a separate table ITM1. The unit price can be imported on the same row as the item details, by selecting the Price List Code field from the dropdown list. When you select the price list code field, a fixed order of fields is displayed, including the currency, additional currencies for exact pricing, and UoM Code. You must follow this order in your spreadsheet. 21

---

## Diapositiva 22

22 PUBLIC Item Master Data with Unit Price (cont.) The price list code is a number assigned when a price list is initially created To see the codes, run a query on the OPLN table: In the spreadsheet, after the price list code, enter the price with the currency code (if not the default currency) You can enter the unit price in up to 2 additional currencies. If additional currencies do not exist, leave the columns blank The UoM Code field is mandatory and for a new item the only allowed value is Manual You can repeat the price list code fields in the spreadsheet row to enter the item price in other pricelists The price list code is the number of a predefined price list. You can run a query on table OPLN to see the price list codes. In the spreadsheet, after the price list code, enter the price with the currency. If this is the default currency you can leave this column blank. You can enter the unit price in up to 2 additional currencies. If there are no additional currencies, you must leave these columns blank so that the fixed order is maintained. The UoM Code field is mandatory. For importing a new item, the only allowed value is Manual. For updating an item, the UoM Code must match to one of the UoM codes defined in the item’s UoM Group. You can repeat the fixed order of fields in the spreadsheet row to enter the price for other pricelists, for example, independent price lists that are not based (using a factor) on another price list. The item price is automatically calculated for any price lists that have the specified price list as a base price list. 22

---

## Diapositiva 23

Price List Import 23

---

## Diapositiva 24

24 PUBLIC Importing Prices to a Price List  You can import multiple prices into a price list by selecting Price List as the data type  The item master data must already exist  The price list must already exist in the price list table OPLN  The only allowed import method is Update Existing Records Without Adding New Records You can select either Item No. or Item No. with UoM. When you make this selection the set of required fields is then automatically selected for you in the window. You can also bulk import multiple prices into price lists independently of the items. In the utility, select Price List as the data type for import. The item master data must already exist. The price list must already exist in the price list table OPLN. The only allowed import method is Update Existing Records Without Adding New Records. You can select either Item No. or Item No. with UoM if the item has units of measure. When you make this selection the set of required fields is then automatically selected for you in the window. 24

---

## Diapositiva 25

25 PUBLIC Importing Unit Prices - 1 To import or update the unit price for an item,  select Item No. and enter in the spreadsheet:  Price list code in column A  Item code in column B  Base price list and factor (optional) in columns C-D  Item price and currency in columns E-F  Optional price in additional currencies in columns G-J To import or update the unit price for an item, select Item No. Create your spreadsheet in the following order so that it maps to the required fields: • The price list code in column A (from the OPLN table) • The item code in column B • The base price list number and the factor (columns C-D) are optional and not required for an independent price list. • The item price in the primary currency in column E • The primary currency in column F (if not the default currency) • Optionally the price in two additional currencies if used (columns G-J). 25

---

## Diapositiva 26

26 PUBLIC Importing Unit Prices - 2 You can import/update multiple item prices on the same row by repeating the selection of the Item No field. Be sure to follow the fixed order of the fields and leave spreadsheet columns blank where necessary. You can import multiple item prices on the same row by repeating the selection of the Item No field. Be sure to follow the fixed order of the fields and leave spreadsheet columns blank where necessary. 26

---

## Diapositiva 27

27 PUBLIC Importing UoM Prices – 1  For an item priced in multiple units of measure (non-Manual UoM Group), you can import the base unit price by selecting Item No.  You can import prices for the units of measure by selecting Item No. with UoM  Note: Before you import the UoM prices, make sure the relevant UoM Codes exist for the item in the UoM Prices window  The utility does not import the UoM Codes. The utility updates the Price and/or Reduce By % fields on the rows in the UoM Prices table If the item is priced in different units of measure, the item’s UoM Group will be something other than Manual. In the example the UoM Group is Cables. The base UoM code for the Cables group is Single, and there are 2Pack and 3Pack units of measure. You can import/update the unit price for the base unit (for example, Each, Single, etc.) by selecting Item No. and mapping your spreadsheet to the fields displayed. To import/update the prices for the units of measure (for example, 2Pack, Carton, etc.), you need to select Item No. with UoM instead and map your spreadsheet to the fields displayed. Important: Before you import the unit of measure prices, make sure the relevant UoM codes exist in the UoM Prices window for the item. The import utility does not import the UoM Codes. Instead the utility updates the Price and/or Reduce By % fields in the rows in the UoM Prices table. In this way the utility is similar to the Prices Update Wizard. 27

---

## Diapositiva 28

28 PUBLIC Importing UoM Prices – 2  In the spreadsheet you can include the base unit price and the UoM prices on the same spreadsheet row  For the base unit price, select Item No in column B  Then select Item No with UoM in column K (and so on)  For the UoM price you can enter either the actual price (column M) or the reduce by amount (column N) In the spreadsheet you can include the base unit price and on the same row the prices for the units of measure. For the base unit price, select Item No. in column B. Then select Item No. with UoM in column K and column S, and so on for other units of measure. In the example shown, price list 1 (mapped to column A) will be updated. Columns B to J contain the price for the base unit Single. Columns K – R and S to Z contain the UoM prices for the 2Pack and 3Pack units of measure. For the UoM price you can enter either the actual price for the measure or you can enter a reduce by percentage (the system will calculate the price). Make sure you leave unused fields as blank columns so that the order of the Import from Excel window is followed. 28

---

## Diapositiva 29

29 PUBLIC Importing UoM Prices – 3  As a result, the price list entry is updated for the primary currency and any additional currencies:  And the UoM Prices are updated accordingly: As a result of the import, the price list entry is updated for the items, in the primary currency and any additional currencies specified in the spreadsheet. The base price for the item is updated in the price list, and the units of measure prices updated in the UoM Prices window. 29

---

## Diapositiva 30

Other Supported Objects 30

---

## Diapositiva 31

31 PUBLIC Business Partner Catalogue Numbers To import catalog numbers for a business partner, select Business Partner Catalog Numbers as the data type Enter each catalog number on a separate row You can configure SAP Business One to use customer and vendor catalog numbers in parallel to your item numbers. This means that you can use the item number of the vendor in the purchase order, and the item number of the customer in the sales order. To import these parallel item codes, select Business Partner Catalog Numbers as the data type to import. Only three fields are required in the spreadsheet: item code, business partner code and the catalog number that the business partner uses for the item. You can enter these fields in any order. Enter each catalog number on a separate row. The table name is OSCN. 31

---

## Diapositiva 32

32 PUBLIC Journal Entries  Select Journal Entry as the object  Only import method is Add New Records Without Updating Existing Records  Journal entries have a header and a line section and column A must contain either H (header) or L (line)  The header fields have a fixed format (columns A-M) that displays when you select the object  The line fields are entered on a separate row starting at column N - Column N signifies if the line is for a G/L account or business partner JE with 2 lines JE for BP with 2 lines Journal entries have a fixed format that is defined in the utility. All editable fields can be imported, including user-defined fields. The only import method is Add New Records Without Updating Existing Records. A journal entry contains a header and multiple, balanced lines. In the spreadsheet, header data is entered on a separate row to the line data.  Column A must contain the character H (for header) or L (for line): • If column A is H, the fields in the spreadsheet row are interpreted as header fields for the journal entry. There is a fixed format for the header fields. • If column A is L, the fields in the spreadsheet row are interpreted as line fields. Column N contains ‘GL’ or ‘BP’ to signify if the line is for a G/L account or business partner. See the example in the slide. Each journal entry is followed by its lines. Multiple journal entries can be entered. The utility will interpret all lines as belonging to the same journal entry until a new journal entry starts with H in column A. 32

---

## Diapositiva 33

33 PUBLIC Single Journal Entry Import Import from Excel button in journal entry form supports import of single journal entry Useful for importing a journal entry with many rows Note that some checkboxes in the JE header (for example, Automatic Tax) are not supported by the import utility You can link to the Import from Excel window directly from the journal entry window to import a single journal entry from a spreadsheet. This might be a useful way to import a journal entry containing many rows. Similar to the bulk import of journal entries, you can import header and lines. The format of the fields is the same as for bulk journal entry import, with rows identified with H or L. The names in the dropdown list match the field labels in the journal entry window, including any labels that were changed using Ctrl + Double-click. The system treats the import just like manual typing. For example, user-defined values added to a field are triggered during the import. Some journal entry fields are not supported for import:  The fields Template and Template Type in the journal entry header  All checkboxes in the header (for example, Automatic Tax) with the exception of the ‘EU Report’ checkbox  The G/L Acct/BP Name field in the lines. The name of the account will be automatically filled by the system on importing the “G/L Acct/BP Code” field.  The Tax Group and Tax Amount fields in the lines  Offset account in expanded editing mode The spreadsheet can contain any of the currencies (LC, FC and SC) with the following rules:  Each journal entry line must have at least one FC, LC or SC value  Each journal entry can have more than one currency specified. If there is a combination of currencies in the file, the system will not calculate any exchange rate between the currencies - they are imported as is from the spreadsheet. 33

---

## Diapositiva 34

34 PUBLIC Opening Balances Import – 1 of 2 Access to the Import from Excel utility is provided directly from a button in the three opening balances windows: G/L Accounts – Import from Excel button Business Partners - Import from Excel button Inventory – Import Items In all three windows you enter the header data first then use the Import from Excel utility to import the row (grid) data. Access to the Import from Excel utility is provided directly from a button in the three opening balances windows (G/L Accounts, Business Partners, and Inventory). This allows you to prepare and validate the opening balance data in a spreadsheet ahead of time instead before you import it. In all three windows you enter the header data first then use the Import from Excel utility to import the row (grid) data. For G/L Accounts and Business Partners, the Import from Excel button only becomes active after you select the opening balance offset account. In the Inventory Opening Balances window you select Import Items from the Add Items dropdown list, and the Import from Excel window will open. 34

---

## Diapositiva 35

35 PUBLIC Opening Balances Import – 2 of 2 The Opening Balances window opens with the pre-selected object type. To run the import:  Select and open the spreadsheet file  Map the columns in the Import from Excel dropdown list (A, B, C, etc.) spreadsheet to the columns/fields in the spreadsheet  Select import method  Choose Import After the import you will be returned to the opening balance transaction window. Choose Add to commit the imported data to the database The names in the dropdown list are the same as the column titles in the opening balance transaction windows When you press the button the Import from Excel window opens showing the pre-selected object type: Opening Balance for G/L Accounts, Opening Balance for Business Partners, or Inventory Opening Balance. To run the import: • Select and open the spreadsheet file. • Map the columns in the dropdown list in the Import from Excel window to the columns in the spreadsheet. The names in the Import from Excel dropdown list are the same as the column titles in the grid section of each of the opening balance transaction windows. If a heading has been changed in the transaction window (using Ctrl + Double-click), the modified title will show in the Import from Excel dropdown list. • Select an import method (a default method is selected for you). For G/L and Business Partners opening balances, only the Add New Records Without Updating Existing Records import method is available. For Inventory opening balances, all three import methods are supported. • Choose the Import button. After the import has run, you will be returned to the opening balance transaction window where you choose Add to save the imported data. The data is not saved in the database until you press Add. 35

---

## Diapositiva 36

36 PUBLIC Inventory Counting and Posting Documents You can import inventory records using the Import from Excel to the following documents: • Inventory counting documents • Inventory posting documents To start the import, open the Add Items dropdown list and instead of selecting the items, choose Import Items. The Import from Excel window will open, with the object Inventory Counting or Inventory Posting pre-selected. 36

---

## Diapositiva 37

37 PUBLIC Serial Numbers- Setup Batch and Serial Numbers Import Access to the Import from Excel utility is provided from the Serial Numbers and Batches setup windows: Batches- Setup Access to the Import from Excel utility is also provided from a button in the Serial Numbers and Batches setup windows. Only one input method is supported: Add New Records Without Updating Existing Records. The names shown in the dropdown list in the Import from Excel utility are the column titles in the grid section of the respective setup window. If the user has changed a grid column’s heading, the new title will appear in the dropdown list. Note: The Import From Excel button becomes disabled if the current serial or batch quantity is full. The system treats the import just like manual typing. For example, user-defined values will be triggered during the import if added to a field. After the import the system returns to the setup window and the new batch or serial numbers are added when the user presses Add. 37

---

## Diapositiva 38

38 PUBLIC Summary Key points from this course: The Import from Excel utility is an easy way to import from a spreadsheet the following types of bulk data:  Business partner master data, with multiple contact persons and billing and shipping addresses  Item master data with unit prices (default Manual UoM Group)  Item prices in existing price lists, including prices for multiple units of measure  Business partner catalog numbers  Journal entries The Import from Excel utility is integrated with various forms for importing:  Opening balances into the grid area of the opening balances transactions for business partners, items, and G/L accounts  Inventory counting and posting documents  Batch and serial numbers from the respective setup windows  Single journal entries from the Journal Entry window. Here are some key points to take away from this session. Please take a minute to review these key points: • The import from Excel utility is an easy way to import bulk master data for business partners, items, and item prices in existing price lists and for multiple units of measure. All items are imported with a Manual UoM Group (this is the default). • You can also bulk import business partner catalog numbers and journal entries. • The Import from Excel utility is integrated with several of the standard forms allowing you to import: • Opening balances into the grid area of the opening balances transactions for business partners, items, and G/L accounts • Inventory counting and posting documents • Batch and serial numbers from the respective batch and serial number setup windows • Single journal entries from the Journal Entry window. 38

---

## Diapositiva 39

39 PUBLIC Summary (cont.) The general authorization ‘Import from Excel’ is required to use the utility. The Database Tables Reference is useful for determining field names and descriptions, default values, field lengths and constraints. The online help for the utility contains tips for preparing the spreadsheet data. Data in the spreadsheet is mapped to object fields in the dropdown list. You can save field mappings as a template for later use. Be sure to save the spreadsheet as a text (tab delimited) file, and close the file before running the import. The spreadsheet should not contain column headings. Some types of data have fixed set of fields that should be matched in the spreadsheet: Unit prices imported with item master data have a fixed format that is shown when the price list code is selected. Prices in a price list also have a fixed format. Journal entries have a fixed format and you must indicated in column A if the data is header or lines. There are some restrictions on fields which can be imported. • The general authorization ‘Import from Excel’ is required to use the utility. • Some fields require specific values, for example, Set G/L Account by and Valuation Method. The Database Tables Reference can help you identify field names and descriptions, default values for fields, as well as field lengths and constraints on the data. Additionally, if you open the online help for the utility, you can see tips for preparing the spreadsheet data. • Data in the spreadsheet is mapped to the object fields in the utility dropdown list. You have the option to save these field mappings as a template for later use. • Remember to save the spreadsheet as a text (tab delimited) file and close the file before running the import. Columns headings should also be removed as they will produce an error when you run the utility. To prevent data truncation in the spreadsheet, it is a good practice to format the cells as text type. Some types of data have fixed set of fields that should be matched in the spreadsheet: • Unit prices imported with item master data have a fixed format that is shown when the price list code is selected from the dropdown list. • Prices in a price list also have a fixed format depending whether the item has units of measure. • Journal entries have a fixed format and you must indicated in column A if the data is header or lines. There are some restrictions on fields which can be imported. 39

---

## Diapositiva 40

41 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and/or platform directions and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

