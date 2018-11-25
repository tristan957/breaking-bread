-- Adminer 4.6.3 PostgreSQL dump

CREATE SEQUENCE allergy_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 4 CACHE 1;

CREATE TABLE "public"."allergy" (
    "id" integer DEFAULT nextval('allergy_id_seq') NOT NULL,
    "name" character varying(128) NOT NULL,
    CONSTRAINT "PK_c9cb3ece73ddfde61d2ada768e1" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_2b7347f89319277f5c6ff37c297" UNIQUE ("name")
) WITH (oids = false);

INSERT INTO "allergy" ("id", "name") VALUES
(1,	'peanuts'),
(2,	'shell fish'),
(3,	'gluten'),
(4,	'dairy');

CREATE SEQUENCE tag_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 4 CACHE 1;

CREATE TABLE "public"."tag" (
    "id" integer DEFAULT nextval('tag_id_seq') NOT NULL,
    "name" character varying(128) NOT NULL,
    CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name")
) WITH (oids = false);

INSERT INTO "tag" ("id", "name") VALUES
(1,	'Mexican'),
(2,	'Spicy'),
(3,	'Syrian'),
(4,	'Greek');

CREATE SEQUENCE topic_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 4 CACHE 1;

CREATE TABLE "public"."topic" (
    "id" integer DEFAULT nextval('topic_id_seq') NOT NULL,
    "name" character varying(128) NOT NULL,
    CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_15f634a2dbf62a79bb726fc6158" UNIQUE ("name")
) WITH (oids = false);

INSERT INTO "topic" ("id", "name") VALUES
(1,	'frasier'),
(2,	'politics'),
(3,	'oandas'),
(4,	'communism');

CREATE SEQUENCE user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 8 CACHE 1;

CREATE TABLE "public"."user" (
    "id" integer DEFAULT nextval('user_id_seq') NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    "imagePath" text,
    "oAuthSub" character varying(255) NOT NULL,
    "about" text,
    "email" character varying NOT NULL,
    "phoneNumber" character varying(16) NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_ee73e929362edbae7720793f2b2" UNIQUE ("oAuthSub", "imagePath", "email", "phoneNumber")
) WITH (oids = false);

INSERT INTO "user" ("id", "firstName", "lastName", "imagePath", "oAuthSub", "about", "email", "phoneNumber", "createdAt", "updatedAt") VALUES
(1,	'Tristan',	'Partin',	NULL,	'adjeij',	'I like long walks on the beach',	'tristan.partin@gmail.com',	'281-300-9395',	'2018-11-21 05:07:32.224883',	'2018-11-21 05:07:32.224883'),
(2,	'Greg',	'Noonan',	NULL,	'adjijdfaa',	'I like short walks on the beach',	'gregnoonan@tamu.edu',	'555-555-5555',	'2018-11-21 05:07:32.299152',	'2018-11-21 05:07:32.299152'),
(3,	'Jonathan',	'Wang',	NULL,	'adjij',	'I like riding my bike on the beach',	'jw206055',	'666-666-6666',	'2018-11-21 05:07:32.292907',	'2018-11-21 05:07:32.292907'),
(4,	'Zhoucheng',	'Li',	NULL,	'akopejij',	'I like sleeping on the beach',	'lizhoucheng@tamu.edu',	'777-777-7777',	'2018-11-21 05:07:32.309497',	'2018-11-21 05:07:32.309497');

CREATE SEQUENCE recipe_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 3 CACHE 1;

CREATE TABLE "public"."recipe" (
    "id" integer DEFAULT nextval('recipe_id_seq') NOT NULL,
    "name" character varying NOT NULL,
    "description" text NOT NULL,
    "imagePath" text,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    "timesSaved" integer DEFAULT 0 NOT NULL,
    "authorId" integer,
    CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"),
    CONSTRAINT "FK_1370c876f9d4a525a45a9b50d81" FOREIGN KEY ("authorId") REFERENCES "user"(id) NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "recipe" ("id", "name", "description", "imagePath", "createdAt", "updatedAt", "timesSaved", "authorId") VALUES
(1,	'Mexican Fried Rice',	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e
',	NULL,	'2018-11-21 05:28:40.421513',	'2018-11-21 05:28:40.421513',   2,	1),
(2,	'Cuban',	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, ',	NULL,	'2018-11-21 05:29:00.32459',	'2018-11-21 05:29:00.32459',    1,	1),
(3,	'Spaget',	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e
',	NULL,	'2018-11-21 05:29:28.111622',	'2018-11-21 05:29:28.111622',   3,	3),
(4,	'Chicken caprese',	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes',	NULL,	'2018-10-21 05:29:28.111622',	'2018-11-20 05:29:28.111622',   0,	2);

CREATE TABLE "public"."user_blacklist_topic" (
    "userId" integer NOT NULL,
    "topicId" integer NOT NULL,
    CONSTRAINT "PK_036733af22c966b948e3a04f1e6" PRIMARY KEY ("userId", "topicId"),
    CONSTRAINT "FK_54fd8943b91907a5b61c616d361" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "FK_95558aa22950193d668ff34f807" FOREIGN KEY ("topicId") REFERENCES topic(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "user_blacklist_topic" ("userId", "topicId") VALUES
(1,	3),
(2,	3),
(2,	4),
(4,	1),
(4,	3),
(4,	4);

CREATE TABLE "public"."user_followed_tags_tag" (
    "userId" integer NOT NULL,
    "tagId" integer NOT NULL,
    CONSTRAINT "PK_ab659541cb5eca1ae991a5ecad2" PRIMARY KEY ("userId", "tagId"),
    CONSTRAINT "FK_4da2ef4bb89d70c5d2a63295cec" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "FK_fa13e54e7716abb30b3a4842083" FOREIGN KEY ("tagId") REFERENCES tag(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

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

CREATE TABLE "public"."user_followed_users_user" (
    "userId_1" integer NOT NULL,
    "userId_2" integer NOT NULL,
    CONSTRAINT "PK_66df5e74a6bd310d05ec72cad3c" PRIMARY KEY ("userId_1", "userId_2"),
    CONSTRAINT "FK_c2d031d9399a2428cedbb14e81e" FOREIGN KEY ("userId_2") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "FK_d9054dc181f1fed03d71a966a5b" FOREIGN KEY ("userId_1") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "user_followed_users_user" ("userId_1", "userId_2") VALUES
(1,	2),
(1,	3),
(2,	1),
(2,	3),
(2,	4),
(3,	2),
(4,	3);

CREATE SEQUENCE user_review_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 2 CACHE 1;

CREATE TABLE "public"."user_review" (
    "id" integer DEFAULT nextval('user_review_id_seq') NOT NULL,
    "rating" integer NOT NULL,
    "description" text,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    "subjectId" integer,
    "authorId" integer,
    CONSTRAINT "PK_261724703ac0fe70a85eb3f3af6" PRIMARY KEY ("id"),
    CONSTRAINT "FK_0ab7f5feda5a65ac18811cecc9e" FOREIGN KEY ("authorId") REFERENCES "user"(id) NOT DEFERRABLE,
    CONSTRAINT "FK_dba69821b12ac18e6b015d1070c" FOREIGN KEY ("subjectId") REFERENCES "user"(id) NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "user_review" ("id", "rating", "description", "createdAt", "updatedAt", "subjectId", "authorId") VALUES
(1,	4,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:27:25.045958',	'2018-11-21 05:27:25.045958',	1,	2),
(2,	5,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:27:47.169143',	'2018-11-21 05:27:47.169143',	3,	4);

CREATE TABLE "public"."user_whitelist_topic" (
    "userId" integer NOT NULL,
    "topicId" integer NOT NULL,
    CONSTRAINT "PK_a6bd8b56f45d95b6150f48baa9a" PRIMARY KEY ("userId", "topicId"),
    CONSTRAINT "FK_68b916a6b0a123ef606b5519abd" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "FK_e4bf137deefe00165d802a23abb" FOREIGN KEY ("topicId") REFERENCES topic(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "user_whitelist_topic" ("userId", "topicId") VALUES
(1,	4),
(1,	1),
(2,	2),
(2,	1),
(3,	3),
(3,	1),
(4,	2);

CREATE SEQUENCE meal_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 2 CACHE 1;

CREATE TABLE "public"."meal" (
    "id" integer DEFAULT nextval('meal_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "price" numeric(2) NOT NULL,
    "description" character varying(512),
    "location" text NOT NULL,
    "startTime" timestamp NOT NULL,
    "endTime" timestamp NOT NULL,
    "maxGuests" integer NOT NULL,
    "imagePath" text,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    "hostId" integer,
    CONSTRAINT "PK_ada510a5aba19e6bb500f8f7817" PRIMARY KEY ("id"),
    CONSTRAINT "FK_132bc692514e13e7abc6ae9633c" FOREIGN KEY ("hostId") REFERENCES "user"(id) NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "meal" ("id", "title", "price", "description", "location", "startTime", "endTime", "maxGuests", "imagePath", "createdAt", "updatedAt", "hostId") VALUES
(1,	'Mexicano on the beach',	4,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e',	'My house',	'2019-01-21 05:37:52.621683', '2019-01-21 07:37:52.621683',	3,	NULL,	'2018-11-21 05:37:52.621143',	'2018-11-21 05:37:52.621143',	1),
(2,	'Spring water and fresh greens',	0,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. ',	'My shack',	'2018-12-21 05:38:37.943961', '2018-12-21 10:38:37.943961',	2,	NULL,	'2018-11-21 05:38:37.942728',	'2018-11-21 05:38:37.942728',	2),
(3,	'Light Italian',	12,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. ',	'Lot 50',	'2019-5-25 05:38:37.943961', '2019-5-25 08:38:37.943961',	4,	NULL,	'2018-11-22 05:38:37.942728',	'2018-11-21 05:38:37.942728',	4);

CREATE TABLE "public"."recipe_allergies_allergy" (
    "recipeId" integer NOT NULL,
    "allergyId" integer NOT NULL,
    CONSTRAINT "PK_969ed0bfc199538ad52e3fe0ec5" PRIMARY KEY ("recipeId", "allergyId"),
    CONSTRAINT "FK_8dfeb1d4d524d3ca0170628736b" FOREIGN KEY ("recipeId") REFERENCES recipe(id) ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "FK_b1d807b09bb14120a69badd16ef" FOREIGN KEY ("allergyId") REFERENCES allergy(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "recipe_allergies_allergy" ("recipeId", "allergyId") VALUES
(1,	1),
(2,	2),
(2,	3),
(3, 4);

CREATE SEQUENCE recipe_review_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 4 CACHE 1;

CREATE TABLE "public"."recipe_review" (
    "id" integer DEFAULT nextval('recipe_review_id_seq') NOT NULL,
    "rating" integer NOT NULL,
    "description" text,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    "subjectId" integer,
    "authorId" integer,
    CONSTRAINT "PK_22bdd896ee3e06a1e62b187cdd1" PRIMARY KEY ("id"),
    CONSTRAINT "FK_4bb7f4ac7e320abccff85feea80" FOREIGN KEY ("subjectId") REFERENCES recipe(id) NOT DEFERRABLE,
    CONSTRAINT "FK_e6af209bebd71846aaf7e003339" FOREIGN KEY ("authorId") REFERENCES "user"(id) NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "recipe_review" ("id", "rating", "description", "createdAt", "updatedAt", "subjectId", "authorId") VALUES
(1,	3,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:35:55.381992',	'2018-11-21 05:35:55.381992',	1,	1),
(2,	3,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:36:03.747939',	'2018-11-21 05:36:03.747939',	1,	2),
(3,	5,	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus e

',	'2018-11-21 05:36:12.539506',	'2018-11-21 05:36:12.539506',	3,	4),
(4,	1,	NULL,	'2018-11-21 05:36:21.937098',	'2018-11-21 05:36:21.937098',	2,	3);

CREATE TABLE "public"."recipe_tags_tag" (
    "recipeId" integer NOT NULL,
    "tagId" integer NOT NULL,
    CONSTRAINT "PK_ae13f8c3cba4e537ac79e71d39f" PRIMARY KEY ("recipeId", "tagId"),
    CONSTRAINT "FK_ec10fc71f95d0199fa20bc3657a" FOREIGN KEY ("recipeId") REFERENCES recipe(id) ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "FK_ee885d85e317449e0f990504e8f" FOREIGN KEY ("tagId") REFERENCES tag(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "recipe_tags_tag" ("recipeId", "tagId") VALUES
(1,	1),
(1,	2),
(2,	1),
(2,	4),
(3,	2);

CREATE TABLE "public"."user_saved_recipes_recipe" (
    "userId" integer NOT NULL,
    "recipeId" integer NOT NULL,
    CONSTRAINT "PK_986dded3c6e200b989793d336f0" PRIMARY KEY ("userId", "recipeId"),
    CONSTRAINT "FK_4cba89a9d4b48b32c7da375c36c" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "FK_a497c3aea570074e16a10c3d108" FOREIGN KEY ("recipeId") REFERENCES recipe(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "user_saved_recipes_recipe" ("userId", "recipeId") VALUES
(1,	1),
(2,	1),
(2,	2),
(3,	3),
(1, 3);

CREATE TABLE "public"."meal_guests_user" (
    "mealId" integer NOT NULL,
    "userId" integer NOT NULL,
    CONSTRAINT "PK_f7e81e0bd043c360c9117c14176" PRIMARY KEY ("mealId", "userId"),
    CONSTRAINT "FK_7425a7213eb621e634d5a786442" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "FK_7ce0462bcf23c6e99b9b04e280f" FOREIGN KEY ("mealId") REFERENCES meal(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "meal_guests_user" ("mealId", "userId") VALUES
(1,	2),
(1,	3),
(2,	4),
(3, 2);

CREATE TABLE "public"."meal_recipes_recipe" (
    "mealId" integer NOT NULL,
    "recipeId" integer NOT NULL,
    CONSTRAINT "PK_bd7addd752eb1327a08e76c13c6" PRIMARY KEY ("mealId", "recipeId"),
    CONSTRAINT "FK_a284b69ecf191a62f1ca7a65d3c" FOREIGN KEY ("mealId") REFERENCES meal(id) ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "FK_e9f08011a5c493b10dd62a73b09" FOREIGN KEY ("recipeId") REFERENCES recipe(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "meal_recipes_recipe" ("mealId", "recipeId") VALUES
(1,	1),
(2,	3),
(2,	2),
(3, 3),
(3, 4);

-- 2018-11-21 05:56:38.102657+00
