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



