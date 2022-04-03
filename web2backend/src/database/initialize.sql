-- drop table answers;
-- drop table events;
-- drop table surveys;
-- drop table questions;
-- drop table orgs;
-- drop table users;
CREATE TABLE IF NOT EXISTS "users"(
	id SERIAL PRIMARY KEY,
	user_id INT UNIQUE,
	password_hash varchar(80),
	nickname VARCHAR(100),
	birth_day varchar(100),
	birth_month varchar(100),
	birth_year varchar(100),
	gender varchar(100),
	height varchar(100),
	weight varchar(100),
	religion varchar(100),
	sexuality varchar(100),
	race varchar(100),
	grade varchar(100),
	postal_code varchar(100),
	avatar_string varchar(100),
	answers integer[],
	events integer[],
	surveys integer[],
	orgs text[]
);

create table if not exists "orgs"(
	id serial primary key,
	owner_id INT,
	FOREIGN KEY (owner_id) REFERENCES users(user_id),
	nickname varchar(100),
	business_number varchar(100),
	verified bit default '0',
	avatar_string varchar(100)
);

create table if not exists "surveys"(
	id serial primary key,
	name TEXT,
	org int,
	FOREIGN KEY (org) REFERENCES orgs(id),
	linked bit default '0',
	description TEXT,
	questions integer[]
	-- FOREIGN KEY (EACH ELEMENT OF questions) REFERENCES questions(id),
);

-- CREATE TYPE type_choices AS ENUM ('short', 'long', 'mc', 'check');

create table if not exists "questions"(
	id serial primary key,
	prompt TEXT,
	answer_type type_choices,
	choices TEXT[]
);

create table if not exists "answers"(
	id serial primary key,
	answer TEXT,
	question_id int,
	FOREIGN KEY (question_id) REFERENCES questions(id)
);

create table if not exists "events"(
	id serial primary key,
	name varchar(80),
	org int,
	FOREIGN KEY (org) REFERENCES orgs(id),
	age_group varchar(80),
	start_date varchar(80),
	end_date varchar(80),
	category varchar(80),
	description TEXT,
	linked_survey_id int null,
	FOREIGN KEY (linked_survey_id) REFERENCES surveys(id),
	image varchar(80)
);