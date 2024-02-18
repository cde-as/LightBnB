INSERT INTO users (name, email, password)
VALUES 
      ('Pedro Pascal', 'papipedro@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
       ('Bella Ramsey', 'bella@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
       ('Young Mazino', 'notoldmazino@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
VALUES 
      (1, 'Regular House', 'Description', 'thumbnail1.jpg', 'coverphoto1.jpg', 100, 'Rancher St', 'Jackson', 'Wyoming', '83001', 'USA', 0, 2, 2),
       (2, 'Luxury Aquarium', 'Description', 'thumbnail2.jpg', 'coverphoto2.jpg', 1000, '1483 Alaskan Way Pier 59', 'Seattle', 'Washington', '98101', 'USA', 100, 10, 1),
       (3, 'Fresh', 'Description', 'thumbnail3.jpg', 'coverphoto3.jpg', 200, 'Flatiron District', 'New York', 'NY', '10011', 'USA', 1, 2, 1);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-01', '2018-09-26', 13, 2),
       ('2019-01-10', '2019-06-15', 14, 3),
       ('2017-02-14', '2022-02-22', 15, 1);