
 #Requirements Document 

Date: 22 march 2022

Version: 0.0

 
| Version number | Change |
| ----------------- |:-----------|
| | | 


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	- [Context Diagram](#context-diagram)
	- [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	- [Functional Requirements](#functional-requirements)
	- [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	- [Use case diagram](#use-case-diagram)
		- [Use case 1, UC1](#use-case-1-uc1)
				- [Scenario 1.1](#scenario-11)
				- [Scenario 1.2](#scenario-12)
				- [Scenario 1.x](#scenario-1x)
		- [Use case 2, UC2](#use-case-2-uc2)
		- [Use case x, UCx](#use-case-x-ucx)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description | 
| ----------------- |:-----------:|
|   Administrator     | Handles economic resources for the company mantains relationship with suppliers| 
|   Quality Office     |Offices that perform quality check on new items             | 
|   Production Organization Unit     |Area that requests product to warehouse to build something             | 
|   Packaging OU    |Area that packages items for shipping              | 
|   Suppliers     |Who supplies the items requested by company              | 
|   Manager DataBase     |Who manages the database              | 
|   Warehouse Worker    |Person/Machine that moves items around the warehouse             | 
|   Database   |Location to store informations about items, supplier and orders             | 
|   Internal Network     |Network that allows to link different internal organization with warehouse | 
|   Warehouse Manager    | Manages the warehouse, places orders |


# Context Diagram and interfaces

## Context Diagram

![](./images/context.png)

## Interfaces

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
| Suppliers | GUI | Keyboard+Mouse |
| Manager Warehouse | GUI | Keyboard+Mouse/Touchscreen |
| Warehouse Worker | GUI | Touchscreen/Barcode scanner |
| Quality Assurance | GUI | Keyboard+Mouse/Touchscreen |

# Stories and personas

- Marika is the manager of the warehouse, periodically she supervises the availability of items and once an item has low availability, she analyzes the list of the suppliers who provide this item and she performs an order to the one who is the most convenient for the company.

At the end of every day, Marika opens her PC and checks whether to buy a product or not. She wants to place an order quickly and go back home.
Marika decides to buy products that are available in limited quantities by looking at the quantities present and taking into consideration a threshold of necessity for the company. Furthermore, based on the quantity requested by the company, she can decide which supplier to contact to get the best possible discount on the purchase.
Marika is not interested in staying at the office long, so she leaves the work to come back home.


- Matteo is a warehouse employee, his job is to receive notifications from the application to move items and to confirm their movement. 

Every day, he is called upon to respond to requests from an organizational unit within the company. His job will therefore be to recieve a request, move the requested item around, scan the barcode of the item and then update who has received this product. At the end of the day, Matteo can relax because he can log out of the application quickly enough and then happily return home.


- Giacomo is dedicated to test the quality of the items received from the suppliers, picks random items to check their quality and approves/rejects the transfer.

Every day, including holidays, Giacomo applies quality control processes for his company, to guarantee the highest quality for internal products. Sometimes he even decides to take the products home with him to finish his work in the most correct way possible by filling in the supplier's card on his PC and thus informing the administrator about its reliability. The work he does is very tiring but has its advantages with the possibility of giving more space to his family.


# Functional and non functional requirements

## Functional Requirements

| ID        | Description  |
| ------------- |:-------------:| 
|  FR1 | Notification when an item is in quantity lower than the threshold |
|  FR1.1 | Show list of suppliers for product |
|  FR2 | Manage Order |
|  FR2.1 | Retrieve catalog |
|  FR2.2 | Send order request to accounting |
|  FR2.3 | Check for free space |
|  FR2.4 | Update order |
|  FR3 | Manage Quality Check Information |
|  FR3.1 | Update order status |
|  FR3.2 | Add quality check result and comment |
|  FR3.3 | Issue a reorder for product |
|  FR4 | Manage Products |
|  FR4.1 | Find item |
|  FR4.2 | Find space for incoming item |
|  FR4.3 | Notify employee for transfer |
|  FR4.4 | Confirm transfer and notify manager |
|  FR4.5 | Generate barcode |
|  FR4.6 | Reject order |
|  FR4.7 | Change product info |
|  FR4.8 | Add product to DB |
|  FR4.9 | Remove product from DB |
|  FR4.10 | Update available warehouse space |
|  FR5 | Manage Suppliers |
|  FR5.1 | Retrieve list of suppliers |
|  FR5.2 | Add supplier |
|  FR5.3 | Remove supplier |
|  FR5.4 | Manage suppliers information |
|  FR6 | Authentication and authorization |
|  FR6.1 | Check user info |
|  FR7 | Manage Employees |
|  FR7.1 | Generate account for new employee |
|  FR7.2 | Delete account for old employees |

## Non Functional Requirements

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Usability | Employees are able to use the app after 30 minutes of training; warehouse managers need 1 hour training | All FRs |
|  NFR2     | Privacy | Items locations in warehouse and suppliers information and prices should not be disclosed | FR2, FR4, FR5 |
|  NFR3     | Performance | All internal functions should complete in less than 0.5s | FR1, FR3, FR4, FR6, FR7 |
|  NFR4     | Security | Access only to authorized personnel | All FRs |
|  NFR5     | Domain | Generated barcodes should be unique and 15 digits long | FR4 |


# Use case diagram and use cases


## Use case diagram
\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>


\<next describe here each use case in the UCD>
### Use case 1, UC1
| Actors Involved        |  |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | \<Textual description of actions executed by the UC> |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

##### Scenario 1.1 

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.1 | |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the scenario can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after scenario is finished> |
| Step#        | Description  |
|  1     |  |  
|  2     |  |
|  ...     |  |

##### Scenario 1.2

##### Scenario 1.x

### Use case 2, UC2
..

### Use case x, UCx
..



# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >




