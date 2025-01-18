-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone_number1 TEXT NOT NULL,
    phone_number2 TEXT,
    gender TEXT,
    email_id TEXT,
    date_of_birth DATE,
    anniversary_date DATE,
    address TEXT,
    pincode TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Staff Table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone_number1 TEXT NOT NULL,
    phone_number2 TEXT,
    gender TEXT,
    email_id TEXT,
    date_of_birth DATE,
    address TEXT,
    pincode TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    advanced_paid DECIMAL(10, 2) DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    report_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Views
CREATE VIEW active_appointments AS
SELECT a.*, c.name AS customer_name, s.service_name, st.name AS staff_name
FROM appointments a
JOIN customers c ON a.customer_id = c.id
JOIN services s ON a.service_id = s.id
JOIN staff st ON a.staff_id = st.id
WHERE a.status IN ('pending', 'confirmed');

CREATE VIEW appointment_history AS
SELECT a.*, c.name AS customer_name, s.service_name, st.name AS staff_name
FROM appointments a
JOIN customers c ON a.customer_id = c.id
JOIN services s ON a.service_id = s.id
JOIN staff st ON a.staff_id = st.id
WHERE a.status IN ('cancelled', 'completed');

CREATE VIEW staff_schedules AS
SELECT st.name AS staff_name, a.appointment_date, a.appointment_time, c.name AS customer_name, s.service_name
FROM appointments a
JOIN staff st ON a.staff_id = st.id
JOIN customers c ON a.customer_id = c.id
JOIN services s ON a.service_id = s.id
WHERE a.status IN ('pending', 'confirmed')
ORDER BY st.name, a.appointment_date, a.appointment_time;

-- Insert sample customers
INSERT INTO customers (id, name, phone_number1, gender, email_id) VALUES
    ('11111111-1111-1111-1111-111111111111', 'John Doe', '1234567890', 'male', 'john@example.com'),
    ('22222222-2222-2222-2222-222222222222', 'Jane Smith', '0987654321', 'female', 'jane@example.com');

-- Insert sample services  
INSERT INTO services (id, service_name) VALUES
    ('33333333-3333-3333-3333-333333333333', 'Haircut'),
    ('44444444-4444-4444-4444-444444444444', 'Manicure'),
    ('55555555-5555-5555-5555-555555555555', 'Facial');

-- Insert sample staff
INSERT INTO staff (id, name, phone_number1, gender) VALUES
    ('66666666-6666-6666-6666-666666666666', 'Alice Johnson', '1122334455', 'female'),
    ('77777777-7777-7777-7777-777777777777', 'Bob Williams', '5566778899', 'male');

-- Insert sample appointments
INSERT INTO appointments (id, customer_id, service_id, staff_id, appointment_date, appointment_time, status) VALUES
    ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '2024-03-22', '10:00:00', 'confirmed'),
    ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', '2024-03-23', '14:30:00', 'pending'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '2024-03-24', '11:00:00', 'confirmed');

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_timestamp
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_services_timestamp
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_staff_timestamp
BEFORE UPDATE ON staff
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_appointments_timestamp
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
