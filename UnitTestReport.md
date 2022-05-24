# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

### **Class *RestockOrderDAO* - method *store***
**Criteria:**

 - Table *RestockOrder* exists
 - *issueDate* is a valid date
 - *products* is a list of valid products
 - *supplierId* is the id of a user of type = 'supplier'

**Predicates:**
| Criteria | Predicate |
| -------- | --------- |
|  |  |
|  |  |
|  |  |
|  |  |

**Boundaries:**

**Combination of predicates:**

--------------------------------------------------
## Class User

 ### **Class *UserDAO* - method *storeUser***

**Criteria for method *storeUser*:**

 - Validity object User
 - User with unique email in database

**Predicates for method *storeUser*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity object User         |   Yes        |
|          |     No      |
|  User with unique email in database         |   Yes        |
|         |      No     |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity object User | User with unique id in database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidUser; True)|testNewUser|
|Yes|No|Invalid|T2(ValidUser; False)||
|No|Yes|Invalid|T3(NullUser; False)||
|No|No|Invalid|T4(NullUser; False)||



 ### **Class *UserDAO* - method *getUsers***

**Criteria for method *getUsers*:**

 - There are Users in DB

**Predicates for method *getUsers*:**

| Criteria | Predicate |
| -------- | --------- |
| There are Users in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| There are Users in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1((); ListUsers)|getUsers|
|No|Invalid|T2((); EmptyList)||



 ### **Class *UserDAO* - method *getSuppliers***

**Criteria for method *getSuppliers*:**

 - There are Suppliers in DB

**Predicates for method *getSuppliers*:**

| Criteria | Predicate |
| -------- | --------- |
| There are Suppliers in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| There are Suppliers in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1((); ListUsers)|getSuppliers|
|No|Invalid|T2((); EmptyList)||



 ### **Class *UserDAO* - method *login***

**Criteria for method *login*:**

 - Validity of tuple username, password
 - User exists in db with correct type

**Predicates for method *login*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity of tuple username, password         |   Yes        |
|          |     No      |
| User exists in db with correct type          |   Yes        |
|         |      No     |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity of tuple username, password | User exists in db with correct type | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidUsernamePassword; User)|login|
|Yes|No|Invalid|T2(ValidUsernamePassword; Null)||
|No|Yes|Invalid|T3(InvalidUsernamePassword; Null)||
|No|No|Invalid|T4(InvalidUsernamePassword; Null)||


 ### **Class *UserDAO* - method *getUserFromId***

**Criteria for method *getUserFromId*:**

 - ID is of a valid user

**Predicates for method *getUserFromId*:**

| Criteria | Predicate |
| -------- | --------- |
| ID is of a valid user         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| ID is of a valid user | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidID; User)|getUserFromId|
|No|Invalid|T2(InvalidID; Null)||


 ### **Class *UserDAO* - method *getUserFromEmail***

**Criteria for method *getUserFromEmail*:**

 - email is of a valid user

**Predicates for method *getUserFromEmail*:**

| Criteria | Predicate |
| -------- | --------- |
| email is of a valid user         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| email is of a valid user | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidEmail; User)|getUserFromEmail|
|No|Invalid|T2(InvalidEmail; Null)||


 ### **Class *UserDAO* - method *updateUser***

**Criteria for method *updateUser*:**

 - ID is of a valid user
 - newType is valid

**Predicates for method *updateUser*:**

| Criteria | Predicate |
| -------- | --------- |
| ID is of a valid user         |   Yes        |
|          |     No      |
| newType is valid         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| ID is of a valid user | newType is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidID; )|updateUser|
|Yes|No|Invalid|T2(ValidID; )||
|No|Yes|Invalid|T3(InvalidID; )||
|No|No|Invalid|T4(InvalidID; )||


 ### **Class *UserDAO* - method *deleteUser***

**Criteria for method *deleteUser*:**

 - ID is of a valid user

**Predicates for method *deleteUser*:**

| Criteria | Predicate |
| -------- | --------- |
| ID is of a valid user         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| ID is of a valid user | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidID; )|deleteUser|
|No|Invalid|T2(InvalidID; )||


--------------------------------------------------

## TestDescriptor


 ### **Class *TestDescriptorDAO* - method *storeTestDescriptor***

**Criteria for method *storeTestDescriptor*:**

 - TestDescriptor is valid

**Predicates for method *storeTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
| TestDescriptor is valid    |   Yes        |
|          |     No      |



**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| TestDescriptor is valid| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidTestDescriptor; True)|teststoreTestDescriptor|
|No|Invalid|T2(nullTestDescriptor; False)||




 ### **Class *TestDescriptorDAO* - method *getTestDescriptors***

**Criteria for method *getTestDescriptors*:**

 - There are TestDescriptors in DB


**Predicates for method *getTestDescriptors*:**

| Criteria | Predicate |
| -------- | --------- |
| There are TestDescriptors in DB         |   Yes        |
|          |     No      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:

| There are TestDescriptors in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1((); ListTestDescriptors)|testgetTestDescriptors|
|No|Invalid|T2((); EmptyList)||



 ### **Class *TestDescriptorDAO* - method *getTestDescriptorsByID***

**Criteria for method *getTestDescriptorsByID*:**

 - ID is valid

**Predicates for method *getTestDescriptorsByID*:**

| Criteria | Predicate |
| -------- | --------- |
| ID is valid    |   Yes        |
|          |     No      |



**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| ID is valid| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidID; TestDescriptor)|testgetTestDescriptorsByID|
|No|Invalid|T2(InvalidID; Null)||


 ### **Class *TestDescriptorDAO* - method *updateTestDescriptor***

**Criteria for method *updateTestDescriptor*:**

 - New TestDescriptor is valid
 - ID is valid

**Predicates for method *updateTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
| New TestDescriptor is valid    |   Yes        |
|          |     No      |
| ID is valid    |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| New TestDescriptor is valid | ID is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidTestDescriptor; )|testupdateTestDescriptor|
|Yes|No|Invalid|T2(InvalidTestDescriptor; )||
|No|Yes|Invalid|T3(InvalidTestDescriptor; )||
|No|No|Invalid|T4(InvalidTestDescriptor; )||


 ### **Class *TestDescriptorDAO* - method *deleteTestDescriptor***

**Criteria for method *deleteTestDescriptor*:**

 - ID is valid

**Predicates for method *deleteTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
| ID is valid    |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| ID is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidID; )|testdeleteTestDescriptor|
|No|Invalid|T2(InvalidID; )||

--------------------------------------------------

## TestResult

 ### **Class *TestResultDAO* - method *storeTestResult***

**Criteria for method *storeTestResult*:**

 - Validity object TestResult

**Predicates for method *storeTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity object TestResult         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity object TestResult | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidTestResult; True)|testNewTestResult|
|No|Invalid|T2(NullTestResult; False)||


 ### **Class *TestResultDAO* - method *getTestResultBySKUITEMID***

**Criteria for method *getTestResultBySKUITEMID*:**

 - TestResult with SKUITEMID exists in DB

**Predicates for method *getTestResultBySKUITEMID*:**

| Criteria | Predicate |
| -------- | --------- |
| TestResult with SKUITEMID exists in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| TestResult with SKUITEMID exists in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidSKUITEMID; TestResultList)|testgetTestResultBySKUITEMID|
|No|Invalid|T2(InvalidSKUITEMID; EmptyList)||


 ### **Class *TestResultDAO* - method *getTestResultBySKUITEMIDAndID***

**Criteria for method *getTestResultBySKUITEMIDAndID*:**

 - TestResult with SKUITEMID exists in DB
 - TestResult with ID exists in DB

**Predicates for method *getTestResultBySKUITEMIDAndID*:**

| Criteria | Predicate |
| -------- | --------- |
| TestResult with SKUITEMID exists in DB         |   Yes        |
|          |     No      |
| TestResult with ID exists in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| TestResult with SKUITEMID exists in DB | TestResult with ID exists in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidSKUITEMIDAndID; TestResult)|testgetTestResultBySKUITEMIDAndID|
|Yes|No|Invalid|T2(InvalidSKUITEMIDAndID; Null)||
|No|Yes|Invalid|T3(InvalidSKUITEMIDAndID; Null)||
|No|No|Invalid|T4(InvalidSKUITEMIDAndID; Null)||


 ### **Class *TestResultDAO* - method *updateTestResult***

**Criteria for method *updateTestResult*:**

 - Validity new TestResult
 - TestResult with rfid exists in DB
 - TestResult with id exists in DB

**Predicates for method *updateTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity new TestResult         |   Yes        |
|          |     No      |
| TestResult with rfid exists in DB         |   Yes        |
|          |     No      |
| TestResult with id exists in DB         |   Yes        |
|          |     No      |



**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity new TestResult | TestResult with rfid exists in DB | TestResult with id exists in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|Yes|Yes|Yes|Valid|T1(ValidData; True)|testupdateTestResult|
|Yes|Yes|No|Valid|T2(InvalidData; True)||
|Yes|No|Yes|Valid|T3(InvalidData; True)||
|Yes|No|No|Valid|T4(InvalidData; True)||
|No|Yes|Yes|Valid|T5(InvalidData; True)||
|No|Yes|No|Valid|T6(InvalidData; True)||
|No|No|Yes|Valid|T7(InvalidData; True)||
|No|No|No|Valid|T8(InvalidData; True)||



 ### **Class *TestResultDAO* - method *deleteTestResult***

**Criteria for method *deleteTestResult*:**

 - TestResult with rfid exists in DB
 - TestResult with id exists in DB

**Predicates for method *deleteTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
| TestResult with rfid exists in DB         |   Yes        |
|          |     No      |
| TestResult with id exists in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| TestResult with rfid exists in DB | TestResult with id exists in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidSKUITEMIDAndID; TestResult)|testdeleteTestResult|
|Yes|No|Invalid|T2(InvalidSKUITEMIDAndID; Null)||
|No|Yes|Invalid|T3(InvalidSKUITEMIDAndID; Null)||
|No|No|Invalid|T4(InvalidSKUITEMIDAndID; Null)||

--------------------------------------------------
## Class Position

 ### **Class *PositionDAO* - method *storePosition***

**Criteria for method *storePosition*:**

 - Validity of object Position
 - Position with unique id in database

**Predicates for method *storePosition*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity object Position         |   Yes        |
|          |     No      |
|  Position with unique id in database         |   Yes        |
|         |      No     |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity object Position | Position with unique id in db | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidPosition; lastID)|testNewPosition|
|Yes|No|Invalid|T2(ValidPosition; Error)||
|No|Yes|Invalid|T3(NullPosition; Error)||
|No|No|Invalid|T4(NullPosition; Error)||



 ### **Class *PositionDAO* - method *getPositions***

**Criteria for method *getPositions*:**

 - There are Positions in DB

**Predicates for method *getPositions*:**

| Criteria | Predicate |
| -------- | --------- |
| There are Positions in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| There are Users in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1((); ListPositions)|getPositions|
|No|Invalid|T2((); EmptyList)||



 ### **Class *PositionDAO* - method *getPositionByID***

**Criteria for method *getPositionByID*:**

 - The given PositionID is in database

**Predicates for method *getPositionByID*:**

| Criteria | Predicate |
| -------- | --------- |
| The given PositionID is in database         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| There are Suppliers in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(Existing ID in database; Position)|getPositionFromId|
|No|Invalid|T2(Existing ID in database; Null)|"|



 ### **Class *PositionDAO* - method *updatePosition***

**Criteria for method *updatePosition*:**

 - Validity object for new Position
 - Existing PositionID from a DB

**Predicates for method *updatePosition*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity object for new Position        |   Yes        |
|          |     No      |
| Existing PositionID from a DB |   Yes        | 
|  |      No     |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity object for new Position | Existing PositionID from a DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1((ValidPosition; PositionIDValid); ())|updateAllPosition|
|Yes|No|Invalid|T2((ValidPosition; PositionIDValid); ())|"|
|No|Yes|Invalid|T3((ValidPosition; PositionIDValid); Error)|"|
|No|No|Invalid|T4((ValidPosition; PositionIDValid); Error)|"|


 ### **Class *PositionDAO* - method *updatePositionID***

**Criteria for method *updatePositionID*:**

 - Existing ID of Position in DB
 - New PositionID valid 

**Predicates for method *updatePositionID*:**

| Criteria | Predicate |
| -------- | --------- |
| Existing ID of Position in DB         |   Yes        |
|          |     No      |
| New PositionID valid          |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Existing ID of Position in DB |New PositionID valid| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1((ValidID, ValidNewID); ())|updatePositionID|
|Yes|No|Invalid|T2((ValidID, InvalidNewID); (Error))|"|
|No|Yes|Invalid|T3((InvalidID, ValidNewID); ())|"|
|No|No|Invalid|T4((InvalidID, InvalidNewID); (Error))|"|


 ### **Class *PositionDAO* - method *deletePosition***

**Criteria for method *deletePosition*:**

 - PositionID exists in DB

**Predicates for method *deletePosition*:**

| Criteria | Predicate |
| -------- | --------- |
| PositionID exists in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| PositionID exists in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidID; ())|deletePosition|
|No|Invalid|T2(InvalidID; ())|"|

--------------------------------------------------

## Class Item

 ### **Class *ItemDao* - method *storeItem***

**Criteria for method *storeItem*:**

 - Validity of object Item
 - Item with unique id in database

**Predicates for method *storeItem*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity object Item         |   Yes        |
|          |     No      |
|  Item with unique id in database         |   Yes        |
|         |      No     |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity object Item | Item with unique id in db | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidItem; Object)|testNewItem|
|Yes|No|Invalid|T2(NullItem; Error)|"|
|No|Yes|Invalid|T3(NullItem; Error)|"|
|No|No|Invalid|T4(NullItem; Error)|"|


 ### **Class *ItemDao* - method *getItems***

**Criteria for method *getItems*:**

 - There are Items in DB

**Predicates for method *getItems*:**

| Criteria | Predicate |
| -------- | --------- |
| There are Items in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| There are Positions in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1((); ListItems)|getItems|
|No|Invalid|T2((); EmptyList)||

### **Class *ItemDao* - method *getItemsBySupplier***

**Criteria for method *getItemsBySupplier*:**

 - Valid SupplierID in DB

**Predicates for method *getItemsBySupplier*:**

| Criteria | Predicate |
| -------- | --------- |
| Valid SupplierID in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Valid Supplier in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(SupplierID; ListItems)|getItemsOfSupplier|
|No|Invalid|T2(SupplierID; EmptyList)|"|





 ### **Class *ItemDao* - method *getItemByID***

**Criteria for method *getItemByID*:**

 - The given ItemID is in database

**Predicates for method *getItemByID*:**

| Criteria | Predicate |
| -------- | --------- |
| The given ItemID is in database         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| The given ItemID is in database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(Existing ID in database; Item)|getItemFromId|
|No|Invalid|T2(ID is not in database; Null)|"|



 ### **Class *ItemDao* - method *updateItem***

**Criteria for method *updateItem*:**

 - Validity object for new Item
 - Existing ItemID from a DB

**Predicates for method *updateItem*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity object for new Item        |   Yes        |
|          |     No      |
| Existing ItemID from a DB |   Yes        | 
|  |      No     |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity object for new Position | Existing PositionID from a DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidItem; ())|updateAnItem|
|Yes|No|Invalid|T2(ValidItem; ())|"|
|No|Yes|Invalid|T3(ValidItem; Error)|"|
|No|No|Invalid|T4(ValidItem; Error)|"|

 ### **Class *ItemDao* - method *deleteItem***

**Criteria for method *deleteItem*:**

 - ItemID exists in DB

**Predicates for method *deleteItem*:**

| Criteria | Predicate |
| -------- | --------- |
| ItemID exists in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| ItemID exists in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidID; ())|deleteItem|
|No|Invalid|T2(InvalidID; ())|"|

--------------------------------------------------

## Class InternalOrder

 ### **Class *InternalOrderDAO* - method *storeInternalOrder***

**Criteria for method *storeInternalOrder*:**

 - Validity of object InternalOrder

**Predicates for method *storeInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity object Item         |   Yes        |
|          |     No      |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity object InternalOrder | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Valid|T1(ValidInternalOrder; lastID)|testNewInternalOrder|
|No|Invalid|T2(InvalidInternalOrder; Error)|"|

### **Class *InternalOrderDAO* - method *storeProducts***

**Criteria for method *storeProducts*:**

 - Validity of object Product

**Predicates for method *storeProducts*:**

| Criteria | Predicate |
| -------- | --------- |
| Validity object Item         |   Yes        |
|          |     No      |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Validity object Item | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Valid|T1(ValidProduct; lastID)|storeProduct|
|No|Invalid|T2(NullProduct; Error)|"|



 ### **Class *InternalOrderDAO* - method *getInternalOrders***

**Criteria for method *getInternalOrders*:**

 - There are InternalOrders in DB

**Predicates for method *getInternalOrders*:**

| Criteria | Predicate |
| -------- | --------- |
| There are InternalOrders in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| There are InternalOrders in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1((); ListInternalOrders)|getInternalOrders|
|No|Invalid|T2((); EmptyList)||

### **Class *InternalOrderDAO* - method *getProducts***

**Criteria for method *getProducts*:**

 - There are Products in DB associated to SKUItem

**Predicates for method *getProducts*:**

| Criteria | Predicate |
| -------- | --------- |
| There are Products in DB associated to SKUItem         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| There are Products in DB associated to SKUItem | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1((); ListProducts)|getProducts|
|No|Invalid|T2((); EmptyList)|"|

 ### **Class *InternalOrderDAO* - method *getInternalOrderByID***

**Criteria for method *getInternalOrderByID*:**

 - The given InternalOrderID is in DB

**Predicates for method *getInternalOrderByID*:**

| Criteria | Predicate |
| -------- | --------- |
| The given InternalOrderID is in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| The given InternalOrderID is in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(Existing ID in DB; Item)|getItemFromInternalOrderFromID|
|No|Invalid|T2(ID is not in DB; Null)|"|



 ### **Class *InternalOrderDAO* - method *changeState***

**Criteria for method *changeState*:**

 - InternalOrderID exists in DB
 - New state is valid

**Predicates for method *changeState*:**

| Criteria | Predicate |
| -------- | --------- |
| InternalOrderID exists in DB        |   Yes        |
|          |     No      |
| New state is valid |   Yes        | 
|  |      No     |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| InternalOrderID exists in DB | New state is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1((ExistsID, ValidState); True)|changeState|
|Yes|No|Invalid|T2((ExistsID, NotValidState); Error)|"|
|No|Yes|Invalid|T3((NotExistsID, ValidState); Error)|"|
|No|No|Invalid|T4((NotExistsID, NotValidState); Error)|"|

 ### **Class *InternalOrderDAO* - method *deleteInternalOrder***

**Criteria for method *deleteInternalOrder*:**

 - InternalOrderID exists in DB

**Predicates for method *deleteInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| InternalOrderID exists in DB         |   Yes        |
|          |     No      |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| InternalOrderID exists in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1(ValidID; ID)|deleteAnInternalOrder|
|No|Invalid|T2(InvalidID; Null)|"|

--------------------------------------------------

# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
|||
|||
||||

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||



