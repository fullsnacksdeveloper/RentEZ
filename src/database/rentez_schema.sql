--PostSQL database creation

--CREATE DATABASE rentez_app;

-- Create ENUM types

CREATE TYPE user_role as ENUM('tenant', 'landlord', 'admin');


CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE rental_type AS ENUM ('apartment', 'studio', 'house', 'room');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id INT PRIMARY KEY,
    first_name   	VARCHAR(100) NOT NULL,
    last_name    	VARCHAR(100) NOT NULL,
    dob          	DATE,
    credit_score 	INTEGER,
    annual_income	DECIMAL(12, 2),
    profile_photo VARCHAR(255),
    verification_status verification_status DEFAULT 'pending',
    reliability_score DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tenant_user FOREIGN KEY (tenant_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- Create landlords table
CREATE TABLE IF NOT EXISTS landlords (
    landlord_id INT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_photo VARCHAR(255),
    bio TEXT,
    verified BOOLEAN DEFAULT FALSE, //adjust 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_landlord_user FOREIGN KEY (landlord_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    property_id SERIAL PRIMARY KEY,
    landlord_id INT NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    parish VARCHAR(50) NOT NULL,
    rental_type rental_type NOT NULL,
    furnished BOOLEAN DEFAULT FALSE,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    description_ TEXT,
    verification_status verification_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_property_landlord FOREIGN KEY (landlord_id) REFERENCES landlords(landlord_id) ON DELETE CASCADE
);


-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
    image_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_image_property FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE
);


---Tenant Application Form
CREATE TABLE IF NOT EXISTS rental_application (
    application_id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL,
    property_id INT NOT NULL,
    application_stat application_status DEFAULT 'pending',
    reliability_score INT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
    ---BACKGROUND INFO/DOCUMENTS
);

-- Payments for Premium
CREATE TABLE IF NOT EXISTS payments (
    payment_id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    status payment_status DEFAULT 'pending',
    due_date DATE NOT NULL,
    paid_at TIMESTAMP
);


---Property Reviews by Tenants
CREATE TABLE IF NOT EXISTS tenant_reviews (
    review_id SERIAL PRIMARY KEY,
    tenant_id INT,
    landlord_id INT,
    property_id INT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_landlord FOREIGN KEY (landlord_id) REFERENCES landlords(landlord_id) ON DELETE CASCADE,
    CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE SET NULL
);

---Landlord View Application Submission



--- Tenant Reviews by Landlords
CREATE TABLE IF NOT EXISTS landlord_reviews (
    review_id SERIAL PRIMARY KEY,
    landlord_id INT,
    tenant_id INT,
    property_id INT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lr_landlord FOREIGN KEY (landlord_id) REFERENCES landlords(landlord_id) ON DELETE CASCADE,
    CONSTRAINT fk_lr_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_lr_property FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE SET NULL
);


