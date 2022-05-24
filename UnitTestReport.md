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

 ### **Class *PositionDAO* - method *storePosition***

**Criteria for method *storePosition*:**

 - Validity object Position
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


| Validity object Position | Position with unique id in database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|Yes|Yes|Valid|T1(ValidPosition; True)|testNewPosition||
|Yes|No|Invalid|T2(ValidPosition; False)|||
|No|Yes|Invalid|T3(NullPosition; False)|||
|No|No|Invalid|T4(NullPosition; False)|||

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


| There are Positions in DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|T1((); ListPositions)||
|No|Invalid|T2((); EmptyList)||


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



