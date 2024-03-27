


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


-- match faqs

create function match_faqs (
  query_embedding vector (1536),
  match_count int default null,
  filter jsonb default '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  embedding jsonb,
  similarity float
) language plpgsql as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    (embedding::text)::jsonb as embedding,
    1 - (bot_faq_data.embedding <=> query_embedding) as similarity
  from bot_faq_data
  where metadata @> filter
  order by bot_faq_data.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- filter properties--

CREATE
OR REPLACE FUNCTION public.get_filtered_properties (
  min_price NUMERIC,
  max_price NUMERIC,
  num_bathrooms INTEGER,
  num_bedrooms INTEGER,
  transit_rating INTEGER,
  shop_rating INTEGER,
  health_rating INTEGER,
  food_rating INTEGER,
  entertainment_rating INTEGER,
  coffee_rating INTEGER,
  grocery_rating INTEGER,
  fitness_rating INTEGER,
  childcare_rating INTEGER,
  park_rating INTEGER,
  high_rating INTEGER,
  elem_rating INTEGER,
  service_type_value TEXT,
  location_value TEXT,
  florida_sub_location_value TEXT
) RETURNS TABLE (property_id UUID, title varchar(255)) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title
       
    FROM public."Properties" p
    JOIN public.service_type_master st ON p.service_type_id = st.service_type_id
    JOIN public.property_location_master lm ON p.location_id = lm.location_id
    JOIN public.property_florida_sub_location_master flsm ON p.florida_sub_location_id = flsm.sub_location_id
    LEFT JOIN public."Ratings" r ON p.id = r.property_id
    WHERE (p.price BETWEEN min_price AND max_price OR min_price IS NULL OR max_price IS NULL)
    AND (p.num_of_bathrooms >= num_bathrooms OR num_bathrooms IS NULL)
    AND (p.num_of_bedrooms >= num_bedrooms OR num_bedrooms IS NULL)
    -- AND (r."OverallScore" = overall_score_rating OR overall_score_rating IS NULL)
   AND (st.type = service_type_value OR service_type_value IS NULL)
    AND (lm.location = location_value OR location_value IS NULL)
    AND (flsm.sub_location = florida_sub_location_value OR florida_sub_location_value IS NULL);

    /*
LEFT JOIN public."Amenities" am on am.property_id = p.id
    where am.new_construction is true
    and am.newly_renovated is true
    and am.pool is true
    and am.gym is true
    and am.yard is true
    and am.luxury is true
    and am.pet_friendly is true
    and am.parking is true
    and am.concierge is true
    and am.waterfront is true
    and am.in_unit_laundry is true
    and am.no_homeowners_association is true
    and am.garage is true

    */

END;
$$;
