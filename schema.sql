-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UID UUID NOT NULL REFERENCES auth.users(id),
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    receiver_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for messages table
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UID UUID NOT NULL REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    phone_number1 VARCHAR(20) NOT NULL,
    phone_number2 VARCHAR(20),
    gender VARCHAR(10) NOT NULL,
    email_id VARCHAR(255),
    date_of_birth DATE,
    anniversary_date DATE,
    address TEXT,
    pincode VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for customers table
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UID UUID NOT NULL REFERENCES auth.users(id),
    service_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for services table
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Staff Table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UID UUID NOT NULL REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    phone_number1 VARCHAR(20) NOT NULL,
    phone_number2 VARCHAR(20),
    gender VARCHAR(10) NOT NULL,
    email_id VARCHAR(255),
    date_of_birth DATE,
    address TEXT,
    pincode VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for staff table
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON staff
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UID UUID NOT NULL REFERENCES auth.users(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    service_id UUID NOT NULL REFERENCES services(id),
    staff_id UUID NOT NULL REFERENCES staff(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    advanced_paid DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    report_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for appointments table
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Views
CREATE VIEW active_appointments AS
SELECT a.*, c.name AS customer_name, s.name AS service_name, st.name AS staff_name
FROM appointments a
JOIN customers c ON a.customer_id = c.id
JOIN services s ON a.service_id = s.id
JOIN staff st ON a.staff_id = st.id
WHERE a.status IN ('pending', 'confirmed');

CREATE VIEW appointment_history AS
SELECT a.*, c.name AS customer_name, s.name AS service_name, st.name AS staff_name
FROM appointments a
JOIN customers c ON a.customer_id = c.id
JOIN services s ON a.service_id = s.id
JOIN staff st ON a.staff_id = st.id
WHERE a.status IN ('cancelled', 'completed');

CREATE VIEW staff_schedules AS
SELECT st.name AS staff_name, a.appointment_date, a.appointment_time, c.name AS customer_name, s.name AS service_name
FROM appointments a
JOIN staff st ON a.staff_id = st.id
JOIN customers c ON a.customer_id = c.id
JOIN services s ON a.service_id = s.id
WHERE a.status IN ('pending', 'confirmed')
ORDER BY st.name, a.appointment_date, a.appointment_time;

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UID UUID NOT NULL REFERENCES auth.users(id),
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    reorder_level INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Inventory Transactions Table
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UID UUID NOT NULL REFERENCES auth.users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'transfer_in', 'transfer_out', 'adjustment')),
    quantity INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for inventory_transactions table
CREATE TRIGGER update_inventory_transactions_updated_at
BEFORE UPDATE ON inventory_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Invoices Table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UID UUID NOT NULL REFERENCES auth.users(id),
    invoice_type VARCHAR(20) NOT NULL CHECK (invoice_type IN ('sale', 'purchase', 'transfer')),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    net_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'issued', 'paid', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for invoices table
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Invoice Items Table
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UID UUID NOT NULL REFERENCES auth.users(id),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for invoice_items table
CREATE TRIGGER update_invoice_items_updated_at
BEFORE UPDATE ON invoice_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for new tables
CREATE INDEX idx_products_name ON products(product_name);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);

-- Views for inventory management
CREATE VIEW current_inventory AS
SELECT p.id AS product_id, p.product_name, 
       p.stock_quantity + COALESCE(SUM(
           CASE 
               WHEN it.transaction_type IN ('purchase', 'transfer_in') THEN it.quantity
               WHEN it.transaction_type IN ('sale', 'transfer_out') THEN -it.quantity
               ELSE 0
           END
       ), 0) AS current_stock
FROM products p
LEFT JOIN inventory_transactions it ON p.id = it.product_id
GROUP BY p.id, p.product_name, p.stock_quantity;

CREATE VIEW low_stock_products AS
SELECT * FROM current_inventory
WHERE current_stock <= (SELECT reorder_level FROM products WHERE id = product_id);

-- Views for financial reporting
CREATE VIEW sales_summary AS
SELECT DATE(invoice_date) AS sale_date,
       SUM(net_amount) AS total_sales,
       COUNT(*) AS invoice_count
FROM invoices
WHERE invoice_type = 'sale'
GROUP BY DATE(invoice_date);

CREATE VIEW purchase_summary AS
SELECT DATE(invoice_date) AS purchase_date,
       SUM(net_amount) AS total_purchases,
       COUNT(*) AS invoice_count
FROM invoices
WHERE invoice_type = 'purchase'
GROUP BY DATE(invoice_date);
