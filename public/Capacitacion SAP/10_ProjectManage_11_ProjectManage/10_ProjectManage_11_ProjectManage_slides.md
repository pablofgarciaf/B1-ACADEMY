# Transcripción por Diapositiva: 10_ProjectManage_11_ProjectManage

## Diapositiva 1

PUBLIC Project Management: Overview Version SAP Busi10.0ness One In this training you will find two scenarios that describe some main features of the Project Management module. An additional training, Project Management Billing is also available. Please refer to the How to Work with Project Management in SAP Business One How to Guide document for additional information. 1

---

## Diapositiva 2

At the end of this topic, you will be able to:  Explain the concept of project management in SAP Business One  Create, maintain and complete a project using Project Master Data  Connect different objects to a project master data.  Create and work with subproject  Monitor your projects using the Gantt chart and project management reports 2 INTERNAL At the end of this topic, you will be able to:  Explain the concept of project management in SAP Business One  Create, maintain and complete a project using Project Master Data  Connect different objects to a project master data.  Create and work with subproject  Monitor your projects using the Gantt chart and project management reports Objectives

---

## Diapositiva 3

3 INTERNAL Concept Stage 1 • Project Data (%) Stage 2 • Project Data (%) Stage 3 • Project Data (%) Project Completion (100%) • A centralized Project master data enables : • Monitoring tasks, progress and general project information • Managing project related documents • A billing wizard enables creating A/R documents in a batch Benefits The Project Management module, enables you to manage different types of projects in the system. The Project Master Data window is a workbench that centralizes different aspects of the project and enables you to document the different stages of the project. The list of stages compose the project process and can be used for planning. For each stage a progress percentage is defined in a way that all finished project stages will sum up to 100%. Each stage may contain data relevant for that stage of the project. The system analyzes this data to retrieve information about the project value, cost and profit. Note that the Project Management module should be manually enabled in the Company Details window. Let us see in the next slide the objects that compose the project data. 3

---

## Diapositiva 4

For each stage in the Project Master Data, different data can be referenced. This data can be composed of marketing and inventory documents, production orders, service solutions and activities. In addition, a financial project code can be linked to each project. The Project Master Data forms one entry point for both financial and logistical data. 4 4 INTERNAL Project Data Project Master Data Inventory documents Marketing Documents Service solutions and Activities Production Orders Financial Project Project data can be:

---

## Diapositiva 5

5 INTERNAL Project management output can be: Project Management Output Project Master Data Gantt chart Project management reports Billing Document Generation Wizard Using the project information accumulated in the master data, the user can also generate a Gantt chart, reports and run the Billing Document Generation Wizard to invoice the project’s chargeable costs. 5

---

## Diapositiva 6

6 INTERNAL Business Scenario OEC Computers provide technical IT solutions for their customers. These solutions usually include:  infrastructure planning and installation,  providing computer hardware,  equipment configuration and integration and  peripheral equipment installation. OEC computers would like to manage a project for each customer to track the progress of the project according to different milestones. They would also like to define a budget  for the project and analyze its profitability. In addition, some projects are composed of several subprojects. To achieve this, OEC computers decide to use the Project Management module. OEC Computers provide technical IT solutions for their customers. These solutions usually include:  infrastructure planning and installation,  providing computer hardware,  equipment configuration and integration and  peripheral equipment installation. OEC computers would like to manage a project for each customer to track the progress of the project according to different milestones. They would also like to define a budget  for the project and analyze its profitability. In addition, some projects are composed of several subprojects. To achieve this, OEC computers decide to use the Project Management module. 6

---

## Diapositiva 7

7 INTERNAL Scenario 1 – The Project Process Stage row 1 • Assignment of the project team Stage row 2 • Kickoff meeting Stage row 3 • Gap analysis Stage row 4 • Purchasing and assembly Stage row 5 • Configuration and integration Stage row 6 • Pilot and signoff In this training we will walk through a project process from the creation step until project completion. In the image we can see the different stages of the project in the scenario. Note that in many cases, all project stages are created upfront including planned start time and end time of each stage. In our scenario, the stages are created one by one according to the project’s progress. 7

---

## Diapositiva 8

8 INTERNAL Project Header Information 2 3 4 Four possible statuses: Started, Paused, Stopped and Finished. The complete% progress bar is updated according to the progress percentage of the finished stage rows. Connect one financial project in order to link relevant documents associated with this project. 1 A project performed for a customer is marked as External whereas an in-house project is marked as Internal. Project Management Project Master Data 1 2 4 3 Kate is the project manager at OEC Computers. She enters the Project Master Data and adds a new project for the customer Maxi Teq. A customer project is marked as External (1). Kate keeps the default status of the project, Started, as long as the project is running (2). The different statuses are further explained in the next slides. Kate can also track the progress of the project by looking at the % Complete field (3). We will also talk about this field in the next slide. Finally, Kate links the financial project that was opened by the accountant in the company. This financial project is linked to revenue accounts in the chart of accounts. This way financial information can be tracked for this project and in addition this enables the linkage of relevant documents associated with this project (4). We will see that as well in the next slides. 8

---

## Diapositiva 9

9 INTERNAL Each finished stage row (task) adds to the progress bar Project Stages and Completion Progress Rate Predefined project stages that can be edited Each stage has one or more tasks. The Stages tab is the backbone of the Project Master Data. Here you document each stage of the project. Each stage may have more than one task. The list of tasks is common to all stages. This means that each task can be used by different stages. In our scenario, Kate defines two tasks for the Conception/ Initiation stage. The first is assigning a project team and the second is a kick off meeting. Note that stage values can be personalized in a way that fits the company needs. The first task is checked as finished and holds 2% of the project completion. Therefore, the completion progress rate of the entire project is now 2% as shown in the % Complete field. Note the difference between the End Date and the Finished Date. The end date is an estimated or desired date the user enters. The finished date, on the other hand, is the actual date when the stage row was completed. Once checking the Finished box, today’s date is automatically populated in the Finished Date field. This date can be adjusted manually. 9

---

## Diapositiva 10

10 INTERNAL Stages Data For each stage row in the upper table, additional data can be added through the options at the bottom For each stage row, additional data can be entered. After choosing the row of the stage, expand the relevant option to enter the details. The data can be for example an A/R Invoice for billing the customer, an Activity for a planned meeting or an Open Issue that rose during the project process. Let us show how we enter this data in the next slides. 10

---

## Diapositiva 11

11 INTERNAL Adding an Activity A meeting activity was set and connected to the kick off meeting task row Kate schedules the meeting in a SAP Business One calendar Activity. She extends the Activity option and from the Activity field, she adds a new meeting activity. Relevant information from the activity is copied to the Activity row in the project. Note that an activity related to a project can be created directly from the CRM or Business Partner module. Once the project data is entered to the activity, it is automatically added to the relevant project stage. It is also possible to connect a row stage id from a project in the Activity Other Details tab. We will further discuss it later on in the training. 11

---

## Diapositiva 12

12 INTERNAL Adding an A/R Invoice An invoice was issued to the customer and attached to stage row 4 A budgeted cost was entered manually Kate marks the second task as finished and the completion rate now stands on 7%. Then, Kate adds a new stage called Definition/ Planning and adds a task for a gap analysis they are about to perform. She adds another predefined stage for a monthly billing for the hours invested in this project - 2,000. After adding the A/R invoice, the amount is copied to the stages table, in the Invoiced Amount (A/R) column. This column displays the total amount of all the A/R invoices related to this stage row. Kate also manually adds a planned cost for each stage row. This way, a project budget can be planned and compared to the actual accumulated value of the project. Note that A/R invoices and deliveries can also be issued in a batch using the Billing Document Generation wizard. For more information about the wizard, please refer to the Project Management – Billing course topic. 12

---

## Diapositiva 13

Kate adds a fourth stage to the project for the purchasing of hardware and assembling computers and servers. Now Kate wants to update the Project Master Data. She opens the master data record and a system message pops up as shown in the image. The system recognizes a document that is not connected to the project master data, but has the same financial project code associated with the project – project code 101. Kate chooses Yes (1) in order to assign the document to the project master data. The Document Assignment window opens. Kate sees an A/P Invoice with several rows. She opens the invoice and realizes this is the equipment purchase invoice for this project. Kate chooses all rows (2), and choses the relevant stage row, stage 4, on the right side of the window (3). Finally, she chooses the arrow button (4) to relate the document rows. 13 13 INTERNAL Document Assignment Document Assignment 2 3 4 1

---

## Diapositiva 14

In the image we see the Documents section is extended for the 6th stage row. There we can see the A/P invoice row that was related to the Project Master Data in the previous step. Kate also attaches the vendor’s scanned invoice in the Attachment tab. The total amount of the A/P Invoice now appears in the Invoiced Amount (A/P) column for stage 4. Note that any document can also be added manually in the Document section. 14 14 INTERNAL Managing Documents

---

## Diapositiva 15

15 INTERNAL Connecting a Project Stage in Documents Time Sheet Type Employee ID Name 4 Milton First Name Kate Stage End Time Start time Date # Con1(6-1) 18:00 09:00 25.9.18 1 A project can be manually connected using the Stage field in: • Marketing documents • Time sheet • Activities * The value 6 is the internal key of the project * We already saw the possibility to connect a document in a Project Master Data but it is also possible to connect a project’s stage row to a document row. This connection is done in the Stage column. The Stage value is the concatenation of the project (the internal key) and stage row numbers, and the Unique ID field in the stage row (if defined). The Unique ID in the project master data is a free text and optional field that the user can fill in for each stage row. Then, in marketing documents, Activities and the Time Sheet, this unique ID can be used to identify and connect these documents to a project’s stage. It is recommended to give a meaningful name to the unique ID field to easily find it in the list of IDs. Note that connecting a project stage in a document row is possible only when the same financial project code is connected to the project master data and to the document row. The time sheet topic is covered in the Project Management Billing course. 15

---

## Diapositiva 16

16 INTERNAL Managing Production Orders in a Stage OEC Computers assembled a server in a production process for this project. Kate opens the Work Order section, of the 4th stage, and adds the relevant Production Order as shown in the lower image. Only Production Orders with the same financial project code are shown in the list to choose from. Alternatively, we can manually add a new Production Order directly, without indicating a financial project code. In the Production Order we can add resources for the employees involved in this project. This way, the project can reflect the employee cost and also allows managing the employee capacity. 16

---

## Diapositiva 17

17 INTERNAL Stage Row Dependency  You can define up to 4 different dependencies.  When a stage row is dependent on another task, it can be marked as finished as long as the base task is finished as well. In our project, stage row 5, Purchasing and Assembly,  is dependent on stage row 3, Gap Analysis. This means that only after Kate marks task 3 as finished can she mark task 5 as finished as well. The reason Kate creates this dependency is to make sure that all preparations made in this stage align with all the recommendations of the gap analysis. It is also possible to add a dependency on a stage from a different subproject. We will learn about subprojects later on in this training. 17

---

## Diapositiva 18

The time for equipment installation at the customer site has arrived and Kate adds stage row 7 for Configuration and Integration. During installation, the technician on site encounters a problem concerning a certification needed for a certain software installation. The technician calls Kate and asks for her help. Kate creates an Open Issue record for Stage row 7 and looks for a pre-defined solution from the solution knowledge base in the Solution column of the Open Issue section. This is the same solution knowledge base from the Service module. Kate finds solution No. 27 with the relevant certification information and calls the technician on site. Once the issue is solved, Kate marks the issue as closed. Note that a stage row cannot be marked as finished while an open issue related to this stage exists. Also note that the solution knowledge base is defined in the Service module. An open-issues dedicated report exists to analyze recurring issues in projects. This way management can track bottle necks or spot issues that can be predicted and better managed. 18 18 INTERNAL Handling Open Issues in a Project During the configuration stage (Stage row 7) an issue occurred concerning manufacture certification creation.

---

## Diapositiva 19

The last stage of the project has arrived: running a pilot and signing off the project. This time Kate assigns herself, as the owner of this stage row. She is responsible at the customer site to run the pilot and handle rejections. 19 19 INTERNAL Stage Owner

---

## Diapositiva 20

20 INTERNAL Project Summary 1/2 Relevant when working with sub-projects Total Variance = Total A/P - Budget The Summary tab provides important information like: planned cost (budget) vs. actual stage value, profit parameters and production and resources costs. In the image, the highlighted section at the bottom is relevant when working with sub- projects and shows the total amounts of all sub-projects. The data at the top of the window is relevant for the current project/subproject. The project in the image, has no subprojects and therefore the data at the bottom is equal to the data in the upper section. In the Budget section, the subproject Budget field is actually the total Planned Cost column amounts of all the stage rows (as appears in the Stages tab). The Total Variance value is a calculation of the Total A/P field value – (minus) the Budget. In the Variance % field, we see that the actual cost of AP document is 32% less than the planned cost. Note that the Open Amount (A/P) field value is the total of all open A/P documents connected to this project/subproject excluding the A/P invoice. This allows better planning upcoming project expenses. 20

---

## Diapositiva 21

21 INTERNAL Relevant when working with sub-projects Project Summary 2/2 Expected income  manually entered Total Variance = Total A/R – Potential amount In the Profit Values section, we see income data. Kate manually entered the expected income amount from this project. Then she saw that the total customer invoiced amount did not reach yet the expected amount. Kate expects that this gap will be eliminated in the next billing round. The Open Amount (A/R) field shows all open A/R documents except for A/R invoices. In the Work Order Costs section we see the different production related costs. Note that the Total Variance amount is the sum of all the Production Orders Variance Total amounts (as indicated in the production order summary tab), related to this project. 21

---

## Diapositiva 22

22 INTERNAL Project Status Started Finished Stopped Paused When a project is done and all obligations to the customer are fulfilled, Kate changes the status of the project from Started to Finished. To finish a project all tasks should be checked as Finished The are two other status values that Kate did not use in this project. The first is status Stopped. Kate chooses this status when a project is stopped before anticipated. When selecting Stopped or Finished, the current date is automatically updated in the closing date field but can be changed. To put a project on hold temporarily, the Paused status should be chosen. 22

---

## Diapositiva 23

23 INTERNAL Scenario 2 - Working with Subprojects Started Project – Parameter100 BP Name Parameter Technologies BP Code C2000 Project Name Parameter100 … Project Type External Internal Project No. 5 Status … Overview Summary Remarks       Attachments Completeness% Planned Cost End Date Start Date Subproject 20 35000 31.10 01.10 London 1 25000 15.11 15.10 Cambridge 2 Stages … Subprojects Project with Subprojects √ The subproject feature enables managing complex projects where each subproject has its own stages and summary data. A subproject may contain further subprojects underneath it, thus forming a hierarchical tree of subprojects, with the main project at the top level. Kate manages another project for a big customer – Parameter Technologies. This customer has several locations and need to renew IT equipment and infrastructure in all their locations. Kate decides to create a subproject for each location. This way she can manage the project data for each location but also manage accumulated data from all the locations. 23

---

## Diapositiva 24

24 INTERNAL Adding and Duplicating Subprojects Subproject – London [Project: Parameter100] Parent Project/Subproject No. 5 Subproject London Status Open … Start Date 01.10. End Date … Subproject contribution % 20 OK Cancel Add New Subproject Add New Subproject Add Subproject from Template List of Subproject London Phase1 Phase2 … Kate creates subproject London underneath project Parameter100. Then before adding a second subproject she realized all subprojects are similar. Therefore Kate decides to duplicate subproject London, that she already created. She chooses the option to add sub project from template, as shown in the image, and then chooses London from the List of Subprojects. 24

---

## Diapositiva 25

25 INTERNAL Subproject Contribution Subproject – London [Project: Parameter100] Parent Project/Subproject No. 5 Subproject London Status Open … Start Date 01.10.18 End Date … Subproject Contribution % 20 10% Project – Parameter100 BP Name Parameter Technologies BP Code C2000 Project Name Parameter100 … Project Type External Internal Project No. 5 Completeness% … 10% 10% Completeness% 50% In each subproject, Kate defines the relative portion of the subproject from the entire project by entering a percentage in the Contribution % field. Look at the image. Subproject London is defined as 20% out of project Parameter100. We can also see in the image that it is 50% completed. Since other subprojects have not started yet, the completeness% of the entire project is 10% which is 50% out of 20% defined for subproject London. 25

---

## Diapositiva 26

26 INTERNAL Overview of a Project A project overview can be seen in: • The Overview tab • The Project Overview report generated from the context menu in the Project Master Data Choose Project Overview from the context menu Kate added several subprojects according to the different locations in project Parameter100. Now she goes to the Overview tab to receive a wider view of all her subprojects. She also opens the Project Overview from the context menu of the Project Master Data. The project overview works as a workbench where Kate can view the different subprojects progress, mark a stage row as completed and open each subproject master data in the list. 26

---

## Diapositiva 27

27 INTERNAL Gantt Chart Choose Gantt Chart from the context menu Adjust display to days/weeks/months Another way to monitor a project is by viewing its Gantt chart. You do that by choosing Gantt Chart from the context menu of the Project Master Data. Look at the image. You can see 3 subprojects for project Parameter100. Each subproject has the same structure with identical 4 stage rows. However, each subproject starts and ends in different dates. You can move Gantt Chart time bars of subprojects and project stages to update project timelines for planning purposes. 27

---

## Diapositiva 28

28 INTERNAL Stage Analysis List of open projects that can be drilled down to receive a list of related stages Project Reports Three available reports: Open Issues List of open issues that can be filtered by owner/ priority /project Resources List of resources related to projects There are 3 different reports in the Project module as shown in the image. These reports can analyze multiple projects and give a cross project overview. Kate uses the Stage Analysis report to receive the full list of open projects and stages. This report is a monitoring tool that provides different project data. To monitor statistics of high occurrence of specific open issues, Kate runs the Open Issues report. In addition, she uses the Resources report to track technicians (that are defined as resources in Production Orders). These reports can be very helpful when working with sub-projects as well since this way the project data is grouped together in the reports. Note there is a forth report that provides an overview of the time sheet records related to projects. Refer to the Project Management Billing course to learn more about the time sheet. 28

---

## Diapositiva 29

29 INTERNAL Summary 1/2 Here are some key points:  A project is composed of stages.  Each row in the Stages tab represents a certain task in a stage. Several tasks (rows) can be defined for one stage.  Each stage row holds a completion rate. The completion rates of all stages amount to 100%.  We can relate, for each stage row, different kinds of data including: documents, production orders, activities, open issues (incidents) and attachments.  The system recommends assignment of documents to a project according to the related financial project code.  It is also possible to connect stage rows within marketing documents, Activities and the Time Sheet by choosing the stage id in the document’s rows. Here are some key points:  A project is composed of stages.  Each row in the Stages tab represents a certain task in a stage. Several tasks (rows) can be defined for one stage.  Each stage row holds a completion rate. The completion rates of all stages amount to 100%.  We can relate, for each stage row, different kinds of data including: documents, production orders, activities, open issues (incidents) and attachments.  The system recommends assignment of documents to a project according to the related financial project code.  It is also possible to connect stage rows within marketing documents, Activities and the Time Sheet by choosing the stage id in the document’s rows. 29

---

## Diapositiva 30

30 INTERNAL Summary 2/2  When a financial project exists, it is important to link it to the project master data, in order to enable document assignment and to relate production documents.  We can set a stage row to be dependent on the completion of another stage row. A dependency can be defined between stages of different subprojects as well.  In the Summary tab we can find useful project information like project profit, budget and cost. Accumulated sub-project information is also displayed in the Summary tab.  A project can have subprojects underneath it. Each subproject can have its own subprojects and so on, forming an hierarchical structure of subprojects where the project is at the top level.  For each subproject, a contribution % should be defined to determine the portion of the subproject from the main project. This portion determines the relative contribution to the main project completeness.  When working with several subproject it is helpful to view the entire project in the project overview and the Gantt chart.  When a financial project exists, it is important to link it to the project master data, in order to enable document assignment and to relate production documents.  We can set a stage row to be dependent on the completion of another stage row. A dependency can be defined between stages of different subprojects as well.  In the Summary tab we can find useful project information like project profit, budget and cost. Accumulated sub-project information is also displayed in the Summary tab.  A project can have subprojects underneath it. Each subproject can have its own subprojects and so on, forming an hierarchical structure of subprojects where the project is at the top level.  For each subproject, a contribution % should be defined to determine the portion of the subproject from the main project. This portion determines the relative contribution to the main project completeness.  When working with several subproject it is helpful to view the entire project in the project overview and the Gantt chart. 30

---

## Diapositiva 31

31 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

