# Transcripción por Diapositiva: 10_Impl_39_SystemSetup_EmailPrefrences

## Diapositiva 1

PUBLIC System Setup & Administration: E-mail Preferences SAP Business One Version 10.0 Welcome to the E-Mail Preferences topic. 1

---

## Diapositiva 2

2 PUBLIC At the end of this topic, you will be able to: Define the settings for E-Mail sending. Send mail automatically when adding a document. E-mail multiple documents to multiple recipients. E-mail aging report specific information to multiple business partners. Objectives After completing this topic, you will be able to: Define the settings for E-Mail sending. Send mail automatically when adding a document. E-mail multiple documents to multiple recipients and e-mail aging report specific information to multiple business partners.

---

## Diapositiva 3

E-mail Methods You can use the SBO Mailer or Microsoft Outlook when sending mails automatically. 3

---

## Diapositiva 4

4 PUBLIC SBO Mailer and Microsoft Outlook General E-Mail Methods: SBO Mailer (SAP Business One mailer) Configure and start the SBO Mailer service in the Job Service area of the SLD Outlook E-Mail Ensure that MS Outlook is installed on the user’s computer There are two methods to send mails from SAP Business One: • SBO Mailer (SAP Business One mailer). This is the in-built mailer for sending mails from the SAP Business One client. When this is used, the SBO Mailer service must be configured and started in the Job Service area of the System Landscape Directory (SLD). This task is usually done when the system is first installed. See the SAP Business One Administrator’s Guide for instructions. • Microsoft Outlook.  To send mails automatically, you only need to have MS Outlook installed on the user’s computer. 4

---

## Diapositiva 5

5 PUBLIC Settings at the Company Level SBO Mailer or MS Outlook Administration System Initialization General Settings Services tab Select default E-Mail Method: SAP Business One Mailer Outlook E-Mail Option to configure a different SMTP mail server for a specific company database • The system administrator can define the default email service that will be used when sending mails automatically. This is done on the Services tab of the General Settings. • Select the option for the SAP Business One mailer or for Outlook E-Mail. • Note that a user has the ability to change the mailing method for single mail sending. • There is an option for the system administrator to configure a different Simple Message Transfer Protocol (SMTP) server for the specific company database. This might be useful where there are several company databases on a shared server. To do this, check the Enable Company Specific Mailer Configuration checkbox in the General Settings, then enter the name and port of your outgoing mail server, as well as the authentication method you want to use, and whether to use TLS encryption. If you do not select this checkbox, only one SMTP server can be configured for the entire SAP Business One landscape from the Job Service - Mailer in the SAP Business One Service Manager. 5

---

## Diapositiva 6

E-mail Documents Automatically Next, let us discuss the option to automatically create and send PDFs by mail when adding a document. 6

---

## Diapositiva 7

7 PUBLIC Business Example E-Mail Documents Automatically OEC Computers wants to reduce paper output and get documents to customers and vendors faster by sending them electronically. To streamline this process further, they want the system to automatically send the e-mail when a document is added. Jean, the sales manager, wants to use this option for the sales quotations her department creates. • Here is a business example: • OEC Computers wants to reduce paper output and get documents to customers and vendors faster by sending them electronically. • To streamline this process further, they want the system to automatically send the e-mail when a document is added. • Jean, the sales manager, wants to use this option for the sales quotations her department creates

---

## Diapositiva 8

8 PUBLIC Settings at the Document Level Automatically Create PDF/ E-Mail Administration System Initialization Print Preferences Per Document: Choose the document type Select the e-mail checkbox (the email goes to the address defined for the document contact person) • In the Print Preferences window, you can now define for each document type whether to: • Automatically export it to PDF and/ or • Send it by mail when adding a document. The document will be attached as a PDF file to the mail. • Use the menu path shown on the graphic. Choose the document type and check the relevant boxes. • In the example shown Jean, the sales manager of OEC Computers, decided that she wants to automatically create and send PDFs by mail when adding a sales quotation. • The mail will be automatically sent to the E-Mail address defined for the document contact person. 8

---

## Diapositiva 9

9 PUBLIC Settings at the Document Level Default Text  for Automatic Mail Sending • When you define the print preferences for a document type, you can also define default text for the automatic e-mail subject and body. • Use the Insert Predefined Texts button to copy text that is already defined in the system. • For the sales quotation, Jean entered default text in the E-Mail Subject and the E- Mail Body fields. 9

---

## Diapositiva 10

10 PUBLIC E-Mail Document Automatically SBO Mailer Add a Sales Quotation Default E-Mail Method: SBO Mailer • Let us see what happens when adding a document. • If the company default is the SBO mailer,  then when adding the document, the Send Message window appears with the details of the contact person defined in the document. • In the Text tab you can see the default text that Jean entered in the E-Mail Subject and the E-Mail Body fields (in the Print Preferences window). You can change this text. • The sales quotation document you have just added appears under the Data tab and the created PDF file to be sent in the mail appears under the Attachments tab. • Choose the Send button to send the mail. 10

---

## Diapositiva 11

11 PUBLIC Attachments Folder Documents for email are stored in the attachments folder defined in the Path tab of the General Settings. Ensure this folder is shared and accessible by users If the path to the folder is changed, use the Refresh Paths in Documents button to apply the new path to attachments in existing documents When a user mails a document, the document will be attached as a PDF file to the mail. SAP Business One stores the PDF in the attachments folder defined in the Path tab in the General Settings. The path to the attachments folder must be defined and operates for the entire company, for all users. Therefore the folder should be shared and accessible by all users. If the attachments folder is changed at any time in the future, and you copy the files to a new location, use the Refresh Paths in Documents button to update the path in existing document attachments. 11

---

## Diapositiva 12

12 PUBLIC Attachments Folder – Sub-folders Instead of a single attachments folder for all users, you can define sub-folders and allocate to different sets of users This is done using User Defaults Instead of a single attachments folder for all users, you can define sub-folders of the main folder and allocate to different sets of users. This is done using the User Defaults. In the example a set of defaults is defined for a group of users, and on the Path tab a separate sub-folder is defined for users who are assigned these defaults. Note that you can also define the print preference settings for emailing documents on the Print tab. 12

---

## Diapositiva 13

13 PUBLIC Add a Sales Quotation E-Mail Document Automatically Outlook E-Mail Default E-Mail Method: Outlook E-Mail • If the company default is the Outlook E-Mail, then when adding the document, a mail window opens with the contact person mail in the To field. • The default text that Jean entered appears in the E-Mail Subject and the E-Mail Body fields. • And the document is attached as a PDF file to the mail. • Choose the Send button to send the mail. 13

---

## Diapositiva 14

14 PUBLIC Sent Emails Report Business Partners →Business Partner Reports→Sent Emails Report A report is available to track sent e-mails with attached documents or reports. Choose the path shown in the slide. Note that if an e-mail is listed in the report it does not mean that the e-mail reached the recipient. 14

---

## Diapositiva 15

E-mail Bulk Documents Next, I will show you the option for e-mailing multiple documents to multiple recipients, all in one go. In addition, we will see the option of sending several customers their aging report. 15

---

## Diapositiva 16

16 PUBLIC Business Example E-mail multiple documents to multiple recipients Recently, OEC Computers introduced new products to prospects and customers at an industry conference. Jean, the sales manager, created sales quotations to customers and leads who approached her during the conference. Now, she is looking for a way to mail these quotations in one go. She also wants to address the  relevant person in the business partner organization. • Here is another business example: • Recently, OEC Computers introduced new products to prospects and customers at an industry conference. • Jean, the sales manager, created sales quotations to customers and leads who approached her during the conference. Now, she is looking for a way to mail these quotations in one go. • She also wants to address the relevant person in the business partner organization.

---

## Diapositiva 17

17 PUBLIC Settings in the Business Partner Master Data E-Mail Group E-Mail Group: Business Partner Contact Person @ E-Mail Address Warehouse Manager (Chief Information Officer) Accountant CIO @ E-Mail Address @ E-Mail Address @ E-Mail Address Marketing Document • When using the option to automatically e-mail a document, the mail is sent to the mailing address defined for the contact person in the document. • You can define E-Mail Groups to specify the recipients within the business partner organization that will receive the e-mail. The e-mail group then acts as a distribution list; for example, to send various A/R Invoices created for different customers to their respective accountants. • You do that by assigning an E-Mail group to given contact person in the business partner master data record to be used as a distribution list. • This way, whenever documents are sent via e-mail to the selected e-mail group, this contact person receives the document produced for his company. • In the example shown OEC Computers has defined three e-mail groups to be assigned to contact persons: • One for the warehouse manager. • Another for the Chief Information Officer. • And the last one for the company accountant. • Most likely that sales quotations will be sent to the chief information officer, deliveries to the warehouse manager and A/R invoices to the accountant. 17

---

## Diapositiva 18

18 PUBLIC Settings in the Business Partner Master Data E-Mail Group Define and assign E-Mail group: Select a contact person in the Business Partner Master Data window, and assign this person to an e-mail group. To define a new e-mail group, choose the Define New option. • After you have defined e-mail groups, you select a contact person in the Business Partner Master Data window, and assign this person to an e-mail group. • You can define new e-mail groups from here by choosing the Define New option. 18

---

## Diapositiva 19

19 PUBLIC Send Multiple Documents to Multiple E-Mail Recipients Sales A/R Document Printing Sales Quotations: • Note that the selection of multiple documents requires Crystal Reports Layout. • You can choose only the documents yet to be E-mailed. • In order to send a batch of documents, for example sales quotations created for different customers, to the respective contact persons of these customers, use the document printing window: • After generating the list of the documents you wish to send by E-Mail, sales quotations in our example, select the documents by clicking the first record and then choose the other records with Control or Shift. • From the File menu choose Send, and then either E-Mail or Outlook E-Mail. • Note that the selection of multiple documents requires Crystal Reports Layout. • You can choose only the documents yet to be E-mailed. • The PLD layout supports mailing a single document only. 19

---

## Diapositiva 20

20 PUBLIC Send Multiple Documents to Multiple E-Mail Recipients CIO Select this box to email the documents to the contact persons associated with the specified E- Mail group. • After you have selected the documents to be printed, The E-Mail Options window appears. • First, you define how to send the selected documents. You can choose whether to use an E-Mail group or not. • Select the Use E-Mail Group box and specify the required group to email the documents to the contact persons associated with the selected E-Mail group. • If you clear this box, the selected documents will be sent to the E-mail address of the contact person defined in the document. If there is no contact person in the document, then the E-Mail address defined for the business partner master data under the General tab will be selected. • You can change the default contact person and the email address in the next window. 20

---

## Diapositiva 21

21 PUBLIC Send Multiple Documents to Multiple E-Mail Recipients • After approving the E-Mail Options window, the E-Mail window appears for the document type, listing the selected documents. • The name of the contact person and its E-Mail address appear depending on the selection you did in the previous window. If an E-Mail group was selected then the details of the contact person associated with the selected E-mail group appear. • If the selected E-mail group does not contain a contact person who is associated with the respective business partners, no name or E-Mail address will appear. • You can update the name and the E-mail address manually if required. • The E-Mail column is selected by default. If you want to cancel sending a certain document, deselect this option. • In the Subject and Body columns the text inserted for the given document type in the Print Preferences window appears. To edit the text, double-click the field in the required line. A text editor appears, enables you to add and edit text, or insert any existing predefined text. • Finally, choose Send. • As a result, the document will be mailed to each contact person defined in this window, and therefore to each company. 21

---

## Diapositiva 22

22 PUBLIC Send Aging Report to Several Business Partners • After generating the aging report, either for customers or for vendors, you can e- mail the respective aging data to the relevant business partners. 22

---

## Diapositiva 23

23 PUBLIC Settings at the Report Level Default Text  for Automatic Mail Sending Administration System Initialization Print Preferences Per Report: • Similarly to the document option, you can define default text for the automatic mail subject and body. • Use the menu path shown on the graphic. • In the slide example, the finance department manager has entered default text in the E-Mail Subject and the E-Mail Body fields. 23

---

## Diapositiva 24

24 PUBLIC Send Aging Report to Several Business Partners • After generating the aging report, for customers in our example, choose the business partners you wish to E-Mail their aging data. • From the File menu choose Send, and then either E-Mail or Outlook E-Mail. 24

---

## Diapositiva 25

25 PUBLIC Send Aging Report to Several Customers Note that the PDF files with the aging data to be sent are already created and you can view them. Follow the details in the Source Path and the File Name columns. Accountant • Similarly to the sending multiple documents to multiple E-Mail recipients options, in the E-Mail Options window define whether to use an E-Mail group or not. • After approving the E-Mail Options window, the E-Mail Aging window appears, listing the selected business partners. • The name of the contact person and its E-Mail address appear: • If an E-Mail group was selected then the details of the contact person associated with the selected E-mail group appear. • Otherwise, the E-Mail address defined for the business partner master data under the General tab appears. • You can change the name and the E-mail address manually if required. • Note that the PDF files with the aging data to be sent are already created and you can view them. Follow the details in the Source Path and the File Name columns. • Finally, choose Send. • As a result, each contact person defined in this window will receive the aging data relevant for his company. 25

---

## Diapositiva 26

26 PUBLIC You can automatically create and send PDF files by mail when adding documents. You can define a company default on whether to use the SAP Business One mailer or Microsoft Outlook. You can also define default text for the automatic mail subject and body. By assigning E-Mail groups to given contact person in the business partner master data record you create distribution lists to e-mail multiple documents to multiple recipients, all in one go. This way, whenever documents are sent via e-mail to the selected E-Mail group, this contact person receives the document produced for his company. Using e-mail groups, you can send relevant information from the customer aging report simultaneously to multiple customers You can review the PDF files to be sent before sending them. Summary You can automatically create and send PDF files by mail when adding documents. The e-mail is by default sent to the contact person’s e-mail from the master data. You can define a company default on whether to use the SAP Business One mailer (SBO Mailer) or Microsoft Outlook. You can also define default text for the automatic mail subject and body. By assigning E-Mail groups to given contact person in the business partner master data record you create distribution lists to e-mail multiple documents to multiple recipients, all in one go. This way, whenever documents are sent via e-mail to the selected E-Mail group, this contact person receives the document produced for his company. Using e-mail groups, you can send relevant information from the customer aging report simultaneously to multiple customers You can review the PDF files to be sent before sending them.

---

## Diapositiva 27

28 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and/or platform directions and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

