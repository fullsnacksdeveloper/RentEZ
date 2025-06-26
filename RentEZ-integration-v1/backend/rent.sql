--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-18 22:03:16

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 875 (class 1247 OID 16404)
-- Name: application_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.application_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.application_status OWNER TO postgres;

--
-- TOC entry 881 (class 1247 OID 16422)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'completed',
    'failed'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- TOC entry 923 (class 1247 OID 16693)
-- Name: pet_policy_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.pet_policy_type AS ENUM (
    'no_pets',
    'cats_only',
    'dogs_only',
    'pets_allowed'
);


ALTER TYPE public.pet_policy_type OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 16412)
-- Name: rental_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rental_type AS ENUM (
    'apartment',
    'studio',
    'house',
    'room'
);


ALTER TYPE public.rental_type OWNER TO postgres;

--
-- TOC entry 869 (class 1247 OID 16390)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'tenant',
    'landlord',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 872 (class 1247 OID 16396)
-- Name: verification_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.verification_status AS ENUM (
    'pending',
    'verified',
    'rejected'
);


ALTER TYPE public.verification_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 16612)
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id integer NOT NULL,
    user1_id integer NOT NULL,
    user2_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16611)
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conversations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversations_id_seq OWNER TO postgres;

--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 233
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- TOC entry 239 (class 1259 OID 16673)
-- Name: gallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery (
    image_id integer NOT NULL,
    property_id integer,
    file_path text NOT NULL,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.gallery OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16672)
-- Name: gallery_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gallery_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gallery_image_id_seq OWNER TO postgres;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 238
-- Name: gallery_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gallery_image_id_seq OWNED BY public.gallery.image_id;


--
-- TOC entry 232 (class 1259 OID 16557)
-- Name: landlord_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.landlord_reviews (
    review_id integer NOT NULL,
    landlord_id integer,
    tenant_id integer,
    property_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT landlord_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.landlord_reviews OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16556)
-- Name: landlord_reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.landlord_reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.landlord_reviews_review_id_seq OWNER TO postgres;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 231
-- Name: landlord_reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.landlord_reviews_review_id_seq OWNED BY public.landlord_reviews.review_id;


--
-- TOC entry 220 (class 1259 OID 16454)
-- Name: landlords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.landlords (
    landlord_id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(20),
    profile_photo character varying(255),
    bio text,
    verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.landlords OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16631)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    conversation_id integer NOT NULL,
    sender_id integer NOT NULL,
    text text NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id integer NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16703)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 16523)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public.payment_status DEFAULT 'pending'::public.payment_status,
    due_date date NOT NULL,
    paid_at timestamp without time zone
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16522)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 227
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 222 (class 1259 OID 16470)
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.properties (
    property_id integer NOT NULL,
    landlord_id integer NOT NULL,
    address_line character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    parish character varying(50) NOT NULL,
    rental_type public.rental_type NOT NULL,
    furnished boolean DEFAULT false,
    monthly_rent numeric(10,2) NOT NULL,
    description text,
    verification_status public.verification_status DEFAULT 'pending'::public.verification_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    availability_date date DEFAULT CURRENT_DATE NOT NULL,
    bedrooms integer DEFAULT 1 NOT NULL,
    bathrooms integer DEFAULT 1 NOT NULL,
    amenities text[] DEFAULT '{}'::text[],
    square_footage integer DEFAULT 0,
    pet_policy public.pet_policy_type DEFAULT 'no_pets'::public.pet_policy_type
);


ALTER TABLE public.properties OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16469)
-- Name: properties_property_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.properties_property_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.properties_property_id_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 221
-- Name: properties_property_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.properties_property_id_seq OWNED BY public.properties.property_id;


--
-- TOC entry 224 (class 1259 OID 16489)
-- Name: property_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_images (
    image_id integer NOT NULL,
    property_id integer NOT NULL,
    image_url character varying(255) NOT NULL,
    is_primary boolean DEFAULT false
);


ALTER TABLE public.property_images OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16488)
-- Name: property_images_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.property_images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_images_image_id_seq OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 223
-- Name: property_images_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.property_images_image_id_seq OWNED BY public.property_images.image_id;


--
-- TOC entry 226 (class 1259 OID 16502)
-- Name: rental_application; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rental_application (
    application_id integer NOT NULL,
    tenant_id integer NOT NULL,
    property_id integer NOT NULL,
    application_stat public.application_status DEFAULT 'pending'::public.application_status,
    reliability_score integer,
    applied_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    notes text,
    full_name text,
    email text,
    phone text,
    employment_status text,
    income numeric,
    reference_info text,
    message text
);


ALTER TABLE public.rental_application OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16501)
-- Name: rental_application_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rental_application_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rental_application_application_id_seq OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 225
-- Name: rental_application_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rental_application_application_id_seq OWNED BY public.rental_application.application_id;


--
-- TOC entry 237 (class 1259 OID 16652)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    property_id integer NOT NULL,
    tenant_id integer NOT NULL,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16651)
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 236
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- TOC entry 230 (class 1259 OID 16531)
-- Name: tenant_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_reviews (
    review_id integer NOT NULL,
    tenant_id integer,
    landlord_id integer,
    property_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.tenant_reviews OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16530)
-- Name: tenant_reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenant_reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenant_reviews_review_id_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 229
-- Name: tenant_reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenant_reviews_review_id_seq OWNED BY public.tenant_reviews.review_id;


--
-- TOC entry 219 (class 1259 OID 16440)
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    tenant_id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    dob date,
    credit_score integer,
    annual_income numeric(12,2),
    profile_photo character varying(255),
    verification_status public.verification_status DEFAULT 'pending'::public.verification_status,
    reliability_score numeric(3,2) DEFAULT 0.00,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16430)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16429)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4850 (class 2604 OID 16615)
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- TOC entry 4855 (class 2604 OID 16676)
-- Name: gallery image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery ALTER COLUMN image_id SET DEFAULT nextval('public.gallery_image_id_seq'::regclass);


--
-- TOC entry 4848 (class 2604 OID 16560)
-- Name: landlord_reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landlord_reviews ALTER COLUMN review_id SET DEFAULT nextval('public.landlord_reviews_review_id_seq'::regclass);


--
-- TOC entry 4844 (class 2604 OID 16526)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 16473)
-- Name: properties property_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties ALTER COLUMN property_id SET DEFAULT nextval('public.properties_property_id_seq'::regclass);


--
-- TOC entry 4839 (class 2604 OID 16492)
-- Name: property_images image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_images ALTER COLUMN image_id SET DEFAULT nextval('public.property_images_image_id_seq'::regclass);


--
-- TOC entry 4841 (class 2604 OID 16505)
-- Name: rental_application application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_application ALTER COLUMN application_id SET DEFAULT nextval('public.rental_application_application_id_seq'::regclass);


--
-- TOC entry 4853 (class 2604 OID 16655)
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- TOC entry 4846 (class 2604 OID 16534)
-- Name: tenant_reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_reviews ALTER COLUMN review_id SET DEFAULT nextval('public.tenant_reviews_review_id_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 16433)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5069 (class 0 OID 16612)
-- Dependencies: 234
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, user1_id, user2_id, created_at) FROM stdin;
5	1	2	2025-05-28 17:37:22.32311
1	1	2	2025-05-29 12:05:46.202248
2	1	2	2025-05-30 16:59:51.467019
3	6	7	2025-05-30 17:00:48.704966
6	28	30	2025-06-18 12:46:06.25258
\.


--
-- TOC entry 5074 (class 0 OID 16673)
-- Dependencies: 239
-- Data for Name: gallery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gallery (image_id, property_id, file_path, uploaded_at) FROM stdin;
1	7	/uploads/1750242942667-128174919.jpg	2025-06-18 05:35:42.67939
2	8	/uploads/1750243523885-543275786.jpg	2025-06-18 05:45:23.89477
3	9	/uploads/1750287959889-874104795.jpg	2025-06-18 18:05:59.916144
\.


--
-- TOC entry 5067 (class 0 OID 16557)
-- Dependencies: 232
-- Data for Name: landlord_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.landlord_reviews (review_id, landlord_id, tenant_id, property_id, rating, comment, created_at) FROM stdin;
\.


--
-- TOC entry 5055 (class 0 OID 16454)
-- Dependencies: 220
-- Data for Name: landlords; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.landlords (landlord_id, first_name, last_name, phone, profile_photo, bio, verified, created_at, updated_at) FROM stdin;
2	Larry	Landlord	\N	\N	\N	f	2025-05-28 17:35:02.806098	2025-05-28 17:35:02.806098
4	Test	Landlord	8765551234	default.jpg	Testing landlord account	f	2025-05-29 21:44:14.211346	2025-05-29 21:44:14.211346
5	Test	Landlord	8765551234	default.jpg	Testing landlord account	f	2025-05-29 21:55:35.215758	2025-05-29 21:55:35.215758
12	Keisia	Bell	\N	\N	\N	f	2025-06-15 10:38:52.161538	2025-06-15 10:38:52.161538
22	mark	mine	8974498823	\N	\N	f	2025-06-16 13:08:29.615646	2025-06-16 13:08:29.615646
29	lando	loc	5567789853	\N	\N	f	2025-06-16 15:03:45.977988	2025-06-16 15:03:45.977988
30	mike	mike	118893467	\N	\N	f	2025-06-16 15:04:54.022978	2025-06-16 15:04:54.022978
\.


--
-- TOC entry 5070 (class 0 OID 16631)
-- Dependencies: 235
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (conversation_id, sender_id, text, sent_at, id) FROM stdin;
5	1	Hello, is this property still available?	2025-05-28 17:38:12.398494	1
5	1	Hi, is the apartment still available?	2025-05-29 12:12:40.765552	2
5	2	Yes! Would you like to view it on Friday at 2 PM?	2025-05-29 12:12:40.765552	3
5	1	Test message for the appointment	2025-05-29 12:16:32.498126	4
3	6	Hey Bob, I’m interested in your apartment!	2025-05-30 17:03:34.945185	5
5	1	I'm looking forward to the viewing!	2025-06-01 15:43:07.225299	6
6	28	Hi, I'm interested in your property.	2025-06-18 12:46:06.311728	7
6	28	Hi, I'm interested in your property.	2025-06-18 12:46:21.539086	8
6	28	I would like to know more about your property	2025-06-18 13:05:48.752143	9
6	28	Do you offer any dicounts	2025-06-18 13:07:15.282839	10
6	28	Do you do walkins?	2025-06-18 13:16:41.065909	11
6	28	Is it ok if i come later	2025-06-18 13:20:45.92737	12
6	28	hola	2025-06-18 13:24:25.532938	13
6	28	I would like to know more about your property	2025-06-18 13:40:09.630012	14
6	28	I would like to know more about your property	2025-06-18 13:42:46.180738	15
6	28	I would like to know more about your property xoxo love	2025-06-18 13:58:50.669814	16
6	28	I would like to know more about your property one more time 	2025-06-18 14:04:30.674906	17
6	28	I would like to know more about your property -lets see if this works	2025-06-18 14:13:43.188462	18
6	28	I would like to know more about your property- i might just cry send help	2025-06-18 14:19:14.49297	19
6	28	I would like to know more about your property - this is not working	2025-06-18 14:24:34.400443	20
6	28	I would like to know more about your property	2025-06-18 14:27:09.3699	21
6	28	I would like to know more about your property	2025-06-18 14:30:14.957682	22
6	28	I would like to know more about your property	2025-06-18 14:33:17.18681	23
6	28	I would like to know more about your property	2025-06-18 14:48:08.364072	24
6	28	I would like to know more about your property	2025-06-18 14:54:27.608763	25
6	28	I would like to know more about your property	2025-06-18 14:57:19.333896	26
6	28	my message is finally sending 	2025-06-18 15:12:02.319636	27
6	28	testing the sockets	2025-06-18 15:26:24.426884	28
6	28	i like it 	2025-06-18 16:46:57.590675	29
6	28	When are you available	2025-06-18 17:07:01.32345	30
6	28	really 	2025-06-18 17:10:39.795209	31
6	28	kdknkdlj	2025-06-18 17:12:47.555866	32
6	28	ok	2025-06-18 17:20:32.530215	33
6	28	ok	2025-06-18 17:35:07.495123	34
6	28	are you ready?	2025-06-18 17:41:03.387636	35
6	28	ok	2025-06-18 17:52:44.496961	36
6	28	yes	2025-06-18 17:57:36.62073	37
6	28	yes	2025-06-18 18:00:45.694974	38
6	28	hi	2025-06-18 18:10:56.094982	39
6	28	ok	2025-06-18 18:15:52.600987	40
6	28	hi	2025-06-18 18:16:23.415931	41
6	28	hi	2025-06-18 18:16:41.578291	42
6	28	hi	2025-06-18 18:16:41.580345	43
6	28	last message	2025-06-18 18:41:18.881032	44
6	28	welcome	2025-06-18 19:00:45.747146	45
6	28	alright	2025-06-18 21:01:07.509649	46
\.


--
-- TOC entry 5063 (class 0 OID 16523)
-- Dependencies: 228
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, amount, status, due_date, paid_at) FROM stdin;
\.


--
-- TOC entry 5057 (class 0 OID 16470)
-- Dependencies: 222
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.properties (property_id, landlord_id, address_line, city, parish, rental_type, furnished, monthly_rent, description, verification_status, created_at, updated_at, availability_date, bedrooms, bathrooms, amenities, square_footage, pet_policy) FROM stdin;
55	5	123 Half Way Tree	Kingston	St. Andrew	apartment	t	90000.00	Updated rent and unit description	pending	2025-06-01 09:00:00	2025-06-01 12:45:39.701227	2025-06-16	1	1	{}	0	no_pets
5	4	123 Main St	Kingston	St. Andrew	apartment	t	90000.00	Updated description	pending	2025-05-29 19:00:00	2025-06-01 15:19:35.189186	2025-06-16	1	1	{}	0	no_pets
3	30	123 mona	kingston	Kingston	apartment	f	1000000.00	so	pending	2025-06-17 11:55:13.835	2025-06-17 11:55:13.91067	2025-06-16	2	2	{Gym,Garden}	90	no_pets
4	30	123 mona	kingston	Kingston	apartment	f	3500.00	soso	verified	2025-06-17 11:59:17.406	2025-06-17 11:59:17.478585	2025-06-16	2	2	{WiFi,Laundry}	90	dogs_only
7	30	Havendale street	Wildwood 	Kingston	apartment	f	3000.00	single person 	verified	2025-06-18 05:35:42.461	2025-06-18 05:35:42.541717	2025-06-17	2	1	{Parking,AC}	130	no_pets
8	30	lakewood	kingston	Kingston	apartment	f	2500.00	lowkey	verified	2025-06-18 05:45:23.767	2025-06-18 05:45:23.847852	2025-06-17	2	2	{AC,Parking}	89	no_pets
9	30	Marvinee Street	kingston	Kingston	apartment	f	2300.00	Enjoy comfortable city living in this stylish 1-bedroom, 1-bathroom apartment located on Marvinee Street, Kingston. Ideal for singles or couples, the unit features a spacious layout with 120 sq ft of living space. Amenities include WiFi, air conditioning, in-unit laundry, gym access, parking, and 24/7 security. No pets allowed.\n\nPerfectly situated near major transportation and shops—this apartment is move-in ready!	verified	2025-06-18 18:05:59.767	2025-06-18 18:05:59.838421	2025-06-17	1	1	{Parking,AC,Pool,Security,Garden}	120	no_pets
\.


--
-- TOC entry 5059 (class 0 OID 16489)
-- Dependencies: 224
-- Data for Name: property_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_images (image_id, property_id, image_url, is_primary) FROM stdin;
\.


--
-- TOC entry 5061 (class 0 OID 16502)
-- Dependencies: 226
-- Data for Name: rental_application; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rental_application (application_id, tenant_id, property_id, application_stat, reliability_score, applied_at, notes, full_name, email, phone, employment_status, income, reference_info, message) FROM stdin;
\.


--
-- TOC entry 5072 (class 0 OID 16652)
-- Dependencies: 237
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, property_id, tenant_id, rating, comment, created_at) FROM stdin;
2	55	1	4	Nice place, landlord is responsive.	2025-06-01 12:59:00.693354
3	55	1	1	house is disgusting	2025-06-01 13:11:37.965783
\.


--
-- TOC entry 5065 (class 0 OID 16531)
-- Dependencies: 230
-- Data for Name: tenant_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_reviews (review_id, tenant_id, landlord_id, property_id, rating, comment, created_at) FROM stdin;
\.


--
-- TOC entry 5054 (class 0 OID 16440)
-- Dependencies: 219
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenants (tenant_id, first_name, last_name, dob, credit_score, annual_income, profile_photo, verification_status, reliability_score, created_at, updated_at) FROM stdin;
1	Tamarica	Tenant	\N	\N	\N	\N	pending	0.00	2025-05-28 17:35:02.806098	2025-05-28 17:35:02.806098
8	Tamarica	Shaw	2000-01-01	720	30000.00	\N	pending	0.00	2025-06-15 10:33:40.357622	2025-06-15 10:33:40.357622
16	Mary	Walker	\N	\N	\N	\N	pending	0.00	2025-06-16 12:14:01.36376	2025-06-16 12:14:01.36376
18	becky	mills	\N	\N	\N	\N	pending	0.00	2025-06-16 12:28:44.064667	2025-06-16 12:28:44.064667
19	becky	wills	\N	\N	\N	\N	pending	0.00	2025-06-16 12:39:04.446912	2025-06-16 12:39:04.446912
20	mark	ben	\N	\N	\N	\N	pending	0.00	2025-06-16 12:46:52.035445	2025-06-16 12:46:52.035445
21	mark	open	\N	\N	\N	\N	pending	0.00	2025-06-16 13:06:51.982748	2025-06-16 13:06:51.982748
23	winter	well	\N	\N	\N	\N	pending	0.00	2025-06-16 13:27:42.725602	2025-06-16 13:27:42.725602
24	baker	maker	\N	\N	\N	\N	pending	0.00	2025-06-16 13:37:33.374392	2025-06-16 13:37:33.374392
25	waker	waker	\N	\N	\N	\N	pending	0.00	2025-06-16 13:42:15.247691	2025-06-16 13:42:15.247691
27	killer 	miller	\N	\N	\N	\N	pending	0.00	2025-06-16 14:11:15.098033	2025-06-16 14:11:15.098033
28	mc	mc	\N	\N	\N	\N	pending	0.00	2025-06-16 14:31:36.878811	2025-06-16 14:31:36.878811
\.


--
-- TOC entry 5053 (class 0 OID 16430)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password_hash, role, created_at, updated_at) FROM stdin;
1	tenant@example.com	hashedpassword1	tenant	2025-05-28 17:33:37.259478	2025-05-28 17:33:37.259478
2	landlord@example.com	hashedpassword2	landlord	2025-05-28 17:33:37.259478	2025-05-28 17:33:37.259478
4	test@rentez.com	hashed_password_placeholder	landlord	2025-05-29 21:43:15.494457	2025-05-29 21:43:15.494457
5	test22@rentez.com	hashed_password_placeholder34	landlord	2025-05-29 21:54:56.813185	2025-05-29 21:54:56.813185
6	alice@example.com	hashedpassword1	tenant	2025-05-30 16:58:31.736114	2025-05-30 16:58:31.736114
7	bob@example.com	hashedpassword2	landlord	2025-05-30 16:58:31.736114	2025-05-30 16:58:31.736114
8	tam@example.com	$2b$10$7pzDycilkZ4OysOg3xUMpu7SAsSm02nklhkOSPXR5Q5P6i.rBo/xW	tenant	2025-06-15 10:33:40.357622	2025-06-15 10:33:40.357622
12	keisia@example.com	$2b$10$G0mw2dNLiP3ZyoaAm.RV6e9xGQ3on.HWFvfH0ZCiGSpvUO19FY9H2	landlord	2025-06-15 10:38:52.161538	2025-06-15 10:38:52.161538
16	mary@mayberry.com	$2b$10$x4uLdvKKqgJnTBOcp3zSnu4FaXOfHbWYFz8VSo5FTZbYLP0CHlckK	tenant	2025-06-16 12:14:01.36376	2025-06-16 12:14:01.36376
18	mills@mills.com	$2b$10$L.9oeg2DURgM0wbInS/OJOyUi2TQFL0hYCJr4fYPVDhzgRhJKpw/.	tenant	2025-06-16 12:28:44.064667	2025-06-16 12:28:44.064667
19	wills@wills.com	$2b$10$obmRW7k4lJ4CR2MPyx083OXZB596ISaxtrdUjPF20vMpgpQnIiGne	tenant	2025-06-16 12:39:04.446912	2025-06-16 12:39:04.446912
20	mark@ben.com	$2b$10$vCHFsfNg6CnWkEveo9k34uRtLdr7a5PNdvLW0pimm3Kxty/9g7rmW	tenant	2025-06-16 12:46:52.035445	2025-06-16 12:46:52.035445
21	open@mark.com	$2b$10$zEt4YUBE/Erbdv3xmVH/eOwaGF7pkOL6sp3JhCX/Fiqlj1Jl.0Yfe	tenant	2025-06-16 13:06:51.982748	2025-06-16 13:06:51.982748
22	mind@mark.com	$2b$10$5rKcAXp7YBftklxqBkslxOsnLeCL7djHjmlxUOnJu5uPaBv1.TCR.	landlord	2025-06-16 13:08:29.615646	2025-06-16 13:08:29.615646
23	well@well.com	$2b$10$PJHDiv.gYcbo.CXgZZZF8emipew0QnPXE9UF3jVS.71JWZCYrrSz.	tenant	2025-06-16 13:27:42.725602	2025-06-16 13:27:42.725602
24	baker@maker.com	$2b$10$vOvh/uI8jqQNUm0Zvnu6IuQmh6d7JOrkJ/U/zzACj4qgyBCaNW/rO	tenant	2025-06-16 13:37:33.374392	2025-06-16 13:37:33.374392
25	waker@waker.com	$2b$10$QjFY1Bm.gQMHa33bk7ITrOyZoJcgib1HGjMyvaJwbQdhWfDYPyig2	tenant	2025-06-16 13:42:15.247691	2025-06-16 13:42:15.247691
27	miller@miller.com	$2b$10$oW4QHDSPFoj5FezkUaJUOuGww6F3ReSSRScWLhB0OyoEjbrYb/Rey	tenant	2025-06-16 14:11:15.098033	2025-06-16 14:11:15.098033
28	mc@maker.com	$2b$10$zBt7yE1iteM8xQI.dEEC2uLQtD/MqaYG9Cn/HzJJuruQ7uCCrOFQC	tenant	2025-06-16 14:31:36.878811	2025-06-16 14:31:36.878811
29	lando@loc.com	$2b$10$usLeSdlR0YIeAkc/RYUtreDD2aEd9QkgwRSar0SqAh4MFaKd3Es16	landlord	2025-06-16 15:03:45.977988	2025-06-16 15:03:45.977988
30	mike@mike.com	$2b$10$wo9iprCkpsVx.aFonbi8i.Ef20hLTyvNcpM4zz0W/NH/29Z0IjTda	landlord	2025-06-16 15:04:54.022978	2025-06-16 15:04:54.022978
31	admin@rentez.com	$2b$10$X423I/YiGHAHnkdbbG7j9eVGZZVRBXCoaR/l6DqKKIDmq9nAcOyvm	admin	2025-06-17 16:45:16.367722	2025-06-17 16:45:16.367722
\.


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 233
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversations_id_seq', 6, true);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 238
-- Name: gallery_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gallery_image_id_seq', 3, true);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 231
-- Name: landlord_reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.landlord_reviews_review_id_seq', 1, false);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 240
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 46, true);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 227
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 1, false);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 221
-- Name: properties_property_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.properties_property_id_seq', 9, true);


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 223
-- Name: property_images_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_images_image_id_seq', 1, false);


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 225
-- Name: rental_application_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rental_application_application_id_seq', 1, false);


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 236
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 3, true);


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 229
-- Name: tenant_reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenant_reviews_review_id_seq', 1, false);


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 31, true);


--
-- TOC entry 4881 (class 2606 OID 16618)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 4887 (class 2606 OID 16681)
-- Name: gallery gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery
    ADD CONSTRAINT gallery_pkey PRIMARY KEY (image_id);


--
-- TOC entry 4879 (class 2606 OID 16566)
-- Name: landlord_reviews landlord_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landlord_reviews
    ADD CONSTRAINT landlord_reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4867 (class 2606 OID 16463)
-- Name: landlords landlords_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landlords
    ADD CONSTRAINT landlords_pkey PRIMARY KEY (landlord_id);


--
-- TOC entry 4883 (class 2606 OID 16705)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 16529)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4869 (class 2606 OID 16482)
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (property_id);


--
-- TOC entry 4871 (class 2606 OID 16495)
-- Name: property_images property_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_pkey PRIMARY KEY (image_id);


--
-- TOC entry 4873 (class 2606 OID 16511)
-- Name: rental_application rental_application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_application
    ADD CONSTRAINT rental_application_pkey PRIMARY KEY (application_id);


--
-- TOC entry 4885 (class 2606 OID 16661)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4877 (class 2606 OID 16540)
-- Name: tenant_reviews tenant_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_reviews
    ADD CONSTRAINT tenant_reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4865 (class 2606 OID 16448)
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (tenant_id);


--
-- TOC entry 4861 (class 2606 OID 16439)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4863 (class 2606 OID 16437)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4892 (class 2606 OID 16517)
-- Name: rental_application fk_app_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_application
    ADD CONSTRAINT fk_app_property FOREIGN KEY (property_id) REFERENCES public.properties(property_id) ON DELETE CASCADE;


--
-- TOC entry 4893 (class 2606 OID 16512)
-- Name: rental_application fk_app_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_application
    ADD CONSTRAINT fk_app_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id) ON DELETE CASCADE;


--
-- TOC entry 4891 (class 2606 OID 16496)
-- Name: property_images fk_image_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT fk_image_property FOREIGN KEY (property_id) REFERENCES public.properties(property_id) ON DELETE CASCADE;


--
-- TOC entry 4894 (class 2606 OID 16546)
-- Name: tenant_reviews fk_landlord; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_reviews
    ADD CONSTRAINT fk_landlord FOREIGN KEY (landlord_id) REFERENCES public.landlords(landlord_id) ON DELETE CASCADE;


--
-- TOC entry 4889 (class 2606 OID 16464)
-- Name: landlords fk_landlord_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landlords
    ADD CONSTRAINT fk_landlord_user FOREIGN KEY (landlord_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4897 (class 2606 OID 16567)
-- Name: landlord_reviews fk_lr_landlord; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landlord_reviews
    ADD CONSTRAINT fk_lr_landlord FOREIGN KEY (landlord_id) REFERENCES public.landlords(landlord_id) ON DELETE CASCADE;


--
-- TOC entry 4898 (class 2606 OID 16577)
-- Name: landlord_reviews fk_lr_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landlord_reviews
    ADD CONSTRAINT fk_lr_property FOREIGN KEY (property_id) REFERENCES public.properties(property_id) ON DELETE SET NULL;


--
-- TOC entry 4899 (class 2606 OID 16572)
-- Name: landlord_reviews fk_lr_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landlord_reviews
    ADD CONSTRAINT fk_lr_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id) ON DELETE CASCADE;


--
-- TOC entry 4902 (class 2606 OID 16640)
-- Name: messages fk_message_conversation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- TOC entry 4903 (class 2606 OID 16645)
-- Name: messages fk_message_sender; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4895 (class 2606 OID 16551)
-- Name: tenant_reviews fk_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_reviews
    ADD CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES public.properties(property_id) ON DELETE SET NULL;


--
-- TOC entry 4890 (class 2606 OID 16483)
-- Name: properties fk_property_landlord; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT fk_property_landlord FOREIGN KEY (landlord_id) REFERENCES public.landlords(landlord_id) ON DELETE CASCADE;


--
-- TOC entry 4896 (class 2606 OID 16541)
-- Name: tenant_reviews fk_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_reviews
    ADD CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id) ON DELETE CASCADE;


--
-- TOC entry 4888 (class 2606 OID 16449)
-- Name: tenants fk_tenant_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT fk_tenant_user FOREIGN KEY (tenant_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4900 (class 2606 OID 16619)
-- Name: conversations fk_user1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fk_user1 FOREIGN KEY (user1_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4901 (class 2606 OID 16624)
-- Name: conversations fk_user2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fk_user2 FOREIGN KEY (user2_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4906 (class 2606 OID 16682)
-- Name: gallery gallery_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery
    ADD CONSTRAINT gallery_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id) ON DELETE CASCADE;


--
-- TOC entry 4904 (class 2606 OID 16662)
-- Name: reviews reviews_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id) ON DELETE CASCADE;


--
-- TOC entry 4905 (class 2606 OID 16667)
-- Name: reviews reviews_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-06-18 22:03:16

--
-- PostgreSQL database dump complete
--

