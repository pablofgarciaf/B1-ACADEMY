# Transcripción por Diapositiva: 10_Production_42_Process_ByProductsandAdditional

## Diapositiva 1

PUBLIC Production and MRP: By Products and Additional Quantity SAP Business One Version 10.0 Welcome to the By-Product and Additional Quantity course topic. In order to take this course, you should first complete the Production Process training topic. 1

---

## Diapositiva 2

After completing this topic, you will be able to: Explain the concept of a by-product. Add By–Products to inventory during the production process Define Additional Quantity in the Production Order Calculate the planned quantity of items and resources in the Production Order 2 PUBLIC At the end of this topic, you will be able to:  Explain the concept of a by-product.  Add By–Products to inventory during the production process  Define Additional Quantity in the Production Order  Calculate the planned quantity of items and resources in the Production Order Objectives

---

## Diapositiva 3

So What is a by-product? A by-product is an item produced from left-over materials in the production process. One or more by-products can be produced along with the main product, using a single production order. These by-products are then stored in the warehouse as separate items and later are sold or used again as a component in production. In our business example, production of window and door frames involves cuts that leave wood remains that can be re-used for producing smaller sized items.  Other examples include: Production of chemicals, where beside the main chemical also some side chemicals can be produced. Metal plate cutting, where the remains are re-used for production. 3 3 PUBLIC By-Products What is a by-product?  A by-product is an item produced from left-over materials in the production process.  One or more by-products can be produced along with the main product, using a single production order.  These by-products are then stored in the warehouse as separate items and later are sold or used again as a component in production. Examples:  Production of window and door frames, where the remains after cutting are re-used for production of smaller sizes of final products.  Production of chemicals, where beside the main chemical also some side chemicals can be produced.  Metal plate cutting, where remains are re-used.

---

## Diapositiva 4

By-products are defined in Bill of Materials and Production Orders as items, but with a negative quantity. Both the Manual and Backflush issue method are supported for by-product. By-products are received to a warehouse by Receipt from Production document, like the main final product. Here we see a by-product item with a negative quantity of 1 entered on a Production Order row. Since the planned quantity for the finished product is 20, the total of by-products produced during manufacturing will be 40.  Because we know that this quantity is always produced when making this finished product, we choose to backflush the by-product. 4 4 PUBLIC By-Products in BOM and Production Order  By-products are defined in BOMs and Production Orders as items, but with a negative quantity  Both the Manual and Backflush issue methods are supported for by-products

---

## Diapositiva 5

By-products are received from production into the warehouse by a Receipt from Production, along with the main final product. When the Manual issue method is used, the quantities can by manually adjusted. However, when the Backflush issue method is used the quantity is derived from the parent item quantity of the main final product.. By-products with Backflush issue method are added or removed together with the parent item, they are bound together. By-products with Manual issue method can be added or removed from the document as independent lines. A By-Product column can be added in the Receipt from Production document that indicates if the item is a by-product or not. 5 5 PUBLIC Receiving By-Products  By-products are received from production into the warehouse by a Receipt from Production, along with the main final product  When the Manual Issue method is used then the quantity can be manually adjusted  When the Backflush issue method is used then the quantity is derived from the quantity of the main final product Two items are added: the produced item and the by-product Indicates whether an item is a by-product

---

## Diapositiva 6

What is Additional Quantity? Additional Quantity (Setup Quantity) represents items or resources that need to be consumed at the beginning or at the end of a production process. Examples include: Machine startup time  (Resource). A lead component used to adjust the machine (Item). The Planned Quantity of a component in a Production Order is calculated using this formula: Planned Quantity = (produced item planned Qty x base Qty) + Additional Qty. This rule applies for both items and resources. 6 6 PUBLIC Additional Quantities What is an Additional Quantity?  Additional Quantity (Setup Quantity) are items or resources that need to be consumed at the beginning or at the end of a production process.  Additional Quantities are not affected by the number of parent items produced. Examples:  Machine startup time (Resource)  Lead component used to set up the machine (Item) Planned Quantity = (produced item planned Qty x base Qty) + Additional Qty

---

## Diapositiva 7

7 PUBLIC Example: Additional Quantities Example – Additional Qty represents setup time of the resource  BOM definition: Qty = 1 , Additional Qty = 0.25  Planned final product Qty = 10  Planned resource component Qty = (10*1) + 0.25 = 10.25 Here is an example of calculating an Additional Quantity.  Here the Additional Quantity represents the setup time for the resource. In our business example, we use a lathe machine in the production process. In the bill of materials we define the Quantity as 1 hour for running the lathe machine, but add an Additional Quantity of 0.25 hours for the time taking to set up the drill of the machine. In our Production Order we produce a quantity of 10 items, therefore the total time for manufacturing the final product is 10 hours based on 10 times 1 hours.  However we must add the additional time for the machine set up.  Since the set up is not dependent on the number of items produced, we just add the additional time to the 10 hours manufacturing time and receive a total of 10.25 hours. 7

---

## Diapositiva 8

8 PUBLIC Summary Here are some key points:  By-products are defined in Bills of Materials and Production Orders as items, but with negative quantity.  Additional Quantity is an amount of items or resources that needs to be consumed at the beginning or at the end of a production process, and is not affected by the number of parent items to produce.  The Planned Quantity of a component in the Production Order row is equal to: (the quantity in the row X the planned quantity of the production order) + the additional quantity in the row. Here are some key points to take away from this session: By-products are defined in Bills of Materials and Production Orders as items, but with negative quantity. Additional Quantity is an amount of items or resources that needs to be consumed at the beginning or at the end of a production process, and is not affected by the number of parent items to produce. The Planned Quantity of a component in the Production Order row equals to: (the quantity in the row X the planned quantity of the production order) + the additional quantity in the row. 8

---

## Diapositiva 9

9 No part of this publication may be reproduced or transmitted in any form or for any purpose without the express permission of SAP SE or an SAP affiliate company. The information contained herein may be changed without prior notice. Some software products marketed by SAP SE and its distributors contain proprietary software components of other software vendors. National product specifications may vary. These materials are provided by SAP SE or an SAP affiliate company for informational purposes only, without representation or warranty of any kind, and SAP or its affiliated companies shall not be liable for errors or omissions with respect to the materials. The only warranties for SAP or SAP affiliate company products and services are those that are set forth in the express warranty statements accompanying such products and services, if any. Nothing herein should be construed as constituting an additional warranty. In particular, SAP SE or its affiliated companies have no obligation to pursue any course of business outlined in this document or any related presentation, or to develop or release any functionality mentioned therein. This document, or any related presentation, and SAP SE’s or its affiliated companies’ strategy and possible future developments, products, and platforms, directions, and functionality are all subject to change and may be changed by SAP SE or its affiliated companies at any time for any reason without notice. The information in this document is not a commitment, promise, or legal obligation to deliver any material, code, or functionality. All forward-looking statements are subject to various risks and uncertainties that could cause actual results to differ materially from expectations. Readers are cautioned not to place undue reliance on these forward-looking statements, and they should not be relied upon in making purchasing decisions. SAP and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. All other product and service names mentioned are the trademarks of their respective companies. See http://global.sap.com/corporate-en/legal/copyright/index.epx for additional trademark information and notices.

---

