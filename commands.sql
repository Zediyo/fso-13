CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
	url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, title, url) values ('Dan Abramov', 'Writing Resilient Components', 'http://localhost:3001/api/blogs');
insert into blogs (author, title, url) values ('Martin Fowler', 'Is High Quality Software Worth the Cost?', 'http://potatofarm.com');
insert into blogs (author, title, url) values ('Robert C. Martin', 'FP vs. OO List Processing', 'http://peruna.fi');