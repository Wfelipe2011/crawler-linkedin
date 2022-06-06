CREATE SCHEMA IF NOT EXISTS TEGRA;

SET search_path TO TEGRA;

CREATE TABLE Users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

insert into users (username, password, email) values ('mperacco0', '95vbGeavA', 'gspirit0@bizjournals.com');
insert into users (username, password, email) values ('rguesford1', 'Jkmn7ZvtmVmT', 'lskamal1@goo.ne.jp');
insert into users (username, password, email) values ('wsugden2', 'Z0X50VEG', 'wmatissoff2@friendfeed.com');
insert into users (username, password, email) values ('lmchale3', 'bR8fKSHesV', 'bdachs3@privacy.gov.au');
insert into users (username, password, email) values ('abrimble4', 'NDJ1LjJ75tL', 'nhamper4@unesco.org');
insert into users (username, password, email) values ('pgundrey5', 'GAAYWHjU1a', 'bfruen5@hatena.ne.jp');
insert into users (username, password, email) values ('gpraill6', 'ZZOxT7', 'msambidge6@timesonline.co.uk');
insert into users (username, password, email) values ('krayman7', 'fnKErejPH', 'clauga7@usnews.com');
insert into users (username, password, email) values ('dthornton8', 'rCBsUjuxlRI6', 'grizzolo8@tiny.cc');
insert into users (username, password, email) values ('hkinnerk9', 'wOx8XxpE4Fu0', 'collerhead9@ucla.edu');