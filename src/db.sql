


CREATE TABLE IF NOT EXISTS "Properties" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255),
    "subtitle" VARCHAR(255),
    "price" NUMERIC,
    "created_by" UUID DEFAULT uuid_generate_v4(),
    "mls" VARCHAR(255),
    "description" VARCHAR(255),
    "banner_img_url" VARCHAR(255),
    "service_type" VARCHAR(255),
    "property_type" VARCHAR(255),
    "num_of_bedrooms" INTEGER,
    "num_of_bathrooms" INTEGER,
    "rating_id" UUID DEFAULT uuid_generate_v4(),
    "amenities" UUID DEFAULT uuid_generate_v4(),
    "located_in_florida" VARCHAR(255),
    "property_located_at" VARCHAR(255),
    "has_opt_for_boosting" BOOLEAN,
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "zip_code" VARCHAR(255),
    "flat_no" VARCHAR(255),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
     FOREIGN KEY ("rating_id") REFERENCES "Ratings" ("id"),
    FOREIGN KEY ("amenities") REFERENCES "Amenities" ("id"),
    FOREIGN KEY ("created_by") REFERENCES "Users" ("id"),
    UNIQUE ("id")
);






CREATE TABLE IF NOT EXISTS "Ratings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "walkability" INTEGER,
    "closeness_To_restaurant" INTEGER,
    "proximity_to_parks" INTEGER,
    "quality_of_schools" INTEGER,
    "distance_to_the_ocean" INTEGER,
    "proximity_to_lake" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    UNIQUE ("id")
);


CREATE TABLE IF NOT EXISTS "Amenities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "new_construction" BOOLEAN,
    "newly_renovated" BOOLEAN,
    "pool" BOOLEAN,
    "gym" BOOLEAN,
    "yard" BOOLEAN,
    "luxury" BOOLEAN,
    "pet_friendly" BOOLEAN,
    "parking" BOOLEAN,
    "concierge" BOOLEAN,
    "waterfront" BOOLEAN,
    "in_unit_laundry" BOOLEAN,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    UNIQUE ("id")
);

CREATE TABLE IF NOT EXISTS "Property_Galleries" (
  "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
  "url" VARCHAR(255) DEFAULT NULL,
  "property_id" UUID DEFAULT NULL,
  "media_type" VARCHAR(255) DEFAULT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("property_id") REFERENCES "Properties" ("id")
);
