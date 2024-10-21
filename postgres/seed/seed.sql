BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) VALUES ('mihai', 'mihai@gmail.com', 3, '2024-01-01');

INSERT into login (hash, email) values ('$2a$12$SVkWUjaAeCRFYMR0VFssaePzZStASY.i5W.JijXed.u1ZBX/8RYFe', 'mihai@gmail.com');

COMMIT;