CREATE TABLE IF NOT EXISTS "users"(
	id SERIAL PRIMARY KEY,
	userid INT UNIQUE,
	password_hash varchar(80),
	user_data_id INT UNIQUE
);
create table if not exists "user_data"(
	id SERIAL PRIMARY KEY,
	nickname VARCHAR(40),
	nickname_iv VARCHAR(80),
	birth_day varchar(80),
	birth_day_iv VARCHAR(80),
	birth_month varchar(80),
	birth_month_iv VARCHAR(80),
	birth_year varchar(80),
	birth_year_iv VARCHAR(80),
	gender varchar(80),
	gender_iv varchar(80),
	height varchar(80),
	height_iv varchar(80),
	weight varchar(80),
	weight_iv varchar(80),
	religion varchar(80),
	religion_iv varchar(80),
	sexuality varchar(80),
	sexuality_iv varchar(80),
	race varchar(80),
	race_iv varchar(80),
	grade varchar(80),
	grade_iv varchar(80),
	postal_code varchar(80),
	postal_code_iv varchar(80),
	avatar_string varchar(80),
	avatar_string_iv varchar(80),
	events int[],
	events_iv varchar(80)[],
	surveys int[],
	surveys_iv varchar(80)[]
)