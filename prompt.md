Implementation Steps for Appointment Module Database Schema:

1. Create Tables:
   - Create 'customers' table with fields: id, name, phone_number1, phone_number2, gender, email_id, date_of_birth, anniversary_date, address, pincode, created_at, updated_at
   - Create 'services' table with fields: id, service_name
   - Create 'staff' table with fields: id, name, phone_number1, phone_number2, gender, email_id, date_of_birth, address, pincode, created_at, updated_at
   - Create 'appointments' table with fields: 
     * id (primary key)
     * customer_id (foreign key to customers)
     * service_id (foreign key to services)
     * staff_id (foreign key to staff)
     * appointment_date (date)
     * appointment_time (time)
     * advanced_paid (decimal)
     * status (enum: pending, confirmed, cancelled, completed)
     * report_date (nullable date)
     * created_at (timestamp)
     * updated_at (timestamp)

2. Define Relationships:
   - Add foreign key constraints between appointments and customers
   - Add foreign key constraints between appointments and services
   - Add foreign key constraints between appointments and staff

3. Add Constraints:
   - Set NOT NULL constraints for required fields
   - Add unique constraints where appropriate
   - Add check constraints for valid values (e.g., positive amounts)

4. Create Indexes:I am going to create a database for this project. Follow these instructions every time I create a table: Use a Supabase database structure for a Salon ERP system with an ID-based schema. Each table must include a UUID as the primary key (`id`), relevant fields, timestamps (`created_at`, `updated_at`), and foreign key relationships. Ensure all IDs are generated using `uuid_generate_v4()`.
   - Create indexes on frequently queried fields (appointment_date, customer_id, status)

5. Implement Data Validation:
   - Add validation for phone number format
   - Add validation for appointment date/time (future dates only)
   - Add validation for status transitions

6. Create Views:
   - Create view for active appointments
   - Create view for appointment history
   - Create view for staff schedules

7. Implement Security:
   - Add row-level security for sensitive data
   - Implement proper access controls

8. Create Documentation:
   - Document schema design decisions
   - Create ER diagram
   - Document API endpoints for data access

9. Plan for Future Expansion:
   - Add support for group bookings
   - Add support for recurring appointments
   - Add support for special discounts/promotions


------------------------------------------------------------------------------------
write a prompt for creating dashboard with side bar using shadcn, side bar have menus: Dashboard, Appointtment, Master dropdown(Staff, Customer), Inventory, Invoice dropdown(sales, sales return, purchase, purchase return, transfer In, transfer Out), Reports


--------------------------------------------------------------------------------------

Create a Supabase database structure for a Salon ERP system with an ID-based schema. Each table should include a UUID as the primary key (`id`), relevant fields, timestamps (`created_at`), and foreign key relationships. Ensure all IDs use `uuid_generate_v4()`. Include tables for `customers`, `employees`, `services`, `appointments`, and `payments`, with relationships linking appointments to customers, employees, and services. Enable the `uuid-ossp` extension for UUID generation.

"I am going to create a database for this project. Follow these instructions every time I create a table: Use a Supabase database structure for a Salon ERP system with an ID-based schema. Each table must include a UUID as the primary key (`id`), relevant fields, timestamps (`created_at`, `updated_at`), and foreign key relationships. Ensure all IDs are generated using `uuid_generate_v4()`."

-------------------------------------------------------------------------------------------

Here’s a corrected version of your prompt with clearer structure and formatting:

---

**Task:** Create Dashboard UI

**Route:** `/dashboard`

**Framework:** Material UI (refer to the [Material UI Dashboard Layout](https://mui.com/toolpad/core/react-dashboard-layout/))

**Sidebar Menus:**
1. Appointment
2. Master (Dropdown)
   - Staff
   - Customers
3. Inventory
4. Invoice (Dropdown)
   - Sales
   - Sales Return
   - Purchase
   - Purchase Return
   - Transfer In
   - Transfer Out
5. Reports

-----------------------------------------------------------------------------------------

Create a New Page for Adding Appointments

Use Material UI for designing the user interface.

Form Title: "Add Appointment"

Input Fields:

Name (Text Input)
Phone Number 1 (Text Input)
Gender (Select Options: Male, Female, Other)
Appointment Date (Date Picker)
Appointment Time (Time Picker)
Report Date (Date Picker)
Advanced Paid (Number Input)
Appointment Cancelled? (Select Options: Yes, No)
Appointment Done? (Select Options: Yes, No)
Dropdown Select Fields:

Service: Dynamically load options from the services table in Supabase.
Staff: Dynamically load options from the staff table in Supabase.
"Add Service" Button:

On clicking "Add Service", allow users to add a new row containing:
Service (Dropdown)
Staff (Dropdown)
Each row should also include a Delete Button to remove the specific service and staff pair.
Footer Buttons:

Cancel Button: Clears the form or redirects to the previous page.
Save Button: Submits the form.
On Form Submission:

Save the data to the appointments table in Supabase.
Display a success message upon successful data submission.

------------------------------------------------------------------------

On route /dashboard, when i click on appointments menu option, it should open /appointments page soo create new page appointments page. 
When the "Appointments" option is clicked:
Load the /appointments page in the content area on the right.
Highlight the "Appointments" option in the sidebar to indicate it is active.
Maintain a smooth transition or animation when the page is loaded.

now appointments page is opening in separate page it should appear on the right side of the dashboard when the "Appointment" option is clicked.

---------------------------------------------------------------------------

Add Profile Option with Logout Dropdown

Implement a Profile option on the right side of the Dashboard header.
The Profile option should include:
A user avatar or profile icon.
A dropdown menu that appears on click.
The dropdown menu should have the following option:
Logout: Log the user out and redirect them to the login page.
Ensure the dropdown menu is styled consistently with the rest of the Dashboard and is responsive across all devices.

---------------------------------------------------------------------------------
Create a Staff Performance Dashboard

Left Card:

Title: "Revenue Generated By The Staff"
Subtitle: Display total revenue (e.g., ₹5,095).
Use a horizontal bar chart to show revenue per staff member.
Display the staff names (e.g., Phoebe, Chandler, etc.) on the left of each bar.
Add the revenue amount at the end of each bar (e.g., ₹1400).
Use a distinct color (e.g., purple) for the bars.
Right Card:

Title: "Top Performing Staff"
Use badge-style indicators for rankings:
1st place: Gold badge with staff name (e.g., Chandler).
2nd place: Silver badge with staff name (e.g., Phoebe).
3rd place: Bronze badge with staff name (e.g., Rachel).
Styling:

Use a clean, modern card design with rounded corners and a light background.
Ensure responsive design for mobile and desktop.

----------------------------------------------------------------------------------

Design a customer management dashboard with a clean and modern UI. The layout should include the following elements:

Statistics Section:

Display three summary cards at the top showing the following:
Total Customers
Active Customers
Inactive Customers
Use clear, bold numbers and descriptive labels for each.
Charts Section:

Include a bar chart titled 'Customers This Week' to display the number of customers for each weekday (M, T, W, T, F, S).
Add a donut chart titled 'Customers Visited the Shop' to display the percentage distribution of customers by time (Morning, Afternoon, Evening). Provide an interactive tooltip for more details when hovering over sections of the chart.
Search Bar:

Include a placeholder text field allowing users to search by customer details (Name, Mobile, Email, DOB, or Purchase Value) with a search icon.
Customer Details Table:

Create a table with the following columns:
Customer Name
Phone Number
Email ID
DOB
Anniversary Date
Purchase Value
Visit Count
Last Visited Date
Action buttons (e.g., a delete button represented by a trash icon)