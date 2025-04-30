CREATE TABLE "user_stats" (
	"username" text PRIMARY KEY NOT NULL,
	"correct_questions" integer[] DEFAULT ARRAY[]::integer[] NOT NULL,
	"incorrect_questions" integer[] DEFAULT ARRAY[]::integer[] NOT NULL
);
