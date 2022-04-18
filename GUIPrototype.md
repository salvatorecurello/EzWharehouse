# Graphical User Interface Prototype  

Authors: Group 55

Date: 12/04/2022

Version: 01

### Use case 1, Manage Employee
The Admin is able to select the functionalities that he/she wants to use. The Application displays for each employee some informations.
![](GUI_Images/Admin/Admin%20Page.png)

If the Admin wants to read some details about one employee, he/she can select an employee with right key and then select 'Read User'
![](GUI_Images/Admin/Read1.png)
![](GUI_Images/Admin/Read2.png)

The Admin can return to initial page with 'Return to Admin page' button on the right

Other functionality that Admin can make is to search an account by different rules, in this example we use the name of employee
![](GUI_Images/Admin/Search2.png)

Admin also can modify the account of an employee. Select the user that he/she wants to modify:
![](GUI_Images/Admin/UpdateUser.png)

Then the Admin press 'Update User' button:

![](GUI_Images/Admin/UpdateUser1.png)

Finally he/she insert the modifications about the employee and the allert will display with a request if to apply or not the modifications about the profile selected
![](GUI_Images/Admin/UpdateUser2.png)

Admin can add a user on the system on pressing the 'Add User' button at the initial page:
![](GUI_Images/Admin/Adduser.png)

Then, after to have inserted all informations, Admin can press the 'Register' button and the alert is shown about if Admin is sure to add this new user:
![](GUI_Images/Admin/AddUser1.png)

Finally functionality is about Delete an user. In this case, Admin presses the 'Delete User' button on selecting the profile that will be deleted
![](GUI_Images/Admin/DeleteUser1.png)

Also in this case, the alert is shown

![](GUI_Images/Admin/DeleteUser2.png)

### Use case 2, Manage Order
When a manager try to access to system, he/she will see other functions. This is the first page for a single manager of Warehouse, in particular he/she can see available space in the Warehouse:
![](GUI_Images/Manager/FirstPage.png)

The first functionality that he/she requires is the possibility to see catalog of a single supplier selected. In this case, Manager selects a Supplier and, with right key, opens a menu bar with 'See Catalog' function
![](GUI_Images/Manager/Catalog1.png)

After he/she presses the menu item, the screen will show the catalog of the supplier
![](GUI_Images/Manager/Catalog2.png)

Manager can also make a request to accounting organization to obtain item. To make this, he/she can select the screen for orders and select the 'Send Request' button
![](GUI_Images/Manager/Orders.png)

After he/she can fill the fields in the request and then Manager can press 'Send Request' button
![](GUI_Images/Manager/Request1.png)

Finally, the screen will show the summary about filled request
![](GUI_Images/Manager/Request2.png)

Manager can manage different types of orders. In general, to change informations about an order, he/she can select the order to manage and to press 'Manage Order' button 
![](GUI_Images/Manager/ManageOrder1.png)

The window will show the information about the order and then he/she can edit these informations 
![](GUI_Images/Manager/ManageOrder2.png)

Finally, he/she will see an alert to confirm his/her changes
![](GUI_Images/Manager/ManageOrder3.png)

The last functionality for the Manage, in this Use Case, allows to see the list of suppliers for item supplied. In particular, he/she can use the search box on the right to select the item to see 
![](GUI_Images/Manager/SuppliersItem.png)

Then the system aswers with the list of suppliers that supplied the item choosen
![](GUI_Images/Manager/SuppliersItem1.png)

### Use case 3, Manage Quality Check Information 
An Employee with quality checker role in the company can assign comment or result about the process of quality made for the set of products. All the Employees can see this page:
![](GUI_Images/Employee/Product.png)

For the role of quality checker, an Employee can set informations thanks to menu that it's possible to open with right key on the single set of item
![](GUI_Images/Employee/MenuProduct.png)

The Quality Checker Employee select the menu about 'Add Comment QC' and the window will show this screen
![](GUI_Images/Employee/Quality1.png)

Finally, Quality Checker Employee can apply the comment with 'Save' button or to select 'Turn Back' button to return to initial page. In particular, if the Employee selects 'Save' button, the system will show an alert to confirm the changes:
![](GUI_Images/Employee/Quality2.png)

Manager can also sent a request to reorder an item to accounting. To make this, he/she accesses to system in the screen about orders and selects what to reorder. Then he/she can click on 'Create New Request' and, in this case, the system understands that's a reorder question to accounting and sends an alert to confirm this
![](GUI_Images/Manager/OrderSelected.png)
![](GUI_Images/Manager/RefundAlert.png)

### Use case 4, Manage Products
In this Use Case, the main content is about "to manage product". An Employee can see the position of a product simply on clicking with righ key on his product screen and then press the menu about "Find Position"
![](GUI_IMages/Employee/Position1.png)

An alert will be generated and the position will be shown
![](GUI_Images/Employee/Position2.png)

To find a space for incoming item, an Employee can see different works for different orders
![](GUI_Images/Employee/Works.png)

For finding a free space for items, an Employee can select the work and then he/she makes right key and select "Find Space Available"
![](GUI_Images/Employee/FindSpace1.png)

Then the system shows free space in warehouse that it's divided into: Area, Lotto and Columns. In particular, an Employee can select the row returned by system and to click on "Update Space"
![](GUI_Images/Employee/FindSpace2.png)
![](GUI_Images/Employee/FindSpace3.png)
![](GUI_Images/Employee/FindSpace4.png)

The alert will be shown if we want use the position of Warehouse

An OU (Organizational Unit) Employee can request an item to Warehouse. To make this, he/she can have a screen about available items
![](GUI_Images/Employee/ItemOUEmployee.png)

In order to request an item, an OU Employee can select an item
![](GUI_Images/Employee/OrderOU1.png)

and then he/she presses "Make an Order" button and an alert with a request quantity is shown
![](GUI_Images/Employee/OrderOU2.png)

After to have inserted the quantity and confirmed, it will be shown a notification about the order requested
![](GUI_Images/Employee/OrderOU3.png)

An Employee can also send a notification to Manager to tell that he/she has completed the works about an order. In the window of works, it's present a "Send Summary" button on the right that allows to notify all works completed
![](GUI_Images/Employee/SendSummaryToManager.png)

A Manager can add a barcode about a product only if the order on the product is completed. To access on completed order, Manager can press "Complete Order" button in Orders Windows
![](GUI_Images/Manager/CompletedOrder.png)

The window makes the possibility to add a barcode by selecting the order and then he/she have to click on "Add Barcode" button
![](GUI_Images/Manager/AddBarcode1.png)

After this step, the information about order will be shown but they are not editable. The barcode depends on the set of item and it's generated automatically with the bar code reader
![](GUI_Images/Manager/AddBarcode2.png)

Finally, he/she can press "Apply Barcode" and an alert will be shown
![](GUI_Images/Manager/AddBarcode3.png)

To reject an Order, Manager can select Orders windows and then select the order. After he/she has selected the order, the Manager can press "Reject Order" and an allert will be shown to confirm operation
![](GUI_Images/Manager/RejectOrder.png)

A Manager can also modify informations about products in Warehouse. In particular, the modifications can be made in the products window on selecting the item to modify
![](GUI_Images/Manager/ChangeInfo1.png)

After to have selected the item, Manager can press "Change Info" button and a new screen will be shown
![](GUI_Images/Manager/ChangeInfo2.png)

After editing the fields of products, Manager can press "Confirm changes" button and an alert will be shown
![](GUI_Images/Manager/ChangeInfo3.png)

To add a new Product, Manager can access to product screen and then to make right key on the data grid
![](GUI_Images/Manager/AddProd1.png)

Then he/she can select the menu item "Add product" and to fill all fields in this new screen
![](GUI_Images/Manager/AddProd2.png)

After he/she has completed, Manager can press "Confirm" button and an alert will be shown to confirm the changes
![](GUI_Images/Manager/AddProd3.png)

A Manager can also delete a product from the list and, in this case, he/she has to select before the item and then to make right key for selecting "Remove Product"
![](GUI_Images/Manager/RemoveProd1.png)

After this, an alert will be shown to confirm the changes to list
![](GUI_Images/Manager/RemoveProd2.png)

Finally to see space available in Warehouse, the manager can see the window on the left that allows also to edit the information. Another thing that can be usefull to Manager, it's the product list in Warehouse that can be shown with click on products menu
![](GUI_Images/Manager/AvailableSpaceAndProdList.png)

### Use case 5, Manage Suppliers
Manager can see informations about suppliers with the suppliers screen
![](GUI_Images/Manager/Suppliers.png)

On this page, he/she can make some operations such as add a new supplier, delete supplier or update a supplier. First operation allows to Manager to add a new supplier with vary informations; in particular he/she have to select 'add supplier' button
![](GUI_Images/Manager/AddSupplier1.png)

After to have inserted these informations, the window will show an alert where to confirm the modification on the supplier list
![](GUI_Images/Manager/AddSupplier2.png)

If the Manager wants, he/she can also delete a supplier. To make this, he/she can select the supplier and presses 'Remove Supplier' button
![](GUI_Images/Manager/RemoveSupplier0.png)

After this operation, the window will show an alert
![](GUI_Images/Manager/RemoveSupplier1.png)

Finally, she/he can also update supplier's informations with 'Update Supplier' button. It's need to select the supplier to update and to press on the button
![](GUI_Images/Manager/UpdateSupplier.png)

In the last, the window will show an alert about the update
![](GUI_Images/Manager/UpdateSupplier1.png)

### Use case 6, Authenticate and Authorize
The user can insert his identifier and the password as shown in this page.

![](GUI_Images/Login/Login1.png)

If the credentials are wrong, the system asks another times the credentials to user
![](GUI_Images/Login/WrongCredentials.png)

After insert the correct credentials, the page for the user (in this example for the admin) will be shown. To make logout, the user can click on 'Logout' button near the company icon
![](GUI_Images/Login/Logout.png)





