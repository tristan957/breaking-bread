INSERT INTO "allergy" ("id", "name") VALUES
(1,	'peanuts'),
(2,	'shell fish'),
(3,	'gluten'),
(4,	'dairy');

INSERT INTO "tag" ("id", "name") VALUES
(1,	'Mexican'),
(2,	'Spicy'),
(3,	'Syrian'),
(4,	'Greek');

INSERT INTO "topic" ("id", "name") VALUES
(1,	'frasier'),
(2,	'politics'),
(3,	'oandas'),
(4,	'communism');

INSERT INTO "user" ("id", "firstName", "lastName", "imagePath", "oAuthSub", "about", "latLong", "location", "email", "phoneNumber", "createdAt", "updatedAt") VALUES
(1,	'Tristan',	'Partin',	NULL,	'google-oauth2|114864505001751214115',	'I like long walks on the beach',	'30.619873|-96.316996',	'492 University Oaks Blvd, College Station, TX 77840, USA',	'tristan.partin@gmail.com',	'281-300-9395',	'2018-11-21 05:07:32.224883',	'2018-11-21 05:07:32.224883'),
(2,	'Greg',	'Noonan',	NULL,	'google-oauth2|104114134196689419228',	'I like short walks on the beach',	'30.629980|-96.359500',	'3645 Wellborn Rd, Bryan, TX 77801, USA',	'gregnoonan@tamu.edu',	'555-555-5555',	'2018-11-21 05:07:32.299152',	'2018-11-21 05:07:32.299152'),
(3,	'Jonathan',	'Wang',	NULL,	'google-oauth2|111086573842245393579',	'I like riding my bike on the beach',	'30.619050|-96.339390',	'Zachry Engineering Center, 125 Spence St, College Station, TX 77840, USA',	'jw206055@tamu.edu',	'666-666-6666',	'2018-11-21 05:07:32.292907',	'2018-11-21 05:07:32.292907'),
(4,	'Zhoucheng',	'Li',	NULL,	'akopejij',	'I like sleeping on the beach',	'38.879177|-76.981812',	'1600 Pennsylvania Ave SE, Washington, DC 20003, USA',	'lizhoucheng@tamu.edu',	'777-777-7777',	'2018-11-21 05:07:32.309497',	'2018-11-21 05:07:32.309497');

INSERT INTO "recipe" ("id", "name", "description", "imagePath", "createdAt", "updatedAt", "authorId") VALUES
(1,	'Mexican Fried Rice',	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e
',	NULL,	'2018-11-21 05:28:40.421513',	'2018-11-21 05:28:40.421513',	1),
(2,	'Cuban',	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, ',	NULL,	'2018-11-21 05:29:00.32459',	'2018-11-21 05:29:00.32459',	1),
(3,	'Spaget',	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e
',	NULL,	'2018-11-21 05:29:28.111622',	'2018-11-21 05:29:28.111622',	3),
(4,	'Chicken caprese',	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes',	NULL,	'2018-10-21 05:29:28.111622',	'2018-11-20 05:29:28.111622',	2);

INSERT INTO "user_blacklist_topic" ("userId", "topicId") VALUES
(1,	3),
(2,	3),
(2,	4),
(4,	1),
(4,	3),
(4,	4);

INSERT INTO "user_followed_tags_tag" ("userId", "tagId") VALUES
(1,	1),
(1,	2),
(2,	1),
(2,	2),
(2,	3),
(2,	4),
(3,	2),
(3,	1),
(4,	4);

INSERT INTO "user_followed_users_user" ("userId_1", "userId_2") VALUES
(1,	2),
(1,	3),
(2,	1),
(2,	3),
(2,	4),
(3,	2),
(4,	3);

INSERT INTO "user_review" ("id", "rating", "description", "createdAt", "updatedAt", "subjectId", "authorId") VALUES
(1,	4,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:27:25.045958',	'2018-11-21 05:27:25.045958',	1,	2),
(2,	5,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:27:47.169143',	'2018-11-21 05:27:47.169143',	3,	4);

INSERT INTO "user_whitelist_topic" ("userId", "topicId") VALUES
(1,	4),
(1,	1),
(2,	2),
(2,	1),
(3,	3),
(3,	1),
(4,	2);

INSERT INTO "meal" ("id", "title", "price", "description", "latLong", "location", "startTime", "endTime", "maxGuests", "imagePath", "createdAt", "updatedAt", "hostId") VALUES
(1,	'Mexicano on the beach',	4,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e', '38.879177|-76.981812',	'1600 Pennsylvania Ave SE, Washington, DC 20003, USA',	'2019-01-21 05:37:52.621683', '2019-01-21 07:37:52.621683',	3,	NULL,	'2018-11-21 05:37:52.621143',	'2018-11-21 05:37:52.621143',	1),
(2,	'Spring water and fresh greens',	0,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. ', '30.629980|-96.359500',	'3645 Wellborn Rd, Bryan, TX 77801, USA',	'2018-12-21 05:38:37.943961', '2018-12-21 10:38:37.943961',	2,	NULL,	'2018-11-21 05:38:37.942728',	'2018-11-21 05:38:37.942728',	2),
(3,	'Light Italian',	12,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. ',	'30.619050|-96.339390',	'Zachry Engineering Center, 125 Spence St, College Station, TX 77840, USA',	'2019-5-25 05:38:37.943961', '2019-5-25 08:38:37.943961',	4,	NULL,	'2018-11-22 05:38:37.942728',	'2018-11-21 05:38:37.942728',	4);

INSERT INTO "recipe_allergies_allergy" ("recipeId", "allergyId") VALUES
(1,	1),
(2,	2),
(2,	3),
(3, 4);

INSERT INTO "recipe_review" ("id", "rating", "description", "createdAt", "updatedAt", "subjectId", "authorId") VALUES
(1,	3,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:35:55.381992',	'2018-11-21 05:35:55.381992',	1,	1),
(2,	3,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:36:03.747939',	'2018-11-21 05:36:03.747939',	1,	2),
(3,	5,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:36:12.539506',	'2018-11-21 05:36:12.539506',	3,	4),
(4,	1,	NULL,	'2018-11-21 05:36:21.937098',	'2018-11-21 05:36:21.937098',	2,	3);

INSERT INTO "recipe_tags_tag" ("recipeId", "tagId") VALUES
(1,	1),
(1,	2),
(2,	1),
(2,	4),
(3,	2);

INSERT INTO "user_saved_recipes_recipe" ("userId", "recipeId") VALUES
(1,	1),
(2,	1),
(2,	2),
(3,	3),
(1, 3);

INSERT INTO "meal_guests_user" ("mealId", "userId") VALUES
(1,	2),
(1,	3),
(2,	4),
(3, 2);

INSERT INTO "meal_recipes_recipe" ("mealId", "recipeId") VALUES
(1,	1),
(2,	3),
(2,	2),
(3, 3),
(3, 4);
