CREATE TABLE signals (
    "id" serial primary key,
    "signal" varchar (100),
    "student" varchar (100),
    "email" varchar (60),
    "claimed" boolean,
);

CREATE TABLE term (
    "id" serial primary key,
    "semester" varchar (15),
    "year" int
);