CREATE SCHEMA IF NOT EXISTS TEGRA;

SET search_path TO TEGRA;

CREATE TABLE Users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	roles VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

insert into users (username, password, email, roles) values ('mperacco0', '95vbGeavA', 'gspirit0@bizjournals.com', 'user');
insert into users (username, password, email, roles) values ('rguesford1', 'Jkmn7ZvtmVmT', 'lskamal1@goo.ne.jp', 'user');
insert into users (username, password, email, roles) values ('wsugden2', 'Z0X50VEG', 'wmatissoff2@friendfeed.com', 'user');
insert into users (username, password, email, roles) values ('lmchale3', 'bR8fKSHesV', 'bdachs3@privacy.gov.au', 'user');
insert into users (username, password, email, roles) values ('abrimble4', 'NDJ1LjJ75tL', 'nhamper4@unesco.org', 'user');
insert into users (username, password, email, roles) values ('pgundrey5', 'GAAYWHjU1a', 'bfruen5@hatena.ne.jp', 'user');
insert into users (username, password, email, roles) values ('gpraill6', 'ZZOxT7', 'msambidge6@timesonline.co.uk', 'user');
insert into users (username, password, email, roles) values ('krayman7', 'fnKErejPH', 'clauga7@usnews.com', 'user');
insert into users (username, password, email, roles) values ('dthornton8', 'rCBsUjuxlRI6', 'grizzolo8@tiny.cc', 'user');
insert into users (username, password, email, roles) values ('hkinnerk9', 'wOx8XxpE4Fu0', 'collerhead9@ucla.edu', 'user');